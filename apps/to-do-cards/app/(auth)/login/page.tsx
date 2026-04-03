import Footer from '@/components/Footer';
import LoginRegister from '@/components/LoginRegister';
import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex flex-1 items-center justify-center py-10">
        <LoginRegister />
      </div>
      <Footer />
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.TO_DO_CARDS_LOGIN_PAGE
        }}
      />
    </div>
  );
}
