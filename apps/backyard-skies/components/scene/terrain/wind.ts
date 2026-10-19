/**
 * Wind shared by the grass and the trees: a fixed direction and broad gusts
 * that roll across the ground along it, so a gust bends the lawn and then
 * the trees it reaches. Returns 0 (calm) to 1 (gust) at a world xz.
 */
export const WIND_GLSL = /* glsl */ `
const vec2 WIND_DIR = vec2(0.8, 0.6);
float windGust(vec2 p, float t) {
  float along = dot(p, WIND_DIR);
  float across = dot(p, vec2(-WIND_DIR.y, WIND_DIR.x));
  float front = sin(along * 0.12 - t * 0.95 + sin(across * 0.06) * 1.6) * 0.5 + 0.5;
  float group = sin(along * 0.035 - t * 0.3 + across * 0.045) * 0.5 + 0.5;
  return front * front * group;
}
`;
