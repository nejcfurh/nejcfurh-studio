'use client';

import { useMemo } from 'react';

import {
  Instance,
  InstancedLayer,
  LoadedChunk,
  unitPlaneGeometry
} from './InstancedLayer';
import { pushRoad, roadMaterial } from './RoadX';

export function RoadZLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const instances = useMemo(() => {
    const out: Instance[] = [];
    for (const chunk of chunks) {
      const { hasRoadX, hasRoadZ } = chunk.data;
      if (hasRoadZ) pushRoad(out, chunk, Math.PI / 2, hasRoadX);
    }
    return out;
  }, [chunks]);

  return (
    <InstancedLayer
      geometry={unitPlaneGeometry}
      material={roadMaterial}
      instances={instances}
      receiveShadow
    />
  );
}
