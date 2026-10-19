export const CHUNK_SIZE = 45;
export const RENDER_DISTANCE = 3;
// Chunks within this ring of the bird get grass and cast shadows.
export const DETAIL_DISTANCE = 1;
// Chunks within this ring get grass, so it reaches past the detail ring.
export const GRASS_DISTANCE = 2;
export const HOUSES_PER_CHUNK = 3;
export const TREES_PER_CHUNK = 5;
/** Half-width of a road with its sidewalks, from the road's centre line. */
export const STREET_HALF_WIDTH = 3.4;

export const HOUSE_MODELS = [
  '/models/houses/House.glb',
  '/models/houses/House-7VSVwAg2T3.glb',
  '/models/houses/Two story house.glb',
  '/models/houses/Two story house-sGgL4Nt7I7.glb',
  '/models/houses/Two story house-htvFgnVP4d.glb',
  '/models/houses/Two story house-hmXhiLDf8D.glb',
  '/models/houses/Two story house-QsF9E0PqyN.glb',
  '/models/houses/Two story house-9N6ROCbmO1.glb'
];

// Per-house roof and wall tints. The generator draws one random number per
// pick whatever the list length, so changing these never moves anything.
export const ROOF_COLORS = [
  '#7b8591',
  '#64676e',
  '#8f6c55',
  '#bf6f53',
  '#9c9083',
  '#76887d'
];
export const WALL_COLORS = [
  '#eeebe4',
  '#e6dbbf',
  '#e8d79e',
  '#a9b596',
  '#a9bdcc',
  '#a2583f',
  '#cbc2b2',
  '#d99a80'
];
export const FENCE_COLORS = ['#F0E8D8', '#E8DFC8', '#D4C8B0', '#C8BCA8'];
