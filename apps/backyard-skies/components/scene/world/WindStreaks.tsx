'use client';

import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { cruiseSpeed } from '@/lib/flightPhysics';
import { useGameStore } from '@/store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 64;
// Streaks fill a cube of air this wide that wraps around a point just ahead
// of the camera, so few are spent behind it.
const BOX = 12;
const AHEAD = BOX * 0.35;
const LENGTH = 0.9;
const WIDTH = 0.035;
const MAX_OPACITY = 0.45;
// Air speed, as a multiple of cruise speed, where streaks start and peak.
const FADE_IN = 1.3;
const FULL = 1.9;
// The air also drifts back past the bird, so the streaks pass at twice the
// bird's speed and the effect reads at the chase camera's distance.
const DRIFT = 1;

const vertexShader = /* glsl */ `
uniform vec3 uCamera;
uniform vec3 uAnchor;
uniform vec3 uOffset;
uniform vec3 uDir;
attribute vec4 aSeed;
varying float vFade;
varying vec2 vUv;

void main() {
  vec3 rel = mod(aSeed.xyz * ${BOX.toFixed(1)} + uOffset - uAnchor, ${BOX.toFixed(1)})
    - ${(BOX / 2).toFixed(1)};
  vec3 center = uAnchor + rel;
  vec3 toCamera = normalize(uCamera - center);
  vec3 side = normalize(cross(uDir, toCamera));
  float len = ${LENGTH.toFixed(2)} * (0.5 + aSeed.w);
  vec3 world = center + uDir * position.x * len + side * position.y * ${WIDTH.toFixed(3)};

  // Fade out at the wrap boundary so streaks never pop, and right in front of
  // the lens where they would turn into wide smears.
  vec3 a = abs(rel) / ${BOX.toFixed(1)};
  vFade = (1.0 - smoothstep(0.3, 0.5, max(a.x, max(a.y, a.z))))
    * smoothstep(2.0, 5.0, distance(center, uCamera));
  vUv = position.xy + 0.5;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uOpacity;
varying float vFade;
varying vec2 vUv;

void main() {
  float along = sin(vUv.x * 3.14159);
  float across = 1.0 - abs(vUv.y * 2.0 - 1.0);
  gl_FragColor = vec4(vec3(1.0), uOpacity * vFade * along * along * across);
}
`;

function buildGeometry() {
  const geometry = new THREE.InstancedBufferGeometry();
  const plane = new THREE.PlaneGeometry(1, 1);
  geometry.index = plane.index;
  geometry.setAttribute('position', plane.getAttribute('position'));
  const seeds = new Float32Array(COUNT * 4);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
  geometry.instanceCount = COUNT;
  return geometry;
}

const uniforms = {
  uCamera: { value: new THREE.Vector3() },
  uAnchor: { value: new THREE.Vector3() },
  uOffset: { value: new THREE.Vector3() },
  uDir: { value: new THREE.Vector3(0, 0, 1) },
  uOpacity: { value: 0 }
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide
});

const _dir = new THREE.Vector3();

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Thin, faint streaks of air rushing past in a dive. Invisible at cruise
 * speed; one instanced draw while visible.
 */
export function WindStreaks() {
  const geometry = useMemo(() => buildGeometry(), []);
  const meshRef = useRef<THREE.Mesh>(null);
  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry]
  );

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const { gameState, velocity, speed, rotation, selectedSpecies } =
      useGameStore.getState();
    const cruise = cruiseSpeed(BIRD_SPECIES[selectedSpecies].attributes);
    const air = Math.hypot(speed, Math.min(velocity[1], 0));
    const target =
      gameState === 'flight' && cruise > 0
        ? smoothstep(FADE_IN, FULL, air / cruise)
        : 0;
    const u = uniforms;
    u.uOpacity.value +=
      (target * MAX_OPACITY - u.uOpacity.value) * (1 - Math.exp(-4 * dt));

    const visible = u.uOpacity.value > 0.003;
    if (meshRef.current) meshRef.current.visible = visible;
    if (!visible) return;

    // Flattened towards the heading: lines along the true dive path run
    // almost straight down the screen and read as rain.
    _dir.set(velocity[0], velocity[1] * 0.4, velocity[2]);
    if (_dir.lengthSq() < 0.01) {
      _dir.set(Math.sin(rotation), 0, Math.cos(rotation));
    }
    _dir.normalize();
    u.uDir.value.copy(_dir);
    u.uCamera.value.copy(camera.position);
    camera.getWorldDirection(u.uAnchor.value);
    u.uAnchor.value.multiplyScalar(AHEAD).add(camera.position);
    u.uOffset.value.addScaledVector(_dir, -air * DRIFT * dt);
    // Keep the offset small; the shader wraps it anyway.
    u.uOffset.value.set(
      u.uOffset.value.x % BOX,
      u.uOffset.value.y % BOX,
      u.uOffset.value.z % BOX
    );
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={10}
      visible={false}
    />
  );
}
