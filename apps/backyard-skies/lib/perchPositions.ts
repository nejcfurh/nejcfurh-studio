// Pure perch position calculation — no store.

import { FeederData } from '@/types';

export interface PerchPosition {
  position: [number, number, number];
  rotation: number;
}

export function computePerchPosition(feeder: FeederData): PerchPosition {
  if (feeder.type === 'feeder') {
    return {
      position: [
        feeder.position[0],
        feeder.position[1] + 1.85,
        feeder.position[2] + 0.9,
      ],
      rotation: Math.PI,
    };
  } else {
    return {
      position: [
        feeder.position[0],
        feeder.position[1] + 2.35,
        feeder.position[2] + 1.1,
      ],
      rotation: Math.PI,
    };
  }
}
