'use client';

import { WeatherTop } from '@/components/WeatherTop';
import { ForecastBottom } from '@/components/ForecastBottom';
import { useDeploymentCheck } from './hooks/useDeploymentCheck';

export default function Home() {
  useDeploymentCheck();

  return (
    <main className="flex flex-col h-screen w-screen divide-y divide-white/50">
      <div className="flex-1">
        <WeatherTop />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ForecastBottom />
      </div>
    </main>
  );
}
