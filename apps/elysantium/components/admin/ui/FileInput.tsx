'use client';

import React from 'react';

type FileInputProps = React.InputHTMLAttributes<HTMLInputElement>;

function FileInput({ className = '', ...props }: FileInputProps) {
  return (
    <input
      type="file"
      className={`file:font-inherit rounded-[var(--border-radius-sm)] text-sm file:mr-3 file:cursor-pointer file:rounded-[var(--border-radius-sm)] file:border-none file:bg-[var(--color-brand-600)] file:px-3 file:py-2 file:font-medium file:text-[var(--color-brand-50)] file:transition-colors file:duration-200 hover:file:bg-[var(--color-brand-700)] ${className}`}
      {...props}
    />
  );
}

export default FileInput;
