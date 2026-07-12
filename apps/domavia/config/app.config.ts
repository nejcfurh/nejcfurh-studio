import 'server-only';

import { AppEnvironment } from '@/utils/enums/common.enums';
import { z } from '@repo/validation';

const AppConfigValidation = z.object({
  env: z.enum(AppEnvironment),
  version: z.string().default('dev'),
  firebase: z.object({
    apiKey: z.string(),
    authDomain: z.string(),
    projectId: z.string(),
    storageBucket: z.string(),
    messagingSenderId: z.string(),
    appId: z.string(),
    measurementId: z.string()
  }),
  firebaseAdmin: z.object({
    projectId: z.string(),
    clientEmail: z.string(),
    privateKey: z.string()
  }),
  posthog: z.object({
    apiKey: z.string(),
    apiHost: z.string()
  }),
  supabase: z.object({
    url: z.string(),
    serviceRoleKey: z.string(),
    anonKey: z.string()
  }),
  serviceName: z.string(),
  webRootUrl: z.string()
});

export const appConfig = AppConfigValidation.parse({
  env: process.env.NEXT_PUBLIC_ENV,
  version: process.env.NEXT_PUBLIC_VERSION,
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  },
  firebaseAdmin: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  },
  serviceName: 'domavia',
  webRootUrl: process.env.NEXT_PUBLIC_ROOT_URL
});
