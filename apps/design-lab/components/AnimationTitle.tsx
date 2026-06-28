import {
  AnimatedDiv,
  AnimatedText,
  AnimatedTitle
} from '@repo/ui/animation/core';
import { cn } from '@repo/ui/utils';
import { ReactNode } from 'react';

export const animationTitleEntrance = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const }
};

const AnimationTitle = ({
  title,
  subtitle,
  className
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}): ReactNode => {
  return (
    <AnimatedDiv
      {...animationTitleEntrance}
      className={cn(
        'pointer-events-none absolute inset-x-0 top-6 z-20 mx-auto max-w-3xl px-20 text-center',
        className
      )}
    >
      <AnimatedTitle className="text-xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl">
        {title}
      </AnimatedTitle>
      {subtitle && (
        <AnimatedText className="mx-auto mt-2 max-w-xl text-xs text-white/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:mt-3 sm:text-base">
          {subtitle}
        </AnimatedText>
      )}
    </AnimatedDiv>
  );
};

export default AnimationTitle;
