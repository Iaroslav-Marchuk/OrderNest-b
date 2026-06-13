import mongoose from 'mongoose';

const glassCategorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const GlassCategoriesCollection = mongoose.model(
  'GlassCategories',
  glassCategorySchema,
);
