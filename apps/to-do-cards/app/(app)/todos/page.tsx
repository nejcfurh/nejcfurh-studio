import CardContainer from '@/components/CardContainer';
import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { getLists } from '@/lib/actions/todos';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';

export default async function TodosPage() {
  const lists = await getLists();

  return (
    <div className="cards-box">
      <div className="wrapper">
        <CardContainer initialLists={lists} />
      </div>
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.TO_DO_CARDS_HOMEPAGE
        }}
      />
    </div>
  );
}
