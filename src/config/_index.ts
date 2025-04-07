import type { AppConfig } from '@/common/interfaces/config';

import emailConfig from '@config/email';
import googleConfig from '@config/google';
import jwtConfig from '@config/jwt';
import mongodbConfig from '@config/mongodb';
import postgresConfig from '@config/postgres';
import rateLimitConfig from '@config/rate-limit';
import serverConfig from '@config/server';

const config: AppConfig = {
  server: serverConfig,
  jwt: jwtConfig,
  mongodb: mongodbConfig,
  postgres: postgresConfig,
  email: emailConfig,
  google: googleConfig,
  rateLimit: rateLimitConfig,
};

export default config;
