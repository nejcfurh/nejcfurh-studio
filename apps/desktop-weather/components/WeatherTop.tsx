'use client';

import { useDisplayCurrentTime } from '../app/hooks/useDisplayCurrentTime';
import { useFetchWeatherData } from '../app/hooks/useFetchWeatherData';
import { useUserLocation } from '../app/hooks/useUserLocation';
import { describeWeatherCode } from './weather-icons/weather-code';
import { WeatherIcon } from './weather-icons/WeatherIcon';

const HERO_ICON_SIZE = 96;

// Holds the line's height before its content arrives, so nothing below shifts.
const PLACEHOLDER = ' ';

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

  const condition = data ? describeWeatherCode(data.weathercode) : null;

  const city =
    location?.city === 'Rače'
      ? 'Hotinja vas' // DISPLAY ACTUAL LOCATION OF THE SURFACE TABLET
      : location?.city;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-3 text-center">
        {/* tabular-nums stops the clock jittering as digit widths change. */}
        <time className="mb-2 block text-9xl font-bold tabular-nums">
          {timeString ?? PLACEHOLDER}
        </time>
        <div className="text-4xl text-white/45">
          {dateString ?? PLACEHOLDER}
        </div>
        <div className="mt-5 h-8 text-2xl font-light text-white/70">
          {city ?? PLACEHOLDER}
        </div>
      </div>
      <div
        className="flex items-center gap-4"
        style={{ height: HERO_ICON_SIZE }}
      >
        {data && condition && (
          <>
            <WeatherIcon
              name={condition.icon}
              label={condition.label}
              size={HERO_ICON_SIZE}
            />
            <span className="text-5xl font-light tabular-nums">
              {data.temperature} °C
            </span>
          </>
        )}
      </div>
    </div>
  );
}
