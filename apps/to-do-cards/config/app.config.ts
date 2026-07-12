import { AppEnvironment } from '@/utils/enums/common.enums';
import { z } from '@repo/validation';

const AppConfigValidation = z.object({
  env: z.nativeEnum(AppEnvironment),
  version: z.string().default('dev'),
  mongodbUri: z.string(),
  authSecret: z.string(),
  authGoogle: z.object({
    id: z.string(),
    secret: z.string()
  }),
  authFacebook: z.object({
    id: z.string(),
    secret: z.string()
  }),
  authTwitter: z.object({
    id: z.string(),
    secret: z.string()
  }),
  authGithub: z.object({
    id: z.string(),
    secret: z.string()
  }),
  supabase: z.object({
    url: z.string(),
    anonKey: z.string()
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
  authSecret: process.env.AUTH_SECRET,
  authGoogle: {
    id: process.env.AUTH_GOOGLE_ID,
    secret: process.env.AUTH_GOOGLE_SECRET
  },
  authFacebook: {
    id: process.env.AUTH_FACEBOOK_ID,
    secret: process.env.AUTH_FACEBOOK_SECRET
  },
  authTwitter: {
    id: process.env.AUTH_TWITTER_ID,
    secret: process.env.AUTH_TWITTER_SECRET
  },
  authGithub: {
    id: process.env.AUTH_GITHUB_ID,
    secret: process.env.AUTH_GITHUB_SECRET
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  serviceName: 'to-do-cards',
  webRootUrl: process.env.NEXT_PUBLIC_ROOT_URL
});
