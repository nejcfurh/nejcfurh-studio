import { CHUNK_SIZE, STREET_HALF_WIDTH } from './chunkConstants';
import { ChunkData, generateChunkData, HouseData } from './chunkGenerator';
import { HOUSE_BOUNDS } from './houseBounds';

/** The instanced layer that draws a prop. */
export type HousePropLayer = 'box' | 'shrub' | 'car';

export type HousePropPart =
  | 'walkway'
  | 'porch'
  | 'mailboxPost'
  | 'mailbox'
  | 'driveway'
  | 'car'
  | 'bin'
  | 'hedge'
  | 'shrub';

/**
 * One placed prop, a box in its own frame: centred on (x, z), standing on
 * `y`, `sx` wide, `sy` tall and `sz` deep before it is turned by `rot`.
 */
export interface HouseProp {
  part: HousePropPart;
  layer: HousePropLayer;
  /** World position of the centre of the prop's base. */
  x: number;
  y: number;
  z: number;
  /** Rotation about Y in the three.js sense, as HouseData.rot. */
  rot: number;
  sx: number;
  sy: number;
  sz: number;
  /** sRGB hex; the layer multiplies it into the prop's own shading. */
  color: string;
}

/**
 * An oriented box the bird can hit, in world space. Its frame follows the
 * house convention: a world point is local
 * (dx * cos(rot) - dz * sin(rot), dx * sin(rot) + dz * cos(rot))
 * with dx, dz measured from (x, z), and the box spans
 * [-halfX, halfX] x [bottom, top] x [-halfZ, halfZ] there.
 */
export interface PropObstacle {
  x: number;
  z: number;
  halfX: number;
  halfZ: number;
  rot: number;
  bottom: number;
  top: number;
}

const LAYER: Record<HousePropPart, HousePropLayer> = {
  walkway: 'box',
  porch: 'box',
  mailboxPost: 'box',
  mailbox: 'box',
  driveway: 'box',
  car: 'car',
  bin: 'box',
  hedge: 'box',
  shrub: 'shrub'
};

/** Parts the bird can fly into; the rest lie flat on the lawn. */
const SOLID: Record<HousePropPart, boolean> = {
  walkway: false,
  porch: false,
  mailboxPost: true,
  mailbox: true,
  driveway: false,
  car: true,
  bin: true,
  hedge: true,
  shrub: true
};

/** Parts that join their own house, so they may run under its eaves. */
export const ATTACHED_PARTS: ReadonlySet<HousePropPart> = new Set([
  'walkway',
  'porch'
]);

export function isSolidPart(part: HousePropPart): boolean {
  return SOLID[part];
}

const PAVED_PARTS: ReadonlySet<HousePropPart> = new Set([
  'driveway',
  'walkway',
  'porch'
]);

/**
 * Whether world (x, z) lies on a driveway, walkway or porch from
 * `houseProps`, within `margin`: where lawn grass should not grow.
 */
export function isPaved(
  props: readonly HouseProp[],
  x: number,
  z: number,
  margin = 0
): boolean {
  return props.some((p) => {
    if (!PAVED_PARTS.has(p.part)) return false;
    const dx = x - p.x;
    const dz = z - p.z;
    const c = Math.cos(p.rot);
    const s = Math.sin(p.rot);
    return (
      Math.abs(dx * c - dz * s) < p.sx / 2 + margin &&
      Math.abs(dx * s + dz * c) < p.sz / 2 + margin
    );
  });
}

// Front door of each model in HOUSE_MODELS order, house frame (front is +z):
// door centre x and the z of the wall it sits in, from the GLB door meshes.
const FRONT_DOORS: ReadonlyArray<readonly [number, number]> = [
  [-2.52, 2.39],
  [-0.03, 3.63],
  [0, 3.65],
  [0, 2.68],
  [1.06, 2.68],
  [-0.03, 3.94],
  [1.23, 2.39],
  [-3.81, 2.39]
];

const DOOR_COLORS = [
  '#8e2f2b',
  '#2f4a6b',
  '#3c5a40',
  '#d1a645',
  '#f2efe6',
  '#2b2b2e',
  '#6b4a33',
  '#5f7f8c'
];
const CAR_COLORS = [
  '#e9e9e6',
  '#b9bcc0',
  '#2a2b2e',
  '#a8262a',
  '#27406b',
  '#3f5a46',
  '#d8cdb0',
  '#6e7378'
];
const DRIVEWAY_COLORS = ['#7b7c7f', '#b7b1a3', '#a49d90'];
const WALKWAY_COLOR = '#cfc8b6';
const PORCH_COLORS = ['#b9b3a6', '#a7684f', '#8d8a85'];
const MAILBOX_COLORS = ['#2b2b2e', '#f0eee8', '#2f4a6b', '#8e2f2b'];
const POST_COLORS = ['#f0eee8', '#6b4a33'];
const BIN_COLORS = ['#3c6b45', '#2f4f7a', '#4a4c50'];
const HEDGE_COLORS = ['#3f7a3a', '#467f3e', '#356e35'];
const SHRUB_COLORS = ['#4f8a3c', '#3b7a40', '#6b8f3a', '#5a7f4a'];

// Prop sizes in metres.
const DRIVEWAY_WIDTH = 3;
const DRIVEWAY_MIN_LENGTH = 6.6;
const WALKWAY_WIDTH = 1.1;
const PORCH_WIDTH = 2;
const PORCH_DEPTH = 1.2;
const CAR_SIZE = { sx: 1.8, sy: 1.45, sz: 4.3 };
const HEDGE_DEPTH = 0.75;
// Gap between a prop and the house wall, fence or the next prop.
const GAP = 0.35;
// Solid props stand this far back from the sidewalk; paving runs up to it.
const CURB_GAP = 0.3;
// Tree trunks are thin; this also keeps a car from sitting under a trunk.
const TRUNK_CLEARANCE = 0.45;

/** Integer hash of a world position, so it never depends on the chunk RNG. */
function positionHash(x: number, z: number): number {
  let h =
    Math.imul(Math.round(x * 100) | 0, 0x27d4eb2d) ^
    Math.imul(Math.round(z * 100) | 0, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

/** mulberry32: a small PRNG stream seeded from a house's world position. */
function houseRandom(x: number, z: number): () => number {
  let a = positionHash(x, z);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(list: readonly T[], r: number): T {
  return list[Math.min(list.length - 1, Math.floor(r * list.length))];
}

/** Front door colour of a house at world (wx, wz). */
export function doorColor(wx: number, wz: number): string {
  return pick(DOOR_COLORS, houseRandom(wx + 0.5, wz - 0.5)());
}

interface Rect {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/** Chunk-local bounds of a prop's footprint. */
function propRect(p: HouseProp, ox: number, oz: number): Rect {
  const c = Math.abs(Math.cos(p.rot));
  const s = Math.abs(Math.sin(p.rot));
  const hx = (c * p.sx + s * p.sz) / 2;
  const hz = (s * p.sx + c * p.sz) / 2;
  return {
    minX: p.x - ox - hx,
    maxX: p.x - ox + hx,
    minZ: p.z - oz - hz,
    maxZ: p.z - oz + hz
  };
}

/** Chunk-local bounds of a house footprint (houses turn by 0 or π). */
function houseRect(h: HouseData, dx: number): Rect {
  const b = HOUSE_BOUNDS[h.modelIndex % HOUSE_BOUNDS.length];
  const c = Math.cos(h.rot);
  const s = Math.sin(h.rot);
  const xs: number[] = [];
  const zs: number[] = [];
  for (const lx of [b.minX, b.maxX]) {
    for (const lz of [b.minZ, b.maxZ]) {
      xs.push(h.x + dx + lx * c + lz * s);
      zs.push(h.z - lx * s + lz * c);
    }
  }
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs)
  };
}

function overlaps(a: Rect, b: Rect, margin = 0): boolean {
  return (
    a.minX < b.maxX + margin &&
    a.maxX > b.minX - margin &&
    a.minZ < b.maxZ + margin &&
    a.maxZ > b.minZ - margin
  );
}

/** Whether a chunk-local footprint reaches a street (road and sidewalks). */
function rectOnStreet(r: Rect, hasRoadX: boolean, hasRoadZ: boolean): boolean {
  const limit = STREET_HALF_WIDTH - 1e-6;
  const crossesZ = r.minZ < limit && r.maxZ > -limit;
  const crossesX = r.minX < limit && r.maxX > -limit;
  return (hasRoadX && crossesZ) || (hasRoadZ && crossesX);
}

interface Obstruction {
  houses: { rect: Rect; owner: number }[];
  trees: { x: number; z: number }[];
  ground: Rect[];
}

/** Everything already standing in and next to the chunk, chunk-local. */
function obstructions(chunk: ChunkData, cx: number, cz: number): Obstruction {
  const houses = chunk.houses.map((h, i) => ({
    rect: houseRect(h, 0),
    owner: i
  }));
  for (const side of [-1, 1]) {
    // Houses near a chunk edge reach a few metres into the next chunk.
    for (const h of generateChunkData(cx + side, cz).houses) {
      houses.push({ rect: houseRect(h, side * CHUNK_SIZE), owner: -1 });
    }
  }
  const ground: Rect[] = [];
  for (const g of chunk.gardenBeds) {
    const c = Math.abs(Math.cos(g.rot));
    const s = Math.abs(Math.sin(g.rot));
    const hx = (c * g.w + s * 0.9) / 2;
    const hz = (s * g.w + c * 0.9) / 2;
    ground.push({
      minX: g.x - hx,
      maxX: g.x + hx,
      minZ: g.z - hz,
      maxZ: g.z + hz
    });
  }
  for (const h of chunk.houses) {
    if (!h.hasPatio) continue;
    // Patio.tsx: a (w + 1) x 2.5 slab 3.5 behind the house.
    const px = h.x - 3.5 * Math.sin(h.rot);
    const pz = h.z - 3.5 * Math.cos(h.rot);
    const hx = (h.w + 1) / 2;
    ground.push({
      minX: px - hx,
      maxX: px + hx,
      minZ: pz - 1.25,
      maxZ: pz + 1.25
    });
  }
  return {
    houses,
    trees: chunk.trees.map((t) => ({ x: t.x, z: t.z })),
    ground
  };
}

/**
 * Props for one house, in the house frame: x across the front, z towards the
 * street, y up. Converted to world space by the caller.
 */
interface LocalProp {
  part: HousePropPart;
  lx: number;
  lz: number;
  y: number;
  /** Extra turn on top of the house's own. */
  turn: number;
  sx: number;
  sy: number;
  sz: number;
  color: string;
}

/**
 * Props accepted or dropped together, e.g. a car and its driveway. Of the
 * features sharing an `exclusive` group only the first that fits is kept, and
 * a feature that `requires` another is kept only alongside it.
 */
interface Feature {
  props: LocalProp[];
  id?: string;
  exclusive?: string;
  requires?: string;
}

function boxProp(
  part: HousePropPart,
  color: string,
  lx: number,
  lz: number,
  size: { sx: number; sy: number; sz: number },
  y = 0,
  turn = 0
): LocalProp {
  return { part, lx, lz, y, turn, color, ...size };
}

/** A strip along z from z0 to z1 (z0 < z1) centred on x. */
function stripZ(
  part: HousePropPart,
  color: string,
  x: number,
  z0: number,
  z1: number,
  width: number,
  height: number
): LocalProp {
  return boxProp(part, color, x, (z0 + z1) / 2, {
    sx: width,
    sy: height,
    sz: z1 - z0
  });
}

/**
 * The features a house could have, most important first. Every random choice
 * is drawn up front in a fixed order, so dropping one feature never changes
 * another.
 */
function houseFeatures(
  h: HouseData,
  wx: number,
  wz: number,
  hasRoadZ: boolean
): Feature[] {
  const rand = houseRandom(wx, wz);
  const r = Array.from({ length: 24 }, () => rand());
  const b = HOUSE_BOUNDS[h.modelIndex % HOUSE_BOUNDS.length];
  const [doorX, doorZ] = FRONT_DOORS[h.modelIndex % FRONT_DOORS.length];
  // The street runs along the front, |h.z| ahead of the house centre;
  // `sidewalk` is where its sidewalk begins, `curb` where solid props stop.
  const sidewalk = Math.abs(h.z) - STREET_HALF_WIDTH;
  const curb = sidewalk - CURB_GAP;
  const fenceX = (h.w + 4) / 2;
  const fenceZ = (h.d + 6) / 2;
  const sideExtent = (side: number) => (side > 0 ? b.maxX : -b.minX);
  const features: Feature[] = [];

  // Driveway beside the house, outside the yard fence. At a junction it goes
  // on the side away from the crossing road. A house turned by π has its
  // local +x pointing to world -x.
  const localXToWorld = Math.cos(h.rot) > 0 ? 1 : -1;
  const towardCentre = (h.x >= 0 ? -1 : 1) * localXToWorld;
  const driveSide = hasRoadZ
    ? -towardCentre
    : r[0] < 0.5
      ? -towardCentre
      : towardCentre;

  [driveSide, -driveSide].forEach((side, k) => {
    const x =
      side * (Math.max(fenceX, sideExtent(side)) + GAP + DRIVEWAY_WIDTH / 2);
    const z0 = Math.min(b.maxZ - 4.5, sidewalk - DRIVEWAY_MIN_LENGTH);
    const props = [
      stripZ(
        'driveway',
        pick(DRIVEWAY_COLORS, r[5]),
        x,
        z0,
        sidewalk,
        DRIVEWAY_WIDTH,
        0.04
      )
    ];
    if (r[6] < 0.75) {
      const carZ = curb - 0.6 - CAR_SIZE.sz / 2 - r[7] * 1.2;
      props.push(
        boxProp(
          'car',
          pick(CAR_COLORS, r[8]),
          x + (r[9] - 0.5) * 0.3,
          carZ,
          CAR_SIZE,
          0,
          r[10] < 0.5 ? 0 : Math.PI
        )
      );
    }
    const id = `driveway${k}`;
    features.push({ props, id, exclusive: 'driveway' });

    // Wheelie bins at the street end, on the house side of the driveway.
    if (r[11] < 0.4) {
      const binX = x - side * (DRIVEWAY_WIDTH / 2 + 0.45);
      const count = r[12] < 0.5 ? 1 : 2;
      const bins = Array.from({ length: count }, (_, i) =>
        boxProp(
          'bin',
          pick(BIN_COLORS, r[13 + i]),
          binX,
          curb - 0.35 - i * 0.75,
          {
            sx: 0.6,
            sy: 1.05,
            sz: 0.65
          }
        )
      );
      features.push({ props: bins, requires: id });
    }
  });

  if (sidewalk - doorZ > PORCH_DEPTH + 0.6) {
    const porch = boxProp(
      'porch',
      pick(PORCH_COLORS, r[1]),
      doorX,
      doorZ + PORCH_DEPTH / 2 - 0.05,
      { sx: PORCH_WIDTH, sy: 0.12, sz: PORCH_DEPTH }
    );
    const walkway = stripZ(
      'walkway',
      WALKWAY_COLOR,
      doorX,
      doorZ + PORCH_DEPTH - 0.05,
      sidewalk,
      WALKWAY_WIDTH,
      0.05
    );
    features.push({ props: [porch, walkway] });

    const mx = doorX + (r[2] < 0.5 ? -1.3 : 1.3);
    const mz = curb - 0.25;
    features.push({
      props: [
        boxProp('mailboxPost', pick(POST_COLORS, r[3]), mx, mz, {
          sx: 0.1,
          sy: 1.0,
          sz: 0.1
        }),
        boxProp(
          'mailbox',
          pick(MAILBOX_COLORS, r[4]),
          mx,
          mz,
          { sx: 0.26, sy: 0.26, sz: 0.5 },
          1.0
        )
      ]
    });
  }

  // Hedge along the yard edge on the other side of the house.
  if (r[15] < 0.55) {
    const side = -driveSide;
    const x = side * (Math.max(fenceX, sideExtent(side) + GAP) + 0.1);
    const z1 = Math.min(curb, fenceZ);
    const z0 = Math.max(b.minZ - 1, -fenceZ + 0.4);
    if (z1 - z0 > 2) {
      features.push({
        props: [
          stripZ(
            'hedge',
            pick(HEDGE_COLORS, r[16]),
            x,
            z0,
            z1,
            HEDGE_DEPTH,
            0.95 + r[17] * 0.4
          )
        ]
      });
    }
  }

  // Shrubs along the front wall, just outside the eaves, clear of the door.
  const shrubCount = 2 + Math.floor(r[18] * 3);
  const span = b.maxX - b.minX - 1.4;
  for (let i = 0; i < shrubCount; i++) {
    const size = 0.75 + ((r[19] * (i + 3)) % 1) * 0.45;
    const lx = b.minX + 0.7 + (span * (i + 0.5)) / shrubCount;
    if (Math.abs(lx - doorX) < PORCH_WIDTH / 2 + size / 2 + 0.1) continue;
    const lz = b.maxZ + size / 2 + 0.05;
    features.push({
      props: [
        boxProp('shrub', pick(SHRUB_COLORS, (r[20] + i * 0.37) % 1), lx, lz, {
          sx: size,
          sy: size * (0.8 + ((r[21] * (i + 5)) % 1) * 0.3),
          sz: size
        })
      ]
    });
  }

  // A shrub or two in the back corners of the yard.
  for (const [k, side] of [
    [22, -1],
    [23, 1]
  ] as const) {
    if (r[k] > 0.45) continue;
    const size = 0.9 + r[k] * 1.2;
    features.push({
      props: [
        boxProp(
          'shrub',
          pick(SHRUB_COLORS, r[k] * 2),
          side * (fenceX - 0.9),
          -fenceZ + 0.9,
          { sx: size, sy: size, sz: size }
        )
      ]
    });
  }

  return features;
}

function toWorld(
  p: LocalProp,
  h: HouseData,
  ox: number,
  oz: number
): HouseProp {
  const c = Math.cos(h.rot);
  const s = Math.sin(h.rot);
  return {
    part: p.part,
    layer: LAYER[p.part],
    x: ox + h.x + p.lx * c + p.lz * s,
    y: p.y,
    z: oz + h.z - p.lx * s + p.lz * c,
    rot: h.rot + p.turn,
    sx: p.sx,
    sy: p.sy,
    sz: p.sz,
    color: p.color
  };
}

function trunkInRect(t: { x: number; z: number }, r: Rect): boolean {
  return (
    t.x > r.minX - TRUNK_CLEARANCE &&
    t.x < r.maxX + TRUNK_CLEARANCE &&
    t.z > r.minZ - TRUNK_CLEARANCE &&
    t.z < r.maxZ + TRUNK_CLEARANCE
  );
}

/**
 * Every yard prop of one chunk in world space: driveways, cars, porches,
 * walkways, mailboxes, bins, hedges and shrubs. Deterministic per chunk and
 * independent of the chunk RNG: choices come from a hash of each house's
 * world position. Nothing lands on a street, in a house (porches and
 * walkways may run under their own house's eaves), on a tree trunk, garden
 * bed, patio or another prop, or outside the chunk, so props of neighbouring
 * chunks never meet. Too slow for a frame loop: cache it per chunk.
 */
export function houseProps(
  chunk: ChunkData,
  cx: number,
  cz: number
): HouseProp[] {
  const ox = cx * CHUNK_SIZE;
  const oz = cz * CHUNK_SIZE;
  const half = CHUNK_SIZE / 2;
  const blocked = obstructions(chunk, cx, cz);
  const taken: Rect[] = [];
  const out: HouseProp[] = [];

  const fits = (p: HouseProp, r: Rect, owner: number) => {
    if (r.minX < -half || r.maxX > half) return false;
    if (rectOnStreet(r, chunk.hasRoadX, chunk.hasRoadZ)) return false;
    const attached = ATTACHED_PARTS.has(p.part);
    if (
      blocked.houses.some(
        (b) => !(attached && b.owner === owner) && overlaps(r, b.rect)
      )
    ) {
      return false;
    }
    if (blocked.trees.some((t) => trunkInRect(t, r))) return false;
    if (blocked.ground.some((g) => overlaps(r, g))) return false;
    return !taken.some((t) => overlaps(r, t, 0.1));
  };

  chunk.houses.forEach((h, owner) => {
    const kept = new Set<string>();
    for (const feature of houseFeatures(
      h,
      ox + h.x,
      oz + h.z,
      chunk.hasRoadZ
    )) {
      if (feature.exclusive && kept.has(feature.exclusive)) continue;
      if (feature.requires && !kept.has(feature.requires)) continue;
      const props = feature.props.map((p) => toWorld(p, h, ox, oz));
      const rects = props.map((p) => propRect(p, ox, oz));
      if (!props.every((p, i) => fits(p, rects[i], owner))) continue;
      if (feature.id) kept.add(feature.id);
      if (feature.exclusive) kept.add(feature.exclusive);
      taken.push(...rects);
      out.push(...props);
    }
  });
  return out;
}

/** An oriented box for every prop the bird can hit, from `houseProps`. */
export function propObstacles(props: readonly HouseProp[]): PropObstacle[] {
  return props
    .filter((p) => SOLID[p.part])
    .map((p) => ({
      x: p.x,
      z: p.z,
      halfX: p.sx / 2,
      halfZ: p.sz / 2,
      rot: p.rot,
      bottom: p.y,
      top: p.y + p.sy
    }));
}
