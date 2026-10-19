'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const COUNT = 20;
// Clouds tile a square of sky this wide around the camera. Half of it lies
// beyond FADE_END, so a cloud wraps to the far side only while invisible.
const FIELD = 300;
const FADE_START = 100;
const FADE_END = 150;
const WIND = new THREE.Vector2(1.2, 0.5);

const vertexShader = /* glsl */ `
uniform vec3 uCamera;
uniform vec2 uDrift;
attribute vec4 aCloud;
varying vec2 vUv;
varying float vSeed;
varying float vDistance;

void main() {
  vec2 rel = mod(aCloud.xy * ${FIELD.toFixed(1)} + uDrift - uCamera.xz, ${FIELD.toFixed(1)})
    - ${(FIELD / 2).toFixed(1)};
  vec3 center = vec3(uCamera.x + rel.x, 32.0 + aCloud.z * 14.0, uCamera.z + rel.y);
  // Upright billboard: turns to face the camera about the vertical only.
  vec3 toCamera = uCamera - center;
  vec3 right = normalize(vec3(toCamera.z, 0.0, -toCamera.x));
  float width = 28.0 + aCloud.w * 24.0;
  vec3 world = center + right * position.x * width
    + vec3(0.0, position.y * width * 0.5, 0.0);

  vUv = position.xy;
  vSeed = aCloud.x * 13.0 + aCloud.y * 7.0;
  vDistance = length(rel);
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uShade;
uniform vec3 uHorizon;
varying vec2 vUv;
varying float vSeed;
varying float vDistance;

void main() {
  // A row of soft overlapping puffs with a flatter base.
  float density = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float x = (fi - 2.0) * 0.16 + sin(vSeed + fi * 2.1) * 0.04;
    float r = 0.13 + 0.09 * fract(sin(vSeed * 3.7 + fi * 12.9) * 437.5);
    float y = -0.12 + r * 0.9 + sin(vSeed * 1.3 + fi * 4.7) * 0.04;
    vec2 d = (vUv - vec2(x, y)) / vec2(r * 1.25, r);
    density += exp(-dot(d, d) * 2.2);
  }
  float base = smoothstep(-0.22, -0.05, vUv.y);
  float alpha = smoothstep(0.2, 0.75, density) * base;
  alpha *= 1.0 - smoothstep(${FADE_START.toFixed(1)}, ${FADE_END.toFixed(1)}, vDistance);
  vec3 color = mix(uShade, vec3(1.0), smoothstep(-0.2, 0.25, vUv.y));
  color = mix(color, uHorizon, smoothstep(30.0, ${FADE_END.toFixed(1)}, vDistance) * 0.6);
  gl_FragColor = vec4(color, alpha * 0.85);
}
`;

function buildGeometry() {
  const geometry = new THREE.InstancedBufferGeometry();
  const plane = new THREE.PlaneGeometry(1, 1);
  geometry.index = plane.index;
  geometry.setAttribute('position', plane.getAttribute('position'));
  const clouds = new Float32Array(COUNT * 4);
  for (let i = 0; i < clouds.length; i++) clouds[i] = Math.random();
  geometry.setAttribute(
    'aCloud',
    new THREE.InstancedBufferAttribute(clouds, 4)
  );
  geometry.instanceCount = COUNT;
  return geometry;
}

const uniforms = {
  uCamera: { value: new THREE.Vector3() },
  uDrift: { value: new THREE.Vector2() },
  uShade: { value: new THREE.Color('#c5d0de') },
  uHorizon: { value: new THREE.Color() }
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false
});

/** Soft billboard clouds drifting high over the suburb. One draw. */
export function Clouds({ horizon }: { horizon: THREE.ColorRepresentation }) {
  const geometry = useMemo(() => buildGeometry(), []);
  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry]
  );
  useEffect(() => {
    uniforms.uHorizon.value.set(horizon);
  }, [horizon]);

  useFrame(({ camera, clock }) => {
    uniforms.uCamera.value.copy(camera.position);
    uniforms.uDrift.value.copy(WIND).multiplyScalar(clock.getElapsedTime());
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={-500}
    />
  );
}
