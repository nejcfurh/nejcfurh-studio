'use client';

import { cn } from '@/utils/utils';
import { AnimatePresence } from '@repo/ui/animation';
import { useState } from 'react';

import Nav from './Nav';

const Header = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className="fixed top-5 right-5 z-100">
        <div
          onClick={() => setIsActive(!isActive)}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#455CE9] md:size-16"
        >
          <div
            className={cn(
              'relative size-full',
              'before:absolute before:top-1/2 before:left-1/2 before:block before:h-px before:w-[40%] before:-translate-x-1/2 before:bg-white before:transition-transform before:duration-300 before:content-[""]',
              'after:absolute after:top-1/2 after:left-1/2 after:block after:h-px after:w-[40%] after:-translate-x-1/2 after:bg-white after:transition-transform after:duration-300 after:content-[""]',
              isActive
                ? 'before:-translate-y-1/2 before:rotate-45 after:-translate-y-1/2 after:-rotate-45'
                : 'before:-translate-y-[2.5px] after:translate-y-[2.5px] md:before:-translate-y-[5px] md:after:translate-y-[5px]'
            )}
          />
        </div>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </>
  );
};

export default Header;
