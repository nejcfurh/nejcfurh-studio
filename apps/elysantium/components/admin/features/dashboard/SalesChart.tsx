'use client';

import Heading from '@/components/admin/ui/Heading';
import { useDarkMode } from '@/lib/context/DarkModeContext';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import DashboardBox from './DashboardBox';

interface BookingData {
  created_at: string;
  totalPrice: number;
  extrasPrice: number;
}

interface SalesChartProps {
  bookings: BookingData[];
  numDays: number;
}

interface ChartDataPoint {
  label: string;
  totalSales: number;
  extrasSales: number;
}

interface ColorSet {
  stroke: string;
  fill: string;
}

interface ChartColors {
  totalSales: ColorSet;
  extrasSales: ColorSet;
  text: string;
  background: string;
}

function SalesChart({
  bookings,
  numDays
}: SalesChartProps): React.ReactElement {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date()
  });

  const data: ChartDataPoint[] = allDates.map((date) => {
    return {
      label: format(date, 'MM/dd'),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.totalPrice, 0),
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.extrasPrice, 0)
    };
  });

  const colors: ChartColors = isDarkMode
    ? {
        totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
        extrasSales: { stroke: '#22c55e', fill: '#22c55e' },
        text: '#e5e7eb',
        background: '#18212f'
      }
    : {
        totalSales: { stroke: '#4f46e5', fill: '#c7d2fe' },
        extrasSales: { stroke: '#16a34a', fill: '#dcfce7' },
        text: '#374151',
        background: '#fff'
      };
  return (
    <DashboardBox className="col-[1/-1] [&_.recharts-cartesian-grid-horizontal_line]:stroke-[var(--color-grey-300)] [&_.recharts-cartesian-grid-vertical_line]:stroke-[var(--color-grey-300)]">
      <Heading as="h2">
        Sales from {format(allDates.at(0)!, 'MMMMMMMMM dd yyyy')} &mdash;{' '}
        {format(allDates.at(-1)!, 'MMMMMMMMM dd yyyy')}
      </Heading>
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text, dy: 6 }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit=""
            tick={{ fill: colors.text, dx: -6 }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={3}
            name="Total Sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={3}
            name="Extras Sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
}

export default SalesChart;
