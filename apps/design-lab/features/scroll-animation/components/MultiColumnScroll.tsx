'use client';

import { MULTI_COLUMN_SCROLL_IMAGES } from '@/features/scroll-animation/constants';
import { useDimension } from '@/hooks/useDimension';
import { useScroll, useTransform } from '@repo/ui/animation';
import { useRef } from 'react';

import ImageColumn from './ImageColumn';

const MultiColumnScroll = () => {
  const { height } = useDimension();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
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
        className="box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-[#454545] p-[2vw]"
      >
        <ImageColumn
          images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(0, 3)}
          y={y}
        />
        <ImageColumn
          images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(3, 6)}
          y={y2}
        />
        <ImageColumn
          images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(6, 9)}
          y={y3}
        />
        <ImageColumn
          images={[...MULTI_COLUMN_SCROLL_IMAGES].slice(9, 12)}
          y={y4}
        />
      </div>
    </main>
  );
};

export default MultiColumnScroll;
