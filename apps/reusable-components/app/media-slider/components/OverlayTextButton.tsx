const OverlayTextButton = ({
  handleDisplayTextOverlay,
  displayTextOverlay,
}: {
  handleDisplayTextOverlay: () => void;
  displayTextOverlay: boolean;
}) => {
  return (
    <button
      className="absolute top-5  bg-white/50 z-10 p-4 rounded-full backdrop-blur-3xl hover:opacity-80 hover:scale-[1.10] transition-all duration-300 cursor-pointer animate-pulse"
      onClick={handleDisplayTextOverlay}
    >
      <span className="text-black text-lg font-light">
        {displayTextOverlay ? 'Hide' : 'Show'} Text Overlay
      </span>
    </button>
  );
};

export default OverlayTextButton;
