// TERRAIN COLLISION DETECTION

import {
  BIRD_COLLISION_OFFSET_Y,
  BIRD_COLLISION_RADIUS
} from '@/utils/constants';

import { CHUNK_SIZE } from './chunkConstants';
import { ChunkData, generateChunkData, TreeData } from './chunkGenerator';
import { cellIndex, HOUSE_BOUNDS, HouseBounds } from './houseBounds';

export function isSafeFeederPosition(wx: number, wz: number): boolean {
  const cx = Math.floor(wx / CHUNK_SIZE);
  const cz = Math.floor(wz / CHUNK_SIZE);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const chunkCx = cx + dx;
      const chunkCz = cz + dz;
      const data = generateChunkData(chunkCx, chunkCz);
      const ox = chunkCx * CHUNK_SIZE;
      const oz = chunkCz * CHUNK_SIZE;

      // HOUSE COLLISION (POSITIONS ARE CHUNK-LOCAL, ADD OFFSET)
      for (const h of data.houses) {
        const hx = ox + h.x;
        const hz = oz + h.z;
        const hw = (h.w + 8) / 2; // INCLUDES FENCE BUFFER
        const hd = (h.d + 10) / 2;
        if (Math.abs(wx - hx) < hw && Math.abs(wz - hz) < hd) {
          return false;
        }
      }

      // TREE COLLISION (~4 UNIT RADIUS FOR CANOPY)
      for (const t of data.trees) {
        const tx = ox + t.x;
        const tz = oz + t.z;
        const tdx = wx - tx;
        const tdz = wz - tz;
        if (tdx * tdx + tdz * tdz < 16) {
          return false;
        }
      }
    }
  }

  return true;
}

// BIRD VS HOUSES AND TREES

/** Chunk content sits around its origin (cx * CHUNK_SIZE), as SuburbanWorld renders it. */
export function chunkIndex(world: number): number {
  return Math.round(world / CHUNK_SIZE);
}

interface HouseObstacle {
  x: number;
  z: number;
  cos: number;
  sin: number;
  shape: HouseBounds;
}

interface TreeObstacle {
  x: number;
  z: number;
  /** Horizontal distance beyond which nothing of the tree can be touched. */
  reach: number;
  trunkRadius: number;
  trunkTop: number;
  pine: boolean;
  /** Pine: cone base height. Others: canopy centre height. */
  canopyY: number;
  /** Pine: cone apex height. Others: vertical canopy radius. */
  canopyTopOrRy: number;
  canopyRadius: number;
}

interface CachedChunk {
  data: ChunkData;
  houses: HouseObstacle[];
  trees: TreeObstacle[];
}

// Tree shapes as components/scene/terrain/Tree.tsx models them at its base
// height, before each instance stretches them. Canopy lobes are covered by
// one sphere, so the tree's random yaw does not matter.
const TREE_BASE_HEIGHT = 5;
const TRUNK_RADIUS = 0.15;
const TRUNK_TOP = 2.775;
const PINE_CONE_BASE = 1.375;
const PINE_CONE_TOP = 4.875;
const PINE_CONE_RADIUS = 1.4;
const CANOPY_SPHERES = {
  round: { y: 3.5, radius: 1.7 },
  oak: { y: 3.3, radius: 1.5 }
};

function treeObstacle(t: TreeData, ox: number, oz: number): TreeObstacle {
  const sy = t.height / TREE_BASE_HEIGHT;
  const sxz = 0.7 + 0.3 * sy;
  const base = {
    x: ox + t.x,
    z: oz + t.z,
    trunkRadius: TRUNK_RADIUS * sxz,
    trunkTop: TRUNK_TOP * sy
  };
  if (t.type === 'pine') {
    const canopyRadius = PINE_CONE_RADIUS * sxz;
    return {
      ...base,
      reach: canopyRadius + BIRD_COLLISION_RADIUS,
      pine: true,
      canopyY: PINE_CONE_BASE * sy,
      canopyTopOrRy: PINE_CONE_TOP * sy,
      canopyRadius
    };
  }
  const sphere = CANOPY_SPHERES[t.type];
  const canopyRadius = sphere.radius * sxz;
  return {
    ...base,
    reach: canopyRadius + BIRD_COLLISION_RADIUS,
    pine: false,
    canopyY: sphere.y * sy,
    canopyTopOrRy: sphere.radius * sy,
    canopyRadius
  };
}

function buildChunk(cx: number, cz: number): CachedChunk {
  const data = generateChunkData(cx, cz);
  const ox = cx * CHUNK_SIZE;
  const oz = cz * CHUNK_SIZE;
  return {
    data,
    houses: data.houses.map((h) => ({
      x: ox + h.x,
      z: oz + h.z,
      cos: Math.cos(h.rot),
      sin: Math.sin(h.rot),
      shape: HOUSE_BOUNDS[h.modelIndex % HOUSE_BOUNDS.length]
    })),
    trees: data.trees.map((t) => treeObstacle(t, ox, oz))
  };
}

// A run crosses a few hundred chunks at most; the cap only bounds memory.
const MAX_CACHED_CHUNKS = 512;
const chunkCache = new Map<number, CachedChunk>();

function cachedChunk(cx: number, cz: number): CachedChunk {
  // A numeric key keeps the per-frame lookup free of string allocations.
  const key = (cx + 1e6) * 2e6 + (cz + 1e6);
  let chunk = chunkCache.get(key);
  if (!chunk) {
    if (chunkCache.size >= MAX_CACHED_CHUNKS) chunkCache.clear();
    chunk = buildChunk(cx, cz);
    chunkCache.set(key, chunk);
  }
  return chunk;
}

/** generateChunkData, memoised; it is deterministic per chunk. */
export function getChunkData(cx: number, cz: number): ChunkData {
  return cachedChunk(cx, cz).data;
}

/** Where the bird ends up after being pushed out, and the surface it hit. */
export interface ObstacleHit {
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
}

export function createObstacleHit(): ObstacleHit {
  return { x: 0, y: 0, z: 0, nx: 0, ny: 0, nz: 0 };
}

/** A roof or canopy top: the bird bounces up and keeps its heading. */
export function isRoofHit(hit: ObstacleHit): boolean {
  return hit.ny > 0.7;
}

// Pushes clear the surface by this much, so the next query does not touch it.
const PUSH_MARGIN = 1e-3;

// Collision sphere centre and the deepest contact so far, reused every frame.
const probe = { x: 0, y: 0, z: 0, depth: 0, nx: 0, ny: 0, nz: 0 };
// The probe in the frame of the house being tested.
const local = { x: 0, y: 0, z: 0 };
// Normal of the last column contact, in the house frame.
const contact = { nx: 0, ny: 0, nz: 0 };

function record(depth: number, nx: number, ny: number, nz: number) {
  if (depth <= probe.depth) return;
  probe.depth = depth;
  probe.nx = nx;
  probe.ny = ny;
  probe.nz = nz;
}

/**
 * Sphere against one column of a house (house frame). A centre that got
 * inside leaves upward or through the nearest side of the whole footprint,
 * since a column's inner sides face its neighbours, not open air.
 */
function collideColumn(
  b: HouseBounds,
  x0: number,
  x1: number,
  z0: number,
  z1: number,
  height: number,
  r: number
): number {
  const qx = Math.min(x1, Math.max(x0, local.x));
  const qy = Math.min(height, local.y);
  const qz = Math.min(z1, Math.max(z0, local.z));
  let nx = local.x - qx;
  let ny = local.y - qy;
  let nz = local.z - qz;
  const dist = Math.sqrt(nx * nx + ny * ny + nz * nz);

  if (dist > 1e-6) {
    nx /= dist;
    ny /= dist;
    nz /= dist;
    local.x = qx + nx * (r + PUSH_MARGIN);
    local.y = qy + ny * (r + PUSH_MARGIN);
    local.z = qz + nz * (r + PUSH_MARGIN);
    contact.nx = nx;
    contact.ny = ny;
    contact.nz = nz;
    return r - dist;
  }

  let gap = height - local.y;
  contact.nx = 0;
  contact.ny = 1;
  contact.nz = 0;
  if (local.x - b.minX < gap) {
    gap = local.x - b.minX;
    contact.nx = -1;
    contact.ny = 0;
  }
  if (b.maxX - local.x < gap) {
    gap = b.maxX - local.x;
    contact.nx = 1;
    contact.ny = 0;
  }
  if (local.z - b.minZ < gap) {
    gap = local.z - b.minZ;
    contact.nx = 0;
    contact.ny = 0;
    contact.nz = -1;
  }
  if (b.maxZ - local.z < gap) {
    gap = b.maxZ - local.z;
    contact.nx = 0;
    contact.ny = 0;
    contact.nz = 1;
  }
  const push = gap + r + PUSH_MARGIN;
  local.x += contact.nx * push;
  local.y += contact.ny * push;
  local.z += contact.nz * push;
  return gap + r;
}

/** Distance from the probe centre to a column; 0 when the centre is inside. */
function columnDistance(
  x0: number,
  x1: number,
  z0: number,
  z1: number,
  height: number
): number {
  const ex = local.x - Math.min(x1, Math.max(x0, local.x));
  const ey = local.y - Math.min(height, local.y);
  const ez = local.z - Math.min(z1, Math.max(z0, local.z));
  return Math.sqrt(ex * ex + ey * ey + ez * ez);
}

const MAX_COLUMN_PASSES = 4;

/**
 * Sphere against the house columns it reaches; the floor is not a face.
 * Resolves the nearest column first, so the seam between two equal columns
 * never acts as an edge: clearing the nearer one clears its neighbour too.
 */
function collideHouse(h: HouseObstacle, r: number) {
  const b = h.shape;
  const dx = probe.x - h.x;
  const dz = probe.z - h.z;
  local.x = dx * h.cos - dz * h.sin;
  local.y = probe.y;
  local.z = dx * h.sin + dz * h.cos;
  if (
    local.x <= b.minX - r ||
    local.x >= b.maxX + r ||
    local.z <= b.minZ - r ||
    local.z >= b.maxZ + r ||
    local.y >= b.top + r
  ) {
    return;
  }

  const cw = (b.maxX - b.minX) / b.cells;
  const cd = (b.maxZ - b.minZ) / b.cells;
  let moved = false;
  for (let pass = 0; pass < MAX_COLUMN_PASSES; pass++) {
    const i0 = cellIndex(local.x - r, b.minX, b.maxX, b.cells);
    const i1 = cellIndex(local.x + r, b.minX, b.maxX, b.cells);
    const j0 = cellIndex(local.z - r, b.minZ, b.maxZ, b.cells);
    const j1 = cellIndex(local.z + r, b.minZ, b.maxZ, b.cells);
    let best = -1;
    let bestDist = r;
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const height = b.heights[j * b.cells + i];
        if (height <= 0 || local.y - r >= height) continue;
        const x0 = b.minX + i * cw;
        const z0 = b.minZ + j * cd;
        const d = columnDistance(x0, x0 + cw, z0, z0 + cd, height);
        if (d < bestDist) {
          bestDist = d;
          best = j * b.cells + i;
        }
      }
    }
    if (best < 0) break;

    const i = best % b.cells;
    const j = (best - i) / b.cells;
    const x0 = b.minX + i * cw;
    const z0 = b.minZ + j * cd;
    const depth = collideColumn(
      b,
      x0,
      x0 + cw,
      z0,
      z0 + cd,
      b.heights[best],
      r
    );
    moved = true;
    record(
      depth,
      contact.nx * h.cos + contact.nz * h.sin,
      contact.ny,
      -contact.nx * h.sin + contact.nz * h.cos
    );
  }
  if (!moved) return;
  probe.x = h.x + local.x * h.cos + local.z * h.sin;
  probe.y = local.y;
  probe.z = h.z - local.x * h.sin + local.z * h.cos;
}

/** Pushes the probe out sideways, or up when the top is the nearer way out. */
function pushOutOfTree(
  t: TreeObstacle,
  h: number,
  dx: number,
  dz: number,
  sideDepth: number,
  upDepth: number
) {
  if (upDepth < sideDepth) {
    probe.y += upDepth + PUSH_MARGIN;
    record(upDepth, 0, 1, 0);
    return;
  }
  const ux = h > 1e-6 ? dx / h : 1;
  const uz = h > 1e-6 ? dz / h : 0;
  const to = h + sideDepth + PUSH_MARGIN;
  probe.x = t.x + ux * to;
  probe.z = t.z + uz * to;
  record(sideDepth, ux, 0, uz);
}

function collideCanopy(t: TreeObstacle, r: number, dx: number, dz: number) {
  const h = Math.sqrt(dx * dx + dz * dz);
  const y = probe.y;
  if (t.pine) {
    const base = t.canopyY - r;
    const apex = t.canopyTopOrRy;
    if (y <= base || y >= apex + r) return;
    const k = t.canopyRadius / (apex - t.canopyY);
    const radiusAt = (apex - Math.min(apex, Math.max(t.canopyY, y))) * k + r;
    if (h >= radiusAt) return;
    // Height at which the widened cone is only as wide as h.
    const surfaceY = h > r ? apex - (h - r) / k : apex + r;
    pushOutOfTree(t, h, dx, dz, radiusAt - h, surfaceY - y);
    return;
  }
  const a = t.canopyRadius + r;
  const b = t.canopyTopOrRy + r;
  const dy = y - t.canopyY;
  const q = (h * h) / (a * a) + (dy * dy) / (b * b);
  if (q >= 1) return;
  const sideDepth = a * Math.sqrt(1 - (dy * dy) / (b * b)) - h;
  const upDepth = b * Math.sqrt(Math.max(0, 1 - (h * h) / (a * a))) - dy;
  pushOutOfTree(t, h, dx, dz, sideDepth, upDepth);
}

function collideTree(t: TreeObstacle, r: number) {
  const dx = probe.x - t.x;
  const dz = probe.z - t.z;
  const h2 = dx * dx + dz * dz;
  if (h2 >= t.reach * t.reach) return;

  const trunkReach = t.trunkRadius + r;
  if (probe.y < t.trunkTop && h2 < trunkReach * trunkReach) {
    const h = Math.sqrt(h2);
    pushOutOfTree(t, h, dx, dz, trunkReach - h, Infinity);
    return;
  }
  collideCanopy(t, r, dx, dz);
}

/**
 * Tests the bird at (x, y, z) against the houses and trees of its chunk and
 * the eight around it. On contact, writes the pushed-out bird position and
 * the normal of the deepest surface into `out` and returns true.
 */
export function resolveObstacleCollision(
  x: number,
  y: number,
  z: number,
  out: ObstacleHit
): boolean {
  const r = BIRD_COLLISION_RADIUS;
  probe.x = x;
  probe.y = y + BIRD_COLLISION_OFFSET_Y;
  probe.z = z;
  probe.depth = 0;

  const cx = chunkIndex(x);
  const cz = chunkIndex(z);
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const chunk = cachedChunk(cx + i, cz + j);
      for (const h of chunk.houses) collideHouse(h, r);
      for (const t of chunk.trees) collideTree(t, r);
    }
  }

  if (probe.depth <= 0) return false;
  out.x = probe.x;
  out.y = probe.y - BIRD_COLLISION_OFFSET_Y;
  out.z = probe.z;
  out.nx = probe.nx;
  out.ny = probe.ny;
  out.nz = probe.nz;
  return true;
}

/**
 * Mirrors a heading (radians, forward = (sin, cos)) off a vertical surface
 * with horizontal normal (nx, nz), keeping it continuous with the old value.
 */
export function reflectHeading(
  rotation: number,
  nx: number,
  nz: number
): number {
  const len = Math.sqrt(nx * nx + nz * nz);
  if (len < 1e-6) return rotation;
  const ux = nx / len;
  const uz = nz / len;
  const fx = Math.sin(rotation);
  const fz = Math.cos(rotation);
  const into = fx * ux + fz * uz;
  if (into >= 0) return rotation;
  const turn =
    Math.atan2(fx - 2 * into * ux, fz - 2 * into * uz) - Math.atan2(fx, fz);
  const wrapped = Math.atan2(Math.sin(turn), Math.cos(turn));
  return rotation + wrapped;
}
