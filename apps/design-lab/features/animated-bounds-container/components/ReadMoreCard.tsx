'use client';

import { AnimatePresence, MotionConfig } from '@repo/ui/animation';
import { AnimatedText } from '@repo/ui/animation/core';
import { useState } from 'react';

import AnimatedContainer from './AnimatedContainer';

const ReadMoreCard = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <MotionConfig
      transition={{
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1],
        delay: 0.05
      }}
    >
      <div className="flex w-full max-w-[400px] flex-col gap-3 rounded-3xl border border-white bg-gray-950 p-5">
        <AnimatedContainer className="overflow-hidden contain-[layout]">
          <div className="flex flex-col gap-3">
            <p className="m-0 text-sm leading-relaxed text-white">
              Containers on the web snap to their new size instantly when
              content changes. By measuring the bounds of a container and
              animating to those values, we can make these transitions feel
              smooth and intentional.
            </p>
            <AnimatePresence mode="popLayout">
              {expanded && (
                <AnimatedText
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  className="m-0 text-sm leading-relaxed text-white"
                >
                  This technique uses a ref to track the height of the inner
                  content. When the content changes, the measured height updates
                  and Motion animates the outer container to match. The inner
                  div always has its natural height, so the content is never
                  clipped or distorted.
                </AnimatedText>
              )}
            </AnimatePresence>
          </div>
        </AnimatedContainer>
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-600 active:scale-[0.98]"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      </div>
    </MotionConfig>
  );
};

export default ReadMoreCard;
