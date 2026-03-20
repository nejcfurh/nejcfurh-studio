'use client';

import { QueryProvider } from '@repo/react-query';
import { ReactQueryDevtools } from '@repo/react-query/devtools';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryProvider>
  );
}
