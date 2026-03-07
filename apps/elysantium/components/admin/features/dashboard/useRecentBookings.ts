'use client';

import { getBookingsAfterDate } from '@/lib/services/apiBookings';
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

export function useRecentBookings() {
  const searchParams = useSearchParams();

  const numDays = !searchParams.get('last')
    ? 7
    : Number(searchParams.get('last'));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const {
    isPending,
    data: bookings,
    error
  } = useQuery<Booking[]>({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ['bookings', `last-${numDays}`]
  });

  return { isPending, bookings, error };
}
