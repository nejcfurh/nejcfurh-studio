import { useState } from 'react';
import CardItem from './CardItem';
import DropIndicator from './DropIndicator';
import AddTask from './AddTask';
import { CardDataType } from '@/features/drag-drop/types';
import { AnimatePresence } from 'motion/react';

const Column = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
}: {
  title: string;
  headingColor: string;
  column: string;
  cards: CardDataType[];
  setCards: React.Dispatch<React.SetStateAction<CardDataType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent, card: CardDataType) => {
    e.dataTransfer.setData('cardId', card.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
    highlightIndicator(e);
  };

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const nearestIndicator = getNearestIndicator(e, indicators);
    if (nearestIndicator) {
      (nearestIndicator.element as HTMLElement).style.opacity = '1';
    }
  };
  const clearHighlights = (elements?: Element[]) => {
    const indicators = elements || getIndicators();

    indicators.forEach(indicator => {
      (indicator as HTMLElement).style.opacity = '0';
    });
  };

  const getNearestIndicator = (e: React.DragEvent, indicators: Element[]) => {
    const DISTANCE_OFFSET = 50;

    const indicatorElement = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        }

        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return indicatorElement;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData('cardId');

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();

    const { element } = getNearestIndicator(e, indicators);

    const before = element.getAttribute('data-before') || '-1';

    if (before !== cardId) {
      let cardsCopy = [...cards];

      let cardToTransfer: CardDataType | undefined;

      cardToTransfer = cardsCopy.find(card => card.id === cardId);

      if (!cardToTransfer) {
        return;
      }

      cardToTransfer = { ...cardToTransfer, column };

      cardsCopy = cardsCopy.filter(card => card.id !== cardId);

      const moveToBack = before === '-1';

      if (moveToBack) {
        cardsCopy.push(cardToTransfer);
      } else {
        const insertAtIndex = cardsCopy.findIndex(card => card.id === before);
        if (insertAtIndex === undefined) {
          return;
        }
        cardsCopy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(cardsCopy);
    }
  };

  const filteredCards = cards.filter(card => card.column === column);

  return (
    <div className="w-72 h-full shrink-0">
      <div className="px-5 py-1.5 flex items-center justify-between">
        <h3 className={`font-medium text-xl ${headingColor}`}>{title}</h3>
        <span className="rounded-full text-lg text-neutral-100 font-bold">
          {filteredCards.length} <span className="text-sm">tasks</span>
        </span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full w-full rounded overflow-scroll transition-colors px-1.5 ${active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'}`}
      >
        <AnimatePresence mode="popLayout">
          {filteredCards.map(card => (
            <CardItem key={card.id} {...card} onDragStart={handleDragStart} />
          ))}
        </AnimatePresence>
        <DropIndicator beforeId={'-1'} column={column} />
        <AddTask column={column} setCards={setCards} />
      </div>
    </div>
  );
};

export default Column;
