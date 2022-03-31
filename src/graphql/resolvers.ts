/* eslint-disable no-underscore-dangle */
import { GraphQLJSON } from 'graphql-type-json';

import {
  Artist as ArtistType,
  QueryArtistArgs,
  QueryVoucherArgs,
  QueryVouchersArgs,
  Voucher as VoucherType
} from '@/graphql/types';
import { ArtistModel, LeanArtistDocument } from '@/models/artist';
import { LeanVoucherDocument, VoucherModel } from '@/models/voucher';
import { CONFIG } from '@/utils/config';
import { getSnapshot } from '@/utils/snapshot';

export const resolvers = {
  JSON: GraphQLJSON,
  Voucher: {
    async createdBy(voucher: VoucherType): Promise<ArtistType | null> {
      const r = await VoucherModel.findById(voucher._id)
        .lean()
        .populate('createdBy');
      if (!r) return null;
      const artist: LeanArtistDocument =
        r.createdBy as unknown as LeanArtistDocument;
      const snapshot = await getSnapshot();
      const response: ArtistType = {
        ...artist,
        createdAt: artist.createdAt.getTime().toString(),
        updatedAt: artist.updatedAt.getTime().toString(),
        _id: artist._id.toString(),
        merkleProof: snapshot.getMerkleProof(artist.ethAddress),
        isWhitelistAdmin: CONFIG.WHITELIST_ADMINS.includes(artist.ethAddress),
        createdVouchers: []
      };
      return response;
    }
  },
  Artist: {
    async createdVouchers(artist: ArtistType): Promise<VoucherType[]> {
      const r = await ArtistModel.findById(artist._id)
        .lean()
        .populate('createdVouchers');
      if (!r) return [];

      const createdVouchers =
        r.createdVouchers as unknown as LeanVoucherDocument[];
      const response = createdVouchers.map(v => {
        const voucher: VoucherType = {
          ...v,
          createdAt: v.createdAt.getTime().toString(),
          updatedAt: v.updatedAt.getTime().toString(),
          _id: v._id.toString(),
          metadata: JSON.parse(v.metadataString),
          createdBy: null
        };
        return voucher;
      });
      return response;
    }
  },
  Query: {
    async vouchers(
      _parent: unknown,
      { where }: QueryVouchersArgs
    ): Promise<VoucherType[]> {
      const shouldApplyMinterFilter =
        !!where?.minted && [true, false].includes(where.minted);
      const shouldApplyTypeFilter = !!where?.contentType;

      let vouchers: LeanVoucherDocument[];
      if (shouldApplyMinterFilter && !shouldApplyTypeFilter) {
        vouchers = await VoucherModel.find({ minted: where.minted }).lean();
      } else if (shouldApplyTypeFilter && !shouldApplyMinterFilter) {
        vouchers = await VoucherModel.find({
          contentType: where.contentType
        }).lean();
      } else if (shouldApplyMinterFilter && shouldApplyTypeFilter) {
        vouchers = await VoucherModel.find({
          minted: where.minted,
          contentType: where.contentType
        }).lean();
      } else {
        vouchers = await VoucherModel.find().lean();
      }
      const response: VoucherType[] = vouchers.map(r => {
        const voucher: VoucherType = {
          ...r,
          _id: r._id.toString(),
          metadata: JSON.parse(r.metadataString),
          createdAt: r.createdAt.getTime().toString(),
          updatedAt: r.updatedAt.getTime().toString(),
          createdBy: null // will be populated in Artist resolver
        };
        return voucher;
      });
      return response;
    },

    async voucher(
      _parent: unknown,
      { where }: QueryVoucherArgs
    ): Promise<VoucherType | null> {
      const shouldApplyIdFilter = !!where?._id;
      const shouldApplyVoucherIdFilter = !!where?.tokenID;
      let voucher: LeanVoucherDocument | null = null;

      if (shouldApplyIdFilter) {
        voucher = await VoucherModel.findById(where._id).lean();
      } else if (shouldApplyVoucherIdFilter) {
        voucher = await VoucherModel.findOne({
          tokenID: where.tokenID
        }).lean();
      }
      if (!voucher) return null;

      const response: VoucherType = {
        ...voucher,
        _id: voucher._id.toString(),
        metadata: JSON.parse(voucher.metadataString),
        createdAt: voucher.createdAt.getTime().toString(),
        updatedAt: voucher.updatedAt.getTime().toString(),
        createdBy: null // will be populated in Artist resolver
      };
      return response;
    },

    async artists(): Promise<ArtistType[]> {
      const artists: LeanArtistDocument[] = await ArtistModel.find().lean();
      const snapshot = await getSnapshot();
      const response: ArtistType[] = artists.map(a => {
        const artist: ArtistType = {
          ...a,
          _id: a._id.toString(),
          merkleProof: snapshot.getMerkleProof(a.ethAddress),
          createdAt: a.createdAt.getTime().toString(),
          updatedAt: a.updatedAt.getTime().toString(),
          createdVouchers: null, // will be populated in Voucher resolver
          isWhitelistAdmin: CONFIG.WHITELIST_ADMINS.includes(a.ethAddress)
        };
        return artist;
      });

      return response;
    },

    async artist(
      _parent: unknown,
      { where }: QueryArtistArgs
    ): Promise<ArtistType | null> {
      const shouldApplyIdFilter = !!where?._id;
      const shouldApplyEthFilter = !!where?.ethAddress;

      let artist: LeanArtistDocument | null = null;

      if (shouldApplyIdFilter) {
        artist = await ArtistModel.findById(where._id).lean();
      } else if (shouldApplyEthFilter) {
        artist = await ArtistModel.findOne({
          ethAddress: { $regex: where.ethAddress, $options: 'i' }
        }).lean();
      }
      if (!artist) return null;
      const snapshot = await getSnapshot();

      const response: ArtistType = {
        ...artist,
        _id: artist._id.toString(),
        createdAt: artist.createdAt.getTime().toString(),
        updatedAt: artist.updatedAt.getTime().toString(),
        merkleProof: snapshot.getMerkleProof(artist.ethAddress),
        createdVouchers: null, // will be populated in Voucher resolver
        isWhitelistAdmin: CONFIG.WHITELIST_ADMINS.includes(artist.ethAddress)
      };

      return response;
    }
  }
};
