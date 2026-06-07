'use client';

import { SCROLL_TO_UNBLUR_TEXT } from '@/features/scroll-to-unblur/contants';
import { textIntoWords } from '@/features/scroll-to-unblur/utils';
import { useEffect, useRef } from 'react';

interface ScrollToUnblurProps {
  text?: string;
  pxPerWord?: number;
}

const MAX_BLUR = 14;
const MIN_OPACITY = 0.12;

export default function ScrollToUnblur({
  text = SCROLL_TO_UNBLUR_TEXT,
  pxPerWord = 45
}: ScrollToUnblurProps) {
  const words: string[] = textIntoWords(text);
  const scrollRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollTop = el.scrollTop;
      for (let i = 0; i < wordRefs.current.length; i++) {
        const w = wordRefs.current[i];
        if (!w) continue;
        const p = Math.min(
          1,
          Math.max(0, (scrollTop - i * pxPerWord) / pxPerWord)
        );
        w.style.opacity = String(MIN_OPACITY + (1 - MIN_OPACITY) * p);
        w.style.filter = `blur(${((1 - p) * MAX_BLUR).toFixed(2)}px)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [words.length, pxPerWord]);

  const revealDistance = words.length * pxPerWord;

  return (
    <main ref={scrollRef} className="scrollbar-none h-screen overflow-y-scroll">
      <div
        className="relative"
        style={{ height: `calc(${revealDistance}px + 100vh)` }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center px-6 pt-24 pb-12 sm:px-10 md:px-20">
          <p className="max-w-5xl text-justify text-base leading-relaxed text-white sm:text-xl md:text-3xl">
            {words.map((word, index) => (
              <span
                key={index}
                ref={(el) => {
                  wordRefs.current[index] = el;
                }}
                style={{
                  opacity: MIN_OPACITY,
                  filter: `blur(${MAX_BLUR}px)`
                }}
              >
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </main>
  );
}
