'use client';

import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`rounded-[var(--border-radius-sm)] border border-[var(--color-grey-300)] bg-[var(--color-grey-0)] px-3 py-2 shadow-[var(--shadow-sm)] ${className}`}
      {...props}
    />
  );
}

export default Input;
