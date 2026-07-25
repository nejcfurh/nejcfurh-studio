'use client';

import { useId } from 'react';

import { ClearDayArt } from './art/clear-day';
import { ClearNightArt } from './art/clear-night';
import { DrizzleArt } from './art/drizzle';
import { FogArt } from './art/fog';
import { MostlyClearDayArt } from './art/mostly-clear-day';
import { MostlyClearNightArt } from './art/mostly-clear-night';
import { OvercastArt } from './art/overcast';
import { PartlyCloudyDayArt } from './art/partly-cloudy-day';
import { PartlyCloudyNightArt } from './art/partly-cloudy-night';
import { RainArt } from './art/rain';
import { SleetArt } from './art/sleet';
import { SnowArt } from './art/snow';
import { ThunderstormsArt } from './art/thunderstorms';
import type { WeatherArtProps } from './art/types';
import type { WeatherIconName } from './weather-code';

const ART: Record<
  WeatherIconName,
  (props: WeatherArtProps) => React.ReactNode
> = {
  'clear-day': ClearDayArt,
  'clear-night': ClearNightArt,
  'mostly-clear-day': MostlyClearDayArt,
  'mostly-clear-night': MostlyClearNightArt,
  'partly-cloudy-day': PartlyCloudyDayArt,
  'partly-cloudy-night': PartlyCloudyNightArt,
  overcast: OvercastArt,
  fog: FogArt,
  drizzle: DrizzleArt,
  rain: RainArt,
  sleet: SleetArt,
  snow: SnowArt,
  thunderstorms: ThunderstormsArt
};

interface WeatherIconProps {
  name: WeatherIconName;
  label: string;
  size: number;
  className?: string;
}

export function WeatherIcon({
  name,
  label,
  size,
  className
}: WeatherIconProps): React.ReactNode {
  // Ids land in url(#…) references, so strip anything not valid in a fragment
  // identifier rather than depending on React's useId format.
  const uid = useId().replace(/[^\w-]/g, '');
  const Art = ART[name];

  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={label}
      className={className}
    >
      <Art uid={uid} />
    </svg>
  );
}
