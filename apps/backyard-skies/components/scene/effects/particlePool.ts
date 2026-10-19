import * as THREE from 'three';

export interface ParticleLook {
  lifetime: number;
  size: number;
  gravity: number;
}

interface Particle extends ParticleLook {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  alive: boolean;
}

const _matrix = new THREE.Matrix4();
const ZERO_SCALE = new THREE.Matrix4().makeScale(0, 0, 0);

/**
 * Fixed-size ring of ballistic particles drawn by one InstancedMesh; spawning
 * past capacity recycles the oldest slot, and nothing allocates per frame.
 */
export class ParticlePool {
  private readonly particles: Particle[];
  private cursor = 0;
  private aliveCount = 0;

  constructor(readonly capacity: number) {
    this.particles = Array.from({ length: capacity }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      age: 0,
      alive: false,
      lifetime: 1,
      size: 0,
      gravity: 0
    }));
  }

  /** Hides every instance and creates the colour attribute up front. */
  init(mesh: THREE.InstancedMesh, color: THREE.Color): void {
    for (let i = 0; i < this.capacity; i++) {
      mesh.setMatrixAt(i, ZERO_SCALE);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  spawn(
    mesh: THREE.InstancedMesh,
    spawn: {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      look: ParticleLook;
      color: THREE.Color;
    }
  ): void {
    const index = this.cursor;
    this.cursor = (index + 1) % this.capacity;
    const p = this.particles[index];
    if (!p.alive) this.aliveCount++;
    p.position.copy(spawn.position);
    p.velocity.copy(spawn.velocity);
    p.lifetime = spawn.look.lifetime;
    p.size = spawn.look.size;
    p.gravity = spawn.look.gravity;
    p.age = 0;
    p.alive = true;
    mesh.setColorAt(index, spawn.color);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  /** Advances and draws the live particles; shrinks each one as it ages. */
  update(mesh: THREE.InstancedMesh, delta: number): void {
    if (this.aliveCount === 0) return;
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      if (!p.alive) continue;
      p.age += delta;
      if (p.age > p.lifetime) {
        p.alive = false;
        this.aliveCount--;
        mesh.setMatrixAt(i, ZERO_SCALE);
        continue;
      }
      p.velocity.y -= p.gravity * delta;
      p.position.addScaledVector(p.velocity, delta);
      const scale = (1 - p.age / p.lifetime) * p.size;
      _matrix.makeScale(scale, scale, scale).setPosition(p.position);
      mesh.setMatrixAt(i, _matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
}
