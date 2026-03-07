'use client';

import React from 'react';

interface FormRowVerticalProps {
  label?: string;
  error?: string;
  children: React.ReactElement<{ id?: string }>;
}

function FormRowVertical({ label, error, children }: FormRowVerticalProps) {
  return (
    <div className="flex flex-col gap-2 py-3">
      {label && (
        <label htmlFor={children.props.id} className="font-medium">
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

export default FormRowVertical;
