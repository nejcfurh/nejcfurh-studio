import { AppEnvironment } from '@/utils/enums/common.enums';
import { z } from 'zod';

const AppConfigValidation = z.object({
  env: z.enum(AppEnvironment),
  version: z.string().default('dev'),
  databaseUrl: z.string(),
  authSecret: z.string(),
  authGoogle: z.object({
    id: z.string(),
    secret: z.string()
  }),
  authFacebook: z.object({
    id: z.string(),
    secret: z.string()
  }),
  authGithub: z.object({
    id: z.string(),
    secret: z.string()
  }),
  cloudinary: z.object({
    cloudName: z.string()
  }),
  pusher: z.object({
    appId: z.string(),
    appKey: z.string(),
    secret: z.string()
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
  databaseUrl: process.env.DATABASE_URL,
  authSecret: process.env.AUTH_SECRET,
  authGoogle: {
    id: process.env.AUTH_GOOGLE_ID,
    secret: process.env.AUTH_GOOGLE_SECRET
  },
  authFacebook: {
    id: process.env.AUTH_FACEBOOK_ID,
    secret: process.env.AUTH_FACEBOOK_SECRET
  },
  authGithub: {
    id: process.env.AUTH_GITHUB_ID,
    secret: process.env.AUTH_GITHUB_SECRET
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  },
  pusher: {
    appId: process.env.PUSHER_APP_ID,
    appKey: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: process.env.PUSHER_SECRET
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  serviceName: 'twabblr',
  webRootUrl: process.env.NEXT_PUBLIC_ROOT_URL
});
