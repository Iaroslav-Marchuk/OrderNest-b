import mongoose from 'mongoose';

const glassTypeSchema = new mongoose.Schema(
  {
    typeId: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thickness: [{ type: String }],
    temper: {
      type: String,
      enum: ['required', 'forbidden', 'optional'],
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const GlassTypesCollection = mongoose.model(
  'GlassTypes',
  glassTypeSchema,
);
