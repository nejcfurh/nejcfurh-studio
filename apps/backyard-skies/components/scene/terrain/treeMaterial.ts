import * as THREE from 'three';

import { WIND_GLSL } from './wind';

/** Per-instance attribute naming the variant (0, 1 or 2) a tree draws. */
export const TREE_VARIANT_ATTRIBUTE = 'aVariant';

const TREE_VERTEX_PARS = /* glsl */ `
uniform float uTime;
attribute vec3 aPos1;
attribute vec3 aPos2;
attribute float ${TREE_VARIANT_ATTRIBUTE};
${WIND_GLSL}
vec3 treePick(vec3 a, vec3 b, vec3 c) {
  return ${TREE_VARIANT_ATTRIBUTE} < 0.5 ? a : (${TREE_VARIANT_ATTRIBUTE} < 1.5 ? b : c);
}
// A slow sway plus a lean while a gust passes, growing with height so the
// trunk stays planted. Wind blows in world space; the instance is rotated and
// stretched, so the offset is taken back into its frame.
vec3 treeSway(vec3 p) {
  vec2 root = instanceMatrix[3].xz;
  float phase = root.x * 0.37 + root.y * 0.29;
  float s = sin(uTime * 0.8 + phase) * 0.05
    + sin(uTime * 1.9 + phase * 1.7) * 0.02
    + windGust(root, uTime) * 0.08;
  float w = clamp(p.y / 5.0, 0.0, 1.0);
  mat3 m = mat3(instanceMatrix);
  vec3 wind = transpose(m) * vec3(WIND_DIR.x, 0.0, WIND_DIR.y);
  wind /= vec3(dot(m[0], m[0]), dot(m[1], m[1]), dot(m[2], m[2]));
  return p + wind * s * w * w;
}
`;

const TREE_BEGIN_VERTEX = /* glsl */ `
vec3 transformed = treeSway(treePick(position, aPos1, aPos2));
`;

/**
 * Lit tree material and the matching shadow-pass material: both pick the
 * instance's variant and sway it, or shadows would show another tree.
 */
export function createTreeMaterials(uniforms: { uTime: { value: number } }) {
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 0.9
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
attribute vec3 aNor1;
attribute vec3 aNor2;
attribute vec3 aCol1;
attribute vec3 aCol2;
${TREE_VERTEX_PARS}`
      )
      .replace(
        '#include <beginnormal_vertex>',
        'vec3 objectNormal = treePick(normal, aNor1, aNor2);'
      )
      .replace('#include <begin_vertex>', TREE_BEGIN_VERTEX)
      .replace(
        '#include <color_vertex>',
        THREE.ShaderChunk.color_vertex.replace(
          'vColor.rgb *= color;',
          'vColor.rgb *= treePick(color, aCol1, aCol2);'
        )
      );
  };

  const depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${TREE_VERTEX_PARS}`)
      .replace('#include <begin_vertex>', TREE_BEGIN_VERTEX);
  };

  return { material, depthMaterial };
}
