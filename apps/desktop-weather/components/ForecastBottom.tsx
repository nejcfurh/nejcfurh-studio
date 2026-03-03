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
      month: 'long',
    });
  };

  return (
    <div className="flex mx-auto overflow-x-hidden justify-center h-full items-center w-full">
      {forecast.time?.map((date: string, idx: number) => (
        <div
          key={date}
          className="shrink-0 flex flex-col mx-5 items-center justify-center p-2 rounded min-w-[30]"
        >
          <div className="font-bold text-lg mb-2">{formatDate(date)}</div>
          <div className="flex flex-col items-center gap-4">
            {mapWeatherCodeToIcon(forecast.weathercode[idx])}
            <div className="text-center text-lg mt-2 gap-2 flex flex-col">
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
