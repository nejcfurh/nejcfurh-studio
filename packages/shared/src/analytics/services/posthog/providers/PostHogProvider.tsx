'use client';

import { createContext, useMemo } from 'react';
import type { FC } from 'react';
import type React from 'react';

import { PostHogClientSession } from '../posthog.client';
import type { AnalyticsPostHogConfig, PostHogContextState } from '../types';

export const PostHogContext = createContext<PostHogContextState | null>(null);

interface PostHogProviderProps {
  children: React.ReactNode;
  config: AnalyticsPostHogConfig | undefined;
}

export const PostHogProvider: FC<PostHogProviderProps> = ({
  children,
  config
}): React.ReactNode => {
  const posthogContextState = useMemo<PostHogContextState | null>(() => {
    if (!config) {
      return null;
    }

    return {
      posthogSession: new PostHogClientSession(config)
    };
  }, [config]);

  return (
    <PostHogContext.Provider value={posthogContextState}>
      {children}
    </PostHogContext.Provider>
  );
};

export {
  useFeatureFlagVariantKey,
  useFeatureFlagPayload
} from 'posthog-js/react';
export { posthog } from 'posthog-js';
