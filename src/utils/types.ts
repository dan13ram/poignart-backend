import { Types } from 'mongoose';

import { Maybe } from '@/graphql/types';

export interface ArtistInterface {
  name: string;
  bio: string;
  ethAddress: string;
  discordHandle: string;
  telegramHandle?: Maybe<string>;
  twitterHandle?: Maybe<string>;
  instagramHandle?: Maybe<string>;
  emailAddress?: Maybe<string>;
  website?: Maybe<string>;
  createdVouchers: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
}

export interface VoucherInterface {
  tokenID: number;
  tokenURI: string;
  minPrice: string; // in wei
  createdBy: Types.ObjectId;
  signature: string;
  minted: boolean;
  mintedBy?: Maybe<string>;
  metadataString: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhitelistInterface {
  ethAddress: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
