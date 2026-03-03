import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import { CardDataType } from '@/features/drag-drop/types';

import DropIndicator from './DropIndicator';

const CardItem = ({
  title,
  id,
  column,
  onDragStart,
  createdAt
}: CardDataType & {
  onDragStart: (e: React.DragEvent, card: CardDataType) => void;
}) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { dateStyle: 'long' });
  };

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <AnimatedDiv
        layout
        layoutId={id}
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        draggable
        onDragStart={(e) =>
          onDragStart(e as unknown as React.DragEvent, {
            title,
            id,
            column,
            createdAt
          })
        }
        className="my-1 flex cursor-grab flex-col items-start justify-center gap-1 rounded-sm border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-base text-neutral-100">{title}</p>
        <p className="text-xs text-neutral-500 italic">
          <span className="font-bold">Created:</span> {formatDate(createdAt)}
        </p>
      </AnimatedDiv>
    </>
  );
};

export default CardItem;
