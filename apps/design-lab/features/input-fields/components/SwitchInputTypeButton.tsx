const SwitchInputTypeButton = ({
  variant,
  handleSwitchInputType
}: {
  variant: 'login' | 'signup';
  handleSwitchInputType: () => void;
}) => {
  return (
    <button
      className="absolute top-5 right-5 z-10 cursor-pointer rounded-full bg-amber-50 p-3 backdrop-blur-3xl transition-all duration-300 hover:scale-[1.10] hover:opacity-80 sm:p-4"
      onClick={handleSwitchInputType}
    >
      <span className="text-sm font-light text-black sm:text-base">
        {variant === 'login' ? 'Change to Sign Up' : 'Change to Log In'}
      </span>
    </button>
  );
};

export default SwitchInputTypeButton;
