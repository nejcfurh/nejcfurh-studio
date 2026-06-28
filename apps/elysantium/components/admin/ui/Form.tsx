'use client';

import React from 'react';

type FormType = 'regular' | 'modal';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  type?: FormType;
  children: React.ReactNode;
}

const typeClasses: Record<FormType, string> = {
  regular: 'py-4 px-4 bg-[var(--color-grey-0)] rounded-lg',
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
