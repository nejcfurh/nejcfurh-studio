import { FaArrowRight } from 'react-icons/fa6';

export const SubmitButton = ({
  variant,
  onClick,
}: {
  variant: 'login' | 'signup';
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="group relative mt-10 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
      
      {/* Content */}
      <span className="relative flex items-center justify-center gap-3">
        <span className="text-lg">{variant === 'login' ? 'Log in' : 'Sign up'}</span>
        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </button>
  );
};

export default SubmitButton;
