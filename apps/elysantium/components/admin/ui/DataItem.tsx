'use client';

import React from 'react';

interface DataItemProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function DataItem({ icon, label, children }: DataItemProps) {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="flex items-center gap-2 font-medium [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-[var(--color-brand-600)]">
        {icon}
        <span>{label}</span>
      </span>
      {children}
    </div>
  );
}

export default DataItem;
