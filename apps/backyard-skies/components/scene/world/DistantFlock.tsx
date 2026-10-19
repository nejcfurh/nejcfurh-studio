'use client';

import { useGameStore } from '@/store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const COUNT = 7;
const COLOR = '#2f3742';
// The flock circles a point this far from the bird; once the bird has left it
// behind it moves to a new point ahead and fades in from the fog colour.
const SPAWN_DISTANCE = 75;
const RESPAWN_DISTANCE = 100;
const SPAWN_SPREAD = THREE.MathUtils.degToRad(40);

const vertexShader = /* glsl */ `
#include <common>
#include <fog_pars_vertex>
uniform vec3 uCenter;
uniform float uTime;
attribute vec4 aBird;

void main() {
  float radius = 7.0 + aBird.y * 7.0;
  float angle = uTime * (0.18 + aBird.z * 0.06) + aBird.x * 6.2831;
  vec3 forward = vec3(-sin(angle), 0.0, cos(angle));
  vec3 side = vec3(forward.z, 0.0, -forward.x);
  vec3 center = uCenter
    + vec3(cos(angle) * radius, aBird.w * 6.0 + sin(uTime * 0.5 + aBird.x * 9.0), sin(angle) * radius);

  // Wingtips beat; the body stays put.
  float flap = sin(uTime * (7.0 + aBird.z * 3.0) + aBird.x * 40.0);
  vec3 local = position;
  local.y += abs(local.x) * flap * 0.45;
  vec3 world = center + side * local.x * 0.75 + forward * local.z * 0.6
    + vec3(0.0, local.y * 0.75, 0.0);

  vec4 mvPosition = viewMatrix * vec4(world, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`;

const fragmentShader = /* glsl */ `
#include <common>
#include <fog_pars_fragment>
uniform vec3 uColor;
uniform float uAppear;

void main() {
  vec3 color = uColor;
  #ifdef USE_FOG
    color = mix(fogColor, uColor, uAppear);
  #endif
  gl_FragColor = vec4(color, 1.0);
  #include <fog_fragment>
}
`;

/** A swept-back V: two wing triangles meeting at the body. */
function buildGeometry() {
  const geometry = new THREE.InstancedBufferGeometry();
  const positions = new Float32Array([
    0, 0, 0.5, -1, 0, -0.4, 0, 0, -0.3, 0, 0, 0.5, 0, 0, -0.3, 1, 0, -0.4
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const birds = new Float32Array(COUNT * 4);
  for (let i = 0; i < birds.length; i++) birds[i] = Math.random();
  geometry.setAttribute('aBird', new THREE.InstancedBufferAttribute(birds, 4));
  geometry.instanceCount = COUNT;
  return geometry;
}

const uniforms = {
  // Starts out of range so the first frame places it ahead of the bird.
  uCenter: { value: new THREE.Vector3(1e6, 0, 0) },
  uTime: { value: 0 },
  uAppear: { value: 0 }
};
const FADE_IN_SECONDS = 3;

const material = new THREE.ShaderMaterial({
  uniforms: {
    ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
    ...uniforms,
    uColor: { value: new THREE.Color(COLOR) }
  },
  vertexShader,
  fragmentShader,
  fog: true,
  side: THREE.DoubleSide
});

const _forward = new THREE.Vector3();

/** A few small birds circling far off, so the sky is not empty. One draw. */
export function DistantFlock() {
  const geometry = useMemo(() => buildGeometry(), []);
  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry]
  );

  useFrame(({ clock }, delta) => {
    const { position, rotation } = useGameStore.getState();
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uAppear.value = Math.min(
      1,
      uniforms.uAppear.value + delta / FADE_IN_SECONDS
    );
    const center = uniforms.uCenter.value;
    const dist = Math.hypot(center.x - position[0], center.z - position[2]);
    if (dist < RESPAWN_DISTANCE) return;
    const heading = rotation + (Math.random() * 2 - 1) * SPAWN_SPREAD;
    _forward.set(Math.sin(heading), 0, Math.cos(heading));
    center.set(
      position[0] + _forward.x * SPAWN_DISTANCE,
      22 + Math.random() * 10,
      position[2] + _forward.z * SPAWN_DISTANCE
    );
    uniforms.uAppear.value = 0;
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
