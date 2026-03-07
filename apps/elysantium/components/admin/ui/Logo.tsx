'use client';

import { useDarkMode } from '@/lib/context/DarkModeContext';
import Image from 'next/image';

function Logo() {
  const { isDarkMode } = useDarkMode();
  const src = isDarkMode ? '/logo-dark.png' : '/logo-light.png';

  return (
    <div className="text-center">
      <Image
        src={src}
        alt="Logo"
        className="hidden h-24 w-auto"
        width={100}
        height={100}
      />
      <div className="text-4xl font-extralight tracking-wider">Elysantium</div>
    </div>
  );
}

export default Logo;
