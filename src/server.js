import 'dotenv/config';

import app from './app.js';

import { initMongoDB } from './db/initMongoDB.js';

import { getEnvVariable } from './utils/getEnvVariable.js';

const PORT = getEnvVariable('PORT') || 8080;

async function startServer() {
  await initMongoDB();

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Server started on port ${PORT}`);
  });
}

startServer().catch((error) => console.error(error));
