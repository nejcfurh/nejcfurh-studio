'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';
import { cn } from '@repo/ui/utils';
import Image from 'next/image';

import { InfiniteScrollTransitionData } from '../types';

const POWER3_OUT_ANIMATION = [0.22, 1, 0.36, 1] as const;

type ExperimentsProps = {
  project: InfiniteScrollTransitionData;
};

const StatusBadge = ({ date }: { date: string }) => {
  const isLive = date.toLowerCase() === 'live';

  return (
    <span className="flex shrink-0 items-center gap-2 text-xs font-medium tracking-wider uppercase">
      <span className="relative flex size-1.5">
        {isLive && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex size-1.5 rounded-full',
            isLive ? 'bg-emerald-400' : 'bg-zinc-600'
          )}
        />
      </span>
      <span className={isLive ? 'text-emerald-400' : 'text-zinc-500'}>
        {date}
      </span>
    </span>
  );
};

const Experiments = ({ project }: ExperimentsProps) => {
  if (!project.details) return null;

  const { sectionImage, items } = project.details;

  return (
    <section className="relative flex min-h-screen flex-col justify-between px-7.5 py-25 lg:flex-row">
      <div className="mb-7.5 h-full lg:sticky lg:top-[120px] lg:mb-0">
        <div className="relative aspect-video h-[30svh] w-full lg:h-[50svh]">
          <Image
            src={sectionImage}
            alt={project.title}
            fill
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 40vw"
            priority
            className="rounded-3xl object-cover opacity-70"
          />
        </div>
      </div>

      <div className="w-full lg:w-5xl">
        {items.map((item, index) => (
          <AnimatedDiv
            key={item.label}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, ease: POWER3_OUT_ANIMATION }}
            className="group flex w-full items-center justify-between gap-4 border-b border-zinc-800 py-4 transition-colors duration-300 hover:border-zinc-600"
          >
            <div className="flex items-baseline gap-4 sm:gap-6">
              <span className="text-xs font-medium text-zinc-600 tabular-nums transition-colors duration-300 group-hover:text-zinc-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-lg font-medium text-zinc-100 transition-colors duration-300 group-hover:text-zinc-400 sm:text-xl">
                {item.label}
              </span>
            </div>
            <StatusBadge date={item.date} />
          </AnimatedDiv>
        ))}
      </div>
    </section>
  );
};

export default Experiments;
