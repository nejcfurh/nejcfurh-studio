'use client';

import {
  type MotionValue,
  motion,
  useScroll,
  useTransform
} from 'framer-motion';
import { useRef } from 'react';


interface AnimatedCharacterProps {
  char: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const AnimatedCharacter = ({
  char,
  index,
  total,
  scrollYProgress
}: AnimatedCharacterProps): React.ReactNode => {
  const start = (index / total) * 0.6; // range for scroll for each character
  const end = start + 1 / total; // equal portion of the range for each character

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 10, 10, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [10, 0, 0, 10]
  );

  return (
    <motion.span
      style={{
        opacity,
        color: '#F0E5B2',
        y,
        display: 'inline-flex', // 🔥 Fixes weird positioning on mobile
        willChange: 'opacity, transform' // Helps prevent rendering glitches
      }}
    >
      {char}
    </motion.span>
  );
};

interface ScrollTextProps {
  text?: string;
}

const ScrollText = ({ text }: ScrollTextProps): React.ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Split text into words first
  const words = text?.split(' ');

  if (!words) return null;

  // Count total characters for animation timing
  const totalCharacters = Array.from(text ?? '').filter((char) =>
    char.trim()
  ).length;
  let characterCount = 0;

  return (
    <div
      ref={containerRef}
      className="flex w-full items-start justify-center md:items-center"
    >
      <div className="rounded-sm px-5 md:w-3/4">
        <div className="relative font-archivo text-2xl md:mt-5 md:text-3xl">
          {words.map((word, wordIndex) => {
            // Split each word into characters
            const characters = Array.from(word);

            return (
              <span
                key={`${word}-${wordIndex}`}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {characters.map((char, charIndex) => {
                  const currentCharIndex = characterCount;

                  characterCount++;

                  return (
                    <AnimatedCharacter
                      key={`${wordIndex}-${charIndex}`}
                      char={char}
                      index={currentCharIndex}
                      total={totalCharacters}
                      scrollYProgress={scrollYProgress}
                    />
                  );
                })}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScrollText;
