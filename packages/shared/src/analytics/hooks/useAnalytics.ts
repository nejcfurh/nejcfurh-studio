import { usePostHog } from '@shared-analytics/services/posthog';
import type {
  AnalyticsClientEventPropertiesBase,
  AnalyticsClientPageEventBase,
  PageNameBase
} from '@shared-analytics/types.client';

export function useAnalytics<
  AnalyticsClientEventProperties extends AnalyticsClientEventPropertiesBase =
    AnalyticsClientEventPropertiesBase,
  AnalyticsClientPageVisit extends AnalyticsClientPageEventBase<PageNameBase> =
    AnalyticsClientPageEventBase<PageNameBase>
>(): {
  userId?: string;
  identify(params: { userId: string }): void;
  trackPageVisit: (params: AnalyticsClientPageVisit) => void;
  trackEvent: (params: AnalyticsClientEventProperties) => void;
} {
  const { posthogSession } = usePostHog();

  const identify = (params: { userId: string }): void => {
    posthogSession?.identify(params.userId);
  };

  const trackEvent = (params: AnalyticsClientEventPropertiesBase): void => {
    const { eventName, properties } = params;

    posthogSession?.capture(eventName, properties);
  };

  const trackPageVisit = (
    params: AnalyticsClientPageEventBase<PageNameBase>
  ): void => {
    const { pageName, properties = {} } = params;

    if (posthogSession) {
      const url = window.location.href;

      posthogSession?.trackPageView(pageName, {
        ...properties,
        $current_url: url
      });
    }
  };

  return {
    identify,
    trackEvent,
    trackPageVisit
  };
}
