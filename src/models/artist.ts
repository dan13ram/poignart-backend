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
      required: true,
      unique: true,
      index: true
    },
    discordHandle: {
      type: String,
      required: true,
      unique: true,
      match: /^((?!(discordtag|everyone|here)#)((?!@|#|:|```).{2,32})#\d{4})/
    },
    telegramHandle: {
      type: String,
      required: false,
      unique: true
    },
    twitterHandle: {
      type: String,
      required: false,
      unique: true
    },
    instagramHandle: {
      type: String,
      required: false,
      unique: true
    },
    emailAddress: {
      type: String,
      required: false,
      unique: true
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
