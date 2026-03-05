'use client';

import NoTasks from '@/components/NoTasks';
import type { IItem } from '@/lib/models/user';
import { CircleCheck } from 'lucide-react';

interface TaskItemProps {
  handleCompleteTask: (
    event: React.FormEvent | React.MouseEvent,
    listName: string,
    itemId: string
  ) => void;
  listName: string;
  items: IItem[];
}

export default function TaskItem({
  handleCompleteTask,
  listName,
  items
}: TaskItemProps) {
  return (
    <div className="card-task">
      {items.length === 0 ? (
        <NoTasks type="active" />
      ) : (
        items.map((item) => (
          <div key={item._id} className="card-task-line">
            <button
              className="card-task-box"
              type="button"
              onClick={(e) => handleCompleteTask(e, listName, item._id)}
            >
              <CircleCheck
                className="complete-icon"
                size={30}
                color="#4ade80"
              />
            </button>
            <p className="card-task-name">{item.name}</p>
          </div>
        ))
      )}
    </div>
  );
}
