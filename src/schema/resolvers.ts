/* eslint-disable no-restricted-syntax, no-underscore-dangle, @typescript-eslint/explicit-module-boundary-types */
import { Artist, ArtistDocument } from 'models/artist';
import { Voucher, VoucherDocument } from 'models/voucher';

export const resolvers = {
  Query: {
    async vouchers(): Promise<VoucherDocument[]> {
      const response = await Voucher.find().populate('createdBy');
      return response;
    },

    async voucher(_parent: any, { filters }: any): Promise<VoucherDocument> {
      const shouldApplyIdFilter = !!filters._id;
      const shouldApplyVoucherIdFilter = !!filters.tokenID;
      let response: any;

      if (shouldApplyIdFilter) {
        response = await Voucher.findById(filters._id).populate('createdBy');
      } else if (shouldApplyVoucherIdFilter) {
        response = await Voucher.findOne({
          tokenID: filters.tokenID
        }).populate('createdBy');
      }
      return response;
    },

    async artists(): Promise<ArtistDocument[]> {
      const response = await Artist.find().populate('createdVouchers');
      return response;
    },

    async artist(_parent: any, { filters }: any): Promise<ArtistDocument> {
      const shouldApplyIdFilter = !!filters._id;
      const shouldApplyEthFilter = !!filters.ethAddress;

      let response: any;

      if (shouldApplyIdFilter) {
        response = await Artist.findById(filters._id).populate(
          'createdVouchers'
        );
      } else if (shouldApplyEthFilter) {
        response = await Artist.findOne({
          ethAddress: { $regex: filters.ethAddress, $options: 'i' }
        }).populate('createdVouchers');
      }
      return response;
    }
  }
};
