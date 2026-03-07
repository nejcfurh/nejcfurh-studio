'use client';

import { getStaysTodayActivity } from '@/lib/services/apiBookings';
import { useQuery } from '@tanstack/react-query';

interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
  country?: string;
}

interface TodayActivity {
  id: number;
  status: string;
  guests: Guest;
  numNights: number;
}

export function useTodayActivity() {
  const { isPending: isPendingTodayActivity, data: activities } = useQuery<
    TodayActivity[]
  >({
    queryFn: getStaysTodayActivity,
    queryKey: ['today-activity']
  });

  return { isPendingTodayActivity, activities };
}
