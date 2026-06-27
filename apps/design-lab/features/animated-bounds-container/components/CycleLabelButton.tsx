'use client';

import {
  AnimatePresence,
  MotionConfig,
  type MotionProps
} from '@repo/ui/animation';
import { AnimatedSpan } from '@repo/ui/animation/core';
import { useState } from 'react';

import AnimatedContainer from './AnimatedContainer';

const labelAnimation: MotionProps = {
  initial: { opacity: 0, filter: 'blur(8px)', scale: 0.95 },
  animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  exit: { opacity: 0, filter: 'blur(8px)', scale: 0.95 },
  transition: {
    duration: 0.4,
    ease: [0.19, 1, 0.22, 1],
    delay: 0.05,
    opacity: {
      duration: 0.6,
      ease: 'easeInOut'
    }
  }
};

const labels = [
  'Lorem Ipsum',
  'Ex Amet',
  'Aliqua Velit',
  'Consectetur Adipiscing Elit'
];

const CycleLabelButton = () => {
  const [index, setIndex] = useState(0);

  const handleClick = () => {
    setIndex((prev) => (prev + 1) % labels.length);
  };

  return (
    <MotionConfig
      transition={{
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1],
        delay: 0.05
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        className="flex cursor-pointer items-center justify-center rounded-full bg-white font-light text-black shadow-md transition-transform outline-none active:scale-[0.98]"
      >
        <AnimatedContainer
          className="overflow-hidden"
          contentClassName="flex w-max items-center justify-center whitespace-nowrap"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <AnimatedSpan
              {...labelAnimation}
              key={labels[index]}
              className="px-4 py-2 text-sm font-medium whitespace-nowrap"
            >
              {labels[index]}
            </AnimatedSpan>
          </AnimatePresence>
        </AnimatedContainer>
      </button>
    </MotionConfig>
  );
};

export default CycleLabelButton;
