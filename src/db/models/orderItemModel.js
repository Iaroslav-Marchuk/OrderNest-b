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

    completed: {
      _id: false,
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null,
      },
      at: { type: Date, default: null },
      location: {
        type: String,
        enum: ['line_1', 'line_2', 'line_3'],
        default: null,
      },
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
