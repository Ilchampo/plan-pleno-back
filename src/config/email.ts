import type { EmailConfig } from '@common/interfaces/config';

import dotenv from 'dotenv';

dotenv.config();

const emailConfig: EmailConfig = {
  service: process.env.EMAIL_SERVICE ?? 'gmail',
  user: process.env.EMAIL_USER ?? '',
  password: process.env.EMAIL_PASSWORD ?? '',
  from: process.env.EMAIL_FROM ?? '',
} as const;

export default emailConfig;
