import { Voucher } from 'models/voucher';
import { VoucherInterface } from 'utils/types';

export const createVoucher = async (
  record: VoucherInterface
): Promise<VoucherInterface> => {
  const response = await Voucher.create(record);
  return response;
};

export const updateVoucherById = async (
  id: string,
  record: VoucherInterface
): Promise<VoucherInterface> => {
  await Voucher.updateOne({ _id: id }, { $set: record });
  const updatedVoucher = await Voucher.findById(id);
  return updatedVoucher;
};

let nextTokenID: number;

export const getNextTokenID = async (rebuild = false) => {
  if (nextTokenID && !rebuild) return nextTokenID;
  const vouchers: VoucherInterface[] = await Voucher.find()
    .sort({ _id: -1 })
    .limit(1);
  nextTokenID = vouchers && vouchers.length === 1 ? vouchers[0].tokenID + 1 : 1;
  return nextTokenID;
};
