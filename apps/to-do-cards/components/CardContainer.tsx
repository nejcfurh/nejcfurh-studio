'use client';

import AddCustomList from '@/components/AddCustomList';
import Card from '@/components/Card';
import {
  completeItem,
  deleteCard as deleteCardAction
} from '@/lib/actions/todos';
import type { IList } from '@/lib/models/user';
import { deleteImageSupabase } from '@/lib/supabase';
import { getDate } from '@/lib/utils/helpers';
import { useState } from 'react';
import { toast } from 'sonner';

interface CardContainerProps {
  initialLists: IList[];
}

export default function CardContainer({ initialLists }: CardContainerProps) {
  const [lists, setLists] = useState<IList[]>(initialLists);
  const [daily, setDaily] = useState('Daily');
  const day = getDate();

  const handleDelete = async (event: React.FormEvent, listId: string) => {
    event.preventDefault();
    try {
      const result = await deleteCardAction(listId);
      setLists(result.lists);
      setDaily('Daily');
      toast.success('List has been successfully deleted!');
      if (result.image && !result.image.includes('unsplash')) {
        deleteImageSupabase(result.image);
      }
    } catch {
      toast.error('Failed to delete card!');
    }
  };

  const handleCompleteTask = async (
    event: React.FormEvent | React.MouseEvent,
    listName: string,
    itemId: string
  ) => {
    event.preventDefault();
    try {
      const updatedLists = await completeItem(listName, itemId);
      setLists(updatedLists);
      setDaily(listName);
      toast.success('Task completed! Great job!');
    } catch {
      toast.error('Task could not be completed!');
    }
  };

  return (
    <div className="container-cards">
      {lists.map((list, i) => (
        <Card
          key={list._id || i}
          list={list}
          day={day}
          daily={daily}
          setLists={setLists}
          setDaily={setDaily}
          handleDelete={handleDelete}
          handleCompleteTask={handleCompleteTask}
        />
      ))}
      <AddCustomList setDaily={setDaily} setLists={setLists} />
    </div>
  );
}
