'use client';

import { getStaysAfterDate } from '@/lib/services/apiBookings';
import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';

interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  status: string;
  cabinPrice: number;
  extrasPrice: number;
  hasBreakfast: boolean;
  observations: string;
  isPaid: boolean;
}

export function useRecentStays() {
  const searchParams = useSearchParams();

  const numDays = !searchParams.get('last')
    ? 7
    : Number(searchParams.get('last'));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const {
    isPending,
    data: stays,
    error
  } = useQuery<Booking[]>({
    queryFn: () => getStaysAfterDate(queryDate),
    queryKey: ['stays', `last-${numDays}`]
  });

  const confirmedStays = stays?.filter(
    (stay: Booking) =>
      stay.status === 'checked-in' || stay.status === 'checked-out'
  );

  return { isPending, confirmedStays, stays, numDays, error };
}
