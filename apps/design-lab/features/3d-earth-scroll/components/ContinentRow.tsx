'use client';

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform
} from '@repo/ui/animation';
import { useRef, useState } from 'react';

import type { Continent } from '../constants';

type ContinentRowProps = {
  continent: Continent;
};

const ContinentRow = ({ continent }: ContinentRowProps) => {
  const { title, description, speed } = continent;
  const container = useRef(null);
  const [active, setActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', `${25 / speed}vw end`]
  });

  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;

  return (
    <div
      ref={container}
      onMouseOver={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="relative flex cursor-default items-center border-b border-[#b7ab98]/25"
    >
      {/* Base title: the dark ghost defines the row height, the coloured copy is
          stacked exactly on top (same grid cell) and revealed left-to-right as
          the row scrolls into view. */}
      <div className="grid pl-[10%]">
        <p className="col-start-1 row-start-1 m-0 text-[8vw] leading-[7.5vw] font-bold text-[#1c1c1c] uppercase">
          {title}
        </p>
        <motion.p
          style={{ clipPath: clip }}
          className="col-start-1 row-start-1 m-0 text-[8vw] leading-[7.5vw] font-bold text-[#b7ab98] uppercase"
        >
          {title}
        </motion.p>
      </div>

      {/* Orange description overlay — pinned to this exact row (inset-0), so it
          can never drift out of alignment. Clipped shut until hover/tap. */}
      <div
        style={{ clipPath: active ? 'inset(0 0 0)' : 'inset(50% 0 50%)' }}
        className="pointer-events-none absolute inset-0 flex items-center justify-between bg-[#ec4e39] px-[10%] transition-[clip-path] duration-400"
      >
        <p className="m-0 text-[8vw] leading-[7.5vw] font-bold text-[#010101] uppercase">
          {title}
        </p>
        <p className="hidden w-1/3 text-[1vw] font-normal sm:block">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ContinentRow;
