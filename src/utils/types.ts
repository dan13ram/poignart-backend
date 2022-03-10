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
  createdNFTs: Types.ObjectId[];
}

export interface TokenInterface {
  tokenID: number;
  tokenURI: string;
  minPrice: string; // in wei
  createdBy: Types.ObjectId;
  signature: string;
}
