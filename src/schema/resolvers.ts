/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Artist } from 'models/artist';
import { Voucher } from 'models/voucher';
import { ArtistInterface, VoucherInterface } from 'utils/types';

export const resolvers = {
  Query: {
    async vouchers(): Promise<VoucherInterface[]> {
      const response = await Voucher.find().populate('createdBy');
      return response;
    },

    async voucher(_parent: any, { filters }: any): Promise<VoucherInterface> {
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

    async artists(): Promise<ArtistInterface[]> {
      const response = await Artist.find().populate('createdNFTs');
      return response;
    },

    async artist(_parent: any, { filters }: any): Promise<ArtistInterface> {
      const shouldApplyIdFilter = !!filters._id;
      const shouldApplyEthFilter = !!filters.ethAddress;

      let response: any;

      if (shouldApplyIdFilter) {
        response = await Artist.findById(filters._id).populate('createdNFTs');
      } else if (shouldApplyEthFilter) {
        response = await Artist.findOne({
          ethAddress: { $regex: filters.ethAddress, $options: 'i' }
        }).populate('createdNFTs');
      }
      return response;
    }
  }
};
