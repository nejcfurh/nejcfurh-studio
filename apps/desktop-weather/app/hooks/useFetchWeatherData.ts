import { useEffect, useState } from 'react';

import { HOURLY_INTERVAL } from '../utils/constants';
import { useUserLocation } from './useUserLocation';

interface WeatherData {
  temperature: number;
  weathercode: number;
}

interface ForecastData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
}

interface WeatherDataWithForecast {
  data: WeatherData | null;
  forecast: ForecastData | null;
}

export const useFetchWeatherData = (): WeatherDataWithForecast => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const { location, loading: locationLoading } = useUserLocation();

  useEffect(() => {
    if (locationLoading || !location) return;

    const fetchWeatherData = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
        );
        const json = await res.json();
        setData(json.current_weather);
        setForecast(json.daily);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Initial fetch
    fetchWeatherData();

    // Set up hourly interval
    const hourlyInterval = setInterval(fetchWeatherData, HOURLY_INTERVAL);

    // Set up daily reset at midnight
    const dailyReset = setTimeout(() => {
      fetchWeatherData(); // Fetch immediately at midnight

      // Then set up daily interval
      const dailyInterval = setInterval(fetchWeatherData, 24 * 3600 * 1000);

      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => {
      clearInterval(hourlyInterval);
      clearTimeout(dailyReset);
    };
  }, [location, locationLoading]);

  return { forecast, data };
};
