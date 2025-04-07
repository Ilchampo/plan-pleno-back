import type { PostgresConfig } from '@common/interfaces/config';

import dotenv from 'dotenv';

dotenv.config();

const postgresConfig: PostgresConfig = {
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  database: process.env.POSTGRES_DB ?? 'plan_pleno',
} as const;

export default postgresConfig;
