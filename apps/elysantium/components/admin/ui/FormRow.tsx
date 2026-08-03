'use client';

import React from 'react';

interface FormRowProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

type ControlProps = {
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

function FormRow({ label, error, children }: FormRowProps) {
  const control = React.isValidElement<ControlProps>(children)
    ? children
    : undefined;
  const childId = control?.props.id;
  const errorId = childId ? `${childId}-error` : undefined;

  // Cloning the control here means every admin form row gets the invalid state
  // and the error association without each one wiring it by hand.
  const describedControl =
    control && error
      ? React.cloneElement(control, {
          'aria-invalid': true,
          'aria-describedby': errorId
        })
      : children;

  return (
    <div className="grid grid-cols-[24rem_1fr_1.2fr] items-center gap-6 py-3 not-last:border-b not-last:border-(--color-grey-100) first:pt-0 last:pb-0 has-[button]:flex has-[button]:justify-end has-[button]:gap-3">
      {label && (
        <label htmlFor={childId} className="font-medium">
          {label}
        </label>
      )}
      {describedControl}
      {error && (
        <span id={errorId} role="alert" className="text-sm text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormRow;
