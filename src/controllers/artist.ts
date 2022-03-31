/* eslint-disable no-param-reassign */
import { utils } from 'ethers';

import { getNextTokenID } from '@/controllers/voucher';
import {
  ArtistDocument,
  ArtistModel,
  LeanArtistDocument
} from '@/models/artist';
import { VoucherModel } from '@/models/voucher';
import { CONFIG } from '@/utils/config';
import { getSnapshot } from '@/utils/snapshot';
import { ArtistInterface } from '@/utils/types';

export const verifyArtist = async (
  artistAddress: string
): Promise<{
  verified: boolean;
  proof: string[];
  artist: LeanArtistDocument | null;
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
    ArtistModel.findOne({
      ethAddress: artistAddress
    })
      .lean()
      .populate('createdVouchers'),
    getNextTokenID()
  ]);

  let rateLimited = false;

  if (artist) {
    const lastTimeVouchers = await VoucherModel.find({
      createdBy: artist._id, // eslint-disable-line no-underscore-dangle
      createdAt: { $gt: lastTime }
    }).lean();

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
): Promise<ArtistDocument> => {
  const snapshot = await getSnapshot();
  const verified = snapshot.verifyAddress(artistAddress);
  if (!verified || artistAddress !== record.ethAddress?.toLowerCase()) {
    const e = new Error(
      `Artist validation failed: Not whilelisted or invalid ethAddress`
    );
    e.name = 'ValidationError';
    throw e;
  }
  record.createdVouchers = [];
  record.ethAddress = artistAddress;
  const artist = await ArtistModel.create(record);
  return artist;
};

export const updateArtist = async (
  artistAddress: string,
  record: ArtistInterface
): Promise<LeanArtistDocument> => {
  const [snapshot, artist] = await Promise.all([
    getSnapshot(),
    ArtistModel.findOne({
      ethAddress: artistAddress
    })
  ]);
  const verified = snapshot.verifyAddress(artistAddress);
  if (!verified || artistAddress !== artist?.ethAddress?.toLowerCase()) {
    const e = new Error(
      `Artist validation failed: ethAddress: Not whilelisted or not found`
    );
    e.name = 'ValidationError';
    throw e;
  }
  record.createdVouchers = artist.createdVouchers;
  record.ethAddress = artistAddress;
  const updatedArtist = await ArtistModel.findOneAndUpdate(
    { ethAddress: artistAddress },
    { $set: record }
  ).lean();
  if (!updatedArtist) {
    const e = new Error(`Artist validation failed: ethAddress: Not found`);
    e.name = 'ValidationError';
    throw e;
  }
  return updatedArtist;
};
