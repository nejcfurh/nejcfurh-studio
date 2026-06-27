export const CURVE_BASE = '/animations/curve-page-transition';

export const CURVE_LINKS = [
  { href: CURVE_BASE, label: 'Home' },
  { href: `${CURVE_BASE}/about`, label: 'About' },
  { href: `${CURVE_BASE}/contact`, label: 'Contact' }
] as const;

// LABEL SHOWN ON THE OVERLAY DURING THE TRANSITION, KEYED BY PATHNAME.
export const ROUTE_LABELS: Record<string, string> = {
  [CURVE_BASE]: 'Home',
  [`${CURVE_BASE}/about`]: 'About',
  [`${CURVE_BASE}/contact`]: 'Contact'
};

// PER-ROUTE ACCENT. SINGLE SOURCE OF TRUTH: DRIVES BOTH THE CURVE OVERLAY COLOR AND THE PAGE'S GLOW, SO THE WIPE BLENDS INTO THE PAGE IT REVEALS.
export const ROUTE_COLORS: Record<string, string> = {
  [CURVE_BASE]: '#1d4ed8', // blue
  [`${CURVE_BASE}/about`]: '#c2410c', // orange
  [`${CURVE_BASE}/contact`]: '#0f766e' // teal
};

export const FALLBACK_COLOR = '#0a0a0a';

// PAGE BACKGROUND GLOW BUILT FROM A ROUTE COLOR (BOTTOM-CENTER GLOW → NEAR-BLACK).
export const glowBackground = (color: string) =>
  `radial-gradient(125% 95% at 50% 115%, ${color} 0%, #06070d 58%, #04050b 100%)`;
