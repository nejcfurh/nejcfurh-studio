import { PiSpeedometer } from 'react-icons/pi';

const SpeedIndicator = ({
  velocity,
  speedValueRef
}: {
  velocity: number;
  speedValueRef: React.RefObject<HTMLSpanElement>;
}) => {
  return (
    <div className="absolute top-5 right-5 z-10 flex items-center gap-2 rounded-full border border-gray-800/50 bg-amber-50 px-4 py-2 text-sm text-gray-800 backdrop-blur-sm dark:text-gray-800">
      <PiSpeedometer className="size-8" /> Speed:{' '}
      <span className="font-bold" ref={speedValueRef}>
        {velocity}
      </span>
      <span>px/s</span>
    </div>
  );
};

export default SpeedIndicator;
