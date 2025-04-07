import { config } from 'dotenv';

config({ path: '.env.test' });

jest.setTimeout(30000);

afterEach(() => {
  jest.clearAllMocks();
});
