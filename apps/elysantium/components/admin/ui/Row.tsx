'use client';

import React from 'react';

type RowType = 'horizontal' | 'vertical';

interface RowProps {
  type?: RowType;
  children: React.ReactNode;
  className?: string;
}

const typeClasses: Record<RowType, string> = {
  horizontal: 'flex justify-between items-center',
  vertical: 'flex flex-col gap-9'
};

function Row({ type = 'vertical', children, className = '' }: RowProps) {
  return <div className={`${typeClasses[type]} ${className}`}>{children}</div>;
}

export default Row;
