import { GoogleAnalytics } from '@next/third-parties/google';
import {
  BrazeProvider,
  type BrazeConfig
} from '@shared-analytics/services/braze';
import { MetaPixel } from '@shared-analytics/services/meta';
import type { PostHogConfig } from '@shared-analytics/services/posthog';
import { PostHogProvider } from '@shared-analytics/services/posthog';
import React, { type ReactNode } from 'react';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  brazeConfig?: BrazeConfig;
  posthogConfig?: PostHogConfig;
  gtmId?: string;
  pixelId?: string;
}

// We needed to wrap Google Analytics with ClientOnly to prevent Vercel timeouts (should not happen but they do).

export const AnalyticsProvider = ({
  children,
  brazeConfig,
  posthogConfig,
  gtmId,
  pixelId
}: AnalyticsProviderProps): ReactNode => {
  return (
    <React.Fragment>
      <BrazeProvider config={brazeConfig}>
        <PostHogProvider config={posthogConfig}>{children}</PostHogProvider>
      </BrazeProvider>
      {gtmId !== undefined && <GoogleAnalytics gaId={gtmId} />}
      {pixelId !== undefined && <MetaPixel pixelId={pixelId} />}
    </React.Fragment>
  );
};
