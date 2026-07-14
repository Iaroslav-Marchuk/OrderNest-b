import { model, Schema } from 'mongoose';

const sessionModel = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
    },
    location: {
      type: String,
      enum: ['line_1', 'line_2', 'line_3'],
      default: null,
    },
    refreshToken: { type: String, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollection = model('Sessions', sessionModel);
