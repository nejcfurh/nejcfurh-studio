import { z } from 'zod';

import { AppEnvironment } from './utils';

const AppConfigValidation = z.object({
  env: z.enum(AppEnvironment),
  version: z.string().default('dev'),
  googleGeminiApiKey: z.string(),
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
  googleGeminiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  serviceName: 'friends-of-nature',
  webRootUrl: process.env.NEXT_PUBLIC_ROOT_URL
});
