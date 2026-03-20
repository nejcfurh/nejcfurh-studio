const SwitchInputTypeButton = ({
  variant,
  handleSwitchInputType
}: {
  variant: 'login' | 'signup';
  handleSwitchInputType: () => void;
}) => {
  return (
    <button
      className="absolute top-5 z-10 cursor-pointer rounded-full bg-amber-50 p-4 backdrop-blur-3xl transition-all duration-300 hover:scale-[1.10] hover:opacity-80"
      onClick={handleSwitchInputType}
    >
      <span className="text-base font-light text-black">
        {variant === 'login' ? 'Change to Sign Up' : 'Change to Log In'}
      </span>
    </button>
  );
};

export default SwitchInputTypeButton;
