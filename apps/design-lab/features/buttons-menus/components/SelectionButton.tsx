const SelectionButton = ({
  selected,
  handleSelection,
  children
}: {
  selected: boolean;
  handleSelection: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      data-selected={selected}
      className="z-10 min-w-0 cursor-pointer rounded-full border-2 border-amber-50 px-3 py-2 text-sm text-white backdrop-blur-3xl transition-all duration-300 hover:scale-[0.97] data-[selected=true]:border-white data-[selected=true]:bg-white data-[selected=true]:text-black sm:min-w-44 sm:px-4 sm:text-base"
      onClick={handleSelection}
    >
      {children}
    </button>
  );
};

export default SelectionButton;
