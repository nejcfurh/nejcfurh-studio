'use client';

import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ClapsProps {
  pageId: string;
  className?: string;
  hiddenCounter?: boolean;
  confettiOrigin?: { x: number; y: number };
}

const WONDER_COLORS = [
  '#F15B50', // red
  '#FBB03B', // yellow
  '#F7931E', // orange
  '#39B54A', // green
  '#69C8EC' // blue
] as const;

export const Claps = ({
  pageId,
  className = '',
  hiddenCounter = false,
  confettiOrigin = { y: 0.85, x: 0.8 }
}: ClapsProps): React.ReactNode => {
  const [count, setCount] = useState<number>(0);
  const [isClapping, setIsClapping] = useState<boolean>(false);
  const [tapCount, setTapCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchClaps = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/v1/claps?pageId=${pageId}`);
        const data = await response.json();

        setCount(data.count);
      } catch {
        setCount(0);
      }
    };

    fetchClaps();
  }, [pageId]);

  const handleClap = async (): Promise<void> => {
    if (isClapping) return;

    setIsClapping(true);
    setTapCount((prev) => prev + 1);
    setIsAnimating(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: confettiOrigin
    });

    try {
      const response = await fetch('/api/v1/claps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pageId })
      });
      const data = await response.json();

      setCount(data.count);
    } catch {
      // Keep the previous count on error
    } finally {
      setIsClapping(false);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 200);

      return (): void => clearTimeout(timer);
    }
  }, [isAnimating]);

  const currentColor = tapCount
    ? WONDER_COLORS[(tapCount - 1) % WONDER_COLORS.length]
    : null;

  return (
    <div
      className={`${className} ${
        tapCount === 0 && !hiddenCounter ? 'animate-bounce' : ''
      }`}
    >
      <div
        className={`relative transition-transform duration-200 ${
          isAnimating ? 'scale-110' : 'scale-100'
        }`}
      >
        <button
          onClick={handleClap}
          type="button"
          className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
          aria-label="Tap to say hello"
        >
          <Image
            src="/images/tap_hello.png"
            alt=""
            width={100}
            height={100}
            priority
          />

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: tapCount ? currentColor || '#FBB03B' : '#FBB03B' }}
            aria-hidden="true"
          >
            <span className="select-none text-3xl">👋</span>
          </div>
        </button>
        {!hiddenCounter && (
          <div
            className="absolute -bottom-3 left-0 right-0 text-center text-xs text-[#033333]"
            aria-live="polite"
          >
            <span className="font-bold">{count}</span> people <br /> said Hi
          </div>
        )}
      </div>
    </div>
  );
};
