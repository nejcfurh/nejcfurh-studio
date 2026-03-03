// Pure feeder generation, culling, and spacing logic.
// No React, no store — called by gameStore and FeederSpawner.

import { FeederData } from '@/types';
import { isSafeFeederPosition } from '@/lib/terrain/terrainCollision';
import { seededRandom } from '@/utils/seededRandom';
import { FEEDER_COUNT, BIRDBATH_COUNT } from '@/utils/constants';

let feederIdCounter = 0;

export function resetFeederIdCounter() {
  feederIdCounter = 0;
}

export function nextFeederId(): number {
  return feederIdCounter++;
}

/** Check minimum spacing against existing feeders */
function isFarEnough(x: number, z: number, feeders: FeederData[], minSpacing: number): boolean {
  for (const f of feeders) {
    const dx = f.position[0] - x;
    const dz = f.position[2] - z;
    if (dx * dx + dz * dz < minSpacing * minSpacing) return false;
  }
  return true;
}

/** Generate initial feeders around a center position */
export function generateFeeders(centerX = 0, centerZ = 0): FeederData[] {
  const feeders: FeederData[] = [];
  const spread = 80;
  const MIN_SPACING = 10;

  function safePosition(): [number, number, number] | null {
    for (let attempt = 0; attempt < 80; attempt++) {
      const s = attempt < 50 ? spread : spread * 1.5;
      const x = centerX + (Math.random() - 0.5) * s;
      const z = centerZ + (Math.random() - 0.5) * s;
      if (isSafeFeederPosition(x, z) && isFarEnough(x, z, feeders, MIN_SPACING)) {
        return [x, 0, z];
      }
    }
    return null;
  }

  for (let i = 0; i < FEEDER_COUNT; i++) {
    const pos = safePosition();
    if (pos) {
      feeders.push({
        id: nextFeederId(),
        position: pos,
        hasCat: Math.random() > 0.6,
        type: 'feeder',
      });
    }
  }

  for (let i = 0; i < BIRDBATH_COUNT; i++) {
    const pos = safePosition();
    if (pos) {
      feeders.push({
        id: nextFeederId(),
        position: pos,
        hasCat: Math.random() > 0.7,
        type: 'birdbath',
      });
    }
  }

  return feeders;
}

/** Cull feeders beyond maxDist from player position */
export function cullDistantFeeders(
  feeders: FeederData[],
  playerX: number,
  playerZ: number,
  maxDist: number,
): FeederData[] {
  return feeders.filter(f => {
    const dx = f.position[0] - playerX;
    const dz = f.position[2] - playerZ;
    return Math.sqrt(dx * dx + dz * dz) < maxDist;
  });
}

/** Spawn new feeders near the player to maintain density */
export function spawnNearbyFeeders(
  existing: FeederData[],
  playerX: number,
  playerZ: number,
  targetCount: number,
  spawnDistance: number,
  minSpacing: number,
  seedBase: number,
): FeederData[] {
  const nearbyCount = existing.filter(f => {
    const dx = f.position[0] - playerX;
    const dz = f.position[2] - playerZ;
    return Math.sqrt(dx * dx + dz * dz) < spawnDistance;
  }).length;

  const toSpawn = targetCount - nearbyCount;
  if (toSpawn <= 0) return existing;

  const rand = seededRandom(Math.abs(seedBase) || 1);
  let updated = [...existing];

  for (let s = 0; s < toSpawn; s++) {
    let placed = false;
    for (let attempt = 0; attempt < 20 && !placed; attempt++) {
      const angle = rand() * Math.PI * 2;
      const dist = 15 + rand() * 35;
      const nx = playerX + Math.sin(angle) * dist;
      const nz = playerZ + Math.cos(angle) * dist;

      if (!isFarEnough(nx, nz, updated, minSpacing)) continue;
      if (!isSafeFeederPosition(nx, nz)) continue;

      const isBath = rand() > 0.55;
      updated = [...updated, {
        id: nextFeederId(),
        position: [nx, 0, nz] as [number, number, number],
        hasCat: rand() > 0.65,
        type: isBath ? 'birdbath' : 'feeder',
      }];
      placed = true;
    }
  }

  return updated;
}
