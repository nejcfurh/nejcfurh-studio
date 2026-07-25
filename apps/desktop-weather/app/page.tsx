'use client';

import { ForecastBottom } from '@/components/ForecastBottom';
import { WeatherTop } from '@/components/WeatherTop';

import { useDeploymentCheck } from './hooks/useDeploymentCheck';

export default function Home() {
  useDeploymentCheck();

  return (
    // A kiosk display never scrolls, so neither axis gets an overflow.
    <main className="flex h-screen w-screen flex-col divide-y divide-white/10 overflow-hidden">
      <div className="flex-1">
        <WeatherTop />
      </div>
      <div className="flex-1">
        <ForecastBottom />
      </div>
    </main>
  );
}
