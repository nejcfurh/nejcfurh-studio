'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';
import Link from 'next/link';

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

const scale = {
  open: { scale: 1, transition: { duration: 0.3 } },
  closed: { scale: 0, transition: { duration: 0.4 } }
};

interface NavLinkProps {
  data: {
    title: string;
    href: string;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
}

const NavLink = ({ data, isActive, setSelectedIndicator }: NavLinkProps) => {
  const { title, href, index } = data;

  return (
    <AnimatedDiv
      className="relative flex shrink-0 items-center leading-none"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <AnimatedDiv
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
        className="absolute -left-[1.5em] size-[0.2em] min-h-2 min-w-2 rounded-full bg-black"
      />
      <Link href={href} className="font-light text-black no-underline">
        {title}
      </Link>
    </AnimatedDiv>
  );
};

export default NavLink;
