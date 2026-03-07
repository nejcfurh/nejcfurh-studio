'use client';

import React from 'react';

interface TagProps {
  type: string;
  children: React.ReactNode;
  className?: string;
}

function Tag({ type, children, className = '' }: TagProps) {
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${className}`}
      style={{
        color: `var(--color-${type}-700)`,
        backgroundColor: `var(--color-${type}-100)`
      }}
    >
      {children}
    </span>
  );
}

export default Tag;
