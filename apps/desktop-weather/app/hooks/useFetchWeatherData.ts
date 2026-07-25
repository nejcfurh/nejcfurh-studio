import { useQuery } from '@repo/react-query';

import { HOURLY_INTERVAL } from '../utils/constants';
import { useUserLocation } from './useUserLocation';

interface WeatherData {
  temperature: number;
  weathercode: number;
  /** 1 while the sun is up at the reading's location, 0 after dark. */
  is_day: number;
}

interface ForecastData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
}

interface WeatherResponse {
  current_weather: WeatherData;
  daily: ForecastData;
}

interface WeatherDataWithForecast {
  data: WeatherData | null;
  forecast: ForecastData | null;
}

async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
  );
  return res.json();
}

export const useFetchWeatherData = (): WeatherDataWithForecast => {
  const { location, loading: locationLoading } = useUserLocation();

  const { data: weatherResponse } = useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: () => fetchWeather(location!.latitude, location!.longitude),
    enabled: !locationLoading && !!location,
    refetchInterval: HOURLY_INTERVAL
  });

  return {
    data: weatherResponse?.current_weather ?? null,
    forecast: weatherResponse?.daily ?? null
  };
};
