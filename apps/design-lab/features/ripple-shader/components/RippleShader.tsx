'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { RIPPLE_BOX_ASPECT } from '../constants';

// Pool of reusable ripple stamps. Range 40–250. Higher = longer continuous trail before old ripples recycle (costs more).
const RIPPLE_COUNT = 150;

// Base brush diameter, in px. Range 60–280. Higher = larger, softer ripples. Lower = small, tight ripples.
const RIPPLE_SIZE = 160;

// Min cursor travel before the next ripple spawns, as a fraction of RIPPLE_SIZE. Range 0.2–1.0. Lower = denser/continuous trail. Higher = sparser, more separated ripples.
const TRAIL_SPACING = 0.4;

// Starting strength (opacity) of a new ripple. Range 0.2–1.0. Higher = stronger initial distortion. Lower = fainter.
const SPAWN_OPACITY = 0.55;

// Starting size of a ripple, as a multiplier of RIPPLE_SIZE. Range 0.1–1.0. Higher = ripples pop in big. Lower = start as a point and grow out.
const SPAWN_SCALE = 0.2;

// Size added to a ripple's scale each frame. Range 0.0–0.4. Higher = ripples spread out faster/wider. 0 = stay at spawn size.
const GROWTH = 0.13;

// Easing on the growth each frame. Range 0.9–1.0. Lower = growth slows sooner. Closer to 1.0 = keeps expanding.
const GROWTH_FRICTION = 0.982;

// Opacity multiplier per frame. Range 0.85–0.99. Lower = ripples vanish fast. Closer to 1.0 = they linger much longer.
const FADE = 0.96;

// Opacity below which a ripple is recycled. Range 0.005–0.1. Lower = faint tails live longer. Higher = culled sooner.
const FADE_CUTOFF = 0.02;

// Rotation added to each ripple per frame, in radians. Range 0.0–0.1. Higher = more swirling/organic motion. 0 = static stamps.
const SPIN = 0.025;

// Higher = stronger, more glass-like warp that bleeds past image edges. 0 = no distortion.
const DISPLACEMENT = 0.045;

// Chromatic aberration along the ripple direction. Range 0.0–0.1 Higher = stronger color fringing at ripple edges. 0 = none.
const RGB_SHIFT = 0.018;

// Bright watery highlight where ripples are strongest. Range 0.0–0.6 Higher = glossier specular sheen. 0 = no highlight.
const SHEEN = 0.05;

// ---- ripple field (brush stamps -> FBO) uses MeshBasicMaterial, no shader ----

// ---- page composition pass: each image cover-mapped into its box ----
const pageVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const pageFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uImageResolution;
  uniform vec2 uBoxResolution;
  varying vec2 vUv;

  // object-fit: cover mapping of the image into its box
  vec2 coverUv(vec2 uv, vec2 res, vec2 img) {
    float rs = res.x / res.y;
    float ri = img.x / img.y;
    vec2 size = rs < ri ? vec2(img.x * res.y / img.y, res.y)
                        : vec2(res.x, img.y * res.x / img.x);
    vec2 offset = (rs < ri ? vec2((size.x - res.x) * 0.5, 0.0)
                           : vec2(0.0, (size.y - res.y) * 0.5)) / size;
    return uv * res / size + offset;
  }

  void main() {
    gl_FragColor = texture2D(uTexture, coverUv(vUv, uBoxResolution, uImageResolution));
  }
`;

// ---- full-screen displacement pass: warp the whole composition ----
const displaceVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const displaceFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uPage;          // the composed page (images on transparent)
  uniform sampler2D uDisplacement;  // ripple field
  uniform float uStrength;
  uniform float uRgbShift;
  uniform float uSheen;
  uniform vec2 uResolution;         // for circular (aspect-correct) ripples
  varying vec2 vUv;

  const float PI = 3.14159265359;

  void main() {
    vec4 disp = texture2D(uDisplacement, vUv);
    float theta = disp.r * 2.0 * PI;
    vec2 dir = vec2(sin(theta), cos(theta));

    vec2 offset = dir * disp.r * uStrength;
    offset.x *= uResolution.y / uResolution.x; // keep ripples round on wide screens

    // chromatic split — warps the entire composition, so edges bleed outward
    float r = texture2D(uPage, vUv + offset * (1.0 + uRgbShift)).r;
    vec4 mid = texture2D(uPage, vUv + offset);
    float b = texture2D(uPage, vUv + offset * (1.0 - uRgbShift)).b;

    float sheen = smoothstep(0.15, 0.9, disp.r) * uSheen;

    gl_FragColor = vec4(vec3(r, mid.g, b) + sheen, mid.a);
  }
`;

const createBrushTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

type Uniform<T> = { value: T };

type PlaneUniforms = {
  uTexture: Uniform<THREE.Texture | null>;
  uImageResolution: Uniform<THREE.Vector2>;
  uBoxResolution: Uniform<THREE.Vector2>;
};

type ImagePlane = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  uniforms: PlaneUniforms;
};

const RippleShader = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const drawBuffer = renderer.getDrawingBufferSize(new THREE.Vector2());

    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -1000,
      1000
    );
    camera.position.z = 2;

    // --- ripple field rendered to an FBO ---
    const rippleScene = new THREE.Scene();
    const brush = createBrushTexture();
    const rippleGeometry = new THREE.PlaneGeometry(RIPPLE_SIZE, RIPPLE_SIZE);

    const ripples: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] =
      [];
    for (let i = 0; i < RIPPLE_COUNT; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: brush,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        opacity: 0
      });
      const mesh = new THREE.Mesh(rippleGeometry, material);
      mesh.visible = false;
      mesh.rotation.z = 2 * Math.PI * Math.random();
      rippleScene.add(mesh);
      ripples.push(mesh);
    }
    const rippleTarget = new THREE.WebGLRenderTarget(width, height);

    const pageScene = new THREE.Scene();
    const pageTarget = new THREE.WebGLRenderTarget(drawBuffer.x, drawBuffer.y);

    // The images never move, so the composition only needs rendering on
    // texture load / resize — not every frame.
    const renderPage = () => {
      renderer.setRenderTarget(pageTarget);
      renderer.clear();
      renderer.render(pageScene, camera);
      renderer.setRenderTarget(null);
    };

    const loader = new THREE.TextureLoader();
    const planes: ImagePlane[] = [];
    const geometry = new THREE.PlaneGeometry(1, 1);

    images.forEach((src) => {
      const uniforms = {
        uTexture: { value: null as THREE.Texture | null },
        uImageResolution: { value: new THREE.Vector2(1, 1) },
        uBoxResolution: { value: new THREE.Vector2(1, 1) }
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: pageVertex,
        fragmentShader: pageFragment
      });
      const mesh = new THREE.Mesh(geometry, material);
      pageScene.add(mesh);
      planes.push({ mesh, uniforms });

      loader.load(src, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        uniforms.uTexture.value = texture;
        uniforms.uImageResolution.value.set(
          texture.image.width,
          texture.image.height
        );
        renderPage();
      });
    });

    // --- full-screen pass that warps the whole composition ---
    const displaceScene = new THREE.Scene();
    const displaceCamera = new THREE.Camera();
    const displaceUniforms = {
      uPage: { value: pageTarget.texture },
      uDisplacement: { value: rippleTarget.texture },
      uStrength: { value: DISPLACEMENT },
      uRgbShift: { value: RGB_SHIFT },
      uSheen: { value: SHEEN },
      uResolution: { value: drawBuffer }
    };
    const displaceMaterial = new THREE.ShaderMaterial({
      uniforms: displaceUniforms,
      vertexShader: displaceVertex,
      fragmentShader: displaceFragment,
      transparent: true
    });
    displaceScene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), displaceMaterial)
    );

    // lay the three boxes out: equal size, centered, single row
    const layout = () => {
      const count = planes.length;
      const gap = Math.max(20, width * 0.025);
      const maxRowWidth = Math.min(width * 0.9, 1200);
      let boxW = (maxRowWidth - gap * (count - 1)) / count;
      let boxH = boxW / RIPPLE_BOX_ASPECT;
      const maxBoxH = height * 0.72;
      if (boxH > maxBoxH) {
        boxH = maxBoxH;
        boxW = boxH * RIPPLE_BOX_ASPECT;
      }
      const rowWidth = count * boxW + (count - 1) * gap;
      const startX = -rowWidth / 2 + boxW / 2;

      planes.forEach(({ mesh, uniforms }, i) => {
        mesh.scale.set(boxW, boxH, 1);
        mesh.position.set(startX + i * (boxW + gap), 0, 0);
        uniforms.uBoxResolution.value.set(boxW, boxH);
      });
    };
    layout();
    renderPage();

    // --- pointer trail spawns ripples ---
    let current = 0;
    let prevX = 0;
    let prevY = 0;
    let rect = container.getBoundingClientRect();

    const spawnRipple = (x: number, y: number) => {
      const mesh = ripples[current];
      mesh.visible = true;
      mesh.material.opacity = SPAWN_OPACITY;
      mesh.position.set(x, y, 0);
      mesh.scale.set(SPAWN_SCALE, SPAWN_SCALE, 1);
      mesh.rotation.z = 2 * Math.PI * Math.random();
      current = (current + 1) % RIPPLE_COUNT;
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX - rect.left - width / 2;
      const y = -(event.clientY - rect.top - height / 2);
      const dist = Math.hypot(x - prevX, y - prevY);
      if (dist > RIPPLE_SIZE * TRAIL_SPACING) {
        spawnRipple(x, y);
        prevX = x;
        prevY = y;
      }
    };
    container.addEventListener('pointermove', onPointerMove);

    // --- render loop ---
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      ripples.forEach((mesh) => {
        if (!mesh.visible) return;
        mesh.rotation.z += SPIN;
        mesh.material.opacity *= FADE;
        mesh.scale.x = GROWTH_FRICTION * mesh.scale.x + GROWTH;
        mesh.scale.y = mesh.scale.x;
        if (mesh.material.opacity < FADE_CUTOFF) mesh.visible = false;
      });

      // 1. ripples -> field FBO (page composition is cached, see renderPage)
      renderer.setRenderTarget(rippleTarget);
      renderer.clear();
      renderer.render(rippleScene, camera);

      // 2. warp the cached composition -> screen (edges bleed past image bounds)
      renderer.setRenderTarget(null);
      renderer.render(displaceScene, displaceCamera);
    };
    animate();

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      renderer.getDrawingBufferSize(drawBuffer);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();
      rippleTarget.setSize(width, height);
      pageTarget.setSize(drawBuffer.x, drawBuffer.y);
      rect = container.getBoundingClientRect();
      // uResolution shares the drawBuffer vector, so it updated above
      layout();
      renderPage();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      rippleTarget.dispose();
      pageTarget.dispose();
      brush.dispose();
      rippleGeometry.dispose();
      geometry.dispose();
      displaceMaterial.dispose();
      ripples.forEach((mesh) => mesh.material.dispose());
      planes.forEach(({ mesh, uniforms }) => {
        mesh.material.dispose();
        uniforms.uTexture.value?.dispose();
      });
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [images]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default RippleShader;
