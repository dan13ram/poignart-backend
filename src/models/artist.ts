import { Document, model, Schema } from 'mongoose';

import { ArtistInterface } from '@/utils/types';

export interface ArtistDocument extends ArtistInterface, Document {}

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
      match: /^0x[a-f0-9]{40}$/
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
    createdVouchers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Voucher',
        required: true
      }
    ]
  },
  { timestamps: true }
);

export const Artist = model<ArtistDocument>('Artist', ArtistSchema);
