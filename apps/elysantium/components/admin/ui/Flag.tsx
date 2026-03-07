'use client';

import React from 'react';

type FlagProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function Flag({ className = '', ...props }: FlagProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`block max-w-[2rem] rounded-[var(--border-radius-tiny)] border border-[var(--color-grey-100)] ${className}`}
      {...props}
    />
  );
}
