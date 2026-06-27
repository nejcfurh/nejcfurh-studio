'use client';

import { useState } from 'react';

import TiltCard from './TiltCard';

interface TiltCardShowcaseProps {
  name: string;
  title: string;
  imageUrl: string;
  logo?: string;
}

export default function TiltCardShowcase({
  name,
  title,
  imageUrl,
  logo
}: TiltCardShowcaseProps) {
  const [electricBorder, setElectricBorder] = useState(false);

  const toggleElectricBorder = () => setElectricBorder((prev) => !prev);

  return (
    <>
      <button
        onClick={toggleElectricBorder}
        aria-pressed={electricBorder}
        className="absolute bottom-10 left-1/2 z-30 min-w-52 -translate-x-1/2 cursor-pointer rounded-full bg-white/50 px-4 py-2 backdrop-blur-3xl transition-all duration-300 hover:scale-[1.02] hover:opacity-80"
      >
        <span className="text-lg font-light text-black">
          {electricBorder ? 'Without' : 'With'} Electric Border
        </span>
      </button>

      <TiltCard
        name={name}
        title={title}
        imageUrl={imageUrl}
        logo={logo}
        electricBorder={electricBorder}
      />
    </>
  );
}
