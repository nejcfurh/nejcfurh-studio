'use client';

import React from 'react';

interface StatProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

function Stat({ icon, title, value, color }: StatProps): React.ReactElement {
  return (
    <div className="grid grid-cols-[4rem_1fr] grid-rows-[auto_auto] gap-x-4 gap-y-1 rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)] p-4">
      <div
        className={`row-[1/-1] flex aspect-square items-center justify-center rounded-full bg-[var(--color-${color}-100)] [&_svg]:h-8 [&_svg]:w-8 [&_svg]:text-[var(--color-${color}-700)]`}
      >
        {icon}
      </div>
      <h5 className="self-end text-xs font-semibold tracking-wide text-[var(--color-grey-500)] uppercase">
        {title}
      </h5>
      <p className="text-2xl leading-none font-medium">{value}</p>
    </div>
  );
}

export default Stat;
