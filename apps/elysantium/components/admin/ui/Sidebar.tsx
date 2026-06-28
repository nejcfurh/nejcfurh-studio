'use client';

import Logo from '@/components/admin/ui/Logo';
import MainNav from '@/components/admin/ui/MainNav';
import Uploader from '@/lib/data/Uploader';
import { useReducedMotion } from '@repo/ui/animation';
import { AnimatedAside } from '@repo/ui/animation/core';
import { useState } from 'react';

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

function Sidebar() {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedAside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={() => setExpanded(false)}
      initial={false}
      animate={{
        width: expanded ? '14.5rem' : '5rem',
        boxShadow: expanded
          ? '8px 0 40px rgba(0,0,0,0.18)'
          : '0px 0 0px rgba(0,0,0,0)'
      }}
      transition={reduce ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT }}
      className="group/sidebar relative z-50 col-start-1 row-span-2 row-start-1 flex flex-col gap-8 overflow-hidden border-r border-(--color-grey-100) bg-(--color-grey-0) px-4 py-8"
    >
      <Logo expanded={expanded} reduce={!!reduce} />
      <MainNav />
      {process.env.NODE_ENV === 'development' && expanded && (
        <Uploader reduce={!!reduce} />
      )}
    </AnimatedAside>
  );
}

export default Sidebar;
