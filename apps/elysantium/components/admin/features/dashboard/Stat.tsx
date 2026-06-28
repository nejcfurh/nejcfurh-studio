'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';
import React from 'react';

import { dashboardItem } from './motion';

interface StatProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  /** Optional 0–1 ratio rendered as a thin gold progress bar under the value. */
  progress?: number;
}

function Stat({ icon, title, value, progress }: StatProps): React.ReactElement {
  return (
    <AnimatedDiv
      variants={dashboardItem}
      className="grid grid-cols-[4rem_1fr] grid-rows-[auto_auto] gap-x-4 gap-y-1 rounded-(--border-radius-md) border border-(--color-grey-100) bg-(--color-grey-0) p-4 shadow-(--shadow-card)"
    >
      <div className="row-span-full flex aspect-square items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-brand-500)_15%,transparent)] [&_svg]:h-8 [&_svg]:w-8 [&_svg]:text-(--color-brand-600)">
        {icon}
      </div>
      <h5 className="self-end text-xs font-semibold tracking-wide text-(--color-grey-500) uppercase">
        {title}
      </h5>
      <div className="flex flex-col gap-2">
        <p className="text-2xl leading-none font-medium">{value}</p>
        {progress != null && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--color-grey-100)">
            <div
              className="h-full rounded-full bg-(--color-brand-500) transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
            />
          </div>
        )}
      </div>
    </AnimatedDiv>
  );
}

export default Stat;
