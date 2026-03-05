import CardContainer from '@/components/CardContainer';
import { getLists } from '@/lib/actions/todos';

export default async function TodosPage() {
  const lists = await getLists();

  return (
    <div className="cards-box">
      <div className="wrapper">
        <CardContainer initialLists={lists} />
      </div>
    </div>
  );
}
