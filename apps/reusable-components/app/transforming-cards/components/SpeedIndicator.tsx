import { PiSpeedometer } from 'react-icons/pi';

const SpeedIndicator = ({
  velocity,
  speedValueRef,
}: {
  velocity: number;
  speedValueRef: React.RefObject<HTMLSpanElement>;
}) => {
  return (
    <div className="z-10 top-5 right-5 text-sm text-gray-800 dark:text-gray-800 absolute flex items-center gap-2 bg-amber-50 backdrop-blur-sm border border-gray-800/50 rounded-full px-4 py-2">
      <PiSpeedometer className="size-8" /> Speed:{' '}
      <span className="font-bold" ref={speedValueRef}>
        {velocity}
      </span>
      <span>px/s</span>
    </div>
  );
};

export default SpeedIndicator;
