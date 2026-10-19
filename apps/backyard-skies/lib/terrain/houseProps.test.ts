import { describe, expect, it } from 'vitest';

import { CHUNK_SIZE, STREET_HALF_WIDTH } from './chunkConstants';
import { generateChunkData, HouseData, isInsideHouse } from './chunkGenerator';
import {
  ATTACHED_PARTS,
  HouseProp,
  houseProps,
  isPaved,
  isSolidPart,
  propObstacles
} from './houseProps';

const chunks = Array.from({ length: 15 * 15 }, (_, i) => ({
  cx: (i % 15) - 7,
  cz: Math.floor(i / 15) - 7
}));

const all = chunks.map(({ cx, cz }) => {
  const data = generateChunkData(cx, cz);
  return { cx, cz, data, props: houseProps(data, cx, cz) };
});

/** Corners and centre of a prop's footprint, chunk-local. */
function footprintPoints(p: HouseProp, ox: number, oz: number) {
  const c = Math.cos(p.rot);
  const s = Math.sin(p.rot);
  const points: [number, number][] = [];
  for (const [fx, fz] of [
    [0, 0],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ]) {
    const lx = (fx * p.sx) / 2;
    const lz = (fz * p.sz) / 2;
    points.push([p.x - ox + lx * c + lz * s, p.z - oz - lx * s + lz * c]);
  }
  return points;
}

function nearestHouse(houses: HouseData[], x: number, z: number) {
  let best: HouseData | undefined;
  let bestD = Infinity;
  for (const h of houses) {
    const d = Math.hypot(h.x - x, h.z - z);
    if (d < bestD) {
      bestD = d;
      best = h;
    }
  }
  return best;
}

describe('houseProps', () => {
  it('is deterministic and does not depend on what was generated before', () => {
    const first = houseProps(generateChunkData(3, -7), 3, -7);
    houseProps(generateChunkData(-2, 4), -2, 4);
    expect(houseProps(generateChunkData(3, -7), 3, -7)).toEqual(first);
  });

  it('leaves the chunk data and its RNG sequence untouched', () => {
    const before = generateChunkData(5, 2);
    houseProps(before, 5, 2);
    expect(before).toEqual(generateChunkData(5, 2));
  });

  it('keeps every prop off the roads and sidewalks', () => {
    for (const { cx, cz, data, props } of all) {
      for (const p of props) {
        for (const [x, z] of footprintPoints(
          p,
          cx * CHUNK_SIZE,
          cz * CHUNK_SIZE
        )) {
          expect(Math.abs(z)).toBeGreaterThanOrEqual(STREET_HALF_WIDTH - 1e-6);
          if (data.hasRoadZ) {
            expect(Math.abs(x)).toBeGreaterThanOrEqual(
              STREET_HALF_WIDTH - 1e-6
            );
          }
        }
      }
    }
  });

  it('keeps props out of houses, except porches and walkways at their own door', () => {
    for (const { cx, cz, data, props } of all) {
      const ox = cx * CHUNK_SIZE;
      const oz = cz * CHUNK_SIZE;
      const neighbours: HouseData[] = [-1, 1].flatMap((side) =>
        generateChunkData(cx + side, cz).houses.map((h) => ({
          ...h,
          x: h.x + side * CHUNK_SIZE
        }))
      );
      for (const p of props) {
        // A porch or walkway belongs to the nearest house.
        const own = ATTACHED_PARTS.has(p.part)
          ? nearestHouse(data.houses, p.x - ox, p.z - oz)
          : undefined;
        const others = data.houses.filter((h) => h !== own);
        for (const [x, z] of footprintPoints(p, ox, oz)) {
          for (const h of [...others, ...neighbours]) {
            expect(isInsideHouse(h, x, z, -1e-6)).toBe(false);
          }
        }
      }
    }
  });

  it('keeps props inside their own chunk', () => {
    for (const { cx, cz, props } of all) {
      for (const p of props) {
        for (const [x] of footprintPoints(
          p,
          cx * CHUNK_SIZE,
          cz * CHUNK_SIZE
        )) {
          expect(Math.abs(x)).toBeLessThanOrEqual(CHUNK_SIZE / 2 + 1e-6);
        }
      }
    }
  });

  it('keeps tree trunks clear of props', () => {
    for (const { cx, cz, data, props } of all) {
      for (const t of data.trees) {
        for (const p of props) {
          const dx = cx * CHUNK_SIZE + t.x - p.x;
          const dz = cz * CHUNK_SIZE + t.z - p.z;
          const c = Math.cos(p.rot);
          const s = Math.sin(p.rot);
          const lx = dx * c - dz * s;
          const lz = dx * s + dz * c;
          const inside =
            Math.abs(lx) < p.sx / 2 + 0.3 && Math.abs(lz) < p.sz / 2 + 0.3;
          expect(inside).toBe(false);
        }
      }
    }
  });

  it('gives most houses a driveway and some of them a car', () => {
    let houses = 0;
    let driveways = 0;
    let cars = 0;
    for (const { data, props } of all) {
      houses += data.houses.length;
      driveways += props.filter((p) => p.part === 'driveway').length;
      cars += props.filter((p) => p.part === 'car').length;
    }
    expect(driveways / houses).toBeGreaterThan(0.6);
    expect(driveways).toBeLessThanOrEqual(houses);
    expect(cars / driveways).toBeGreaterThan(0.4);
    expect(cars).toBeLessThan(driveways);
  });

  it('reports paving under driveways and walkways, and lawn beside them', () => {
    let checked = 0;
    for (const { props } of all) {
      for (const p of props) {
        if (p.part !== 'driveway' && p.part !== 'walkway') continue;
        checked++;
        expect(isPaved(props, p.x, p.z)).toBe(true);
        expect(isPaved(props, p.x + p.sx / 2 - 0.05, p.z)).toBe(true);
        // Beside the strip, across its width, is lawn unless a porch is there.
        const beside = p.x + p.sx / 2 + 0.3;
        if (!props.some((q) => q.part === 'porch' && Math.abs(q.z - p.z) < 3)) {
          expect(isPaved(props, beside, p.z)).toBe(false);
        }
      }
    }
    expect(checked).toBeGreaterThan(100);
  });

  it('parks every car on a driveway', () => {
    for (const { props } of all) {
      const driveways = props.filter((p) => p.part === 'driveway');
      for (const car of props.filter((p) => p.part === 'car')) {
        const on = driveways.some(
          (d) =>
            Math.abs(d.x - car.x) < d.sx / 2 &&
            Math.abs(d.z - car.z) + car.sz / 2 <= d.sz / 2 + 1e-6
        );
        expect(on).toBe(true);
      }
    }
  });
});

describe('propObstacles', () => {
  it('has one box per prop the bird can hit, matching its size', () => {
    for (const { props } of all) {
      const solid = props.filter((p) => isSolidPart(p.part));
      const obstacles = propObstacles(props);
      expect(obstacles).toHaveLength(solid.length);
      solid.forEach((p, i) => {
        expect(obstacles[i]).toEqual({
          x: p.x,
          z: p.z,
          halfX: p.sx / 2,
          halfZ: p.sz / 2,
          rot: p.rot,
          bottom: p.y,
          top: p.y + p.sy
        });
      });
    }
  });

  it('covers every prop that stands taller than a lawn edge', () => {
    for (const { props } of all) {
      for (const p of props) {
        if (p.y + p.sy > 0.3) expect(isSolidPart(p.part)).toBe(true);
      }
    }
  });
});
