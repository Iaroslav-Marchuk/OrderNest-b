import 'dotenv/config';

import mongoose from 'mongoose';
import { initMongoDB } from '../src/db/initMongoDB.js';
import { GlassCategoriesCollection } from '../src/db/models/glassCategoryModel.js';
import { GlassTypesCollection } from '../src/db/models/glassTypeModel.js';
import { GLASS_TYPES } from '../src/constants/glassTypesBase.js';

async function seedGlassTypes() {
  await initMongoDB();

  const existing = await GlassTypesCollection.countDocuments();
  if (existing > 0) {
    console.log(`Already seeded (${existing} glass types). Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const categories = await GlassCategoriesCollection.find().lean();
  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.label, c._id]),
  );

  const missingCategories = [
    ...new Set(GLASS_TYPES.map((t) => t.category)),
  ].filter((cat) => !categoryMap[cat]);

  if (missingCategories.length > 0) {
    console.error('Missing categories in DB:', missingCategories);
    await mongoose.disconnect();
    process.exit(1);
  }

  const docs = GLASS_TYPES.map(({ label, category, thickness, temper }) => ({
    label,
    category: categoryMap[category],
    thickness,
    temper,
  }));

  await GlassTypesCollection.insertMany(docs);
  console.log(`Seeded ${docs.length} glass types`);

  await mongoose.disconnect();
}

seedGlassTypes().catch((err) => {
  console.error(err);
  process.exit(1);
});
