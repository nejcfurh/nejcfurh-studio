import { seededRandom } from '@/utils/seededRandom';

import {
  CHUNK_SIZE,
  FENCE_COLORS,
  HOUSE_MODELS,
  HOUSES_PER_CHUNK,
  ROOF_COLORS,
  STREET_HALF_WIDTH,
  TREES_PER_CHUNK,
  WALL_COLORS
} from './chunkConstants';
import { HOUSE_BOUNDS } from './houseBounds';

export interface HouseData {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  roofColor: string;
  wallColor: string;
  rot: number;
  fenceColor: string;
  hasPatio: boolean;
  modelIndex: number;
}

export interface TreeData {
  x: number;
  z: number;
  height: number;
  type: 'pine' | 'round' | 'oak';
}

export interface GardenBedData {
  x: number;
  z: number;
  rot: number;
  w: number;
}

export interface ChunkData {
  hasRoadX: boolean;
  hasRoadZ: boolean;
  houses: HouseData[];
  trees: TreeData[];
  gardenBeds: GardenBedData[];
}

export function generateChunkData(cx: number, cz: number): ChunkData {
  const seed = cx * 73856093 + cz * 19349663;
  const rng = seededRandom(Math.abs(seed) + 1);

  // Skip 30 RNG calls (grass patches: 5 × 6) to keep downstream positions stable
  for (let i = 0; i < 30; i++) rng();

  // Skip 28 RNG calls (mow stripes: 4 × 7) to keep downstream positions stable
  for (let i = 0; i < 28; i++) rng();

  // ROADS
  const hasRoadX = true;
  const hasRoadZ = Math.abs(cx) % 2 === 0;

  // HOUSES
  const houses: HouseData[] = [];

  if (hasRoadX && hasRoadZ) {
    // INTERSECTION: 4 QUADRANT CORNERS
    for (let qi = 0; qi < 4; qi++) {
      const sx = qi < 2 ? 1 : -1;
      const sz = qi % 2 === 0 ? 1 : -1;
      houses.push({
        x: sx * (6 + rng() * 5),
        z: sz * (6 + rng() * 5),
        w: 3.5 + rng() * 2,
        h: 2.8 + rng() * 1.5,
        d: 3.5 + rng() * 2,
        roofColor: ROOF_COLORS[Math.floor(rng() * ROOF_COLORS.length)],
        wallColor: WALL_COLORS[Math.floor(rng() * WALL_COLORS.length)],
        rot: sz > 0 ? Math.PI : 0,
        fenceColor: FENCE_COLORS[Math.floor(rng() * FENCE_COLORS.length)],
        hasPatio: rng() > 0.65,
        modelIndex: Math.floor(rng() * HOUSE_MODELS.length)
      });
    }
  } else {
    // HOUSES ALONG HORIZONTAL ROAD
    for (let i = 0; i < HOUSES_PER_CHUNK; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const baseX =
        (i / HOUSES_PER_CHUNK - 0.5) * CHUNK_SIZE * 0.8 + (rng() - 0.5) * 4;
      houses.push({
        x: baseX,
        z: side * (6 + rng() * 5),
        w: 3.5 + rng() * 2,
        h: 2.8 + rng() * 1.5,
        d: 3.5 + rng() * 2,
        roofColor: ROOF_COLORS[Math.floor(rng() * ROOF_COLORS.length)],
        wallColor: WALL_COLORS[Math.floor(rng() * WALL_COLORS.length)],
        rot: side > 0 ? Math.PI : 0,
        fenceColor: FENCE_COLORS[Math.floor(rng() * FENCE_COLORS.length)],
        hasPatio: rng() > 0.65,
        modelIndex: Math.floor(rng() * HOUSE_MODELS.length)
      });
    }
  }

  // TREES
  const trees: TreeData[] = [];
  const types: Array<'pine' | 'round' | 'oak'> = ['pine', 'round', 'oak'];
  for (let i = 0; i < TREES_PER_CHUNK; i++) {
    trees.push({
      x: (rng() - 0.5) * CHUNK_SIZE,
      z: (rng() - 0.5) * CHUNK_SIZE,
      height: 3 + rng() * 4,
      type: types[Math.floor(rng() * types.length)]
    });
  }

  // GARDEN BEDS
  const gardenBeds: GardenBedData[] = [];
  for (let i = 0; i < houses.length; i++) {
    if (rng() > 0.7) {
      gardenBeds.push({
        x: houses[i].x + (rng() - 0.5) * 3,
        z: houses[i].z + (rng() > 0.5 ? 4 : -4),
        rot: houses[i].rot,
        w: 1.5 + rng() * 2
      });
    }
  }

  // Filtered only after every rng() draw, so the sequence (and with it the
  // layout and feeder placement) is the same as before filtering existed.
  const onStreet = (x: number, z: number, halfX: number, halfZ: number) =>
    Math.abs(z) - halfZ < STREET_HALF_WIDTH ||
    (hasRoadZ && Math.abs(x) - halfX < STREET_HALF_WIDTH);

  for (const h of houses) {
    // Patio is a (w + 1) x 2.5 slab 3.5 behind the house, see Patio.tsx.
    const px = h.x - 3.5 * Math.sin(h.rot);
    const pz = h.z - 3.5 * Math.cos(h.rot);
    if (h.hasPatio && onStreet(px, pz, (h.w + 1) / 2, 1.25)) h.hasPatio = false;
  }

  return {
    hasRoadX,
    hasRoadZ,
    houses,
    trees: trees.filter(
      (t) =>
        !onStreet(t.x, t.z, TREE_CLEARANCE, TREE_CLEARANCE) &&
        !houses.some((h) => isInsideHouse(h, t.x, t.z, TREE_CLEARANCE))
    ),
    gardenBeds: gardenBeds.filter((g) => !onStreet(g.x, g.z, g.w / 2, 0.45))
  };
}

const TREE_CLEARANCE = 1.5;

/** Whether a point lies within `margin` of a house's footprint. */
export function isInsideHouse(
  h: HouseData,
  x: number,
  z: number,
  margin: number
): boolean {
  const b = HOUSE_BOUNDS[h.modelIndex % HOUSE_BOUNDS.length];
  const dx = x - h.x;
  const dz = z - h.z;
  const cos = Math.cos(h.rot);
  const sin = Math.sin(h.rot);
  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  return (
    lx > b.minX - margin &&
    lx < b.maxX + margin &&
    lz > b.minZ - margin &&
    lz < b.maxZ + margin
  );
}
