import 'dotenv/config';

import mongoose from 'mongoose';
import { initMongoDB } from '../src/db/initMongoDB.js';

import { CLIENTS } from '../src/constants/clientsBase.js';
import { ClientsCollection } from '../src/db/models/clientModel.js';

async function seedClients() {
  await initMongoDB();

  const existing = await ClientsCollection.countDocuments();
  if (existing > 0) {
    console.log(`Already seeded (${existing} clients). Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const docs = CLIENTS.map((name) => ({ name }));
  await ClientsCollection.insertMany(docs);
  console.log(`Seeded ${docs.length} clients`);

  await mongoose.disconnect();
}

seedClients().catch((err) => {
  console.error(err);
  process.exit(1);
});
