import { FiEye, FiEyeOff } from 'react-icons/fi';

const ShowPasswordButton = ({
  viewPassword,
  handleTogglePassword,
}: {
  viewPassword: boolean;
  handleTogglePassword: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      type="button"
      onClick={handleTogglePassword}
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 transition-all duration-300 hover:scale-110 hover:text-blue-500 focus:outline-none dark:text-gray-400 dark:hover:text-blue-400"
      aria-label="Toggle password visibility"
    >
      {viewPassword ? (
        <FiEyeOff className="h-5 w-5" />
      ) : (
        <FiEye className="h-5 w-5" />
      )}
    </button>
  );
};

export default ShowPasswordButton;
