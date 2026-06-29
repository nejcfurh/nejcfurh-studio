'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';
import Link from 'next/link';
import { JSX } from 'react';

const EASE = [0.76, 0, 0.24, 1] as const;

const slide = {
  initial: { x: 80 },
  enter: (i: number) => ({
    x: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.05 * i }
  }),
  exit: (i: number) => ({
    x: 80,
    transition: { duration: 0.8, ease: EASE, delay: 0.05 * i }
  })
};

interface MobileNavLinkProps {
  data: {
    title: string;
    href: string;
    index: number;
    /** ACCENT RENDERS THE ITEM AS A PILL CTA — FOR ACTIONS LIKE LOGIN/WRITE. */
    variant?: 'default' | 'accent';
  };
  onNavigate: () => void;
}

const MobileNavLink = ({
  data,
  onNavigate
}: MobileNavLinkProps): JSX.Element => {
  const { title, href, index, variant = 'default' } = data;
  const isAccent = variant === 'accent';

  return (
    <AnimatedDiv
      className="relative flex shrink-0 items-center leading-none"
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <Link
        href={href}
        onClick={onNavigate}
        className={
          isAccent
            ? // RESET THE INHERITED DISPLAY-SIZE FONT SO IT READS AS A BUTTON,
              // NOT A HEADING.
              'bg-accent! inline-flex items-center rounded-full px-8 py-3 text-2xl font-medium text-white no-underline transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_25px_var(--accent-glow)]'
            : 'text-white-100 font-light no-underline'
        }
      >
        {title}
      </Link>
    </AnimatedDiv>
  );
};

export default MobileNavLink;
