import mongoose from 'mongoose';

import { Schema } from 'mongoose';
import { LOCATIONS, STATUSES } from '../../constants/constants.js';

const orderSchema = new Schema(
  {
    ep: {
      type: Number,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clients',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    location: {
      type: String,
      enum: LOCATIONS,
      required: true,
    },
    status: {
      type: String,
      enum: STATUSES,
      required: true,
      default: 'created',
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItems',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ status: 1, updatedAt: -1 });

export const OrdersCollection = mongoose.model('Orders', orderSchema);
