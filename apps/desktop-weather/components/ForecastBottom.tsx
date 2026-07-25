'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';

import { useFetchWeatherData } from '../app/hooks/useFetchWeatherData';
import { describeWeatherCode } from './weather-icons/weather-code';
import { WeatherIcon } from './weather-icons/WeatherIcon';
import { forecastColumnVariants, forecastRowVariants } from './weather-motion';

const FORECAST_ICON_SIZE = 96;

const formatWeekday = (dateString: string) =>
  new Date(dateString).toLocaleDateString('sl-SI', { weekday: 'short' });

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('sl-SI', {
    day: 'numeric',
    month: 'short'
  });

export function ForecastBottom() {
  const { forecast } = useFetchWeatherData();

  if (!forecast) return null;

  return (
    // Capped width keeps the seven days reading as one group on a wide kiosk
    // screen, and flexing within it fits them all instead of clipping.
    <AnimatedDiv
      className="mx-auto flex h-full w-full max-w-5xl items-center justify-between gap-4 px-10"
      variants={forecastRowVariants}
      initial="hidden"
      animate="visible"
    >
      {forecast.time?.map((date: string, idx: number) => {
        // Daily rollups have no day/night, so these stay on the day icons.
        const condition = describeWeatherCode(forecast.weathercode[idx]);

        return (
          <AnimatedDiv
            key={date}
            className="flex min-w-0 flex-1 flex-col items-center gap-3 px-2 py-4"
            variants={forecastColumnVariants}
          >
            <div className="text-center">
              <div className="text-lg font-medium tracking-wide text-white/60 uppercase">
                {formatWeekday(date)}
              </div>
              <div className="text-sm text-white/40">{formatDate(date)}</div>
            </div>
            <WeatherIcon
              name={condition.icon}
              label={condition.label}
              size={FORECAST_ICON_SIZE}
            />
            {/* High leads, low recedes — the old markup bolded the labels instead. */}
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-3xl font-medium">
                {Math.round(forecast.temperature_2m_max[idx])}°
              </span>
              <span className="text-xl font-light text-white/45">
                {Math.round(forecast.temperature_2m_min[idx])}°
              </span>
            </div>
          </AnimatedDiv>
        );
      })}
    </AnimatedDiv>
  );
}
