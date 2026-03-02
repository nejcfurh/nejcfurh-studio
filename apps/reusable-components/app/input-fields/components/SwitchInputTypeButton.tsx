const SwitchInputTypeButton = ({
  variant,
  handleSwitchInputType,
}: {
  variant: 'login' | 'signup';
  handleSwitchInputType: () => void;
}) => {
  return (
    <button
      className="absolute top-5 bg-amber-50 z-10 p-4 rounded-full backdrop-blur-3xl hover:opacity-80 hover:scale-[1.10] transition-all duration-300 cursor-pointer"
      onClick={handleSwitchInputType}
    >
      <span className="text-black text-base font-light">
        {variant === 'login' ? 'Change to Sign Up' : 'Change to Log In'}
      </span>
    </button>
  );
};

export default SwitchInputTypeButton;
