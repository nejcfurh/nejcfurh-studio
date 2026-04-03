import Game from '@/components/Game';
import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';

export default function Home() {
  return (
    <>
      <Game />
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.BACKYARD_SKIES_HOMEPAGE
        }}
      />
    </>
  );
}
