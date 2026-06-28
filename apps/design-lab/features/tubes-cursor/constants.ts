// INITIAL TUBE RIBBON COLORS.
export const TUBE_COLORS = ['#f967fb', '#53bc28', '#6958d5'];

// INITIAL POINT-LIGHT COLORS TRAVELLING THROUGH THE TUBES.
export const TUBE_LIGHT_COLORS = ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'];

// LIGHT INTENSITY FOR THE TUBE POINT LIGHTS.
export const TUBE_LIGHT_INTENSITY = 200;

// IDLE "SLEEP" DRIFT REACH (X = HORIZONTAL, Y = VERTICAL). DESKTOP DRIFTS WIDE AND HORIZONTAL;
export const SLEEP_RADIUS_DESKTOP = { x: 300, y: 150 };
//  MOBILE DRIFTS TALL AND VERTICAL SINCE THERE IS NO CURSOR.
export const SLEEP_RADIUS_MOBILE = { x: 120, y: 320 };

// VIEWPORT WIDTH AT OR BELOW WHICH THE VERTICAL (MOBILE) DRIFT IS USED.
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

/** GENERATES `COUNT` RANDOM HEX COLORS, E.G. `#A1B2C3`. */
export const randomColors = (count: number): string[] =>
  Array.from(
    { length: count },
    () =>
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
  );
