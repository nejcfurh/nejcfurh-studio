'use client';

import AddTask from '@/components/AddTask';
import CompletedItem from '@/components/CompletedItem';
import TaskItem from '@/components/TaskItem';
import type { IList } from '@/lib/models/user';

interface TasksProps {
  handleCompleteTask: (
    event: React.FormEvent | React.MouseEvent,
    listName: string,
    itemId: string
  ) => void;
  list: IList;
  setDaily: React.Dispatch<React.SetStateAction<string>>;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
  active: boolean;
}

export default function Tasks({
  handleCompleteTask,
  list,
  setLists,
  setDaily,
  active
}: TasksProps) {
  const { items, completedItems } = list;

  if (!active) {
    return (
      <div className="card-form-tasks">
        <CompletedItem
          completedItems={completedItems}
          listName={list.name}
          setLists={setLists}
          setDaily={setDaily}
        />
      </div>
    );
  }

  return (
    <div className="card-form-tasks">
      <TaskItem
        handleCompleteTask={handleCompleteTask}
        listName={list.name}
        items={items}
      />
      <AddTask list={list} setLists={setLists} setDaily={setDaily} />
    </div>
  );
}
