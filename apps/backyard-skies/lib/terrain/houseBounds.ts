/** The uniform scale components/scene/terrain/House.tsx draws every house model at. */
export const HOUSE_SCALE = 6.3;

/**
 * A house model in its own frame, already scaled: its footprint, split into
 * a grid of columns that each rise from the ground to the highest point of
 * the model over that cell (0 where nothing stands, as in an L-shaped plan).
 */
export interface HouseBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  top: number;
  cells: number;
  /** Row-major: rows run from minZ to maxZ, columns from minX to maxX. */
  heights: Float64Array;
}

const GRID_CELLS = 8;

// Sampled from the GLB triangles in HOUSE_MODELS order, in model units and
// rounded up, so every gable, lean-to and porch roof sits inside its column.
// box is [minX, maxX, minZ, maxZ].
const MODEL_SHAPES: ReadonlyArray<{
  box: readonly [number, number, number, number];
  heights: ReadonlyArray<readonly number[]>;
}> = [
  {
    box: [-0.65, 0.65, -0.458, 0.458],
    heights: [
      [0.49, 0.49, 0.49, 0.69, 0.69, 0.49, 0.49, 0.49],
      [0.58, 0.58, 0.58, 0.69, 0.69, 0.58, 0.58, 0.58],
      [0.67, 0.67, 0.67, 0.69, 0.69, 0.67, 0.67, 0.67],
      [0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
      [0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
      [0.67, 0.67, 0.67, 0.67, 0.67, 0.66, 0.66, 0.66],
      [0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58],
      [0.49, 0.49, 0.49, 0.49, 0.49, 0.49, 0.49, 0.49]
    ]
  },
  {
    box: [-0.654, 0.654, -0.654, 0.654],
    heights: [
      [0, 0, 0.48, 0.6, 0.72, 0.75, 0.65, 0.53],
      [0, 0, 0.48, 0.6, 0.72, 0.75, 0.65, 0.53],
      [0.63, 0.69, 0.63, 0.6, 0.72, 0.75, 0.65, 0.53],
      [0.63, 0.69, 0.63, 0.61, 0.72, 0.75, 0.65, 0.53],
      [0.73, 0.73, 0.73, 0.73, 0.73, 0.75, 0.65, 0.53],
      [0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.65, 0.53],
      [0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.53],
      [0.53, 0.53, 0.53, 0.53, 0.53, 0.53, 0.53, 0.53]
    ]
  },
  {
    box: [-0.65, 0.65, -0.6581, 0.6581],
    heights: [
      [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      [0.91, 0.91, 0.91, 1.09, 1.09, 0.91, 0.91, 0.91],
      [1.03, 1.03, 1.03, 1.09, 1.09, 1.03, 1.03, 1.03],
      [1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15],
      [1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15],
      [1.03, 1.03, 1.03, 1.09, 1.09, 1.03, 1.03, 1.03],
      [0.9, 0.91, 0.91, 1.09, 1.09, 0.91, 0.91, 0.91],
      [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    ]
  },
  {
    box: [-0.65, 0.65, -0.5029, 0.5029],
    heights: [
      [0.84, 0.84, 0.83, 1.09, 1.09, 0.83, 0.84, 0.84],
      [0.93, 0.93, 0.93, 1.09, 1.09, 0.93, 0.93, 0.93],
      [1.02, 1.02, 1.02, 1.09, 1.09, 1.02, 1.02, 1.02],
      [1.12, 1.12, 1.12, 1.12, 1.12, 1.12, 1.12, 1.12],
      [1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15],
      [1.09, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09],
      [0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99],
      [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9]
    ]
  },
  {
    box: [-0.8682, 0.8682, -0.5029, 0.5029],
    heights: [
      [0.49, 0.83, 0.84, 0.83, 1.09, 1.06, 0.84, 0.84],
      [0.49, 0.93, 0.93, 0.93, 1.09, 1.06, 0.93, 0.93],
      [0.49, 1.02, 1.02, 1.02, 1.09, 1.06, 1.02, 1.02],
      [0.49, 1.12, 1.12, 1.12, 1.12, 1.12, 1.12, 1.21],
      [0.49, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.21],
      [0.49, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09],
      [0.49, 0.99, 0.99, 0.99, 1, 1, 0.99, 0.99],
      [0.49, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9]
    ]
  },
  {
    box: [-0.654, 0.654, -0.7029, 0.7029],
    heights: [
      [0, 0, 0.88, 1, 1.12, 1.15, 1.05, 0.93],
      [0, 0, 0.88, 1, 1.12, 1.15, 1.05, 0.93],
      [1.03, 1.09, 1.03, 1, 1.12, 1.15, 1.05, 0.93],
      [1.03, 1.09, 1.03, 1, 1.12, 1.15, 1.05, 0.93],
      [1.1, 1.1, 1.1, 1.1, 1.12, 1.15, 1.05, 0.93],
      [1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.05, 0.93],
      [1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.05, 0.93],
      [0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.93]
    ]
  },
  {
    box: [-0.4521, 0.4521, -0.45, 0.45],
    heights: [
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87],
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87],
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87],
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87],
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87],
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87],
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87],
      [1.16, 1.12, 1.08, 1.03, 1, 0.95, 0.91, 0.87]
    ]
  },
  {
    box: [-0.854, 0.854, -0.458, 0.458],
    heights: [
      [0.49, 0.49, 0.69, 0.85, 1.02, 1.15, 1.13, 0.99],
      [0.58, 0.58, 0.69, 0.85, 1.02, 1.15, 1.13, 0.99],
      [0.67, 0.67, 0.69, 0.85, 1.02, 1.15, 1.13, 0.99],
      [0.75, 0.75, 0.75, 0.85, 1.02, 1.15, 1.13, 0.99],
      [0.75, 0.75, 0.75, 0.85, 1.02, 1.15, 1.13, 0.99],
      [0.67, 0.66, 0.66, 0.85, 1.02, 1.15, 1.13, 0.99],
      [0.58, 0.58, 0.58, 0.85, 1.02, 1.15, 1.13, 0.99],
      [0.49, 0.49, 0.49, 0.85, 1.02, 1.15, 1.13, 0.99]
    ]
  }
];

export const HOUSE_BOUNDS: readonly HouseBounds[] = MODEL_SHAPES.map(
  ({ box: [minX, maxX, minZ, maxZ], heights }) => {
    const flat = Float64Array.from(heights.flat(), (y) => y * HOUSE_SCALE);
    return {
      minX: minX * HOUSE_SCALE,
      maxX: maxX * HOUSE_SCALE,
      minZ: minZ * HOUSE_SCALE,
      maxZ: maxZ * HOUSE_SCALE,
      top: Math.max(...flat),
      cells: GRID_CELLS,
      heights: flat
    };
  }
);

/** Column index of a house-frame coordinate, clamped to the grid. */
export function cellIndex(v: number, min: number, max: number, cells: number) {
  return Math.min(
    cells - 1,
    Math.max(0, Math.floor(((v - min) / (max - min)) * cells))
  );
}

/** Height of the house column under a point in the house frame; 0 off the footprint. */
export function roofHeightAt(b: HouseBounds, lx: number, lz: number): number {
  if (lx < b.minX || lx > b.maxX || lz < b.minZ || lz > b.maxZ) return 0;
  const i = cellIndex(lx, b.minX, b.maxX, b.cells);
  const j = cellIndex(lz, b.minZ, b.maxZ, b.cells);
  return b.heights[j * b.cells + i];
}
