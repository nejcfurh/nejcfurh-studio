'use client';

import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`h-20 w-full rounded-[5px] border border-[var(--color-grey-300)] bg-[var(--color-grey-0)] px-3 py-2 shadow-[var(--shadow-sm)] ${className}`}
      {...props}
    />
  );
}

export default Textarea;
