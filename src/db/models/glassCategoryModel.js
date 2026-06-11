import mongoose from 'mongoose';

const glassCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const GlassCategoriesCollection = mongoose.model(
  'GlassCategories',
  glassCategorySchema,
);
