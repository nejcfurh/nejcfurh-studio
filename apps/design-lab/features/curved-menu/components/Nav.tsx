'use client';

import { motion } from '@repo/ui/animation';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { NAV_ITEMS } from '../contants';
import Curve from './Curve';
import NavDivider from './NavDivider';
import NavFooter from './NavFooter';
import NavLink from './NavLink';

const EASE = [0.76, 0, 0.24, 1] as const;

const menuSlide = {
  initial: { x: 'calc(100% + 100px)' },
  enter: {
    x: '0',
    transition: { duration: 0.8, ease: EASE }
  },
  exit: {
    x: 'calc(100% + 100px)',
    transition: { duration: 0.8, ease: EASE }
  }
};

const Nav = () => {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const navItemCount = NAV_ITEMS.length;

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed top-0 right-0 z-50 h-screen w-full overflow-visible bg-amber-50 py-10 text-black sm:py-0 md:w-auto"
    >
      <div className="box-border flex h-full flex-col p-6 md:p-10 lg:p-[100px]">
        <div
          onMouseLeave={() => setSelectedIndicator(pathname)}
          className="flex min-h-0 flex-1 flex-col gap-2 md:mt-20"
        >
          <div className="shrink-0 text-[11px] text-black uppercase">
            <p>Navigation</p>
          </div>
          <NavDivider />
          <div
            className="flex min-h-0 flex-1 flex-col justify-evenly pl-6 md:pl-0"
            style={{
              fontSize: `clamp(1rem, calc((100vh - 14rem) / ${navItemCount} * 0.6), 3.5rem)`
            }}
          >
            {NAV_ITEMS.map((data, index) => (
              <NavLink
                key={data.href}
                data={{ ...data, index }}
                isActive={selectedIndicator === data.href}
                setSelectedIndicator={setSelectedIndicator}
              />
            ))}
          </div>
          <NavDivider />
          <NavFooter />
        </div>
      </div>
      <Curve />
    </motion.div>
  );
};

export default Nav;
