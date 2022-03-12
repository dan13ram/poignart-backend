import { Types } from 'mongoose';

export interface ArtistInterface {
  name: string;
  bio: string;
  ethAddress: string;
  discordHandle: string;
  telegramHandle?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  emailAddress?: string;
  ensName?: string;
  createdVouchers: Types.ObjectId[];
}

export interface VoucherInterface {
  tokenID: number;
  tokenURI: string;
  minPrice: string; // in wei
  createdBy: Types.ObjectId;
  signature: string;
  minted: boolean;
  mintedBy?: string;
  metadataString: string;
}

export interface WhitelistInterface {
  ethAddress: string;
  createdBy: string;
}
