import type { RateLimitConfig } from '@common/interfaces/config';

import dotenv from 'dotenv';

dotenv.config();

const FIFTEEN_MINUTES = 900000 as const;
const DEFAULT_MAX = 100 as const;

const rateLimitConfig: RateLimitConfig = {
  windowMs: process.env.RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
    : FIFTEEN_MINUTES,
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : DEFAULT_MAX,
} as const;

export default rateLimitConfig;
