'use client';

import { useRouter } from 'next/navigation';

export function useMoveBack(): () => void {
  const router = useRouter();
  return () => router.back();
}
