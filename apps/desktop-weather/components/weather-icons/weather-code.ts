export type WeatherIconName =
  | 'clear-day'
  | 'clear-night'
  | 'mostly-clear-day'
  | 'mostly-clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
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

/**
 * Only the icons that actually draw a sun have a night counterpart. Overcast,
 * fog and the precipitation icons hide the sky anyway, so they are drawn the
 * same after dark and are deliberately absent here.
 */
const NIGHT_EQUIVALENT: Partial<Record<WeatherIconName, WeatherIconName>> = {
  'clear-day': 'clear-night',
  'mostly-clear-day': 'mostly-clear-night',
  'partly-cloudy-day': 'partly-cloudy-night'
};

interface DescribeOptions {
  /** Open-Meteo reports this per reading; a daily forecast has no such thing. */
  isDay?: boolean;
}

export const describeWeatherCode = (
  code: number,
  { isDay = true }: DescribeOptions = {}
): WeatherCondition => {
  const condition = CONDITIONS[code] ?? UNKNOWN;

  if (isDay) return condition;

  const nightIcon = NIGHT_EQUIVALENT[condition.icon];

  return nightIcon ? { ...condition, icon: nightIcon } : condition;
};
