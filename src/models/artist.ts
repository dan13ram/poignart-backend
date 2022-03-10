import { Document, Schema, model } from 'mongoose';

import { ArtistInterface } from '../utils/types';

interface ArtistDocument extends ArtistInterface, Document {}

const ArtistSchema = new Schema<ArtistDocument>(
  {
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    ethAddress: {
      type: String,
      required: true
    },
    discordHandle: {
      type: String,
      required: true
    },
    telegramHandle: {
      type: String,
      required: false
    },
    twitterHandle: {
      type: String,
      required: false
    },
    instagramHandle: {
      type: String,
      required: false
    },
    emailAddress: {
      type: String,
      required: false
    },
    ensName: {
      type: String,
      required: false
    },
    createdNFTs: {
      type: [Schema.Types.ObjectId],
      ref: 'Token',
      required: true
    }
  },
  { timestamps: true }
);

export const Artist = model<ArtistDocument>('Artist', ArtistSchema);
