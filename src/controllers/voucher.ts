/* eslint-disable no-underscore-dangle, no-param-reassign */
import { Artist, ArtistDocument } from '@/models/artist';
import { Voucher, VoucherDocument } from '@/models/voucher';
import { verifyOwnership } from '@/utils/contract';
import { VoucherInterface } from '@/utils/types';

export const createVoucher = async (
  artistAddress: string,
  record: VoucherInterface & { metadata?: Record<string, unknown> }
): Promise<VoucherDocument> => {
  const artist: ArtistDocument | null = await Artist.findOne({
    ethAddress: artistAddress
  });
  if (!artist) {
    const e = new Error(
      'Voucher validation failed: createdBy: Artist does not exist'
    );
    e.name = 'ValidationError';
    throw e;
  }

  record.createdBy = artist._id;
  record.minted = false;
  record.mintedBy = undefined;
  record.metadataString = JSON.stringify(record.metadata ?? {});

  const voucher: VoucherDocument = await Voucher.create(record);
  artist.createdVouchers.push(voucher._id);
  artist.save();
  return voucher;
};

export const redeemVoucher = async (
  minterAddress: string,
  record: { tokenID: number }
): Promise<VoucherDocument> => {
  const voucher: VoucherDocument | null = await Voucher.findOne({
    tokenID: record.tokenID,
    minted: false
  });
  if (!voucher || !(await verifyOwnership(minterAddress, record.tokenID))) {
    const e = new Error(
      'Voucher validation failed: Voucher does not exist or already minted'
    );
    e.name = 'ValidationError';
    throw e;
  }

  voucher.minted = true;
  voucher.mintedBy = minterAddress;
  voucher.signature = '0x';
  voucher.save();

  return voucher;
};

let nextTokenID: number;

export const getNextTokenID = async (rebuild = false) => {
  if (nextTokenID && !rebuild) return nextTokenID;
  const vouchers: VoucherDocument[] = await Voucher.find()
    .sort({ _id: -1 })
    .limit(1);
  nextTokenID = vouchers && vouchers.length === 1 ? vouchers[0].tokenID + 1 : 1;
  return nextTokenID;
};
