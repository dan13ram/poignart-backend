import { Types } from 'mongoose';

export interface ArtistInterface {
  name: string;
  email_address: string;
  discord_handle: string;
  telegram_handle?: string;
  twitter_handle?: string;
  github_handle?: string;
  eth_address: string;
  ens_name?: string;
  created_nfts: Types.ObjectId[];
}

export interface TokenInterface {
  token_id: number;
  token_uri: string;
  min_price: string; // in wei
  created_by: Types.ObjectId;
  signature: string;
  minter_address?: string;
  minted_at?: Date;
}
