/* eslint-disable no-underscore-dangle */
import { Artist, ArtistDocument } from 'models/artist';
import { Voucher, VoucherDocument } from 'models/voucher';
import { VoucherInterface } from 'utils/types';

export const createVoucher = async (
  artistAddress: string,
  record: VoucherInterface
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
  // eslint-disable-next-line no-param-reassign
  record.createdBy = artist._id;
  const voucher: VoucherDocument = await Voucher.create(record);
  artist.createdVouchers.push(voucher._id);
  artist.save();
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
