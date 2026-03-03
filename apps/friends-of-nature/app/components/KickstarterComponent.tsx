'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const COLORS = [
  '#EF413B',
  '#F6B01A',
  '#F27C21',
  '#3B9858',
  '#6FA8D1',
  '#7660A2'
];

const KickstarterComponent = (): React.ReactNode => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const getRandomColor = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);

    setCurrentColorIndex(randomIndex);
  }, []);

  useEffect(() => {
    getRandomColor(); // Set initial random color

    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % COLORS.length);
    }, 5 * 1000); // Rotate color every 5 seconds

    return (): void => clearInterval(intervalId);
  }, [getRandomColor]);

  const currentColor = COLORS[currentColorIndex];

  return (
    <div
      className="flex items-center justify-center gap-2 py-2"
      style={{ color: currentColor, transition: 'color 1s ease-in-out' }}
    >
      <p className="mt-[1.5px] font-semibold">Launching on </p>
      <Image
        src="/images/kickstarter_icon_header.png"
        alt="Kickstarter icon"
        width={138}
        height={21}
      />
      <p className="mt-[1.5px] font-semibold">| Spring 2025</p>
    </div>
  );
};

export default KickstarterComponent;
