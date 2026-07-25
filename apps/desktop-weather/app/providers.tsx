'use client';

import { QueryProvider } from '@repo/react-query';
import { ReactQueryDevtools } from '@repo/react-query/devtools';
import { MotionConfig } from '@repo/ui/animation';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      {/* Motion honours the OS setting; the SMIL in the icons is paused
          separately by WeatherIcon, which MotionConfig cannot reach. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QueryProvider>
  );
}
