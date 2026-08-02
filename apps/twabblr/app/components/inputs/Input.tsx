'use client';

import { cn } from '@repo/ui/utils';
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister
} from 'react-hook-form';

interface InputProps<TValues extends FieldValues> {
  label: string;
  /** Must name a field on the form, so a typo fails to compile. */
  id: Path<TValues>;
  type?: string;
  required?: boolean;
  register: UseFormRegister<TValues>;
  errors: FieldErrors<TValues>;
  disabled?: boolean;
}

const Input = <TValues extends FieldValues>({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled
}: InputProps<TValues>) => {
  // Every form using this component is flat, so a field path is a top-level key.
  const error = errors[id as keyof FieldErrors<TValues>] as
    | FieldError
    | undefined;
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="font-md block text-sm leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...register(id, { required })}
          className={cn(
            `block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-inset sm:text-sm sm:leading-6`,
            error && 'focus:ring-rose-500',
            disabled && 'cursor-default opacity-50'
          )}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-rose-500">
            {error.message ?? 'This field is required'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
