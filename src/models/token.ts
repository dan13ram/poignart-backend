import { Document, Schema, model } from 'mongoose';

import { TokenInterface } from '../utils/types';

interface TokenDocument extends TokenInterface, Document {}

const TokenSchema = new Schema<TokenDocument>(
  {
    tokenID: {
      type: Number,
      required: true
    },
    tokenURI: {
      type: String,
      required: true
    },
    minPrice: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },
    signature: {
      type: String,
      required: true
    },
    minterAddress: {
      type: String,
      required: false
    },
    mintedAt: {
      type: Date,
      required: false
    }
  },
  { timestamps: true }
);

export const Token = model<TokenDocument>('Token', TokenSchema);
