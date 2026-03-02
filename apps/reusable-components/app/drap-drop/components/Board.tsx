import { useState } from 'react';
import Column from './Column';
import { CardDataType } from '@/features/drag-drop/types';
import { CARD_DATA } from '@/features/drag-drop/constants';
import DeleteArea from './DeleteArea';
import Header from './Header';

const Board = () => {
  const [cards, setCards] = useState<CardDataType[]>(CARD_DATA);

  return (
    <div className="flex flex-col h-screen w-full py-10 justify-start gap-3">
      <Header />
      <div className="flex w-full justify-center gap-3">
        <Column
          title="Backlog"
          headingColor="text-red-300"
          column="backlog"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="To Do"
          headingColor="text-yellow-200"
          column="to-do"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In Progress"
          headingColor="text-blue-300"
          column="in-progress"
          cards={cards}
          setCards={setCards}
        />
        <Column
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
