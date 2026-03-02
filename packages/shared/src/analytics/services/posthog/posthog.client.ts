import { AppEnvironment } from '@shared-utils/enums/common.enums';
import { posthog } from 'posthog-js';

import type { AnalyticsPostHogConfig } from './types';

export class PostHogClientSession {
  private readonly debug: boolean;

  private readonly environment: AppEnvironment;

  constructor(params: AnalyticsPostHogConfig) {
    const { debug = false, apiKey, apiHost, superProperties } = params;

    this.environment = superProperties.environment;
    this.debug = debug;

    // We need this check to prevent building issues on Vercel, because our NodeVersion does not support FileAPI that is used by posthog-js
    if (typeof window !== 'undefined') {
      posthog.init(apiKey, {
        api_host: apiHost,
        debug,
        capture_pageview: false // Disable default pageview tracking because we are using our own component for this.
      });

      posthog.register({
        Environment: superProperties.environment,
        Source: superProperties.serviceName,
        Version: superProperties.version
      });
    }
  }

  public get isEnabled(): boolean {
    return this.environment !== AppEnvironment.Development || this.debug;
  }

  public identify(userId: string, properties?: Record<string, unknown>): void {
    if (this.isEnabled) {
      posthog.identify(userId, properties);
    }
  }

  public capture(event: string, properties?: Record<string, unknown>): void {
    if (this.isEnabled) {
      posthog.capture(event, properties);
    }
  }

  public trackPageView(pageName: string, additionalProperties = {}): void {
    this.capture('$pageview', {
      Page: pageName,
      ...additionalProperties
    });
  }
}
