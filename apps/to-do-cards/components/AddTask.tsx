'use client';

import { addItem } from '@/lib/actions/todos';
import type { IList } from '@/lib/models/user';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddTaskProps {
  list: IList;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
  setDaily: React.Dispatch<React.SetStateAction<string>>;
}

export default function AddTask({ list, setLists, setDaily }: AddTaskProps) {
  const [inputValue, setInputValue] = useState('');

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const updatedLists = await addItem(list.name, inputValue);
      setLists(updatedLists);
      setDaily(list.name);
      setInputValue('');
      toast.success('Task created successfully!');
    } catch {
      toast.error('Failed to create task!');
    }
  };

  return (
    <form className="card-task-input" onSubmit={handleCreate}>
      <input
        id="card-task-input-text"
        type="text"
        name="newItem"
        placeholder="New task"
        autoComplete="off"
        required
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        type="submit"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <PlusCircle className="add-task-icon" size={30} color="#4ade80" />
      </button>
    </form>
  );
}
