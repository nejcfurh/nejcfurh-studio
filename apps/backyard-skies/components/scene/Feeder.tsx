'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import { FeederData } from '@/types';
import { ObjMtlModel } from '@/components/scene/ObjMtlModel';
import * as THREE from 'three';

const dangerGlowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color('#FF3D00') },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPos.xyz);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
      float glow = pow(fresnel, 3.0);
      float pulse = 0.7 + 0.3 * sin(uTime * 3.0);
      float alpha = glow * 0.55 * pulse;
      gl_FragColor = vec4(uColor, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.FrontSide,
});

/** BASIN DISH WITH INDENTED BOTTOM EDGE (RECEDED RIM, NOT EXTRUDED). */
function createBasinGeometry(): THREE.LatheGeometry {
  // PROFILE (RADIUS, HEIGHT): BOTTOM EDGE INDENTED, THEN FLARE OUT TO BOWL
  const pts = [
    new THREE.Vector2(1.0, 0), // INDENTED BOTTOM RIM
    new THREE.Vector2(1.08, 0.04),
    new THREE.Vector2(1.35, 0.1), // FLARE TO MAIN BOWL
    new THREE.Vector2(1.3, 0.2),
    new THREE.Vector2(1.25, 0.25), // TOP RIM
  ];
  return new THREE.LatheGeometry(pts, 32);
}

/** FLAT STRIP WITH ROUNDED CORNERS (2D ROUNDED RECT EXTRUDED BY DEPTH). */
function createRoundedStripGeometry(
  width: number,
  height: number,
  depth: number,
  cornerRadius: number,
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const r = Math.min(cornerRadius, width / 2, height / 2);
  shape.moveTo(r, 0);
  shape.lineTo(width - r, 0);
  shape.absarc(width - r, r, r, -Math.PI / 2, 0);
  shape.lineTo(width, height - r);
  shape.absarc(width - r, height - r, r, 0, Math.PI / 2);
  shape.lineTo(r, height);
  shape.absarc(r, height - r, r, Math.PI / 2, Math.PI);
  shape.lineTo(0, r);
  shape.absarc(r, r, r, Math.PI, -Math.PI / 2);
  const geom = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geom.translate(0, 0, -depth / 2);
  return geom;
}

interface FeederProps {
  data: FeederData;
}

export default function Feeder({ data }: FeederProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Group>(null);
  const position = useGameStore(s => s.position);
  const [isLocked, setIsLocked] = useState(false);
  const prevLockedRef = useRef(false);

  const glowMat = useMemo(() => {
    const mat = dangerGlowMaterial.clone();
    mat.uniforms.uColor.value = new THREE.Color(data.hasCat ? '#FF3D00' : '#FF9800');
    return mat;
  }, [data.hasCat]);

  useFrame(({ clock }) => {
    const now = Date.now();
    const newLocked = !!(data.lockedUntil && data.lockedUntil > now);
    if (newLocked !== prevLockedRef.current) {
      prevLockedRef.current = newLocked;
      setIsLocked(newLocked);
    }

    // Drive shader uniforms
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = clock.getElapsedTime();
      mat.uniforms.uColor.value.set(isLocked ? '#FF9800' : '#FF3D00');
    }

    if (markerRef.current) {
      markerRef.current.position.y =
        5 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      markerRef.current.rotation.y += 0.02;
    }
  });

  const isBirdbath = data.type === 'birdbath';

  // CALCULATE DISTANCE TO PLAYER FOR MARKER VISIBILITY
  const dx = position[0] - data.position[0];
  const dz = position[2] - data.position[2];
  const dist = Math.sqrt(dx * dx + dz * dz);
  const showMarker = dist < 40 && !isLocked;

  return (
    <group position={data.position}>
      {isBirdbath ? <BirdbuddyBath /> : <BirdbuddyFeeder />}

      {/* DANGER GLOW — FRESNEL GRADIENT AURA */}
      {(data.hasCat || isLocked) && (
        <mesh ref={glowRef} position={[0, 1.5, 0]} material={glowMat}>
          <sphereGeometry args={[3.5, 24, 16]} />
        </mesh>
      )}

      {/* FLOATING MARKER (HIDDEN WHEN LOCKED) */}
      {showMarker && (
        <group ref={markerRef} position={[0, 5, 0]}>
          <mesh>
            <octahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color={isBirdbath ? '#00AEEF' : '#4CAF50'}
              emissive={isBirdbath ? '#00AEEF' : '#4CAF50'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      )}

      {/* LOCKED INDICATOR */}
      {isLocked && showMarker && (
        <group position={[0, 6, 0]}>
          <mesh>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#FF9800"
              emissive="#FF9800"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* CAT 3D MODEL FOR DANGEROUS FEEDERS */}
      {data.hasCat && (
        <ObjMtlModel
          baseUrl="/models/mycat/model"
          scale={0.03}
          position={[2.5, 0, 1.5]}
          rotation={[1.5, -3.15, -3]}
        />
      )}
    </group>
  );
}

// BIRDBUDDY-STYLE SMART FEEDER - TEAL HOUSE-SHAPE BODY WITH PEAKED ROOF
export function BirdbuddyFeeder() {
  return (
    <group>
      {/* GRAY POLE FROM GROUND */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.1, 12]} />
        <meshStandardMaterial color="#6B6B6B" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 8]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* MAIN BODY - TEAL HOUSE SHAPE, OPEN FRONT */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[0.9, 1, 0.6]} />
        <meshStandardMaterial color="#2D6B73" roughness={0.3} />
      </mesh>

      {/* ROOF LEFT SLOPE */}
      <mesh position={[-0.4, 2.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.85, 0.06, 1.0]} />
        <meshStandardMaterial color="#2D6B73" roughness={0.4} />
      </mesh>
      {/* ROOF RIGHT SLOPE */}
      <mesh position={[0.4, 2.8, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.85, 0.06, 1.0]} />
        <meshStandardMaterial color="#2D6B73" roughness={0.4} />
      </mesh>
      {/* ROOF RIDGE CAP */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.12, 0.08, 1.0]} />
        <meshStandardMaterial color="#2D6B73" roughness={0.4} />
      </mesh>
      {/* CAMERA STRIP - TALL WHITE/SILVER WITH ROUNDED CORNERS */}
      <mesh
        position={[-0.125, 1.95, 0.3]}
        geometry={useMemo(
          () => createRoundedStripGeometry(0.25, 0.6, 0.02, 0.5),
          [],
        )}
      >
        <meshStandardMaterial color="#E8E4E0" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* INDICATOR DOT NEAR TOP OF STRIP */}
      <mesh position={[0, 2.35, 0.3]}>
        <sphereGeometry args={[0.02, 6, 8]} />
        <meshStandardMaterial
          color="#0d0e0d"
          emissive="#151615"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* CAMERA LENS - LARGE BLACK CYLINDER LOWER-CENTER */}
      <mesh position={[0, 2.07, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 0.05, 16]} />
        <meshStandardMaterial
          color="#1A1A1A"
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
      {/* ORANGE/CORAL TRAY - EXTENDS FORWARD FROM BOTTOM, BIRDS PERCH HERE */}
      <mesh position={[0, 1.78, 0.5]}>
        <boxGeometry args={[0.9, 0.02, 0.6]} />
        <meshStandardMaterial color="#f33737" roughness={0.5} />
      </mesh>
      {/* TRAY LIP - FRONT EDGE */}
      <mesh position={[0, 1.8, 0.82]}>
        <boxGeometry args={[0.9, 0.06, 0.06]} />
        <meshStandardMaterial color="#f33737" roughness={0.6} />
      </mesh>
      {/* TRAY LIP - SIDES */}
      {[-1, 1].map(side => (
        <mesh key={`tl${side}`} position={[side * 0.48, 1.8, 0.44]}>
          <boxGeometry args={[0.06, 0.06, 0.8]} />
          <meshStandardMaterial color="#f33737" roughness={0.6} />
        </mesh>
      ))}

      {/* SEEDS SCATTERED ON TRAY (BETWEEN THE TWO SIDE LINES) */}
      {useMemo(() => {
        // eslint-disable-next-line react-hooks/purity
        const rng = () => Math.random();
        const xMin = -0.42,
          xMax = 0.42;
        const zMin = 0.22,
          zMax = 0.78;
        const colors = ['#8D7E63', '#5C4A32', '#A09070'];
        return Array.from({ length: 50 }, (_, i) => ({
          key: `ts${i}`,
          x: xMin + rng() * (xMax - xMin),
          z: zMin + rng() * (zMax - zMin),
          color: colors[i % 3],
        }));
      }, []).map(({ key, x, z, color }) => (
        <mesh key={key} position={[x, 1.82, z]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// BIRDBUDDY-STYLE BIRDBATH - LARGE SHALLOW TEAL DISH ON POLE (LIKE FEEDER)
const BATH_POLE_TOP = 2.0;

export function BirdbuddyBath() {
  return (
    <group>
      {/* GRAY POLE FROM GROUND */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.08, 12]} />
        <meshStandardMaterial color="#6B6B6B" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.3, 8]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* BASIN - LARGE SHALLOW TEAL DISH ON TOP OF POLE, INDENTED BOTTOM EDGE */}
      <mesh
        position={[0, BATH_POLE_TOP + 0.1, 0]}
        geometry={useMemo(() => createBasinGeometry(), [])}
      >
        <meshStandardMaterial color="#4A8B96" roughness={0.4} />
      </mesh>
      {/* BASIN INNER DEPRESSION */}
      <mesh position={[0, BATH_POLE_TOP + 0.2, 0]}>
        <cylinderGeometry args={[1.15, 1.2, 0.12, 24]} />
        <meshStandardMaterial color="#3D7580" roughness={0.5} />
      </mesh>
      {/* SMOOTH RIM EDGE */}
      <mesh
        position={[0, BATH_POLE_TOP + 0.25, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1.25, 0.06, 8, 28]} />
        <meshStandardMaterial color="#4A8B96" roughness={0.35} />
      </mesh>

      {/* WATER SURFACE */}
      <mesh
        position={[0, BATH_POLE_TOP + 0.27, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.1, 24]} />
        <meshStandardMaterial
          color="#43a5cc"
          roughness={0.05}
          metalness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* CAMERA UNIT - HOUSE-SHAPED TEAL MODULE ON BACK RIM */}
      <group position={[0, BATH_POLE_TOP + 0.22, -1.05]}>
        {/* CAMERA BODY - SMALLER HOUSE SHAPE */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.6, 0.7, 0.45]} />
          <meshStandardMaterial color="#2D6B73" roughness={0.4} />
        </mesh>

        {/* PEAKED ROOF ON CAMERA UNIT */}
        <mesh position={[-0.3, 0.69, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.6, 0.04, 0.5]} />
          <meshStandardMaterial color="#2D6B73" roughness={0.4} />
        </mesh>
        <mesh position={[0.3, 0.69, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.6, 0.04, 0.5]} />
          <meshStandardMaterial color="#2D6B73" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.84, 0]}>
          <boxGeometry args={[0.1, 0.04, 0.5]} />
          <meshStandardMaterial color="#2D6B73" roughness={0.4} />
        </mesh>

        {/* WHITE CAMERA STRIP ON FRONT (FACING BASIN CENTER) - ROUNDED CORNERS */}
        <mesh
          position={[-0.09, 0.19, 0.22]}
          geometry={useMemo(
            () => createRoundedStripGeometry(0.18, 0.45, 0.04, 0.5),
            [],
          )}
        >
          <meshStandardMaterial
            color="#E8E4E0"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        {/* INDICATOR DOT */}
        <mesh position={[0, 0.5, 0.23]}>
          <sphereGeometry args={[0.02, 12, 8]} />
          <meshStandardMaterial
            color="#0d0e0d"
            emissive="#151615"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* CAMERA LENS */}
        <mesh position={[0, 0.3, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
          <meshStandardMaterial
            color="#1A1A1A"
            roughness={0.15}
            metalness={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}
