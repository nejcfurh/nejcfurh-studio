const SwitchVariantButton = ({
  variant,
  handleSwitchVariant
}: {
  variant: 'circular' | 'horizontal';
  handleSwitchVariant: () => void;
}) => {
  return (
    <button
      className="z-10 mt-10 flex cursor-pointer rounded-full bg-amber-50 px-4 py-2 text-black backdrop-blur-3xl transition-all duration-300 hover:scale-[1.10] hover:opacity-80"
      onClick={handleSwitchVariant}
    >
      <span className="text-base font-light text-black">
        {variant === 'circular' ? 'Change to Horizontal' : 'Change to Circular'}
      </span>
    </button>
  );
};

export default SwitchVariantButton;
