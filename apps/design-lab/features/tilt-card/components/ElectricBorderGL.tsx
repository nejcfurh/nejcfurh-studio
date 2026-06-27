'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * GPU electric border for mobile / touch devices.
 *
 * Mobile Safari rasterises the desktop SVG `feTurbulence` + `feDisplacementMap`
 * filter on the CPU (single-threaded, no GPU path), which is why its performance tanks.
 * This reimplements the same idea — a rounded-rect border
 * displaced by fractal turbulence, with a glow that spills past the edge — as a
 * fragment shader, so the noise/displacement runs on the GPU and stays smooth.
 *
 * The quad is rendered larger than the card (MARGIN + the negative inset on the
 * wrapper) so the glow can extend beyond the card silhouette.
 */

// PX OF EMPTY SPACE AROUND THE CARD SO THE GLOW CAN BLEED OUTWARD AND FADE OUT
// SMOOTHLY (PREVENTS A VISIBLE RECTANGULAR GLOW CLIPPED AT THE CANVAS EDGE).
const MARGIN = 40;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // FULLSCREEN PLANE: positions are already -1..1, ignore the camera.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform vec2 uResolution;   // CANVAS SIZE IN CSS PX
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uMargin;      // GLOW MARGIN IN PX (CARD EDGE INSET)

  // ---- VALUE-NOISE FBM (THE GPU EQUIVALENT OF feTurbulence) ----
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // RIDGED / TURBULENT FBM: abs() of the noise puts SHARP CREASES at the zero
  // crossings -> jagged kinks instead of smooth waves (same trick as SVG
  // feTurbulence type="turbulence").
  float turb(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * abs(vnoise(p) * 2.0 - 1.0);
      p = p * 2.0 + 19.0;
      a *= 0.5;
    }
    return v;
  }

  // ---- ROUNDED-RECT SIGNED DISTANCE ----
  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  // TUNABLES (PX)
  const float RADIUS = 16.0;     // CORNER RADIUS (MATCHES CARD rounded-2xl = 16px)
  const float DISPLACE = 12.0;   // WOBBLE AMPLITUDE (KEEP SMALL SO IT HUGS EDGE)
  const float NOISE_SCALE = 8.0; // TURBULENCE FREQUENCY (HIGH -> JAGGED KINKS)
  const float SPEED = 2.1;       // CRACKLE TRAVEL SPEED
  const float CORE = 2.0;        // BRIGHT LINE HALF-THICKNESS
  const float GLOW = 15.0;       // GLOW FALLOFF DISTANCE

  void main() {
    vec2 res = uResolution;
    vec2 p = (vUv - 0.5) * res;        // CENTERED PX COORDS
    vec2 halfb = res * 0.5 - uMargin;  // BORDER RECT = CARD EDGE

    // RIDGED TURBULENT DISPLACEMENT (TWO DECORRELATED CHANNELS, ANIMATED).
    // HIGH FREQUENCY + SMALL AMPLITUDE -> SHARP KINKS THAT STILL HUG THE EDGE.
    vec2 nc = vUv * NOISE_SCALE * vec2(res.x / res.y, 1.0);
    float tflow = uTime * SPEED;
    float n1 = turb(nc + vec2(0.0, -tflow));
    float n2 = turb(nc + vec2(tflow, 13.7));
    vec2 disp = (vec2(n1, n2) - 0.5) * 2.0 * DISPLACE;

    float d = sdRoundRect(p + disp, halfb, RADIUS);
    float ad = abs(d);

    float core = smoothstep(CORE, 0.0, ad);     // BRIGHT FILAMENT
    float glow = exp(-ad / GLOW);               // SOFT HALO (BOTH SIDES)

    // BREAKING: moving gaps along the bolt, but never fully invisible so it
    // always reads as a lit border.
    float crackle = fbm(nc * 1.7 + vec2(tflow * 1.1, -tflow * 0.6));
    core *= 0.4 + 0.6 * smoothstep(0.28, 0.70, crackle);

    // ELECTRIC BUZZ
    float flicker = 0.7 + 0.3 * fbm(vec2(uTime * 14.0, 0.0));

    // FADE EVERYTHING OUT BEFORE THE CANVAS EDGE -> NO VISIBLE GLOW RECTANGLE.
    vec2 edgePx = min(vUv, 1.0 - vUv) * res;
    float edgeFade = smoothstep(0.0, uMargin, min(edgePx.x, edgePx.y));

    // ALPHA = HOW MUCH ELECTRICITY IS HERE -> EVERYTHING ELSE IS TRANSPARENT
    float intensity = clamp((core * 2.6 + glow * 0.7) * flicker * edgeFade, 0.0, 1.0);
    vec3 col = mix(uColor, vec3(1.0), core * 0.55); // WHITE-HOT FILAMENT

    // PREMULTIPLIED-ALPHA OUTPUT (MATCHES premultipliedAlpha MATERIAL/CANVAS)
    gl_FragColor = vec4(col * intensity, intensity);
  }
`;

const BorderPlane = ({ color }: { color: string }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor: { value: new THREE.Color(color) },
      uMargin: { value: MARGIN }
    }),
    [color]
  );

  // Drive time + resolution on the live material every frame (outside render).
  // Read the canvas's live DOM size rather than R3F's cached `state.size`:
  // R3F can latch a stale measurement on mount (the cause of the border
  // sometimes drifting until toggled off/on). clientWidth/Height always
  // reflect the true rendered size, so the border math stays correct.
  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    const canvas = state.gl.domElement;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uResolution.value.set(
      canvas.clientWidth || state.size.width,
      canvas.clientHeight || state.size.height
    );
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        premultipliedAlpha
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

export default function ElectricBorderGL({
  color = '#dd8448'
}: {
  color?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ inset: -MARGIN }}
      aria-hidden="true"
    >
      <Canvas
        flat
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none', background: 'transparent' }}
      >
        <BorderPlane color={color} />
      </Canvas>
    </div>
  );
}
