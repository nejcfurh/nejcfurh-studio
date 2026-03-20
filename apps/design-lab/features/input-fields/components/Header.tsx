const Header = ({ inputType }: { inputType: 'login' | 'signup' }) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {inputType === 'login' ? 'Welcome Back' : 'Create an Account'}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {inputType === 'login'
          ? 'Enter your credentials to continue'
          : 'Enter your details to create an account'}
      </p>
    </div>
  );
};

export default Header;
