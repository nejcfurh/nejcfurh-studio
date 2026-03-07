'use client';

import { getBookings } from '@/lib/services/apiBookings';
import { PAGE_SIZE } from '@/lib/utils/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

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

interface BookingsResult {
  data: Booking[];
  count: number | null;
}

interface Filter {
  field: string;
  value: string;
  method: string;
}

interface SortBy {
  field: string;
  direction: string;
}

export function useBookings() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // FILTER

  const filterValue = searchParams.get('status');
  const filter: Filter | null =
    !filterValue || filterValue === 'all'
      ? null
      : { field: 'status', value: filterValue, method: 'eq' };

  // SORT

  const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
  const [field, direction] = sortByRaw.split('-');
  const sortBy: SortBy = { field, direction };

  // PAGINATION

  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  // QUERY

  const { isLoading, data, error } = useQuery<BookingsResult>({
    queryKey: ['bookings', filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page })
  });

  const bookings = data?.data;
  const count = data?.count ?? 0;

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);
  // page up
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ['bookings', filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 })
    });

  // page down
  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ['bookings', filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 })
    });

  return { isLoading, bookings, error, count };
}
