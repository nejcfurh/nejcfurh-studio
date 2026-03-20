'use client';

import { useAnalytics } from '@analytics/hooks/useAnalytics';
import type {
  AnalyticsClientPageEventBase,
  PageNameBase
} from '@analytics/types.client';
import { ClientOnly, useMount } from '@repo/utils';

interface PageVisitTrackerProps<
  AnalyticsClientPageEvent extends AnalyticsClientPageEventBase<PageNameBase>
> {
  pageEvent: AnalyticsClientPageEvent;
}

const PageVisitTrackerComponent = <
  AnalyticsClientPageEvent extends AnalyticsClientPageEventBase<PageNameBase>
>({
  pageEvent: { pageName, properties: pageVisitProperties }
}: PageVisitTrackerProps<AnalyticsClientPageEvent>): null => {
  const { trackPageVisit } = useAnalytics();

  useMount(() => {
    trackPageVisit({ pageName, properties: pageVisitProperties });
  });

  return null;
};

export const PageVisitTracker = <
  AnalyticsClientPageEvent extends AnalyticsClientPageEventBase<PageNameBase>
>(
  props: PageVisitTrackerProps<AnalyticsClientPageEvent>
): React.JSX.Element => {
  return (
    <ClientOnly>
      <PageVisitTrackerComponent {...props} />
    </ClientOnly>
  );
};
