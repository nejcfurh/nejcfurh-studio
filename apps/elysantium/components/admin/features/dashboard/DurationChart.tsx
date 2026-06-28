'use client';

import Heading from '@/components/admin/ui/Heading';
import { useDarkMode } from '@/lib/context/DarkModeContext';
import { AnimatedDiv } from '@repo/ui/animation/core';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import { dashboardItem } from './motion';

interface StayData {
  numNights: number;
}

interface DurationChartProps {
  confirmedStays: StayData[];
}

interface DurationDataItem {
  duration: string;
  value: number;
  color: string;
}

// Cohesive, on-brand palette: gold → bronze → slate (warm to cool),
// instead of a clashing rainbow.
const DURATION_PALETTE = [
  '#d4a954', // gold
  '#c2913c', // deep gold
  '#aa7a30', // bronze
  '#8f6b3d', // olive bronze
  '#9a9488', // warm sand-grey
  '#76808a', // slate
  '#5d6b78', // deep slate
  '#465a6b' // steel
];

const buildStartData = (): DurationDataItem[] =>
  [
    '1 night',
    '2 nights',
    '3 nights',
    '4-5 nights',
    '6-7 nights',
    '8-14 nights',
    '15-21 nights',
    '21+ nights'
  ].map((duration, i) => ({
    duration,
    value: 0,
    color: DURATION_PALETTE[i]!
  }));

const startDataLight: DurationDataItem[] = buildStartData();
const startDataDark: DurationDataItem[] = buildStartData();

function prepareData(
  startData: DurationDataItem[],
  stays: StayData[]
): DurationDataItem[] {
  function incArrayValue(
    arr: DurationDataItem[],
    field: string
  ): DurationDataItem[] {
    return arr.map((obj) =>
      obj.duration === field ? { ...obj, value: obj.value + 1 } : obj
    );
  }

  const data = stays
    .reduce((arr: DurationDataItem[], cur) => {
      const num = cur.numNights;
      if (num === 1) return incArrayValue(arr, '1 night');
      if (num === 2) return incArrayValue(arr, '2 nights');
      if (num === 3) return incArrayValue(arr, '3 nights');
      if ([4, 5].includes(num)) return incArrayValue(arr, '4-5 nights');
      if ([6, 7].includes(num)) return incArrayValue(arr, '6-7 nights');
      if (num >= 8 && num <= 14) return incArrayValue(arr, '8-14 nights');
      if (num >= 15 && num <= 21) return incArrayValue(arr, '15-21 nights');
      if (num >= 21) return incArrayValue(arr, '21+ nights');
      return arr;
    }, startData)
    .filter((obj) => obj.value > 0);

  return data;
}

function DurationChart({
  confirmedStays
}: DurationChartProps): React.ReactElement {
  const { isDarkMode } = useDarkMode();
  const startData = isDarkMode ? startDataDark : startDataLight;

  const data = prepareData(startData, confirmedStays);

  return (
    <AnimatedDiv
      variants={dashboardItem}
      className="col-[3/span_2] rounded-(--border-radius-md) border border-(--color-grey-100) bg-(--color-grey-0) px-8 py-6 shadow-(--shadow-card) [&_.recharts-pie-label-text]:font-semibold [&>*:first-child]:mb-4"
    >
      <Heading
        as="h2"
        className="flex items-center gap-3 before:h-5 before:w-1 before:rounded-full before:bg-(--color-brand-500) before:content-['']"
      >
        Stay duration summary
      </Heading>
      <ResponsiveContainer width="100%" height={248}>
        <PieChart>
          <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            cx="42%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={1.5}
          >
            {data.map((entry) => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.duration}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            width={170}
            layout="vertical"
            iconType="circle"
            iconSize={12}
            formatter={(value) => (
              <span className="text-sm text-(--color-grey-600)">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </AnimatedDiv>
  );
}

export default DurationChart;
