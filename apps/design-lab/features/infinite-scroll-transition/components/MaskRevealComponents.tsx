import { AnimatedSpan } from '@repo/ui/animation/core';

import { POWER3_OUT_ANIMATION } from '../constants';

type MaskRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export const MaskRevealH1 = ({
  children,
  className,
  delay = 0
}: MaskRevealProps) => (
  <h1 className={`overflow-hidden ${className ?? ''}`}>
    <AnimatedSpan
      className="block"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: POWER3_OUT_ANIMATION, delay }}
    >
      {children}
    </AnimatedSpan>
  </h1>
);

export const MaskRevealP = ({
  children,
  className,
  delay = 0
}: MaskRevealProps) => (
  <p className={`overflow-hidden ${className ?? ''}`}>
    <AnimatedSpan
      className="block"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: POWER3_OUT_ANIMATION, delay }}
    >
      {children}
    </AnimatedSpan>
  </p>
);

export const MaskRevealSpan = ({
  children,
  className,
  delay = 0
}: MaskRevealProps) => (
  <span className={`block overflow-hidden ${className ?? ''}`}>
    <AnimatedSpan
      className="block"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: POWER3_OUT_ANIMATION, delay }}
    >
      {children}
    </AnimatedSpan>
  </span>
);
