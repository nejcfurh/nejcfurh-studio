'use client';

import { ForecastBottom } from '@/components/ForecastBottom';
import { WeatherTop } from '@/components/WeatherTop';

import { useDeploymentCheck } from './hooks/useDeploymentCheck';

export default function Home() {
  useDeploymentCheck();

  return (
    <main className="flex h-screen w-screen flex-col divide-y divide-white/50">
      <div className="flex-1">
        <WeatherTop />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ForecastBottom />
      </div>
    </main>
  );
}
