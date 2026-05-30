import 'dotenv/config';
import bcrypt from 'bcrypt';
import { initMongoDB } from '../src/db/initMongoDB.js';
import { UsersCollection } from '../src/db/models/userModel.js';

import { getEnvVariable } from '../src/utils/getEnvVariable.js';

const ADMIN_TEL = getEnvVariable('ADMIN_TEL');
const ADMIN_NAME = getEnvVariable('ADMIN_NAME');
const ADMIN_PASSWORD = getEnvVariable('ADMIN_PASSWORD');

const createAdmin = async () => {
  await initMongoDB();

  const existing = await UsersCollection.findOne({
    tel: ADMIN_TEL,
  });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await UsersCollection.create({
    name: ADMIN_NAME,
    tel: ADMIN_TEL,
    password: await bcrypt.hash(ADMIN_PASSWORD, 10),
    role: 'admin',
  });

  console.log('Admin created successfully!');
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
