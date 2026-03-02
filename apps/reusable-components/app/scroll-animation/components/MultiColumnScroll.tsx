'use client';

import { MULTI_COLUMN_SCROLL_IMAGES } from '@/features/scroll-animation/constants';
import Column from './Column';
import { useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import { useDimension } from '@/hooks/useDimension';

const MultiColumnScroll = () => {
  const { height } = useDimension();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 2.9]);

  return (
    <main className="bg-white pt-[25vh]">
      {/* GALLERY */}
      <div
        ref={ref}
        className="h-[175vh] bg-[#454545] flex gap-[2vw] p-[2vw] box-border overflow-hidden"
      >
        <Column images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(0, 3)} y={y} />
        <Column images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(3, 6)} y={y2} />
        <Column images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(6, 9)} y={y3} />
        <Column images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(9, 12)} y={y4} />
      </div>
    </main>
  );
};

export default MultiColumnScroll;
