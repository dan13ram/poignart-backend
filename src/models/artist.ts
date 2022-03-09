import { Document, Schema, model } from 'mongoose';

import { ArtistInterface } from '../utils/types';

interface ArtistDocument extends ArtistInterface, Document {}

const ArtistSchema = new Schema<ArtistDocument>(
  {
    name: {
      type: String,
      required: true
    },
    email_address: {
      type: String,
      required: true
    },
    discord_handle: {
      type: String,
      required: true
    },
    telegram_handle: {
      type: String,
      required: false
    },
    twitter_handle: {
      type: String,
      required: false
    },
    github_handle: {
      type: String,
      required: false
    },
    eth_address: {
      type: String,
      required: true
    },
    ens_name: {
      type: String,
      required: false
    },
    created_nfts: {
      type: [Schema.Types.ObjectId],
      ref: 'Token',
      required: true
    }
  },
  { timestamps: true }
);

export const Artist = model<ArtistDocument>('Artist', ArtistSchema);
