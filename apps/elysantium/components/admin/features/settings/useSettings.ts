'use client';

import { getSettings } from '@/lib/services/apiSettings';
import { useQuery } from '@tanstack/react-query';

interface Settings {
  id: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  maxNumberGuestsPerBooking: number;
  breakfastPrice: number;
}

export function useSettings() {
  const {
    isPending,
    error,
    data: settings
  } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  return { isPending, error, settings };
}
