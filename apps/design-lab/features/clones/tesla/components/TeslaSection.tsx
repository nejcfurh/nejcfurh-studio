'use client';

import { useEffect, useRef, useState } from 'react';

import ChevronDown from './ChevronDown';

type TeslaSectionProps = {
  id: string;
  title: string;
  subtitle: string | null;
  bg: string;
  buttons: string[];
  showArrow: boolean;
  nextSectionId?: string;
  children?: React.ReactNode;
};

export default function TeslaSection({
  id,
  title,
  subtitle,
  bg,
  buttons,
  showArrow,
  nextSectionId,
  children
}: TeslaSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const scrollToNext = () => {
    if (nextSectionId) {
      document
        .getElementById(nextSectionId)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={sectionRef}
      id={id}
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('${bg}')` }}
    >
      {children}

      {/* Title + subtitle */}
      <div
        className={`absolute top-20 left-1/2 flex w-full max-w-[90vw] -translate-x-1/2 flex-col transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        <h1 className="m-auto mt-8 text-center text-3xl font-bold text-white drop-shadow-lg sm:text-[40px]">
          {title}
        </h1>
        {subtitle && (
          <p className="pt-1 text-center text-sm text-white/80 drop-shadow-md sm:text-[16px] sm:whitespace-nowrap">
            Order online for{' '}
            <span className="cursor-pointer underline underline-offset-4 hover:decoration-2">
              {subtitle}
            </span>
          </p>
        )}
      </div>

      {/* Buttons */}
      <div
        className={`absolute bottom-[80px] left-1/2 flex -translate-x-1/2 flex-col transition-all delay-300 duration-1000 md:flex-row md:space-x-4 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <button className="h-10 w-72 cursor-pointer rounded-full bg-gray-800/90 text-white uppercase backdrop-blur-sm transition-all duration-300 hover:bg-gray-900 md:w-60">
          {buttons[0]}
        </button>
        {buttons[1] && (
          <button className="mt-2 h-10 w-72 cursor-pointer rounded-full bg-white/80 text-gray-900 uppercase backdrop-blur-sm transition-all duration-300 hover:bg-white md:mt-0 md:w-60">
            {buttons[1]}
          </button>
        )}
      </div>

      {/* Chevron */}
      {showArrow && (
        <button
          onClick={scrollToNext}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer transition-opacity duration-300 hover:opacity-70"
          aria-label="Scroll to next section"
        >
          <ChevronDown />
        </button>
      )}
    </div>
  );
}
