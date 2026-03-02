'use client';

import React, { useState, useEffect } from 'react';
import '../scroll-to-unblur.css';
import { SCROLL_TO_UNBLUR_TEXT } from '@/features/scroll-to-unblur/contants';
import { textIntoWords } from '@/features/scroll-to-unblur/utils';

interface ScrollToUnblurProps {
  containerHeight?: number;
  text?: string;
  pxPerWordMultiplier?: number;
}

export default function ScrollToUnblur({
  containerHeight,
  text = SCROLL_TO_UNBLUR_TEXT,
  pxPerWordMultiplier = 40,
}: ScrollToUnblurProps) {
  const words: string[] = textIntoWords(text);
  const wordCount = words.length;

  const [dimensions, setDimensions] = useState<{
    viewportHeight: number;
    calculatedHeight: number;
  }>(() => {
    if (typeof window === 'undefined') {
      return { viewportHeight: 0, calculatedHeight: 0 };
    }
    const vh = window.innerHeight;
    const height = containerHeight ?? wordCount * pxPerWordMultiplier;
    return { viewportHeight: vh, calculatedHeight: height };
  });

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      const height = containerHeight ?? wordCount * pxPerWordMultiplier;
      setDimensions({ viewportHeight: vh, calculatedHeight: height });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerHeight, wordCount, pxPerWordMultiplier]);

  if (dimensions.calculatedHeight === 0) {
    return null;
  }

  const { viewportHeight, calculatedHeight } = dimensions;
  const totalScrollHeight = calculatedHeight + viewportHeight;
  const pxPerWord = calculatedHeight / wordCount;

  return (
    <main
      className="h-screen pt-10 overflow-y-scroll"
      style={
        {
          scrollTimelineName: '--section',
          '--containerHeight': `${totalScrollHeight}px`,
          '--wordCount': wordCount,
          '--pxPerWord': `${pxPerWord}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative" style={{ height: `${totalScrollHeight}px` }}>
        <p className="sticky top-20 px-8 md:px-20 text-xl md:text-4xl leading-relaxed text-white">
          {words.map((word, index) => (
            <span
              key={index}
              className="word"
              style={{ '--i': index } as React.CSSProperties}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </main>
  );
}
