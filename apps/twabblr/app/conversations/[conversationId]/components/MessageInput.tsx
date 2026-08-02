'use client';

import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface MessageInputProps<TValues extends FieldValues> {
  placeholder?: string;
  /** Must name a field on the form, so a typo fails to compile. */
  id: Path<TValues>;
  type?: string;
  required?: boolean;
  register: UseFormRegister<TValues>;
}

const MessageInput = <TValues extends FieldValues>({
  placeholder,
  id,
  type,
  required,
  register
}: MessageInputProps<TValues>) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        aria-label={placeholder}
        {...register(id, { required })}
        placeholder={placeholder}
        className="w-full rounded-full bg-neutral-100 px-4 py-2 font-light text-black focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
