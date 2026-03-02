'use client';

import { useAnalytics } from '@shared-analytics/hooks/useAnalytics';
import type {
  AnalyticsClientPageEventBase,
  PageNameBase
} from '@shared-analytics/types.client';
import { ClientOnly } from '@shared-utils/components';
import { useMount } from '@shared-utils/hooks/client';

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
