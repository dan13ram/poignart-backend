/* eslint-disable no-param-reassign */
import { getNextTokenID } from '@/controllers/voucher';
import { Artist, ArtistDocument } from '@/models/artist';
import { getSnapshot } from '@/utils/snapshot';
import { ArtistInterface } from '@/utils/types';

export const verifyArtist = async (
  artistAddress: string
): Promise<{
  verified: boolean;
  proof: string[];
  artist: ArtistDocument | null;
  nextTokenID: number;
}> => {
  const [snapshot, artist, nextTokenID] = await Promise.all([
    getSnapshot(),
    Artist.findOne({
      ethAddress: artistAddress
    }).populate('createdVouchers'),
    getNextTokenID()
  ]);
  const proof = snapshot.getMerkleProof(artistAddress);
  const verified = snapshot.verifyAddress(artistAddress);
  return {
    verified,
    proof,
    artist,
    nextTokenID
  };
};

export const createArtist = async (
  artistAddress: string,
  record: ArtistInterface
): Promise<ArtistInterface> => {
  const snapshot = await getSnapshot();
  const verified = snapshot.verifyAddress(artistAddress);
  if (!verified || artistAddress !== record.ethAddress?.toLowerCase()) {
    const e = new Error(
      `Artist validation failed: not whilelisted or invalid ethAddress`
    );
    e.name = 'ValidationError';
    throw e;
  }
  record.createdVouchers = [];
  record.ethAddress = artistAddress;
  const artist = await Artist.create(record);
  return artist;
};
