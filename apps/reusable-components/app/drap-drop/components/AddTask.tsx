import { CardDataType } from '@/features/drag-drop/types';
import { motion } from 'motion/react';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

const AddTask = ({
  column,
  setCards,
}: {
  column: string;
  setCards: React.Dispatch<React.SetStateAction<CardDataType[]>>;
}) => {
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard: CardDataType = {
      title: text.trim(),
      id: Math.random().toString(),
      column,
      createdAt: new Date().toISOString(),
    };

    setCards((prevCards: CardDataType[]) => [...prevCards, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit} className="relative">
          <textarea
            onChange={e => setText(e.target.value)}
            autoFocus
            rows={2}
            maxLength={50}
            placeholder="Add a new task..."
            className="w-full h-28 rounded-lg border-2 border-violet-400 bg-violet-40/20 p-3 text-lg text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
          />
          <div className="absolute bottom-3 right-2 w-full flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 text-base transition-colors text-neutral-100 hover:text-neutral-400"
            >
              Close <FaTimes className="size-4" />
            </button>
            <button
              type="submit"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-neutral-50 px-3 py-1 text-base transition-colors hover:bg-neutral-300 text-neutral-950"
            >
              <span>Add</span> <FiPlus className="size-4" />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-lg text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add task</span> <FiPlus className="size-4" />
        </motion.button>
      )}
    </>
  );
};

export default AddTask;
