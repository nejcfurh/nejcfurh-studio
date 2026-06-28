'use client';

import React from 'react';

type FlagProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function Flag({ className = '', ...props }: FlagProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      className={`block h-5 w-7 rounded-(--border-radius-tiny) border border-(--color-grey-100) object-cover ${className}`}
      {...props}
    />
  );
}
