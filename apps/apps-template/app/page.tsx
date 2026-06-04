import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';
import { AnimatedTitle } from '@repo/ui/animation/core';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900">
      <AnimatedTitle className="text-4xl font-bold">
        Apps Template
      </AnimatedTitle>
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.APPS_TEMPLATE
        }}
      />
    </div>
  );
}
