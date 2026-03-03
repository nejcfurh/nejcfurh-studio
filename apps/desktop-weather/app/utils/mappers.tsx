import {
  Sun,
  CloudRain,
  Snowflake,
  CloudSun,
  Cloud,
  CloudFog,
  Zap,
  Droplets,
} from 'lucide-react';
import React from 'react';

export const mapWeatherCodeToIcon = (code: number): React.ReactNode => {
  if (code === 0) return <Sun size={48} />;
  if (code === 1 || code === 2) return <CloudSun size={48} />;
  if (code === 3) return <Cloud size={48} />;
  if (code >= 45 && code <= 48) return <CloudFog size={48} />;
  if (code >= 51 && code <= 57) return <Droplets size={48} />;
  if (code >= 61 && code <= 67) return <CloudRain size={48} />;
  if (code >= 71 && code <= 77) return <Snowflake size={48} />;
  if (code >= 80 && code <= 82) return <CloudRain size={48} />;
  if (code >= 85 && code <= 86) return <Snowflake size={48} />;
  if (code >= 95 && code <= 99) return <Zap size={48} />;
  return <Cloud size={48} />;
};
