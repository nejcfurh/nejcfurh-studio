'use client';

import { getCabins } from '@/lib/services/apiCabins';
import { useQuery } from '@tanstack/react-query';

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

export function useCabins() {
  const {
    isLoading,
    isPending,
    data: cabins,
    error
  } = useQuery<Cabin[]>({
    queryKey: ['cabins'],
    queryFn: getCabins
  });

  return { isLoading, isPending, cabins, error };
}
