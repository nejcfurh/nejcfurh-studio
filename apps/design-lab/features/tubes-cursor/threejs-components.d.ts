// THE `THREEJS-COMPONENTS` PACKAGE SHIPS NO TYPE DECLARATIONS, SO WE DESCRIBE THE SLICE OF THE TUBES CURSOR API WE ACTUALLY USE HERE.
declare module 'threejs-components/build/cursors/tubes1.min.js' {
  export interface TubesCursorLightsConfig {
    intensity?: number;
    colors?: string[];
  }

  export interface TubesCursorTubesConfig {
    colors?: string[];
    lights?: TubesCursorLightsConfig;
  }

  export interface TubesCursorBloomConfig {
    threshold?: number;
    strength?: number;
    radius?: number;
  }

  export interface TubesCursorConfig {
    tubes?: TubesCursorTubesConfig;
    bloom?: TubesCursorBloomConfig;
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeScale1?: number;
    sleepTimeScale2?: number;
  }

  export interface TubesCursorInstance {
    setColors: (colors: string[]) => void;
    setLightsColors: (colors: string[]) => void;
  }

  export interface TubesCursorApp {
    tubes: TubesCursorInstance;
    /** THE RESOLVED, LIVE CONFIG — MUTATING IT AFFECTS SUBSEQUENT FRAMES. */
    options: TubesCursorConfig;
    dispose: () => void;
  }

  /** INITIALISES THE TUBES CURSOR EFFECT ON THE GIVEN CANVAS ELEMENT. THE CANVAS IS SIZED TO ITS PARENT, SO WRAP IT IN A SIZED CONTAINER. */
  export default function TubesCursor(
    canvas: HTMLCanvasElement,
    config?: TubesCursorConfig
  ): TubesCursorApp;
}
