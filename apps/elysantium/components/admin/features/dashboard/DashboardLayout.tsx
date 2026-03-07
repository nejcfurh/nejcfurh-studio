'use client';

import { useCabins } from '@/components/admin/features/cabins/useCabins';
import TodayActivity from '@/components/admin/features/check-in-out/TodayActivity';
import Spinner from '@/components/admin/ui/Spinner';

import DurationChart from './DurationChart';
import SalesChart from './SalesChart';
import Stats from './Stats';
import { useRecentBookings } from './useRecentBookings';
import { useRecentStays } from './useRecentStays';

function DashboardLayout(): React.ReactElement | null {
  const { bookings, isPending } = useRecentBookings();
  const {
    confirmedStays,
    isPending: isPendingStays,
    numDays
  } = useRecentStays();
  const { cabins, isPending: isPendingCabins } = useCabins();

  if (isPending || isPendingStays || isPendingCabins) return <Spinner />;

  return (
    <div className="grid grid-cols-4 grid-rows-[auto_34rem_auto] gap-6">
      <Stats
        bookings={bookings!}
        confirmedStays={confirmedStays!}
        numDays={numDays}
        cabinCount={cabins?.length ?? 0}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays!} />
      <SalesChart bookings={bookings!} numDays={numDays} />
    </div>
  );
}

export default DashboardLayout;
