'use client';

import { getBooking } from '@/lib/services/apiBookings';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
}

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

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
  guests: Guest;
  cabins: Cabin;
}

export function useBooking() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const {
    isLoading,
    data: booking,
    error
  } = useQuery<Booking>({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(Number(bookingId)),
    retry: false
  });

  return { isLoading, booking, error };
}
