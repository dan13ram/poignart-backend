/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Artist as artist } from '../models/artist';
import { Token as token } from '../models/token';

import { ArtistInterface, TokenInterface } from '../utils/types';

export const resolvers = {
  Query: {
    async artists(): Promise<ArtistInterface[]> {
      const response = await artist.find().populate('created_nfts');
      return response;
    },
    async tokens(): Promise<TokenInterface[]> {
      const response = await token.find().populate('created_by');
      return response;
    },

    // individual record resolvers
    async token(parent: any, { filters }: any): Promise<TokenInterface> {
      const shouldApplyIdFilter = !!filters._id;
      const shouldApplyTokenIdFilter = !!filters.token_id;
      let response;

      if (shouldApplyIdFilter) {
        response = await artist.findById(filters._id).populate('created_by');
      } else if (shouldApplyTokenIdFilter) {
        response = await artist
          .findOne({
            token_id: filters.token_id
          })
          .populate('created_by');
      }
      return response;
    },
    async artist(parent: any, { filters }: any): Promise<ArtistInterface> {
      const shouldApplyIdFilter = !!filters._id;
      const shouldApplyEthFilter = !!filters.eth_address;

      let response;

      if (shouldApplyIdFilter) {
        response = await artist.findById(filters._id).populate('created_nfts');
      } else if (shouldApplyEthFilter) {
        response = await artist
          .findOne({
            eth_address: { $regex: filters.eth_address, $options: 'i' }
          })
          .populate('created_nfts');
      }
      return response;
    }
  }
};
