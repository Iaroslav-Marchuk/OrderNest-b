import mongoose from 'mongoose';

const glassCategorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
    isLaminated: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const GlassCategoriesCollection = mongoose.model(
  'GlassCategories',
  glassCategorySchema,
);
