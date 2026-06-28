'use client';

import Heading from '@/components/admin/ui/Heading';
import { useDarkMode } from '@/lib/context/DarkModeContext';
import { AnimatedDiv } from '@repo/ui/animation/core';
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
import { dashboardItem } from './motion';

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
        totalSales: { stroke: '#d4a954', fill: '#d4a954' },
        extrasSales: { stroke: '#76808a', fill: '#76808a' },
        text: '#e5e7eb',
        background: '#18212f'
      }
    : {
        totalSales: { stroke: '#a8842f', fill: '#a8842f' },
        extrasSales: { stroke: '#5d6b78', fill: '#5d6b78' },
        text: '#374151',
        background: '#fff'
      };
  return (
    <AnimatedDiv variants={dashboardItem} className="col-span-full">
      <DashboardBox className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-(--color-grey-300) [&_.recharts-cartesian-grid-vertical_line]:stroke-(--color-grey-300)">
        <Heading
          as="h2"
          className="flex items-center gap-3 before:h-5 before:w-1 before:rounded-full before:bg-(--color-brand-500) before:content-['']"
        >
          Sales from {format(allDates.at(0)!, 'MMMMMMMMM dd yyyy')} &mdash;{' '}
          {format(allDates.at(-1)!, 'MMMMMMMMM dd yyyy')}
        </Heading>
        <ResponsiveContainer height={300} width="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="totalSalesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={colors.totalSales.stroke}
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor={colors.totalSales.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id="extrasSalesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={colors.extrasSales.stroke}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={colors.extrasSales.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
              fill="url(#totalSalesGradient)"
              strokeWidth={3}
              name="Total Sales"
              unit="$"
            />
            <Area
              dataKey="extrasSales"
              type="monotone"
              stroke={colors.extrasSales.stroke}
              fill="url(#extrasSalesGradient)"
              strokeWidth={3}
              name="Extras Sales"
              unit="$"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>
    </AnimatedDiv>
  );
}

export default SalesChart;
