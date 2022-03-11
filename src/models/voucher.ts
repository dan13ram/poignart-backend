import { Document, Schema, model } from 'mongoose';

import { VoucherInterface } from '../utils/types';

interface VoucherDocument extends VoucherInterface, Document {}

const VoucherSchema = new Schema<VoucherDocument>(
  {
    tokenID: {
      type: Number,
      required: true,
      unique: true
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
    }
  },
  { timestamps: true }
);

export const Voucher = model<VoucherDocument>('Voucher', VoucherSchema);
