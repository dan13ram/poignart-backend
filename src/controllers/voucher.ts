/* eslint-disable no-underscore-dangle, no-param-reassign */
import { utils } from 'ethers';

import { Artist } from '@/models/artist';
import { Voucher, VoucherDocument } from '@/models/voucher';
import { CONFIG } from '@/utils/config';
import { verifyOwnership } from '@/utils/contract';
import { getTypedDataOptions } from '@/utils/helpers';
import { getSnapshot } from '@/utils/snapshot';
import { VoucherInterface } from '@/utils/types';

export const getNextTokenID = async () => {
  const vouchers: VoucherDocument[] = await Voucher.find()
    .sort({ _id: -1 })
    .limit(1);
  return vouchers && vouchers.length === 1 ? vouchers[0].tokenID + 1 : 1;
};

export const createVoucher = async (
  artistAddress: string,
  record: VoucherInterface & { metadata?: Record<string, unknown> }
): Promise<VoucherDocument> => {
  const [nextTokenID, snapshot, artist] = await Promise.all([
    getNextTokenID(),
    getSnapshot(),
    Artist.findOne({ ethAddress: artistAddress })
  ]);
  if (Number(record.tokenID) !== nextTokenID) {
    const e = new Error(
      `Voucher validation failed: tokenID: Next available tokenID is ${nextTokenID} (${record.tokenID})`
    );
    e.name = 'ValidationError';
    throw e;
  }
  const verified = snapshot.verifyAddress(artistAddress);
  if (!verified) {
    const e = new Error(
      `Voucher validation failed: createdBy: Artist not in merkle tree`
    );
    e.name = 'ValidationError';
    throw e;
  }
  if (!artist) {
    const e = new Error(
      'Voucher validation failed: createdBy: Artist does not exist'
    );
    e.name = 'ValidationError';
    throw e;
  }

  const lastTime = new Date();
  lastTime.setTime(lastTime.getTime() - CONFIG.RATE_LIMIT_DURATION);

  const lastTimeVouchers = await Voucher.find({
    createdBy: artist._id,
    createdAt: { $gt: lastTime }
  });

  if (lastTimeVouchers.length >= CONFIG.MAX_VOUCHERS) {
    const e = new Error('Voucher validation failed: Too many vouchers');
    e.name = 'ValidationError';
    throw e;
  }

  const { domain, types } = getTypedDataOptions();
  const recoverredAddress = utils.verifyTypedData(
    domain,
    types,
    {
      tokenId: record.tokenID,
      minPrice: record.minPrice,
      uri: record.tokenURI
    },
    record.signature
  );
  if (recoverredAddress.toLowerCase() !== artistAddress) {
    const e = new Error(
      'Voucher validation failed: signature: Invalid signature'
    );
    e.name = 'ValidationError';
    throw e;
  }

  record.createdBy = artist._id;
  record.minted = false;
  record.mintedBy = undefined;
  record.metadataString = JSON.stringify(record.metadata ?? {});
  if (record.metadataString.length > 1500) {
    const e = new Error(
      'Voucher validation failed: metadata: Longer than 1500 characters'
    );
    e.name = 'ValidationError';
    throw e;
  }
  if (!['audio', 'video', 'image'].includes(record.contentType)) {
    const e = new Error(
      `Voucher validation failed: contentType: Invalid contentType (${record.contentType})`
    );
    e.name = 'ValidationError';
    throw e;
  }

  const voucher: VoucherDocument = await Voucher.create(record);
  artist.createdVouchers.push(voucher._id);
  artist.save();
  return voucher;
};

export const redeemVoucher = async (
  minterAddress: string,
  tokenID: number
): Promise<VoucherDocument> => {
  if (Number.isNaN(tokenID)) {
    const e = new Error('Voucher validation failed: Invalid tokenID');
    e.name = 'ValidationError';
    throw e;
  }
  const [voucher, isOwner] = await Promise.all([
    Voucher.findOne({
      tokenID,
      minted: false
    }),
    verifyOwnership(minterAddress, tokenID)
  ]);
  if (!voucher) {
    const e = new Error(
      'Voucher validation failed: Voucher does not exist or already redeemed'
    );
    e.name = 'ValidationError';
    throw e;
  }
  if (!isOwner) {
    const e = new Error('Voucher validation failed: Redeemer not owner');
    e.name = 'ValidationError';
    throw e;
  }

  voucher.minted = true;
  voucher.mintedBy = minterAddress;
  voucher.signature = '0x';
  voucher.save();

  return voucher;
};
