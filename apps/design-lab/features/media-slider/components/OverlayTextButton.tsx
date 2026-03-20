const OverlayTextButton = ({
  handleDisplayTextOverlay,
  displayTextOverlay
}: {
  handleDisplayTextOverlay: () => void;
  displayTextOverlay: boolean;
}) => {
  return (
    <button
      className="absolute top-5 z-10 animate-pulse cursor-pointer rounded-full bg-white/50 p-4 backdrop-blur-3xl transition-all duration-300 hover:scale-[1.10] hover:opacity-80"
      onClick={handleDisplayTextOverlay}
    >
      <span className="text-lg font-light text-black">
        {displayTextOverlay ? 'Hide' : 'Show'} Text Overlay
      </span>
    </button>
  );
};

export default OverlayTextButton;
