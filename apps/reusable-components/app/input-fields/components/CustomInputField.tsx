import { cn } from '@/utils/utils';
import InputContainer from './InputContainer';

const CustomInputField = ({
  children,
  id,
  type,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  required = false,
  label,
  labelClassName,
  className,
}: {
  children?: React.ReactNode;
  id: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  required: boolean;
  className?: string;
  labelClassName?: string;
  label: string;
}) => {
  return (
    <InputContainer>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={cn(
          'peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-4 text-base text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 dark:border-gray-700 dark:text-gray-100 dark:focus:border-blue-400',
          className
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-2 top-4 bg-white px-2 py-1 text-base text-gray-500 transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-blue-500 dark:bg-gray-900 dark:text-gray-400 dark:peer-focus:text-blue-400 dark:peer-[:not(:placeholder-shown)]:text-blue-400',
          labelClassName
        )}
      >
        {label}
      </label>
      {children}
    </InputContainer>
  );
};

export default CustomInputField;
