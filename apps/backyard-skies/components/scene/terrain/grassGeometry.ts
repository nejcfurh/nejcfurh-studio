import * as THREE from 'three';

const BLADES = 5;
/** Heights along a blade where its width steps in; the tip closes it. */
const ROWS = [0, 0.38, 0.72];
const ROW_WIDTHS = [1, 0.72, 0.4];
const BLADE_WIDTH = 0.15;
const PETALS = 5;
const PETAL_TIP = 0.16;
const PETAL_NOTCH = 0.07;
const GRADIENT = ['#3a6e26', '#5c9c34', '#86bf45', '#b4dd66'].map(
  (c) => new THREE.Color(c)
);

/** Daisy white, buttercup yellow, violet; in linear RGB for the shader. */
export const FLOWER_COLORS = ['#f6f2e4', '#f3cd34', '#a07ce4'].map((c) => {
  const color = new THREE.Color(c);
  return new THREE.Vector3(color.r, color.g, color.b);
});

/** Tint multiplied into the centre of every flower: a warm, darker eye. */
export const FLOWER_EYE = new THREE.Vector3(0.95, 0.62, 0.2);

/** Bend direction, lean and height of each blade: the tallest one holds the flower. */
function blade(b: number) {
  const angle = (b / BLADES) * Math.PI * 2 + b * 0.7;
  return {
    angle,
    root: new THREE.Vector2(Math.cos(angle) * 0.07, Math.sin(angle) * 0.07),
    bend: angle + 0.4,
    lean: 0.22 + 0.06 * ((b * 5) % 3),
    height: [1, 0.74, 0.88, 0.66, 0.82][b]
  };
}

function bladePoint(b: number, t: number, side: number) {
  const { angle, root, bend, lean, height } = blade(b);
  const w = t >= 1 ? 0 : ROW_WIDTHS[ROWS.indexOf(t)] * BLADE_WIDTH * 0.5;
  // The blade face turns across its bend so it reads from most directions.
  const face = angle + Math.PI / 2;
  return new THREE.Vector3(
    root.x + Math.cos(bend) * lean * t * t + Math.cos(face) * w * side,
    height * (t - 0.12 * lean * t * t),
    root.y + Math.sin(bend) * lean * t * t + Math.sin(face) * w * side
  );
}

/** Where the flower head sits: the tip of blade 0. */
export const TUFT_HEAD_ANCHOR = bladePoint(0, 1, 0);

/**
 * A tuft of curved, tapering blades, about 1 unit tall, plus a small flower
 * cup on the tallest blade that the shader folds into the blade tip unless
 * the tuft flowers. Normals point straight up so blades shade like the lawn
 * they stand on; colour runs from a dark root (contact shade) to a light tip,
 * and each blade gets its own tone.
 */
export function buildTuftGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const colors: number[] = [];
  const heads: number[] = [];
  const index: number[] = [];
  const c = new THREE.Color();
  const tones = [
    new THREE.Color(1, 1, 1),
    new THREE.Color(1.08, 1.04, 0.86),
    new THREE.Color(0.9, 0.98, 1.0),
    new THREE.Color(1.02, 0.96, 0.9)
  ];
  const push = (p: THREE.Vector3, color: THREE.Color, head: number) => {
    positions.push(p.x, p.y, p.z);
    colors.push(color.r, color.g, color.b);
    heads.push(head);
    return positions.length / 3 - 1;
  };
  for (let b = 0; b < BLADES; b++) {
    const row = ROWS.map((t, k) => {
      c.copy(GRADIENT[k]).multiply(tones[b % tones.length]);
      return [
        push(bladePoint(b, t, -1), c, 0),
        push(bladePoint(b, t, 1), c, 0)
      ];
    });
    c.copy(GRADIENT[3]).multiply(tones[b % tones.length]);
    const tip = push(bladePoint(b, 1, 0), c, 0);
    for (let k = 0; k < ROWS.length - 1; k++) {
      const [a0, a1] = row[k];
      const [b0, b1] = row[k + 1];
      index.push(a0, a1, b1, a0, b1, b0);
    }
    const [l, r] = row[ROWS.length - 1];
    index.push(l, r, tip);
  }
  // Flower: a shallow five-petal star cup around a darker centre (head 2),
  // so it reads as a bloom rather than a shard when the camera is close.
  const white = new THREE.Color(1, 1, 1);
  const centre = push(
    TUFT_HEAD_ANCHOR.clone().setY(TUFT_HEAD_ANCHOR.y - 0.02),
    white,
    2
  );
  const rim = Array.from({ length: PETALS * 2 }, (_, i) => {
    const a = (i / (PETALS * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? PETAL_TIP : PETAL_NOTCH;
    return push(
      TUFT_HEAD_ANCHOR.clone().add(
        new THREE.Vector3(
          Math.cos(a) * r,
          0.05 * (r / PETAL_TIP),
          Math.sin(a) * r
        )
      ),
      white,
      1
    );
  });
  rim.forEach((v, i) => index.push(centre, rim[(i + 1) % rim.length], v));

  const geo = new THREE.BufferGeometry();
  geo.setIndex(index);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('aHead', new THREE.Float32BufferAttribute(heads, 1));
  const normals = new Float32Array(positions.length);
  for (let i = 1; i < normals.length; i += 3) normals[i] = 1;
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  return geo;
}

// Share of tufts kept at a distance from the camera: all of them up close,
// then falling with a power of the distance (about the rate the area a tuft
// covers on screen shrinks) to a floor that still reaches the grass ring.
// Kept tufts widen as the rest drop out, so the far lawn stays covered.
const DENSITY_NEAR = 14;
const DENSITY_POWER = 1.5;
const DENSITY_MIN = 0.06;

/** Fraction of a tile's tufts drawn at `distance` from the camera. */
export function grassDensity(distance: number): number {
  if (distance <= DENSITY_NEAR) return 1;
  return Math.max(DENSITY_MIN, (DENSITY_NEAR / distance) ** DENSITY_POWER);
}

/** grassDensity for the shader; the two must agree. */
export const GRASS_DENSITY_GLSL = /* glsl */ `
float grassDensity(float distance) {
  float near = ${DENSITY_NEAR.toFixed(2)};
  return max(${DENSITY_MIN.toFixed(3)}, pow(near / max(distance, near), ${DENSITY_POWER.toFixed(2)}));
}
`;
