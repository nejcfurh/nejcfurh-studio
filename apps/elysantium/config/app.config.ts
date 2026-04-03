import { AppEnvironment } from '@/utils/enums/common.enums';
import { z } from 'zod';

const AppConfigValidation = z.object({
  env: z.enum(AppEnvironment),
  version: z.string().default('dev'),
  supabase: z.object({
    url: z.string(),
    anonKey: z.string()
  }),
  auth: z.object({
    user: z.string(),
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
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  auth: {
    user: process.env.USER,
    password: process.env.PASSWORD
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  serviceName: 'elysantium',
  webRootUrl: process.env.NEXT_PUBLIC_ROOT_URL
});
