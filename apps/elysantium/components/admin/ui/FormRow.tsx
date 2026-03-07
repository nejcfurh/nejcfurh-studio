'use client';

import React from 'react';

interface FormRowProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

function FormRow({ label, error, children }: FormRowProps) {
  const childId = React.isValidElement<{ id?: string }>(children)
    ? children.props.id
    : undefined;

  return (
    <div className="grid grid-cols-[24rem_1fr_1.2fr] items-center gap-6 py-3 first:pt-0 last:pb-0 has-[button]:flex has-[button]:justify-end has-[button]:gap-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[var(--color-grey-100)]">
      {label && (
        <label htmlFor={childId} className="font-medium">
          {label}
        </label>
      )}
      {children}
      {error && (
        <span className="text-sm text-[var(--color-red-700)]">{error}</span>
      )}
    </div>
  );
}

export default FormRow;
