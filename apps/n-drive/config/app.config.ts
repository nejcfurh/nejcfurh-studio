import { AppEnvironment } from '@/utils/enums/common.enums';
import { z } from 'zod';

const AppConfigValidation = z.object({
  env: z.enum(AppEnvironment),
  version: z.string().default('dev'),
  convex: z.object({
    deployment: z.string(),
    url: z.string()
  }),
  clerk: z.object({
    publishableKey: z.string(),
    secretKey: z.string(),
    webhookSecret: z.string()
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
  convex: {
    deployment: process.env.CONVEX_DEPLOYMENT,
    url: process.env.NEXT_PUBLIC_CONVEX_URL
  },
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  serviceName: 'n-drive',
  webRootUrl: process.env.NEXT_PUBLIC_ROOT_URL
});
