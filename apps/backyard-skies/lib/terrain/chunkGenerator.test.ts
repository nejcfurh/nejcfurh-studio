import { describe, expect, it } from 'vitest';

import { STREET_HALF_WIDTH } from './chunkConstants';
import { generateChunkData, isInsideHouse } from './chunkGenerator';

const chunks = Array.from({ length: 21 * 21 }, (_, i) => ({
  cx: (i % 21) - 10,
  cz: Math.floor(i / 21) - 10
}));

describe('generateChunkData', () => {
  it('is deterministic for a chunk', () => {
    expect(generateChunkData(3, -7)).toEqual(generateChunkData(3, -7));
  });

  it('never plants a tree inside or against a house', () => {
    for (const { cx, cz } of chunks) {
      const data = generateChunkData(cx, cz);
      for (const t of data.trees) {
        expect(data.houses.some((h) => isInsideHouse(h, t.x, t.z, 1))).toBe(
          false
        );
      }
    }
  });

  it('keeps trees off the street', () => {
    for (const { cx, cz } of chunks) {
      const data = generateChunkData(cx, cz);
      for (const t of data.trees) {
        expect(Math.abs(t.z)).toBeGreaterThan(STREET_HALF_WIDTH);
        if (data.hasRoadZ) {
          expect(Math.abs(t.x)).toBeGreaterThan(STREET_HALF_WIDTH);
        }
      }
    }
  });

  it('keeps garden beds off the street', () => {
    for (const { cx, cz } of chunks) {
      const data = generateChunkData(cx, cz);
      for (const g of data.gardenBeds) {
        expect(Math.abs(g.z) - 0.45).toBeGreaterThanOrEqual(STREET_HALF_WIDTH);
        if (data.hasRoadZ) {
          expect(Math.abs(g.x) - g.w / 2).toBeGreaterThanOrEqual(
            STREET_HALF_WIDTH
          );
        }
      }
    }
  });

  it('still leaves most chunks with trees', () => {
    const withTrees = chunks.filter(
      ({ cx, cz }) => generateChunkData(cx, cz).trees.length > 0
    ).length;
    expect(withTrees / chunks.length).toBeGreaterThan(0.8);
  });
});

describe('isInsideHouse', () => {
  it('detects a point at the centre of a house and rejects one far away', () => {
    const house = generateChunkData(1, 0).houses[0];
    expect(isInsideHouse(house, house.x, house.z, 0)).toBe(true);
    expect(isInsideHouse(house, house.x + 30, house.z, 0)).toBe(false);
  });
});
