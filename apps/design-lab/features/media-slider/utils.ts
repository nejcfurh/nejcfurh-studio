/**
 * Horizontal-divider variant used on mobile: stacks the videos top-to-bottom
 * with angled HORIZONTAL separators (instead of the desktop vertical slices),
 * evenly distributed (no hover-expand, since mobile has no hover).
 */
export const computeClipHorizontal = (
  idx: number,
  pps: number,
  split: number
): string | undefined => {
  const j = idx + 1;
  if (j === 1) return undefined;
  return `polygon(0 calc(${j - 1} * ${pps}% + ${split}px), 100% calc(${
    j - 1
  } * ${pps}% - ${split}px), 100% 100%, 0 100%)`;
};

export const computeClip = (
  idx: number,
  hovered: number | null,
  pps: number,
  split: number,
  count: number
): string | undefined => {
  const j = idx + 1;
  const i = hovered !== null ? hovered + 1 : null;

  // WHEN NOT HOVERED
  if (i === null) {
    if (j === 1) return undefined;
    return `polygon(calc(${j - 1} * ${pps}% - ${split}px) 100%, calc(${
      j - 1
    } * ${pps}% + ${split}px) 0, 100% 0, 100% 100%)`;
  }

  // WHEN HOVERED
  if (j <= i) {
    if (j === 1) return undefined;
    const numLeft = j - 1;
    const base = numLeft * 2;
    return `polygon(${base * split}px 100%, ${
      (base + 2) * split
    }px 0, 100% 0, 100% 100%)`;
  } else {
    const numRight = count - j;
    const base = numRight * 2;
    return `polygon(calc(100% - ${(base + 4) * split}px) 100%, calc(100% - ${
      (base + 2) * split
    }px) 0, 100% 0, 100% 100%)`;
  }
};
