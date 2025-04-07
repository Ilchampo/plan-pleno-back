import type { MongoDbConfig } from '@common/interfaces/config';

import dotenv from 'dotenv';

dotenv.config();

const mongodbConfig: MongoDbConfig = {
  uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/plan_pleno',
} as const;

export default mongodbConfig;
