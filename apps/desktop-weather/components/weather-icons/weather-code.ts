export type WeatherIconName =
  | 'clear-day'
  | 'mostly-clear-day'
  | 'partly-cloudy-day'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'sleet'
  | 'snow'
  | 'thunderstorms';

export interface WeatherCondition {
  icon: WeatherIconName;
  label: string;
}

// WMO weather interpretation codes, as returned by Open-Meteo.
const CONDITIONS: Record<number, WeatherCondition> = {
  0: { icon: 'clear-day', label: 'Clear' },
  1: { icon: 'mostly-clear-day', label: 'Mainly clear' },
  2: { icon: 'partly-cloudy-day', label: 'Partly cloudy' },
  3: { icon: 'overcast', label: 'Overcast' },
  45: { icon: 'fog', label: 'Fog' },
  48: { icon: 'fog', label: 'Freezing fog' },
  51: { icon: 'drizzle', label: 'Light drizzle' },
  53: { icon: 'drizzle', label: 'Drizzle' },
  55: { icon: 'drizzle', label: 'Heavy drizzle' },
  56: { icon: 'sleet', label: 'Freezing drizzle' },
  57: { icon: 'sleet', label: 'Freezing drizzle' },
  61: { icon: 'rain', label: 'Light rain' },
  63: { icon: 'rain', label: 'Rain' },
  65: { icon: 'rain', label: 'Heavy rain' },
  66: { icon: 'sleet', label: 'Freezing rain' },
  67: { icon: 'sleet', label: 'Freezing rain' },
  71: { icon: 'snow', label: 'Light snow' },
  73: { icon: 'snow', label: 'Snow' },
  75: { icon: 'snow', label: 'Heavy snow' },
  77: { icon: 'snow', label: 'Snow grains' },
  80: { icon: 'rain', label: 'Light showers' },
  81: { icon: 'rain', label: 'Showers' },
  82: { icon: 'rain', label: 'Heavy showers' },
  85: { icon: 'snow', label: 'Snow showers' },
  86: { icon: 'snow', label: 'Heavy snow showers' },
  95: { icon: 'thunderstorms', label: 'Thunderstorm' },
  96: { icon: 'thunderstorms', label: 'Thunderstorm with hail' },
  99: { icon: 'thunderstorms', label: 'Thunderstorm with hail' }
};

const UNKNOWN: WeatherCondition = {
  icon: 'overcast',
  label: 'Unknown conditions'
};

export const describeWeatherCode = (code: number): WeatherCondition =>
  CONDITIONS[code] ?? UNKNOWN;
