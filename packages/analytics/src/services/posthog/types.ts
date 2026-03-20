import type { AppEnvironment } from '@repo/utils';

import type { PostHogClientSession } from './posthog.client';

export interface AnalyticsPostHogConfig {
  debug?: boolean;
  apiKey: string;
  apiHost: string;
  superProperties: {
    environment: AppEnvironment;
    serviceName: string;
    version: string;
  };
}

export interface PostHogContextState {
  posthogSession: PostHogClientSession;
}
