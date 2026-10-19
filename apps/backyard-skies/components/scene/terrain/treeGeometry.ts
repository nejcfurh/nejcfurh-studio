import { TreeData } from '@/lib/terrain/chunkGenerator';
import * as THREE from 'three';

export type TreeType = TreeData['type'];
/** Near trees get the full shape; far ones a cheaper copy of the same silhouette. */
export type TreeDetail = 'near' | 'far';

/** Geometry is modelled at this height; instances stretch it to their own. */
export const TREE_BASE_HEIGHT = 5;

type Vec3 = [number, number, number];

interface TrunkSpec {
  top: number;
  radius: number;
  topRadius: number;
  /** Radius multiplier where the trunk meets the ground. */
  flare: number;
  color: string;
  /** Pale bark with dark flecks. */
  birch?: boolean;
}

interface StubSpec {
  from: Vec3;
  to: Vec3;
  radius: number;
}

interface LobeSpec {
  at: Vec3;
  radius: Vec3;
  detail: 0 | 1;
  color: string;
}

/** One layer of a pine: a cone whose rim alternates between tips and notches. */
export interface TierSpec {
  baseY: number;
  height: number;
  radius: number;
  /** How far the rim tips hang below baseY. */
  droop: number;
  color: string;
}

export interface TreeSpec {
  trunk: TrunkSpec;
  stubs: StubSpec[];
  lobes: LobeSpec[];
  tiers: TierSpec[];
}

/** Lobes placed evenly around the trunk axis, so the canopy stays round from every yaw. */
function ring(
  count: number,
  distance: number,
  heights: number[],
  radius: number,
  colors: string[],
  phase = 0
): LobeSpec[] {
  return heights.slice(0, count).map((y, i) => {
    const a = phase + (i / count) * Math.PI * 2;
    const r = radius * (0.9 + 0.2 * ((i * 7) % 3) * 0.5);
    return {
      at: [Math.cos(a) * distance, y, Math.sin(a) * distance],
      radius: [r, r * 0.9, r],
      detail: 0,
      color: colors[i % colors.length]
    };
  });
}

// Tiers stay steeper than about 0.6 (radius over height plus droop): the
// bird then meets a pine's side as a wall, not as a roof it bounces up off.
function tier(
  baseY: number,
  height: number,
  radius: number,
  droop: number,
  color: string
): TierSpec {
  return { baseY, height, radius, droop, color };
}

/**
 * Every variant of a type has the same parts in the same order, so all three
 * share one vertex layout and an instance picks its shape in the vertex shader.
 */
export const TREE_SPECS: Record<TreeType, TreeSpec[]> = {
  pine: [
    {
      trunk: {
        top: 2.2,
        radius: 0.15,
        topRadius: 0.08,
        flare: 1.7,
        color: '#5a3a22'
      },
      stubs: [],
      lobes: [],
      tiers: [
        tier(1.1, 2.3, 1.45, 0.2, '#24603a'),
        tier(2.0, 2.0, 1.15, 0.16, '#296b3c'),
        tier(2.85, 1.65, 0.85, 0.12, '#2f7640'),
        tier(3.65, 1.3, 0.5, 0.08, '#378446')
      ]
    },
    {
      // Spruce: narrow, blue-green, skirts close to the ground.
      trunk: {
        top: 2.0,
        radius: 0.13,
        topRadius: 0.07,
        flare: 1.6,
        color: '#4f3422'
      },
      stubs: [],
      lobes: [],
      tiers: [
        tier(0.8, 2.0, 1.15, 0.18, '#235946'),
        tier(1.8, 1.8, 0.95, 0.14, '#27634b'),
        tier(2.8, 1.6, 0.7, 0.1, '#2c6d50'),
        tier(3.7, 1.35, 0.42, 0.06, '#347a57')
      ]
    },
    {
      // Layered pine: wider tiers with heavier drooping tips.
      trunk: {
        top: 2.3,
        radius: 0.17,
        topRadius: 0.09,
        flare: 1.8,
        color: '#5e3c24'
      },
      stubs: [],
      lobes: [],
      tiers: [
        tier(1.2, 2.35, 1.55, 0.25, '#2b6933'),
        tier(2.05, 2.0, 1.25, 0.2, '#307438'),
        tier(2.85, 1.6, 0.95, 0.15, '#367f3d'),
        tier(3.7, 1.25, 0.58, 0.08, '#3e8a44')
      ]
    }
  ],
  round: [
    {
      trunk: {
        top: 3.3,
        radius: 0.16,
        topRadius: 0.09,
        flare: 1.6,
        color: '#6b4428'
      },
      stubs: [
        { from: [0, 2.3, 0], to: [0.85, 3.0, 0.25], radius: 0.07 },
        { from: [0, 2.6, 0], to: [-0.6, 3.25, -0.55], radius: 0.06 }
      ],
      lobes: [
        {
          at: [0, 3.55, 0],
          radius: [1.45, 1.3, 1.45],
          detail: 1,
          color: '#3b8b49'
        },
        ...ring(4, 0.95, [3.15, 3.7, 3.3, 3.9], 0.85, ['#46994f', '#3f9049'])
      ],
      tiers: []
    },
    {
      // Birch: slim pale trunk, narrow airy canopy.
      trunk: {
        top: 4.3,
        radius: 0.11,
        topRadius: 0.05,
        flare: 1.4,
        color: '#e6e1d4',
        birch: true
      },
      stubs: [
        { from: [0, 2.3, 0], to: [0.55, 2.95, 0.1], radius: 0.04 },
        { from: [0, 2.7, 0], to: [-0.45, 3.35, -0.25], radius: 0.04 }
      ],
      lobes: [
        {
          at: [0, 3.6, 0],
          radius: [0.88, 1.3, 0.88],
          detail: 1,
          color: '#6aa84f'
        },
        ...ring(
          4,
          0.5,
          [2.75, 3.3, 2.9, 4.25],
          0.58,
          ['#7cb85a', '#5e9e48'],
          0.4
        )
      ],
      tiers: []
    },
    {
      // Linden: broad round crown on a short trunk.
      trunk: {
        top: 3.0,
        radius: 0.18,
        topRadius: 0.1,
        flare: 1.7,
        color: '#634026'
      },
      stubs: [
        { from: [0, 2.1, 0], to: [1.0, 2.75, 0.3], radius: 0.08 },
        { from: [0, 2.3, 0], to: [-0.8, 2.95, -0.6], radius: 0.07 }
      ],
      lobes: [
        {
          at: [0, 3.35, 0],
          radius: [1.6, 1.25, 1.6],
          detail: 1,
          color: '#36843f'
        },
        ...ring(
          4,
          1.2,
          [2.95, 3.55, 3.05, 3.7],
          0.85,
          ['#3f8f47', '#2f7a3b'],
          0.7
        )
      ],
      tiers: []
    }
  ],
  oak: [
    {
      trunk: {
        top: 2.9,
        radius: 0.2,
        topRadius: 0.12,
        flare: 1.8,
        color: '#5e3d24'
      },
      stubs: [
        { from: [0, 2.0, 0], to: [1.05, 2.65, 0.2], radius: 0.09 },
        { from: [0, 2.2, 0], to: [-0.7, 2.8, 0.75], radius: 0.08 },
        { from: [0, 2.4, 0], to: [-0.3, 3.0, -0.95], radius: 0.07 }
      ],
      lobes: [
        {
          at: [0, 3.3, 0],
          radius: [1.5, 1.05, 1.5],
          detail: 1,
          color: '#4a9452'
        },
        ...ring(5, 1.2, [2.95, 3.55, 3.1, 3.75, 3.3], 0.85, [
          '#56a35c',
          '#428a49',
          '#4d9a55'
        ])
      ],
      tiers: []
    },
    {
      // Maple: tall dome, warmer green.
      trunk: {
        top: 3.0,
        radius: 0.17,
        topRadius: 0.1,
        flare: 1.7,
        color: '#5b3b25'
      },
      stubs: [
        { from: [0, 2.2, 0], to: [0.95, 2.95, -0.2], radius: 0.08 },
        { from: [0, 2.4, 0], to: [-0.85, 3.05, 0.45], radius: 0.07 },
        { from: [0, 2.6, 0], to: [0.1, 3.2, 0.95], radius: 0.06 }
      ],
      lobes: [
        {
          at: [0, 3.5, 0],
          radius: [1.55, 1.3, 1.55],
          detail: 1,
          color: '#5c9e3b'
        },
        ...ring(
          5,
          1.15,
          [3.1, 3.75, 3.25, 3.95, 3.4],
          0.85,
          ['#6aab45', '#558f35', '#64a440'],
          0.5
        )
      ],
      tiers: []
    },
    {
      // Old oak: thick trunk, low wide crown.
      trunk: {
        top: 2.6,
        radius: 0.24,
        topRadius: 0.14,
        flare: 2.0,
        color: '#533622'
      },
      stubs: [
        { from: [0, 1.8, 0], to: [1.2, 2.45, 0.3], radius: 0.11 },
        { from: [0, 2.0, 0], to: [-0.9, 2.55, 0.85], radius: 0.1 },
        { from: [0, 2.15, 0], to: [-0.4, 2.7, -1.1], radius: 0.09 }
      ],
      lobes: [
        {
          at: [0, 3.05, 0],
          radius: [1.55, 0.95, 1.55],
          detail: 1,
          color: '#3f8646'
        },
        ...ring(
          5,
          1.35,
          [2.7, 3.2, 2.85, 3.35, 3.0],
          0.85,
          ['#4b9550', '#38793f', '#448d4a'],
          0.9
        )
      ],
      tiers: []
    }
  ]
};

/** Deterministic per-part random numbers, so a rebuild bakes the same colours. */
function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Buffers {
  position: number[];
  color: number[];
}

/** A variant's triangles, with where its trunk ends and its foliage starts. */
interface TreeBuffers extends Buffers {
  trunkEnd: number;
  foliageStart: number;
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _n = new THREE.Vector3();
const _color = new THREE.Color();

function pushTri(
  out: Buffers,
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
  color: THREE.Color
) {
  out.position.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 0; i < 3; i++) out.color.push(color.r, color.g, color.b);
}

function faceNormal(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
  return _n.subVectors(c, b).cross(_c.subVectors(a, b)).normalize();
}

const SUN_TINT = new THREE.Color('#fff2b0');
const SHADE_TINT = new THREE.Color('#1d3b2c');

/**
 * Foliage face colour: sunlit tops lighter and warmer, undersides darker and
 * cooler, lower faces darker still, each face nudged a little at random.
 */
function foliageColor(
  base: THREE.Color,
  normalY: number,
  heightFraction: number,
  jitter: number
) {
  _color.copy(base);
  const up = normalY * 0.5 + 0.5;
  if (up > 0.6) _color.lerp(SUN_TINT, (up - 0.6) * 0.45);
  else _color.lerp(SHADE_TINT, (0.6 - up) * 0.75);
  return _color.multiplyScalar(
    (0.82 + 0.25 * heightFraction) * (0.94 + jitter * 0.12)
  );
}

function addTrunk(
  out: Buffers,
  t: TrunkSpec,
  detail: TreeDetail,
  random: () => number
) {
  const sides = detail === 'near' ? 6 : 4;
  const rings =
    detail === 'near'
      ? [
          { y: -0.05, r: t.radius * t.flare },
          { y: 0.35, r: t.radius * 1.05 },
          { y: t.top, r: t.topRadius }
        ]
      : [
          { y: -0.05, r: t.radius * 1.2 },
          { y: t.top, r: t.topRadius }
        ];
  const base = new THREE.Color(t.color);
  const fleck = new THREE.Color('#3a3631');
  const point = (
    ring: { y: number; r: number },
    i: number,
    v: THREE.Vector3
  ) => {
    const a = (i / sides) * Math.PI * 2 + 0.3;
    return v.set(Math.cos(a) * ring.r, ring.y, Math.sin(a) * ring.r);
  };
  for (let k = 0; k < rings.length - 1; k++) {
    const lo = rings[k];
    const hi = rings[k + 1];
    for (let i = 0; i < sides; i++) {
      // Darker towards the ground: cheap contact shadow at the root.
      const ao = k === 0 && rings.length > 2 ? 0.62 : 0.9;
      const c = new THREE.Color()
        .copy(base)
        .multiplyScalar(ao + random() * 0.12);
      if (t.birch && random() < 0.35) c.copy(fleck);
      point(lo, i, _a);
      point(lo, i + 1, _b);
      point(hi, i + 1, _c);
      pushTri(out, _a, _c, _b, c);
      const d = point(hi, i, new THREE.Vector3());
      pushTri(out, _a, d, _c, c);
    }
  }
}

function addStub(out: Buffers, s: StubSpec, color: THREE.Color) {
  const from = new THREE.Vector3(...s.from);
  const to = new THREE.Vector3(...s.to);
  const axis = new THREE.Vector3().subVectors(to, from).normalize();
  const side = new THREE.Vector3(0, 1, 0).cross(axis).normalize();
  const up = new THREE.Vector3().crossVectors(axis, side);
  const ringAt = (centre: THREE.Vector3, r: number) =>
    [0, 1, 2].map((i) => {
      const a = (i / 3) * Math.PI * 2;
      return centre
        .clone()
        .addScaledVector(side, Math.cos(a) * r)
        .addScaledVector(up, Math.sin(a) * r);
    });
  const a = ringAt(from, s.radius);
  const b = ringAt(to, s.radius * 0.45);
  for (let i = 0; i < 3; i++) {
    const j = (i + 1) % 3;
    pushTri(out, a[i], b[j], a[j], color);
    pushTri(out, a[i], b[i], b[j], color);
  }
}

/** Smooth bumps that depend only on the direction, so shared corners stay shared. */
function bump(v: THREE.Vector3, seed: number) {
  return (
    Math.sin(v.x * 3.1 + seed) *
      Math.sin(v.y * 2.7 + seed * 1.7) *
      Math.sin(v.z * 3.3 + seed * 0.6) *
      0.6 +
    Math.sin((v.x + v.z) * 5.3 + seed * 2.3) * 0.4
  );
}

function addLobe(
  out: Buffers,
  lobe: LobeSpec,
  detail: TreeDetail,
  seed: number,
  canopy: { bottom: number; top: number },
  random: () => number
) {
  const ico = new THREE.IcosahedronGeometry(
    1,
    detail === 'near' ? lobe.detail : 0
  );
  const pos = ico.getAttribute('position');
  const amount = detail === 'near' && lobe.detail === 1 ? 0.13 : 0.08;
  const verts: THREE.Vector3[] = [];
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
    const k = 1 + amount * bump(v, seed);
    verts.push(
      new THREE.Vector3(
        lobe.at[0] + v.x * lobe.radius[0] * k,
        lobe.at[1] + v.y * lobe.radius[1] * k,
        lobe.at[2] + v.z * lobe.radius[2] * k
      )
    );
  }
  ico.dispose();
  const base = new THREE.Color(lobe.color);
  for (let i = 0; i < verts.length; i += 3) {
    const [a, b, c] = [verts[i], verts[i + 1], verts[i + 2]];
    const n = faceNormal(a, b, c);
    const y = (a.y + b.y + c.y) / 3;
    const h = THREE.MathUtils.clamp(
      (y - canopy.bottom) / (canopy.top - canopy.bottom),
      0,
      1
    );
    pushTri(out, a, b, c, foliageColor(base, n.y, h, random()));
  }
}

function addTier(
  out: Buffers,
  tier: TierSpec,
  detail: TreeDetail,
  canopy: { bottom: number; top: number },
  random: () => number
) {
  const sides = detail === 'near' ? 8 : 6;
  const apex = new THREE.Vector3(0, tier.baseY + tier.height, 0);
  const hub = new THREE.Vector3(0, tier.baseY + tier.height * 0.22, 0);
  const rim: THREE.Vector3[] = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + tier.baseY;
    const tip = i % 2 === 0;
    const r = tier.radius * (tip ? 1 : 0.8);
    rim.push(
      new THREE.Vector3(
        Math.cos(a) * r,
        tier.baseY - (tip ? tier.droop : 0),
        Math.sin(a) * r
      )
    );
  }
  const base = new THREE.Color(tier.color);
  for (let i = 0; i < sides; i++) {
    const a = rim[i];
    const b = rim[(i + 1) % sides];
    const n = faceNormal(apex, b, a);
    const h = THREE.MathUtils.clamp(
      (tier.baseY - canopy.bottom) / (canopy.top - canopy.bottom),
      0,
      1
    );
    pushTri(out, apex, b, a, foliageColor(base, n.y, h, random()));
    // Underside: a shallow hollow in deep shade.
    pushTri(out, hub, a, b, _color.copy(base).lerp(SHADE_TINT, 0.55));
  }
}

/** Triangles of one variant, in a fixed order shared by every variant of the type. */
export function buildTreeVariant(
  spec: TreeSpec,
  detail: TreeDetail,
  seed: number
): TreeBuffers {
  const out: Buffers = { position: [], color: [] };
  const random = rng(seed * 7919 + (detail === 'near' ? 1 : 2));
  addTrunk(out, spec.trunk, detail, random);
  const trunkEnd = out.position.length;
  if (detail === 'near') {
    const bark = new THREE.Color(spec.trunk.color).multiplyScalar(0.85);
    for (const s of spec.stubs)
      addStub(out, s, spec.trunk.birch ? new THREE.Color('#d9d3c4') : bark);
  }
  const ys = [
    ...spec.lobes.flatMap((l) => [
      l.at[1] - l.radius[1],
      l.at[1] + l.radius[1]
    ]),
    ...spec.tiers.flatMap((t) => [t.baseY - t.droop, t.baseY + t.height])
  ];
  const canopy = { bottom: Math.min(...ys), top: Math.max(...ys) };
  const foliageStart = out.position.length;
  spec.lobes.forEach((lobe, i) =>
    addLobe(out, lobe, detail, seed * 13 + i * 3.7, canopy, random)
  );
  for (const tier of spec.tiers) addTier(out, tier, detail, canopy, random);
  return { ...out, trunkEnd, foliageStart };
}

function normalsOf(position: number[]) {
  const normals = new Float32Array(position.length);
  for (let i = 0; i < position.length; i += 9) {
    _a.fromArray(position, i);
    _b.fromArray(position, i + 3);
    _c.fromArray(position, i + 6);
    const n = faceNormal(_a, _b, _c);
    for (let k = 0; k < 3; k++) n.toArray(normals, i + k * 3);
  }
  return normals;
}

/**
 * One geometry holding every variant of a tree type: position/normal/color
 * are variant 0, aPos1/aNor1/aCol1 and aPos2/aNor2/aCol2 the others.
 */
export function buildTreeGeometry(
  type: TreeType,
  detail: TreeDetail
): THREE.BufferGeometry {
  const variants = TREE_SPECS[type].map((spec, v) =>
    buildTreeVariant(spec, detail, v + 1)
  );
  const count = variants[0].position.length;
  if (variants.some((v) => v.position.length !== count)) {
    throw new Error(`Variants of ${type} trees do not share a vertex layout`);
  }
  const geo = new THREE.BufferGeometry();
  variants.forEach((v, i) => {
    const suffix = i === 0 ? null : String(i);
    geo.setAttribute(
      suffix ? `aPos${suffix}` : 'position',
      new THREE.Float32BufferAttribute(v.position, 3)
    );
    geo.setAttribute(
      suffix ? `aNor${suffix}` : 'normal',
      new THREE.BufferAttribute(normalsOf(v.position), 3)
    );
    geo.setAttribute(
      suffix ? `aCol${suffix}` : 'color',
      new THREE.Float32BufferAttribute(v.color, 3)
    );
  });
  geo.computeBoundingSphere();
  return geo;
}

/** Part positions of one variant, for checking collision shapes against what is drawn. */
export function treeVariantParts(
  type: TreeType,
  variant: number,
  detail: TreeDetail
) {
  const built = buildTreeVariant(
    TREE_SPECS[type][variant],
    detail,
    variant + 1
  );
  return {
    trunk: built.position.slice(0, built.trunkEnd),
    foliage: built.position.slice(built.foliageStart)
  };
}
