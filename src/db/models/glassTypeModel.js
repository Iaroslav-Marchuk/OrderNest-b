import mongoose from 'mongoose';

const glassTypeSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GlassCategories',
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
