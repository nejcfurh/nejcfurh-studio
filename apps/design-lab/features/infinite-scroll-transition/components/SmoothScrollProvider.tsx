'use client';

import BackButton from '@/components/buttons/BackButton';
import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Scroll-to-top on navigation. The native scroll is reset synchronously in a layout effect (before the browser paints) so the new page never shows a frame at the old scroll position — that stale frame is the "jump to top" / flash. lenis.scrollTo only syncs Lenis' internal position so its rAF doesn't drift.
const ScrollReset = () => {
  const pathname = usePathname();
  const lenis = useLenis();

  useIsomorphicLayoutEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
};

const SmoothScrollProvider = ({
  children
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.05, wheelMultiplier: 0.7, touchMultiplier: 1.5 }}
    >
      <ScrollReset />
      <BackButton className="fixed top-5 left-5 z-50" />
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollProvider;
