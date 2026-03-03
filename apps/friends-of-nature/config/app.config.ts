import { z } from 'zod';

import { AppEnvironment } from './utils';

const AppConfigValidation = z.object({
  env: z.enum(AppEnvironment),
  version: z.string().default('dev'),
  serviceName: z.string()
});

export const appConfig = AppConfigValidation.parse({
  env: process.env.NEXT_PUBLIC_ENV,
  version: process.env.NEXT_PUBLIC_VERSION,
  serviceName: 'friends-of-nature'
});
