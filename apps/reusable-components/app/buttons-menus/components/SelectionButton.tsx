const SelectionButton = ({
  selected,
  handleSelection,
  children,
}: {
  selected: boolean;
  handleSelection: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      data-selected={selected}
      className="border-2 border-amber-50 text-white z-10 px-4 py-2 rounded-full backdrop-blur-3xl hover:scale-[0.97] transition-all duration-300 cursor-pointer data-[selected=true]:border-white data-[selected=true]:text-black data-[selected=true]:bg-white"
      onClick={handleSelection}
    >
      {children}
    </button>
  );
};

export default SelectionButton;
