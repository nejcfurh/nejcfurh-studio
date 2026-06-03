import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div>Hello Home</div>
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.DOMERA
        }}
      />
    </div>
  );
}
