'use client';

import { formatCurrency } from '@/lib/utils/helpers';
import { HiOutlineBriefcase, HiOutlineChartBar } from 'react-icons/hi';
import { HiOutlineBanknotes, HiOutlineCalendarDays } from 'react-icons/hi2';

import Stat from './Stat';

interface StayData {
  numNights: number;
  status: string;
}

interface BookingData {
  totalPrice: number;
}

interface StatsProps {
  bookings: BookingData[];
  confirmedStays: StayData[];
  numDays: number;
  cabinCount: number;
}

function Stats({
  bookings,
  confirmedStays,
  numDays,
  cabinCount
}: StatsProps): React.ReactElement {
  //1. Calculate number of bookings
  const numBookings = bookings.length;

  //2. Total sales
  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);

  //3. Total check-ins
  const checkins = confirmedStays.length;

  //4. Occupancy rate (num of checked in nights / all available nights (number of days x number of cabins))
  const occupancy =
    confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) /
    (numDays * cabinCount);

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Stays"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check-ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy Rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupancy * 100) + '%'}
      />
    </>
  );
}

export default Stats;
