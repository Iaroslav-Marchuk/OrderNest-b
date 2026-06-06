import 'dotenv/config';

import mongoose from 'mongoose';
import { initMongoDB } from '../src/db/initMongoDB.js';
import { ClientModel } from '../src/db/models/clientModel.js';
import { CLIENTS } from '../src/constants/clientsBase.js';

async function seedClients() {
  await initMongoDB();

  const existing = await ClientModel.countDocuments();
  if (existing > 0) {
    console.log(`Already seeded (${existing} clients). Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const docs = CLIENTS.map((name) => ({ name }));
  await ClientModel.insertMany(docs);
  console.log(`Seeded ${docs.length} clients`);

  await mongoose.disconnect();
}

seedClients().catch((err) => {
  console.error(err);
  process.exit(1);
});
