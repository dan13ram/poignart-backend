import { Document, model, Schema } from 'mongoose';

import { WhitelistInterface } from '@/utils/types';

export interface WhitelistDocument extends WhitelistInterface, Document {}

const WhitelistSchema = new Schema<WhitelistDocument>(
  {
    createdBy: {
      type: String,
      required: true
    },
    ethAddress: {
      type: String,
      required: true,
      unique: true,
      match: /^0x[a-f0-9]{40}$/
    }
  },
  { timestamps: true }
);

export const Whitelist = model<WhitelistDocument>('Whitelist', WhitelistSchema);
