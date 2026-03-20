'use client';

import type { FC, PropsWithChildren } from 'react';

import { useIsMounted } from '../hooks/client';

export const ClientOnly: FC<PropsWithChildren> = ({ children }) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return children;
};
