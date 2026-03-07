'use client';

import React from 'react';

interface ButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: 'button' | 'div';
}

function ButtonIcon({
  children,
  as,
  className = '',
  ...props
}: ButtonIconProps) {
  const classes = `bg-transparent border-none p-1.5 rounded-[var(--border-radius-sm)] transition-all duration-200 cursor-pointer hover:bg-[var(--color-grey-100)] [&_svg]:w-[22px] [&_svg]:h-[22px] [&_svg]:text-[var(--color-brand-600)] ${className}`;

  if (as === 'div') {
    return (
      <div
        className={classes}
        onClick={
          props.onClick as unknown as React.MouseEventHandler<HTMLDivElement>
        }
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default ButtonIcon;
