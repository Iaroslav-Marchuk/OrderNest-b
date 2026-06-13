import 'dotenv/config';

import mongoose from 'mongoose';
import { initMongoDB } from '../src/db/initMongoDB.js';
import { GlassCategoriesCollection } from '../src/db/models/glassCategoryModel.js';
import { GLASS_CATEGORIES } from '../src/constants/glassCategoriesBase.js';

async function seedGlassCategories() {
  await initMongoDB();

  const existing = await GlassCategoriesCollection.countDocuments();
  if (existing > 0) {
    console.log(`Already seeded (${existing} glass categories). Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const docs = GLASS_CATEGORIES.map((label) => ({ label }));
  await GlassCategoriesCollection.insertMany(docs);
  console.log(`Seeded ${docs.length} glass categories`);

  await mongoose.disconnect();
}

seedGlassCategories().catch((err) => {
  console.error(err);
  process.exit(1);
});
