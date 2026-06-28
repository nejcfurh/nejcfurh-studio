'use client';

import React from 'react';

interface DashboardBoxProps {
  className?: string;
  children?: React.ReactNode;
}

function DashboardBox({
  className = '',
  children
}: DashboardBoxProps): React.ReactElement {
  return React.createElement(
    'div',
    {
      className:
        `bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] shadow-[var(--shadow-card)] p-8 flex flex-col gap-6 ${className}`.trim()
    },
    children
  );
}

export default DashboardBox;
