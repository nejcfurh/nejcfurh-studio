'use client';

import React from 'react';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariation = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $size?: ButtonSize;
  $variation?: ButtonVariation;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  small: 'text-xs px-2 py-1 uppercase font-semibold text-center',
  medium: 'text-sm px-4 py-3 font-medium',
  large: 'text-base px-6 py-3 font-medium'
};

const variationClasses: Record<ButtonVariation, string> = {
  primary:
    'text-[var(--color-brand-50)] bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)]',
  secondary:
    'text-[var(--color-grey-600)] bg-[var(--color-grey-0)] border border-[var(--color-grey-200)] hover:bg-[var(--color-grey-50)]',
  danger:
    'text-[var(--color-red-100)] bg-[var(--color-red-700)] hover:bg-[var(--color-red-800)]'
};

function Button({
  $size = 'medium',
  $variation = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-[var(--border-radius-sm)] border-none shadow-[var(--shadow-sm)] ${sizeClasses[$size]} ${variationClasses[$variation]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
