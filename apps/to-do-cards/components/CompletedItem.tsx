'use client';

import NoTasks from '@/components/NoTasks';
import { deleteCompletedItem } from '@/lib/actions/todos';
import type { IItem, IList } from '@/lib/models/user';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CompletedItemProps {
  completedItems: IItem[];
  listName: string;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
  setDaily: React.Dispatch<React.SetStateAction<string>>;
}

export default function CompletedItem({
  completedItems,
  listName,
  setLists,
  setDaily
}: CompletedItemProps) {
  const handleDeleteTask = async (event: React.MouseEvent, itemId: string) => {
    event.preventDefault();
    try {
      const updatedLists = await deleteCompletedItem(listName, itemId);
      setLists(updatedLists);
      setDaily(listName);
      toast.success('Task successfully deleted!');
    } catch {
      toast.error('Task could not be deleted!');
    }
  };

  return (
    <div className="card-task">
      {completedItems.length === 0 ? (
        <NoTasks type="completed" />
      ) : (
        completedItems.map((item) => {
          const dateObject = new Date(item.date);
          return (
            <div key={item._id} className="card-task-line-completed">
              <Trash2
                onClick={(e) => handleDeleteTask(e, item._id)}
                className="completed-task-delete"
                size={18}
              />
              <p className="card-task-name-completed">
                <strong>
                  {item.name.length >= 20
                    ? `${item.name.substring(0, 19)}...`
                    : item.name}
                </strong>{' '}
                was completed on{' '}
                <strong>{dateObject.toLocaleDateString('en-US')}</strong>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
