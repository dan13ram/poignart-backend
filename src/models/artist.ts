import { Document, Schema, model } from 'mongoose';

import { ArtistInterface } from '../utils/types';

interface ArtistDocument extends ArtistInterface, Document {}

const ArtistSchema = new Schema<ArtistDocument>(
  {
    name: {
      type: String,
      required: true
    },
    emailAddress: {
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
    githubHandle: {
      type: String,
      required: false
    },
    ethAddress: {
      type: String,
      required: true
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
