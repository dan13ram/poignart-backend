import { Document, Schema, model } from 'mongoose';

import { TokenInterface } from '../utils/types';

interface TokenDocument extends TokenInterface, Document {}

const TokenSchema = new Schema<TokenDocument>(
  {
    token_id: {
      type: Number,
      required: true
    },
    token_uri: {
      type: String,
      required: true
    },
    min_price: {
      type: String,
      required: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },
    signature: {
      type: String,
      required: true
    },
    minter_address: {
      type: String,
      required: false
    },
    minted_at: {
      type: Date,
      required: false
    }
  },
  { timestamps: true }
);

export const Token = model<TokenDocument>('Token', TokenSchema);
