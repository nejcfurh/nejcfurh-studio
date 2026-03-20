'use client';

import { QueryProvider } from '@repo/react-query';
import { ReactQueryDevtools } from '@repo/react-query/devtools';

interface QueryContextProps {
  children: React.ReactNode;
}

export default function QueryContext({ children }: QueryContextProps) {
  return (
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryProvider>
  );
}
