import type { ServerConfig } from '@common/interfaces/config';

import dotenv from 'dotenv';

dotenv.config();

const serverConfig: ServerConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? '/api',
} as const;

export default serverConfig;
