/* eslint-disable no-param-reassign */
import { utils } from 'ethers';

import { getNextTokenID } from '@/controllers/voucher';
import { Artist, ArtistDocument } from '@/models/artist';
import { Voucher } from '@/models/voucher';
import { CONFIG } from '@/utils/config';
import { getSnapshot } from '@/utils/snapshot';
import { ArtistInterface } from '@/utils/types';

export const verifyArtist = async (
  artistAddress: string
): Promise<{
  verified: boolean;
  proof: string[];
  artist: ArtistDocument | null;
  nextTokenID: number;
  rateLimited: boolean;
}> => {
  if (!utils.isAddress(artistAddress)) {
    const e = new Error(`Artist validation failed: invalid ethAddress`);
    e.name = 'ValidationError';
    throw e;
  }
  const lastTime = new Date();
  lastTime.setTime(lastTime.getTime() - CONFIG.RATE_LIMIT_DURATION);

  const [snapshot, artist, nextTokenID] = await Promise.all([
    getSnapshot(),
    Artist.findOne({
      ethAddress: artistAddress
    }).populate('createdVouchers'),
    getNextTokenID()
  ]);

  let rateLimited = false;

  if (artist) {
    const lastTimeVouchers = await Voucher.find({
      createdBy: artist._id, // eslint-disable-line no-underscore-dangle
      createdAt: { $gt: lastTime }
    });

    rateLimited = lastTimeVouchers.length >= CONFIG.MAX_VOUCHERS;
  }

  const proof = snapshot.getMerkleProof(artistAddress);
  const verified = snapshot.verifyAddress(artistAddress);
  return {
    verified,
    proof,
    artist,
    nextTokenID,
    rateLimited
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
