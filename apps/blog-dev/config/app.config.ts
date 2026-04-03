import { AppEnvironment } from '@/utils/enums/common.enums';
import { z } from 'zod';

const AppConfigValidation = z.object({
  env: z.nativeEnum(AppEnvironment),
  version: z.string().default('dev'),
  mongodbUri: z.string(),
  nextAuthSecret: z.string(),
  admin: z.object({
    username: z.string(),
    password: z.string()
  }),
  posthog: z.object({
    apiKey: z.string(),
    apiHost: z.string()
  }),
  serviceName: z.string(),
  webRootUrl: z.string()
});

export const appConfig = AppConfigValidation.parse({
  env: process.env.NEXT_PUBLIC_ENV,
  version: process.env.NEXT_PUBLIC_VERSION,
  mongodbUri: process.env.MONGODB_URI,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  serviceName: 'blog-dev',
  webRootUrl: process.env.NEXT_PUBLIC_ROOT_URL
});
