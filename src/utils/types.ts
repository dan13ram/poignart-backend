import { Types } from 'mongoose';

export interface ArtistInterface {
  name: string;
  emailAddress: string;
  discordHandle: string;
  telegramHandle?: string;
  twitterHandle?: string;
  githubHandle?: string;
  ethAddress: string;
  ensName?: string;
  createdNFTs: Types.ObjectId[];
}

export interface TokenInterface {
  tokenID: number;
  tokenURI: string;
  minPrice: string; // in wei
  createdBy: Types.ObjectId;
  signature: string;
  minterAddress?: string;
  mintedAt?: Date;
}
