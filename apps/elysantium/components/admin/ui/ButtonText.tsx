'use client';

import React from 'react';

interface ButtonTextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function ButtonText({ children, className = '', ...props }: ButtonTextProps) {
  return (
    <button
      className={`rounded-[var(--border-radius-sm)] border-none bg-transparent text-center font-medium text-[var(--color-brand-600)] transition-all duration-300 hover:text-[var(--color-brand-700)] active:text-[var(--color-brand-700)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default ButtonText;
