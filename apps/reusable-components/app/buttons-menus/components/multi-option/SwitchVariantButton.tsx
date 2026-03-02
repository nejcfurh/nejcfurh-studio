const SwitchVariantButton = ({
  variant,
  handleSwitchVariant,
}: {
  variant: 'circular' | 'horizontal';
  handleSwitchVariant: () => void;
}) => {
  return (
    <button
      className="flex mt-10 bg-amber-50 text-black z-10 px-4 py-2 rounded-full backdrop-blur-3xl hover:opacity-80 hover:scale-[1.10] transition-all duration-300 cursor-pointer"
      onClick={handleSwitchVariant}
    >
      <span className="text-black text-base font-light">
        {variant === 'circular' ? 'Change to Horizontal' : 'Change to Circular'}
      </span>
    </button>
  );
};

export default SwitchVariantButton;
