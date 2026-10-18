import {
  BIRD_COLLISION_OFFSET_Y,
  BIRD_COLLISION_RADIUS
} from '@/utils/constants';
import { describe, expect, it } from 'vitest';

import { CHUNK_SIZE, HOUSE_MODELS } from './chunkConstants';
import { generateChunkData, HouseData, TreeData } from './chunkGenerator';
import { HOUSE_BOUNDS, HouseBounds, roofHeightAt } from './houseBounds';
import {
  chunkIndex,
  createObstacleHit,
  getChunkData,
  isRoofHit,
  isSafeFeederPosition,
  reflectHeading,
  resolveObstacleCollision
} from './terrainCollision';

/** A house of a generated chunk, with its frame as House.tsx renders it. */
function houseAt(cx: number, cz: number, i: number) {
  const h = generateChunkData(cx, cz).houses[i];
  return placeHouse(cx, cz, h);
}

function placeHouse(cx: number, cz: number, h: HouseData) {
  const bounds = HOUSE_BOUNDS[h.modelIndex];
  const x = cx * CHUNK_SIZE + h.x;
  const z = cz * CHUNK_SIZE + h.z;
  const cos = Math.cos(h.rot);
  const sin = Math.sin(h.rot);
  return {
    bounds,
    /** World position of a point given in the house's own frame. */
    toWorld: (lx: number, lz: number): [number, number] => [
      x + lx * cos + lz * sin,
      z - lx * sin + lz * cos
    ],
    /** World direction of a direction given in the house's own frame. */
    dirToWorld: (lx: number, lz: number): [number, number] => [
      lx * cos + lz * sin,
      -lx * sin + lz * cos
    ]
  };
}

/** First generated house drawn with the given model. */
function houseWithModel(modelIndex: number) {
  for (let cx = -6; cx <= 6; cx++) {
    for (let cz = -6; cz <= 6; cz++) {
      const h = generateChunkData(cx, cz).houses.find(
        (house) => house.modelIndex === modelIndex
      );
      if (h) return placeHouse(cx, cz, h);
    }
  }
  throw new Error(`no house uses model ${modelIndex}`);
}

/** Highest house column the bird's sphere can reach from (lx, lz). */
function roofUnderSphere(b: HouseBounds, lx: number, lz: number) {
  let top = 0;
  for (const ox of [-1, 0, 1]) {
    for (const oz of [-1, 0, 1]) {
      const r = BIRD_COLLISION_RADIUS;
      top = Math.max(top, roofHeightAt(b, lx + ox * r, lz + oz * r));
    }
  }
  return top;
}

const headingOf = (dx: number, dz: number) => Math.atan2(dx, dz);

describe('house bounds', () => {
  it('has one shape per house model', () => {
    expect(HOUSE_BOUNDS).toHaveLength(HOUSE_MODELS.length);
  });

  it('follows the gable: lower over the eaves than at the ridge', () => {
    const b = HOUSE_BOUNDS[0];
    expect(roofHeightAt(b, 0, 0)).toBeCloseTo(b.top, 5);
    expect(roofHeightAt(b, 0, b.maxZ * 0.95)).toBeLessThan(b.top - 1.5);
  });
});

describe('chunk lookup', () => {
  it('maps a world coordinate to the nearest chunk origin, like rendering', () => {
    expect(chunkIndex(0)).toBe(0);
    expect(chunkIndex(CHUNK_SIZE * 0.49)).toBe(0);
    expect(chunkIndex(CHUNK_SIZE * 0.51)).toBe(1);
    expect(chunkIndex(-CHUNK_SIZE * 0.51)).toBe(-1);
  });

  it('caches chunk data that equals a fresh generation', () => {
    for (const [cx, cz] of [
      [0, 0],
      [1, -2],
      [-3, 5]
    ]) {
      const cached = getChunkData(cx, cz);
      expect(cached).toEqual(generateChunkData(cx, cz));
      expect(getChunkData(cx, cz)).toBe(cached);
    }
  });
});

describe('house collision', () => {
  const hit = createObstacleHit();

  it('detects a bird inside a house box', () => {
    const house = houseAt(1, 0, 0);
    const [x, z] = house.toWorld(0, 0);
    expect(resolveObstacleCollision(x, 1, z, hit)).toBe(true);
  });

  it('does not collide just above the roof, for every model', () => {
    for (let m = 0; m < HOUSE_BOUNDS.length; m++) {
      const house = houseWithModel(m);
      const b = house.bounds;
      for (const [fx, fz] of [
        [0, 0],
        [0.6, 0.8],
        [-0.8, -0.6]
      ]) {
        const lx = fx * b.maxX;
        const lz = fz * b.maxZ;
        const [x, z] = house.toWorld(lx, lz);
        const roof = roofUnderSphere(b, lx, lz);
        const y = roof + BIRD_COLLISION_RADIUS - BIRD_COLLISION_OFFSET_Y + 0.05;
        expect(resolveObstacleCollision(x, y, z, hit)).toBe(false);
      }
    }
  });

  it('lets a bird skim over the eaves below the ridge height', () => {
    const house = houseWithModel(0);
    const b = house.bounds;
    const lz = b.maxZ * 0.9;
    const [x, z] = house.toWorld(0, lz);
    const y = roofUnderSphere(b, 0, lz) - BIRD_COLLISION_OFFSET_Y + 0.6;
    expect(y).toBeLessThan(b.top - 1);
    expect(resolveObstacleCollision(x, y, z, hit)).toBe(false);
  });

  it('gives a flat wall one normal, even across a seam between columns', () => {
    const house = houseWithModel(0);
    const b = house.bounds;
    const seam = b.minX + ((b.maxX - b.minX) / b.cells) * 2;
    const [nx, nz] = house.dirToWorld(0, 1);
    for (const offset of [-0.05, 0.05]) {
      const [x, z] = house.toWorld(
        seam + offset,
        b.maxZ + BIRD_COLLISION_RADIUS * 0.5
      );
      expect(resolveObstacleCollision(x, 1, z, hit)).toBe(true);
      expect(hit.nx).toBeCloseTo(nx, 5);
      expect(hit.nz).toBeCloseTo(nz, 5);
    }
  });

  it('leaves the empty corner of an L-shaped house clear', () => {
    for (const m of [1, 5]) {
      const house = houseWithModel(m);
      const b = house.bounds;
      const lx = b.minX + (b.maxX - b.minX) * 0.1;
      const lz = b.minZ + (b.maxZ - b.minZ) * 0.1;
      expect(roofHeightAt(b, lx, lz)).toBe(0);
      const [x, z] = house.toWorld(lx, lz);
      expect(resolveObstacleCollision(x, 0.3, z, hit)).toBe(false);
    }
  });

  it('pushes a bird dropping onto the roof back up', () => {
    const house = houseAt(1, 0, 0);
    const [x, z] = house.toWorld(0, 0);
    const y = roofHeightAt(house.bounds, 0, 0) - 0.5;
    expect(resolveObstacleCollision(x, y, z, hit)).toBe(true);
    expect(isRoofHit(hit)).toBe(true);
    expect(hit.y).toBeGreaterThan(y);
    expect(resolveObstacleCollision(hit.x, hit.y, hit.z, hit)).toBe(false);
  });

  it('pushes a bird in a wall back outside the box', () => {
    const house = houseAt(0, 0, 1);
    const [x, z] = house.toWorld(0, house.bounds.maxZ - 0.3);
    expect(resolveObstacleCollision(x, 2, z, hit)).toBe(true);
    expect(isRoofHit(hit)).toBe(false);
    const [nx, nz] = house.dirToWorld(0, 1);
    expect(hit.nx).toBeCloseTo(nx, 5);
    expect(hit.nz).toBeCloseTo(nz, 5);
    const pushedOut = (hit.x - x) * nx + (hit.z - z) * nz;
    expect(pushedOut).toBeGreaterThanOrEqual(0.3 + BIRD_COLLISION_RADIUS);
    expect(resolveObstacleCollision(hit.x, hit.y, hit.z, hit)).toBe(false);
  });

  it('reports a wall the bird only grazes with its radius', () => {
    const house = houseAt(1, 0, 1);
    const [x, z] = house.toWorld(
      house.bounds.maxX + BIRD_COLLISION_RADIUS * 0.5,
      0
    );
    expect(resolveObstacleCollision(x, 2, z, hit)).toBe(true);
    const [nx, nz] = house.dirToWorld(1, 0);
    expect(hit.nx).toBeCloseTo(nx, 5);
    expect(hit.nz).toBeCloseTo(nz, 5);
  });
});

/**
 * Trees of a few chunks that stand clear of houses and other trees: the
 * generator sometimes plants a tree inside or against a house.
 */
function lonelyTrees() {
  const houses: [number, number][] = [];
  const trees: { x: number; z: number; t: TreeData }[] = [];
  for (let cx = -4; cx <= 4; cx++) {
    for (let cz = 2; cz <= 6; cz++) {
      const data = generateChunkData(cx, cz);
      for (const h of data.houses) {
        houses.push([cx * CHUNK_SIZE + h.x, cz * CHUNK_SIZE + h.z]);
      }
      if (Math.abs(cx) > 3 || cz < 3 || cz > 5) continue;
      for (const t of data.trees) {
        trees.push({ x: cx * CHUNK_SIZE + t.x, z: cz * CHUNK_SIZE + t.z, t });
      }
    }
  }
  return trees.filter(
    (a) =>
      houses.every(([hx, hz]) => Math.hypot(a.x - hx, a.z - hz) > 10) &&
      trees.every((b) => b === a || Math.hypot(a.x - b.x, a.z - b.z) > 6)
  );
}

describe('tree collision', () => {
  const hit = createObstacleHit();
  const trees = lonelyTrees();

  it('has lonely trees of every type to test against', () => {
    expect(new Set(trees.map((a) => a.t.type))).toEqual(
      new Set(['pine', 'round', 'oak'])
    );
  });

  it('detects a bird in a tree canopy and pushes it out', () => {
    for (const { x, z, t } of trees) {
      const y = t.height * 0.65 - BIRD_COLLISION_OFFSET_Y;
      expect(resolveObstacleCollision(x + 0.3, y, z, hit)).toBe(true);
      expect(hit.nx > 0 || isRoofHit(hit)).toBe(true);
      expect(resolveObstacleCollision(hit.x, hit.y, hit.z, hit)).toBe(false);
    }
  });

  it('meets a bird flying into the canopy side with a sideways normal', () => {
    for (const { x, z, t } of trees) {
      const y = t.height * 0.65 - BIRD_COLLISION_OFFSET_Y;
      let bx = x + 5;
      while (!resolveObstacleCollision(bx, y, z, hit)) bx -= 0.2;
      expect(bx).toBeGreaterThan(x + 0.5);
      expect(hit.nx).toBeGreaterThan(0.99);
      expect(isRoofHit(hit)).toBe(false);
    }
  });

  it('detects a bird flying low into a trunk', () => {
    for (const { x, z } of trees) {
      expect(resolveObstacleCollision(x - 0.4, 0.3, z, hit)).toBe(true);
      expect(hit.nx).toBeLessThan(0);
      expect(hit.ny).toBe(0);
    }
  });

  it('does not collide above the tree top', () => {
    for (const { x, z, t } of trees) {
      expect(resolveObstacleCollision(x, t.height + 0.6, z, hit)).toBe(false);
    }
  });

  it('follows the pine cone, clear beside its narrow tip', () => {
    for (const { x, z, t } of trees) {
      if (t.type !== 'pine') continue;
      const tipY = t.height * 0.9 - BIRD_COLLISION_OFFSET_Y;
      expect(resolveObstacleCollision(x + 1.2, tipY, z, hit)).toBe(false);
      const skirtY = t.height * 0.32 - BIRD_COLLISION_OFFSET_Y;
      expect(resolveObstacleCollision(x + 1.2, skirtY, z, hit)).toBe(true);
    }
  });
});

describe('open space', () => {
  const hit = createObstacleHit();

  it('leaves a point on the road between houses clear', () => {
    const data = generateChunkData(1, 0);
    expect(data.hasRoadZ).toBe(false);
    const x = CHUNK_SIZE + data.houses[1].x;
    expect(resolveObstacleCollision(x, 2, 0, hit)).toBe(false);
  });

  it('never collides at cruise altitude over the town', () => {
    for (let x = -300; x <= 300; x += 1.5) {
      for (let z = -300; z <= 300; z += 1.5) {
        if (resolveObstacleCollision(x, 9, z, hit)) {
          throw new Error(`hit at ${x}, ${z}`);
        }
      }
    }
  });
});

describe('reflectHeading', () => {
  it('turns a head-on approach around', () => {
    const r = reflectHeading(headingOf(0, 1), 0, -1);
    expect(Math.sin(r)).toBeCloseTo(0, 5);
    expect(Math.cos(r)).toBeCloseTo(-1, 5);
  });

  it('mirrors an oblique approach away from the wall', () => {
    const r = reflectHeading(headingOf(1, 1), -1, 0);
    expect(Math.sin(r)).toBeCloseTo(-Math.SQRT1_2, 5);
    expect(Math.cos(r)).toBeCloseTo(Math.SQRT1_2, 5);
  });

  it('keeps a heading that already points away from the surface', () => {
    expect(reflectHeading(0.3, 0, 1)).toBe(0.3);
  });

  it('stays continuous with a heading that has wound past a full turn', () => {
    const start = headingOf(0, 1) + 4 * Math.PI;
    const r = reflectHeading(start, -Math.SQRT1_2, -Math.SQRT1_2);
    expect(Math.abs(r - start)).toBeLessThanOrEqual(Math.PI);
  });
});

describe('isSafeFeederPosition', () => {
  // It picks its 3x3 chunk window with Math.floor while rendering centres
  // chunks with Math.round; the floor window still covers the nearest origin.
  it('rejects every house and tree position near chunk edges too', () => {
    for (let cx = -3; cx <= 3; cx++) {
      for (let cz = -3; cz <= 3; cz++) {
        const data = generateChunkData(cx, cz);
        const ox = cx * CHUNK_SIZE;
        const oz = cz * CHUNK_SIZE;
        for (const h of data.houses) {
          expect(isSafeFeederPosition(ox + h.x, oz + h.z)).toBe(false);
        }
        for (const t of data.trees) {
          expect(isSafeFeederPosition(ox + t.x, oz + t.z)).toBe(false);
        }
      }
    }
  });
});
