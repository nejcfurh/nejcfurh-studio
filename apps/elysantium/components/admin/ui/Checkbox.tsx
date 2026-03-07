'use client';

import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id: string;
  children: React.ReactNode;
}

function Checkbox({
  checked,
  onChange,
  disabled = false,
  id,
  children
}: CheckboxProps) {
  return (
    <div className="flex gap-4">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-6 w-6 origin-left accent-[var(--color-brand-600)] outline-offset-2"
      />
      <label
        htmlFor={!disabled ? id : ''}
        className="flex flex-1 items-center gap-2"
      >
        {children}
      </label>
    </div>
  );
}

export default Checkbox;
