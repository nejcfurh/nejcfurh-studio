'use client';

import { useGameStore } from '@/store/gameStore';
import Feeder from './Feeder';

export default function FeederSpawner() {
  const feeders = useGameStore(s => s.feeders);

  return (
    <>
      {feeders.map(f => (
        <Feeder key={f.id} data={f} />
      ))}
    </>
  );
}
