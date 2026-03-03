'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { cn } from 'lib/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ReactElement, RefObject } from 'react';

interface InteractiveSectionProps {
  titles: string[];
  descriptions: string[];
  images: string[];
  classNameTitle?: string;
  colors: string[][];
  className?: string;
  firstImageClassName?: string;
  secondImageClassName?: string;
  thirdImageClassName?: string;
}

const InteractiveSection = ({
  titles,
  descriptions,
  images,
  classNameTitle = '',
  colors,
  className,
  firstImageClassName,
  secondImageClassName,
  thirdImageClassName
}: InteractiveSectionProps): ReactElement<any, any> => {
  const firstImageRef = useRef<HTMLDivElement>(null);
  const secondImageRef = useRef<HTMLDivElement>(null);
  const thirdImageRef = useRef<HTMLDivElement>(null);

  const [interactionCount, setInteractionCount] = useState(0);

  const isFirstImageInView = useInView(firstImageRef, {
    amount: 0.5
  });

  const isSecondImageInView = useInView(secondImageRef, {
    amount: 0.5
  });

  const isThirdImageInView = useInView(thirdImageRef, {
    amount: 0.5
  });

  const getCorrectRefObject = (
    index: number
  ): RefObject<HTMLDivElement | null> => {
    if (index === 0) {
      return firstImageRef;
    }

    if (index === 1) {
      return secondImageRef;
    }

    return thirdImageRef;
  };

  useEffect(() => {
    if (isThirdImageInView) {
      setInteractionCount(2);
    } else if (isSecondImageInView) {
      setInteractionCount(1);
    } else if (isFirstImageInView) {
      setInteractionCount(0);
    }
  }, [isFirstImageInView, isSecondImageInView, isThirdImageInView]);

  return (
    <div className={cn('block w-screen bg-[#F4E28E]', className)}>
      <div className="flex h-full w-full">
        <div className="relative w-1/2">
          {images.map((image, index) => (
            <div
              key={image}
              className="h-[100dvh] w-full overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(${colors[index][0]}, ${colors[index][1]})`
              }}
              ref={getCorrectRefObject(index)}
            >
              <Image
                className={cn('h-full w-full object-cover object-center', [
                  index === 0 && firstImageClassName,
                  index === 1 && secondImageClassName,
                  index === 2 && thirdImageClassName
                ])}
                src={image}
                alt={`Interactive image ${index}`}
                sizes="100%"
                width={0}
                height={0}
              />
            </div>
          ))}
        </div>
        <div className="sticky top-0 flex h-[100dvh] w-1/2 flex-col items-center justify-center gap-10 overflow-auto px-10">
          <AnimatePresence mode="wait">
            <motion.h2
              key={interactionCount}
              className={`max-w-[612px] text-6xl text-[#003333] ${classNameTitle}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {titles[interactionCount]}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={interactionCount}
              className="max-w-[612px] text-4xl text-[#003333]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {descriptions[interactionCount]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSection;
