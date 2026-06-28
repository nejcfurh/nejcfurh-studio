'use client';

import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`min-h-12 rounded-lg border border-(--color-grey-300) bg-(--color-grey-0) px-3 py-2 ${className}`}
      {...props}
    />
  );
}

export default Input;
