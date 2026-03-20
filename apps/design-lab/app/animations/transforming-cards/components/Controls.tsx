const Controls = ({
  toggleAnimation,
  resetPosition,
  changeDirection,
  isAnimating
}: {
  toggleAnimation: () => void;
  resetPosition: () => void;
  changeDirection: () => void;
  isAnimating: boolean;
}) => {
  return (
    <div className="absolute top-5 left-1/2 z-10 flex -translate-x-1/2 flex-row gap-4">
      <button
        className="control-btn border border-amber-50/50"
        onClick={toggleAnimation}
      >
        <span>{isAnimating ? 'Pause' : 'Play'}</span>
      </button>
      <button
        className="control-btn border border-amber-50/50"
        onClick={resetPosition}
      >
        <span>Reset</span>
      </button>
      <button
        className="control-btn border border-amber-50/50"
        onClick={changeDirection}
      >
        <span>Direction</span>
      </button>
    </div>
  );
};

export default Controls;
