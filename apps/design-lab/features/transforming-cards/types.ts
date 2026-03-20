export interface CardData {
  id: number;
  imageUrl: string;
  asciiCode: string;
}

// THREE.JS TYPES

export type Scene = {
  add: (object: unknown) => void;
  remove: (object: unknown) => void;
};

export type Camera = {
  position: { z: number };
  updateProjectionMatrix?: () => void;
  left?: number;
  right?: number;
};

export type Renderer = {
  setSize: (width: number, height: number) => void;
  setClearColor: (color: number, alpha: number) => void;
  render: (scene: unknown, camera: unknown) => void;
  dispose: () => void;
};

export type Particles = {
  geometry: {
    attributes: {
      position: { array: Float32Array; needsUpdate: boolean };
      alpha: { array: Float32Array; needsUpdate: boolean };
    };
    dispose: () => void;
  };
  material: { dispose: () => void };
};

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  life: number;
  time: number;
  twinkleSpeed: number;
  twinkleAmount: number;
  originalAlpha: number;
}
