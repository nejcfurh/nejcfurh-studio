'use client';

import React from 'react';

type FormType = 'regular' | 'modal';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  type?: FormType;
  children: React.ReactNode;
}

const typeClasses: Record<FormType, string> = {
  regular:
    'py-6 px-10 bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)]',
  modal: 'w-[80rem]'
};

function Form({
  type = 'regular',
  children,
  className = '',
  ...props
}: FormProps) {
  return (
    <form
      className={`overflow-hidden text-sm ${typeClasses[type]} ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

export default Form;
