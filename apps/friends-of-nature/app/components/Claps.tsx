'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ClapsProps {
  pageId: string;
  className?: string;
  hiddenCounter?: boolean;
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
  hiddenCounter = false
}: ClapsProps): React.ReactNode => {
  const [count, setCount] = useState<number>(0);
  const [isClapping, setIsClapping] = useState<boolean>(false);
  const [tapCount, setTapCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch initial claps count
  useEffect(() => {
    const fetchClaps = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/v1/claps?pageId=${pageId}`);
        const data = await response.json();

        setCount(data.count);
      } catch {
        setCount(0); // Fallback to 0 on error
      }
    };

    fetchClaps();
  }, [pageId]);

  // Handle clap button click
  const handleClap = async (): Promise<void> => {
    if (isClapping) return;

    setIsClapping(true);
    setTapCount((prev) => prev + 1);
    setIsAnimating(true);
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

  // Reset scale animation
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
    <div className={`relative inline-block ${className}`}>
      <div
        className={`relative transition-transform duration-200 ${
          isAnimating ? 'scale-110' : 'scale-100'
        }`}
      >
        {/* Base purple badge */}
        <button
          onClick={handleClap}
          type="button"
          className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
          aria-label="Tap to say hello"
        >
          <Image
            src="/images/tap_hello.png"
            alt=""
            width={120}
            height={120}
            className="h-[120px] w-[120px]"
            priority
          />

          {/* Center content: wave emoji or number */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: tapCount ? currentColor || '#FBB03B' : '#FBB03B' }}
            aria-hidden="true"
          >
            <span className="text-4xl select-none">👋</span>
          </div>
        </button>
        {!hiddenCounter && (
          <div
            className="absolute right-0 -bottom-0 left-0 text-center text-sm text-[#033333]"
            aria-live="polite"
          >
            <span className="font-bold">{count}</span> people said Hi
          </div>
        )}
      </div>
    </div>
  );
};
