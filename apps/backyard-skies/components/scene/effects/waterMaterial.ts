import * as THREE from 'three';

// Matches the sky and sun set up in GameEnvironment so the water reflects them.
const SUN_DIRECTION = new THREE.Vector3(-0.723, 0.469, -0.507).normalize();

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uMap;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSky;
  uniform vec3 uSunDir;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  #include <fog_pars_fragment>

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);

    // Rings spreading from the centre plus a weaker wandering drip.
    float phase1 = r * 26.0 - uTime * 2.6;
    float amp1 = 0.5 * (1.0 - smoothstep(0.2, 1.0, r));
    vec2 c2 = vec2(0.35 * sin(uTime * 0.7), 0.3 * cos(uTime * 0.53));
    vec2 d2 = p - c2;
    float r2 = length(d2);
    float phase2 = r2 * 34.0 - uTime * 3.4;
    float amp2 = 0.35 * exp(-r2 * 3.0);

    vec2 slope =
      (p / max(r, 1e-3)) * cos(phase1) * amp1 +
      (d2 / max(r2, 1e-3)) * cos(phase2) * amp2;
    // The disc lies flat with uv.y running toward -z.
    vec3 n = normalize(vec3(-slope.x * 0.35, 1.0, slope.y * 0.35));

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    vec3 tex = texture2D(uMap, vUv + slope * 0.015).rgb;
    vec3 base = mix(uDeep, uShallow, smoothstep(0.0, 1.0, r));
    base *= mix(vec3(1.0), tex * 1.5, 0.35);

    vec3 color = mix(base, uSky, 0.2 + 0.65 * fresnel);
    vec3 halfDir = normalize(uSunDir + viewDir);
    color += vec3(1.0, 0.95, 0.85) * pow(max(dot(n, halfDir), 0.0), 90.0) * 0.9;
    color = mix(color, vec3(0.92, 0.96, 1.0), smoothstep(0.86, 1.0, r) * 0.35);

    gl_FragColor = vec4(color, 0.93);
    #include <fog_fragment>
  }
`;

/** Rippling bird-bath water; one draw, animated through `uTime`. */
export function createWaterMaterial(map: THREE.Texture): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uTime: { value: 0 },
        uMap: { value: null },
        uDeep: { value: new THREE.Color('#1f6f8f') },
        uShallow: { value: new THREE.Color('#5fb7cf') },
        uSky: { value: new THREE.Color('#a9c7e2') },
        uSunDir: { value: SUN_DIRECTION.clone() }
      }
    ]),
    vertexShader,
    fragmentShader,
    transparent: true,
    fog: true
  });
  // A texture only reached through a uniform is not tagged sRGB by R3F.
  if (map.colorSpace !== THREE.SRGBColorSpace) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
  }
  // Merging clones uniform values, so the shared texture is assigned afterwards.
  material.uniforms.uMap.value = map;
  return material;
}
