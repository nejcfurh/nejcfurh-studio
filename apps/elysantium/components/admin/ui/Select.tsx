'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'onChange'
> {
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  type?: string;
}

function Select({
  options,
  value,
  onChange,
  type,
  className = '',
  ...props
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`rounded-[var(--border-radius-sm)] border bg-[var(--color-grey-0)] px-3 py-2 text-sm font-medium shadow-[var(--shadow-sm)] ${
        type === 'white'
          ? 'border-[var(--color-grey-100)]'
          : 'border-[var(--color-grey-300)]'
      } ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
