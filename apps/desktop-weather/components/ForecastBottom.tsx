'use client';

import { useFetchWeatherData } from '../app/hooks/useFetchWeatherData';
import { mapWeatherCodeToIcon } from '../app/utils/mappers';

export function ForecastBottom() {
  const { forecast } = useFetchWeatherData();

  if (!forecast) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sl-SI', {
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="mx-auto flex h-full w-full items-center justify-center overflow-x-hidden">
      {forecast.time?.map((date: string, idx: number) => (
        <div
          key={date}
          className="mx-5 flex min-w-[30] shrink-0 flex-col items-center justify-center rounded p-2"
        >
          <div className="mb-2 text-lg font-bold">{formatDate(date)}</div>
          <div className="flex flex-col items-center gap-4">
            {mapWeatherCodeToIcon(forecast.weathercode[idx])}
            <div className="mt-2 flex flex-col gap-2 text-center text-lg">
              <p className="font-thing">
                <span className="font-bold">Max:</span>{' '}
                {Math.round(forecast.temperature_2m_max[idx])}°C
              </p>
              <p className="font-thin">
                <span className="font-bold">Min:</span>{' '}
                {Math.round(forecast.temperature_2m_min[idx])}°C
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
