'use client';

import { AnimatePresence } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';

import { useDisplayCurrentTime } from '../app/hooks/useDisplayCurrentTime';
import { useFetchWeatherData } from '../app/hooks/useFetchWeatherData';
import { useUserLocation } from '../app/hooks/useUserLocation';
import { ClockDigits } from './ClockDigits';
import { describeWeatherCode } from './weather-icons/weather-code';
import { WeatherIcon } from './weather-icons/WeatherIcon';
import {
  conditionSwapMotion,
  heroLineMotion,
  revealMotion
} from './weather-motion';

const HERO_ICON_SIZE = 96;

// Holds the line's height before its content arrives, so nothing below shifts.
const PLACEHOLDER = ' ';

export function WeatherTop() {
  const { data } = useFetchWeatherData();
  const currentTime = useDisplayCurrentTime();
  const { location } = useUserLocation();

  const timeString = currentTime?.toLocaleString('sl-SI', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const dateString = currentTime?.toLocaleString('sl-SI', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const condition = data
    ? describeWeatherCode(data.weathercode, { isDay: data.is_day === 1 })
    : null;

  const city =
    location?.city === 'Rače'
      ? 'Hotinja vas' // DISPLAY ACTUAL LOCATION OF THE SURFACE TABLET
      : location?.city;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-3 text-center">
        {/* tabular-nums stops the clock jittering as digit widths change. */}
        <time
          className="mb-2 block text-9xl font-bold tabular-nums"
          aria-label={timeString}
        >
          {timeString ? <ClockDigits value={timeString} /> : PLACEHOLDER}
        </time>
        <div className="h-12 text-4xl text-white/45">
          <AnimatePresence>
            {dateString && (
              <AnimatedDiv key={dateString} {...heroLineMotion(0.06)}>
                {dateString}
              </AnimatedDiv>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-5 h-8 text-2xl font-light text-white/70">
          <AnimatePresence>
            {city && (
              <AnimatedDiv key={city} {...revealMotion}>
                {city}
              </AnimatedDiv>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div
        className="flex items-center gap-4"
        style={{ height: HERO_ICON_SIZE }}
      >
        {data && condition && (
          <>
            {/* Keyed on the icon, so it only crossfades when the condition
                actually changes rather than on every temperature tick. */}
            <AnimatePresence mode="wait" initial={false}>
              <AnimatedDiv key={condition.icon} {...conditionSwapMotion}>
                <WeatherIcon
                  name={condition.icon}
                  label={condition.label}
                  size={HERO_ICON_SIZE}
                />
              </AnimatedDiv>
            </AnimatePresence>
            <AnimatedDiv
              className="text-5xl font-light tabular-nums"
              {...revealMotion}
            >
              {data.temperature} °C
            </AnimatedDiv>
          </>
        )}
      </div>
    </div>
  );
}
