import { CardDataType } from '@/features/drag-drop/types';
import { useState } from 'react';
import { FaFire, FaTrash } from 'react-icons/fa6';

const DeleteArea = ({
  setCards,
}: {
  setCards: React.Dispatch<React.SetStateAction<CardDataType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      setCards((prevCards: CardDataType[]) =>
        prevCards.filter(card => card.id !== cardId)
      );
    }
    e.dataTransfer.clearData();
    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-12 grid h-48 w-48 shrink-0 place-content-center rounded-lg border text-3xl transition-colors duration-300 ${active ? 'border-red-800 bg-red-800/20 text-red-500' : 'border-neutral-500 bg-neutral-500/50 text-neutral-500'}`}
    >
      {active ? (
        <FaFire className="size-10 animate-bounce" />
      ) : (
        <FaTrash className="size-10" />
      )}
    </div>
  );
};

export default DeleteArea;
