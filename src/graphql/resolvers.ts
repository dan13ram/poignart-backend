/* eslint-disable no-restricted-syntax, no-underscore-dangle, @typescript-eslint/explicit-module-boundary-types, no-param-reassign */
import { GraphQLJSON } from 'graphql-type-json';

import { Artist, ArtistDocument } from '@/models/artist';
import { Voucher, VoucherDocument } from '@/models/voucher';

export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    async vouchers(_parent: any, { where }: any): Promise<VoucherDocument[]> {
      const shouldApplyMinterFilter = [true, false].includes(where?.minted);
      const shouldApplyTypeFilter = !!where?.contentType;

      let response: any[];
      if (shouldApplyMinterFilter && !shouldApplyTypeFilter) {
        response = await Voucher.find({ minted: where.minted }).populate(
          'createdBy'
        );
      } else if (shouldApplyTypeFilter && !shouldApplyMinterFilter) {
        response = await Voucher.find({
          contentType: where.contentType
        }).populate('createdBy');
      } else if (shouldApplyMinterFilter && shouldApplyTypeFilter) {
        response = await Voucher.find({
          minted: where.minted,
          contentType: where.contentType
        }).populate('createdBy');
      } else {
        response = await Voucher.find().populate('createdBy');
      }
      response.forEach(r => {
        // eslint-disable-next-line no-param-reassign
        r.metadata = JSON.parse(r.metadataString);
      });
      return response;
    },

    async voucher(_parent: any, { where }: any): Promise<VoucherDocument> {
      const shouldApplyIdFilter = !!where._id;
      const shouldApplyVoucherIdFilter = !!where.tokenID;
      let response: any;

      if (shouldApplyIdFilter) {
        response = await Voucher.findById(where._id).populate('createdBy');
      } else if (shouldApplyVoucherIdFilter) {
        response = await Voucher.findOne({
          tokenID: where.tokenID
        }).populate('createdBy');
      }
      response.metadata = JSON.parse(response.metadataString);
      return response;
    },

    async artists(): Promise<ArtistDocument[]> {
      let response = await Artist.find().populate('createdVouchers');
      response = response.map(a => {
        a.createdVouchers = a.createdVouchers.map(v => {
          (v as any).metadata = JSON.parse(
            (v as unknown as VoucherDocument).metadataString
          );
          return v;
        });
        return a;
      });

      return response;
    },

    async artist(_parent: any, { where }: any): Promise<ArtistDocument | null> {
      const shouldApplyIdFilter = !!where._id;
      const shouldApplyEthFilter = !!where.ethAddress;

      let response: ArtistDocument | null;

      if (shouldApplyIdFilter) {
        response = await Artist.findById(where._id).populate('createdVouchers');
      } else if (shouldApplyEthFilter) {
        response = await Artist.findOne({
          ethAddress: { $regex: where.ethAddress, $options: 'i' }
        }).populate('createdVouchers');
      } else {
        return null;
      }
      if (response && response.createdVouchers.length > 0) {
        response.createdVouchers = response.createdVouchers.map(v => {
          (v as any).metadata = JSON.parse(
            (v as unknown as VoucherDocument).metadataString
          );
          return v;
        });
      }

      return response;
    }
  }
};
