import 'dotenv/config';
import mongoose from 'mongoose';
import { initMongoDB } from '../src/db/initMongoDB.js';
import { GlassCategoriesCollection } from '../src/db/models/glassCategoryModel.js';
import { GLASS_CATEGORIES } from '../src/constants/glassCategoriesBase.js';

async function seedGlassCategories() {
  await initMongoDB();

  await GlassCategoriesCollection.deleteMany({});
  console.log('Cleared existing glass categories');

  await GlassCategoriesCollection.insertMany(GLASS_CATEGORIES);
  console.log(`Seeded ${GLASS_CATEGORIES.length} glass categories`);

  await mongoose.disconnect();
}

seedGlassCategories().catch((err) => {
  console.error(err);
  process.exit(1);
});
