import mongoose from 'mongoose';

import { Schema } from 'mongoose';
import { STATUSES } from '../../constants/constants.js';

const orderItemSchema = new Schema(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GlassTypes',
      required: true,
    },
    sizeX: { type: Number, required: true },
    sizeY: { type: Number, required: true },
    thickness: { type: String, required: true },
    isTempered: { type: Boolean, required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: STATUSES,
      required: true,
      default: 'created',
    },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

export const OrderItemsCollection = mongoose.model(
  'OrderItems',
  orderItemSchema,
);
