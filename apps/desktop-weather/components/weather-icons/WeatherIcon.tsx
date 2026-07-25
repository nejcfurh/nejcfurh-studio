'use client';

import { useReducedMotion } from '@repo/ui/animation';
import { useEffect, useId, useRef } from 'react';

import { ClearDayArt } from './art/clear-day';
import { DrizzleArt } from './art/drizzle';
import { FogArt } from './art/fog';
import { MostlyClearDayArt } from './art/mostly-clear-day';
import { OvercastArt } from './art/overcast';
import { PartlyCloudyDayArt } from './art/partly-cloudy-day';
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
  'mostly-clear-day': MostlyClearDayArt,
  'partly-cloudy-day': PartlyCloudyDayArt,
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
  const ref = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();
  // Ids land in url(#…) references, so strip anything not valid in a fragment
  // identifier rather than depending on React's useId format.
  const uid = useId().replace(/[^\w-]/g, '');
  const Art = ART[name];

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    // SMIL animations ignore prefers-reduced-motion, so they need pausing by hand.
    if (reducedMotion) {
      svg.pauseAnimations();
    } else {
      svg.unpauseAnimations();
    }
  }, [reducedMotion]);

  return (
    <svg
      ref={ref}
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
