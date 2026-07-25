'use client';

import { QueryProvider } from '@repo/react-query';
import { ReactQueryDevtools } from '@repo/react-query/devtools';
import { MotionConfig } from '@repo/ui/animation';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      {/* Deliberately ignores the OS reduced-motion setting. This is a
          wall-mounted kiosk with no user to shield from motion, and the
          tablet it runs on has animation effects switched off in Windows,
          which would otherwise leave the whole display frozen. */}
      <MotionConfig reducedMotion="never">{children}</MotionConfig>
    </QueryProvider>
  );
}
