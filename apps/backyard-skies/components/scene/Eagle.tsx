'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import { ObjMtlModel } from '@/components/scene/ObjMtlModel';
import * as THREE from 'three';

// EAGLE BY ROBERT MIRABELLE [CC-BY] VIA POLY PIZZA

const _eagleTarget = new THREE.Vector3();

export default function Eagle() {
  const groupRef = useRef<THREE.Group>(null);

  const threatType = useGameStore(s => s.threatType);
  const position = useGameStore(s => s.position);
  const rotation = useGameStore(s => s.rotation);
  const eagleDodgeWindow = useGameStore(s => s.eagleDodgeWindow);
  const eagleAltitudeHunt = useGameStore(s => s.eagleAltitudeHunt);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (threatType !== 'eagle') {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;
    const t = clock.getElapsedTime();

    // DIRECTION THE BIRD IS FACING
    const forwardX = Math.sin(rotation);
    const forwardZ = Math.cos(rotation);

    if (eagleDodgeWindow > 0) {
      // SWOOPING ATTACK - DIVE FROM THE FRONT TOWARD PLAYER
      const swoopProgress = 1 - eagleDodgeWindow / 1.5;
      const dist = 8 - swoopProgress * 8;
      groupRef.current.position.set(
        position[0] + forwardX * dist + Math.sin(t * 3) * 0.5,
        position[1] + 3 - swoopProgress * 5,
        position[2] + forwardZ * dist + Math.cos(t * 3) * 0.5,
      );
    } else if (eagleAltitudeHunt) {
      // ALTITUDE HUNT - EAGLE HOVERS AHEAD OF THE BIRD, FACING IT
      const dist = 10 + Math.sin(t * 1.2) * 2;
      groupRef.current.position.set(
        position[0] + forwardX * dist,
        position[1] + 1 + Math.sin(t * 1.5) * 0.5,
        position[2] + forwardZ * dist,
      );
    } else {
      // CIRCLING NEAR PLAYER - SLIGHTLY ABOVE, TIGHT ORBIT
      const circleRadius = 5;
      groupRef.current.position.set(
        position[0] + Math.sin(t * 0.8) * circleRadius,
        position[1] + 1.5,
        position[2] + Math.cos(t * 0.8) * circleRadius,
      );
    }

    if (eagleAltitudeHunt && eagleDodgeWindow <= 0) {
      // FACE THE PLAYER FROM THE SIDE - OFFSET PERPENDICULAR TO FORWARD DIRECTION
      const perpX = Math.cos(rotation);
      const perpZ = -Math.sin(rotation);
      _eagleTarget.set(
        position[0] + perpX * 3,
        position[1],
        position[2] + perpZ * 3,
      );
    } else {
      // FACE THE DIRECTION OF TRAVEL (TANGENT TO CIRCLE)
      _eagleTarget.set(
        position[0] + Math.sin(t * 0.8 + 0.1) * 5,
        groupRef.current.position.y,
        position[2] + Math.cos(t * 0.8 + 0.1) * 5,
      );
    }
    groupRef.current.lookAt(_eagleTarget);
  });

  return (
    <group ref={groupRef} visible={false}>
      <ObjMtlModel
        baseUrl="/models/myeagle/wind_eagle"
        scale={0.06}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}
