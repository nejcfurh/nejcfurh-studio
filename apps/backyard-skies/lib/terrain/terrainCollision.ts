// TERRAIN COLLISION DETECTION

import { CHUNK_SIZE } from './chunkConstants';
import { generateChunkData } from './chunkGenerator';

export function isSafeFeederPosition(wx: number, wz: number): boolean {
  const cx = Math.floor(wx / CHUNK_SIZE);
  const cz = Math.floor(wz / CHUNK_SIZE);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const chunkCx = cx + dx;
      const chunkCz = cz + dz;
      const data = generateChunkData(chunkCx, chunkCz);
      const ox = chunkCx * CHUNK_SIZE;
      const oz = chunkCz * CHUNK_SIZE;

      // HOUSE COLLISION (POSITIONS ARE CHUNK-LOCAL, ADD OFFSET)
      for (const h of data.houses) {
        const hx = ox + h.x;
        const hz = oz + h.z;
        const hw = (h.w + 8) / 2; // INCLUDES FENCE BUFFER
        const hd = (h.d + 10) / 2;
        if (Math.abs(wx - hx) < hw && Math.abs(wz - hz) < hd) {
          return false;
        }
      }

      // TREE COLLISION (~4 UNIT RADIUS FOR CANOPY)
      for (const t of data.trees) {
        const tx = ox + t.x;
        const tz = oz + t.z;
        const tdx = wx - tx;
        const tdz = wz - tz;
        if (tdx * tdx + tdz * tdz < 16) {
          return false;
        }
      }
    }
  }

  return true;
}
