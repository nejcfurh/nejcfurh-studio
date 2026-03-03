'use client';

import { useDisplayCurrentTime } from '../app/hooks/useDisplayCurrentTime';
import { useFetchWeatherData } from '../app/hooks/useFetchWeatherData';
import { useUserLocation } from '../app/hooks/useUserLocation';
import { mapWeatherCodeToIcon } from '../app/utils/mappers';

export function WeatherTop() {
  const { data } = useFetchWeatherData();
  const currentTime = useDisplayCurrentTime();
  const { location } = useUserLocation();

  const timeString = currentTime.toLocaleString('sl-SI', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleString('sl-SI', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const icon = data ? mapWeatherCodeToIcon(data.weathercode) : null;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mb-8">
        <div className="font-roboto text-9xl font-bold mb-2">{timeString}</div>
        <div className="font-roboto text-4xl text-gray-400">{dateString}</div>
        {location && location.city && (
          <div className="font-roboto font-light text-2xl text-white/80 mt-5">
            {location.city === 'Rače'
              ? 'Hotinja vas' // DISPLAY ACTUAL LOCATION OF THE SURFACE TABLET
              : location.city}
          </div>
        )}
      </div>
      {data && (
        <div className="flex items-center gap-6">
          {icon}
          <span className="font-roboto text-5xl font-light">
            {data.temperature} °C
          </span>
        </div>
      )}
    </div>
  );
}
