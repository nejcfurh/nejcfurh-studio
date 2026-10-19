'use client';

import { useGameStore } from '@/store/gameStore';
import { Suspense } from 'react';

import Feeder from './Feeder';

export default function FeederSpawner() {
  const feeders = useGameStore((s) => s.feeders);

  return (
    <>
      {feeders.map((f) => (
        <Suspense key={f.id} fallback={null}>
          <Feeder data={f} />
        </Suspense>
      ))}
    </>
  );
}
