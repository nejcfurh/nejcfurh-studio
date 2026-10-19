// TERRAIN COLLISION DETECTION

import {
  BIRD_COLLISION_OFFSET_Y,
  BIRD_COLLISION_RADIUS
} from '@/utils/constants';

import { CHUNK_SIZE, STREET_HALF_WIDTH } from './chunkConstants';
import { ChunkData, generateChunkData, TreeData } from './chunkGenerator';
import { cellIndex, HOUSE_BOUNDS, HouseBounds } from './houseBounds';
import { houseProps, propObstacles } from './houseProps';

// A feeder's base disc reaches ~0.6 from its pole; keep a little air beyond it.
const FEEDER_CLEARANCE = 1.5;

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

      for (const p of cachedChunk(chunkCx, chunkCz).props) {
        local.x = (wx - p.x) * p.cos - (wz - p.z) * p.sin;
        local.z = (wx - p.x) * p.sin + (wz - p.z) * p.cos;
        if (
          Math.abs(local.x) < p.halfX + FEEDER_CLEARANCE &&
          Math.abs(local.z) < p.halfZ + FEEDER_CLEARANCE
        ) {
          return false;
        }
      }
    }
  }

  return !isOnStreet(wx, wz, FEEDER_CLEARANCE);
}

/** Whether a point is on a road or sidewalk, or within `margin` of one. */
function isOnStreet(wx: number, wz: number, margin: number): boolean {
  const cx = chunkIndex(wx);
  const cz = chunkIndex(wz);
  const data = cachedChunk(cx, cz).data;
  if (Math.abs(wz - cz * CHUNK_SIZE) < STREET_HALF_WIDTH + margin) return true;
  return (
    data.hasRoadZ && Math.abs(wx - cx * CHUNK_SIZE) < STREET_HALF_WIDTH + margin
  );
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

interface TreeCone {
  baseY: number;
  apexY: number;
  radius: number;
}

interface TreeCrown {
  y: number;
  /** Horizontal radius. */
  rx: number;
  /** Vertical radius. */
  ry: number;
}

interface TreeObstacle {
  x: number;
  z: number;
  /** Horizontal distance beyond which nothing of the tree can be touched. */
  reach: number;
  trunkRadius: number;
  trunkTop: number;
  /** Pine tiers, bottom first; empty for broadleaf trees. */
  cones: TreeCone[];
  crown: TreeCrown | null;
}

/** A solid house prop (car, hedge, bin, mailbox) as an oriented box. */
interface PropBox {
  x: number;
  z: number;
  cos: number;
  sin: number;
  halfX: number;
  halfZ: number;
  bottom: number;
  top: number;
}

interface CachedChunk {
  data: ChunkData;
  houses: HouseObstacle[];
  trees: TreeObstacle[];
  props: PropBox[];
}

// Tree shapes as components/scene/terrain/treeGeometry.ts models them at its
// base height, before each instance stretches them: one entry per variant.
// Pine tiers are cones with their drooping rim tips as the base. A broadleaf
// crown is a rounded box (a superellipsoid, see collideCrown) around the
// trunk, fitted to its lobes, so the tree's random yaw does not matter.
const TREE_BASE_HEIGHT = 5;

interface TreeShape {
  trunkRadius: number;
  trunkTop: number;
  cones: TreeCone[];
  crown: TreeCrown | null;
}

const cone = (baseY: number, apexY: number, radius: number): TreeCone => ({
  baseY,
  apexY,
  radius
});

const TREE_SHAPES: Record<TreeData['type'], TreeShape[]> = {
  pine: [
    {
      trunkRadius: 0.15,
      trunkTop: 2.2,
      cones: [
        cone(0.9, 3.4, 1.45),
        cone(1.84, 4.0, 1.15),
        cone(2.73, 4.5, 0.85),
        cone(3.57, 4.95, 0.5)
      ],
      crown: null
    },
    {
      trunkRadius: 0.13,
      trunkTop: 2.0,
      cones: [
        cone(0.62, 2.8, 1.15),
        cone(1.66, 3.6, 0.95),
        cone(2.7, 4.4, 0.7),
        cone(3.64, 5.05, 0.42)
      ],
      crown: null
    },
    {
      trunkRadius: 0.17,
      trunkTop: 2.3,
      cones: [
        cone(0.95, 3.55, 1.55),
        cone(1.85, 4.05, 1.25),
        cone(2.7, 4.45, 0.95),
        cone(3.62, 4.95, 0.58)
      ],
      crown: null
    }
  ],
  round: [
    {
      trunkRadius: 0.16,
      trunkTop: 3.3,
      cones: [],
      crown: { y: 3.52, rx: 1.73, ry: 1.24 }
    },
    {
      trunkRadius: 0.11,
      trunkTop: 4.3,
      cones: [],
      crown: { y: 3.51, rx: 1.12, ry: 1.34 }
    },
    {
      trunkRadius: 0.18,
      trunkTop: 3.0,
      cones: [],
      crown: { y: 3.28, rx: 2.0, ry: 1.24 }
    }
  ],
  oak: [
    {
      trunkRadius: 0.2,
      trunkTop: 2.9,
      cones: [],
      crown: { y: 3.25, rx: 2.06, ry: 1.1 }
    },
    {
      trunkRadius: 0.17,
      trunkTop: 3.0,
      cones: [],
      crown: { y: 3.45, rx: 1.98, ry: 1.26 }
    },
    {
      trunkRadius: 0.24,
      trunkTop: 2.6,
      cones: [],
      crown: { y: 3.04, rx: 2.22, ry: 1.02 }
    }
  ]
};

/**
 * Which of its type's shapes the tree at a world position has. Tree.tsx draws
 * the same one, so it must stay a pure function of the position.
 */
export function treeVariant(x: number, z: number): number {
  const h = Math.abs(Math.sin(x * 37.719 + z * 17.137) * 24634.6345) % 1;
  return Math.min(2, Math.floor(h * 3));
}

function treeObstacle(t: TreeData, ox: number, oz: number): TreeObstacle {
  const x = ox + t.x;
  const z = oz + t.z;
  const sy = t.height / TREE_BASE_HEIGHT;
  const sxz = 0.7 + 0.3 * sy;
  const shape = TREE_SHAPES[t.type][treeVariant(x, z)];
  const cones = shape.cones.map((c) => ({
    baseY: c.baseY * sy,
    apexY: c.apexY * sy,
    radius: c.radius * sxz
  }));
  const crown = shape.crown && {
    y: shape.crown.y * sy,
    rx: shape.crown.rx * sxz,
    ry: shape.crown.ry * sy
  };
  const widest = Math.max(crown?.rx ?? 0, ...cones.map((c) => c.radius));
  return {
    x,
    z,
    reach: widest + BIRD_COLLISION_RADIUS,
    trunkRadius: shape.trunkRadius * sxz,
    trunkTop: shape.trunkTop * sy,
    cones,
    crown
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
    trees: data.trees.map((t) => treeObstacle(t, ox, oz)),
    props: propObstacles(houseProps(data, cx, cz)).map((p) => ({
      x: p.x,
      z: p.z,
      cos: Math.cos(p.rot),
      sin: Math.sin(p.rot),
      halfX: p.halfX,
      halfZ: p.halfZ,
      bottom: p.bottom,
      top: p.top
    }))
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

function collideCone(t: TreeObstacle, c: TreeCone, r: number) {
  const y = probe.y;
  if (y <= c.baseY - r || y >= c.apexY + r) return;
  const dx = probe.x - t.x;
  const dz = probe.z - t.z;
  const h = Math.sqrt(dx * dx + dz * dz);
  const k = c.radius / (c.apexY - c.baseY);
  const radiusAt = (c.apexY - Math.min(c.apexY, Math.max(c.baseY, y))) * k + r;
  if (h >= radiusAt) return;
  // Height at which the widened cone is only as wide as h.
  const surfaceY = h > r ? c.apexY - (h - r) / k : c.apexY + r;
  pushOutOfTree(t, h, dx, dz, radiusAt - h, surfaceY - y);
}

// The crown is (h / rx)^3 + (|dy| / ry)^3 < 1: flatter on top and fuller at the
// sides than an ellipsoid, like a cluster of lobes. The bird's sphere is added
// by sampling across it, so the grown shape stays rounded at the rim instead
// of reaching out where nothing is drawn.
const SPHERE_SAMPLES = [-1, -0.6, 0, 0.6, 1].map((s) => ({
  s,
  w: Math.sqrt(1 - s * s)
}));

/** Crown radius at a height dy above its centre, or -Infinity outside it. */
function crownRadius(c: TreeCrown, dy: number) {
  const v = Math.abs(dy) / c.ry;
  return v >= 1 ? -Infinity : c.rx * (1 - v ** 3) ** (1 / 3);
}

/** Crown half-height at a distance h from the trunk, or -Infinity outside. */
function crownHalfHeight(c: TreeCrown, h: number) {
  const u = Math.abs(h) / c.rx;
  return u >= 1 ? -Infinity : c.ry * (1 - u ** 3) ** (1 / 3);
}

function collideCrown(t: TreeObstacle, c: TreeCrown, r: number) {
  const dx = probe.x - t.x;
  const dz = probe.z - t.z;
  const h = Math.sqrt(dx * dx + dz * dz);
  const dy = probe.y - c.y;
  let side = -Infinity;
  let half = -Infinity;
  for (const { s, w } of SPHERE_SAMPLES) {
    side = Math.max(side, crownRadius(c, dy + s * r) + w * r);
    half = Math.max(half, crownHalfHeight(c, h + s * r) + w * r);
  }
  if (h >= side || Math.abs(dy) >= half) return;
  pushOutOfTree(t, h, dx, dz, side - h, half - dy);
}

function collideTrunk(t: TreeObstacle, r: number) {
  if (probe.y >= t.trunkTop) return;
  const dx = probe.x - t.x;
  const dz = probe.z - t.z;
  const h = Math.sqrt(dx * dx + dz * dz);
  const reach = t.trunkRadius + r;
  if (h < reach) pushOutOfTree(t, h, dx, dz, reach - h, Infinity);
}

// Parts overlap (a trunk inside its crown, stacked pine tiers), so a push out
// of one can land in another; a few passes settle it.
const MAX_TREE_PASSES = 3;

function collideTree(t: TreeObstacle, r: number) {
  const dx = probe.x - t.x;
  const dz = probe.z - t.z;
  if (dx * dx + dz * dz >= t.reach * t.reach) return;

  for (let pass = 0; pass < MAX_TREE_PASSES; pass++) {
    const { x, y, z } = probe;
    collideTrunk(t, r);
    for (const c of t.cones) collideCone(t, c, r);
    if (t.crown) collideCrown(t, t.crown, r);
    if (probe.x === x && probe.y === y && probe.z === z) return;
  }
}

/** Sphere against an oriented prop box; a centre inside leaves by the nearest face. */
function collideProp(p: PropBox, r: number) {
  const dx = probe.x - p.x;
  const dz = probe.z - p.z;
  local.x = dx * p.cos - dz * p.sin;
  local.y = probe.y;
  local.z = dx * p.sin + dz * p.cos;
  if (
    Math.abs(local.x) >= p.halfX + r ||
    Math.abs(local.z) >= p.halfZ + r ||
    local.y >= p.top + r ||
    local.y <= p.bottom - r
  ) {
    return;
  }

  const qx = Math.min(p.halfX, Math.max(-p.halfX, local.x));
  const qy = Math.min(p.top, Math.max(p.bottom, local.y));
  const qz = Math.min(p.halfZ, Math.max(-p.halfZ, local.z));
  let nx = local.x - qx;
  let ny = local.y - qy;
  let nz = local.z - qz;
  const dist = Math.sqrt(nx * nx + ny * ny + nz * nz);
  let depth: number;
  if (dist > 1e-6) {
    if (dist >= r) return;
    nx /= dist;
    ny /= dist;
    nz /= dist;
    depth = r - dist;
  } else {
    // Inside: take the face with the least way out (never down into the ground).
    const up = p.top - local.y;
    const sideX = p.halfX - Math.abs(local.x);
    const sideZ = p.halfZ - Math.abs(local.z);
    nx = 0;
    ny = 0;
    nz = 0;
    if (up <= sideX && up <= sideZ) {
      ny = 1;
      depth = up + r;
    } else if (sideX <= sideZ) {
      nx = Math.sign(local.x) || 1;
      depth = sideX + r;
    } else {
      nz = Math.sign(local.z) || 1;
      depth = sideZ + r;
    }
  }

  const push = depth + PUSH_MARGIN;
  local.x += nx * push;
  local.y += ny * push;
  local.z += nz * push;
  record(depth, nx * p.cos + nz * p.sin, ny, -nx * p.sin + nz * p.cos);
  probe.x = p.x + local.x * p.cos + local.z * p.sin;
  probe.y = local.y;
  probe.z = p.z - local.x * p.sin + local.z * p.cos;
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
      for (const p of chunk.props) collideProp(p, r);
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
