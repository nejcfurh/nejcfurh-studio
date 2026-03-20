'use client';

import type { EffectCallback } from 'react';
import { useEffect, useRef, useState } from 'react';

export const useMount = (callback: EffectCallback): void => {
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;

      return callback();
    }
  }, []);
};

// Copied from https://usehooks-ts.com/react-hook/use-is-mounted
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useMount(() => {
    setIsMounted(true);
  });

  return isMounted;
}
