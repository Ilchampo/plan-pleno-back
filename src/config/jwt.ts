import type { JwtConfig } from '@common/interfaces/config';

import dotenv from 'dotenv';

dotenv.config();

const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET ?? 'default_secret_for_development',
  expiration: process.env.JWT_EXPIRATION ?? '7d',
} as const;

export default jwtConfig;
