import { ComponentType, ReactNode } from 'react';

import { GlassCard } from './primitives';

const TipSection = ({
  title,
  Icon,
  accent,
  children
}: {
  title: string;
  Icon: ComponentType<{ className?: string }>;
  accent: string;
  children: ReactNode;
}) => {
  return (
    <GlassCard className="p-4">
      <div className="mb-2.5 flex items-center gap-2.5">
        <div
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px]"
          style={{
            background: `${accent}22`,
            color: accent
          }}
        >
          <Icon className="text-base" />
        </div>
        <p className="font-display text-[15px] font-bold tracking-[0.02em] text-white">
          {title}
        </p>
      </div>
      <ul className="flex list-none flex-col gap-2 pl-0 text-[13px] leading-[1.55] text-white/75">
        {children}
      </ul>
    </GlassCard>
  );
};

export default TipSection;
