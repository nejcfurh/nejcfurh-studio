import { CARD_DATA } from '@/features/drag-drop/constants';
import { CardDataType } from '@/features/drag-drop/types';
import { useState } from 'react';

import DeleteArea from './DeleteArea';
import DragDropColumn from './DragDropColumn';
import DragDropHeader from './DragDropHeader';

const Board = () => {
  const [cards, setCards] = useState<CardDataType[]>(CARD_DATA);

  return (
    <div className="flex h-screen w-full flex-col justify-start gap-3 py-10">
      <DragDropHeader />
      <div className="flex w-full justify-start gap-3 overflow-x-auto px-4 lg:justify-center">
        <DragDropColumn
          title="Backlog"
          headingColor="text-red-300"
          column="backlog"
          cards={cards}
          setCards={setCards}
        />
        <DragDropColumn
          title="To Do"
          headingColor="text-yellow-200"
          column="to-do"
          cards={cards}
          setCards={setCards}
        />
        <DragDropColumn
          title="In Progress"
          headingColor="text-blue-300"
          column="in-progress"
          cards={cards}
          setCards={setCards}
        />
        <DragDropColumn
          title="Complete"
          headingColor="text-emerald-300"
          column="complete"
          cards={cards}
          setCards={setCards}
        />
        <DeleteArea setCards={setCards} />
      </div>
    </div>
  );
};

export default Board;
