import type { GoogleOAuthConfig } from '@common/interfaces/config';

import dotenv from 'dotenv';

dotenv.config();

const googleConfig: GoogleOAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  callbackUrl: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3000/api/auth/google/callback',
} as const;

export default googleConfig;
