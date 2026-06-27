export const BASE = '/animations/animated-page-transitions';

export const LINKS = [
  { href: BASE, label: 'Home' },
  { href: `${BASE}/about`, label: 'About' },
  { href: `${BASE}/contact`, label: 'Contact' }
] as const;

// LABEL SHOWN ON THE CURVE OVERLAY DURING THE TRANSITION, KEYED BY PATHNAME.
export const ROUTE_LABELS: Record<string, string> = {
  [BASE]: 'Home',
  [`${BASE}/about`]: 'About',
  [`${BASE}/contact`]: 'Contact'
};

// PER-ROUTE ACCENT. SINGLE SOURCE OF TRUTH: DRIVES BOTH THE CURVE OVERLAY COLOR AND THE PAGE'S GLOW, SO THE WIPE BLENDS INTO THE PAGE IT REVEALS.
export const ROUTE_COLORS: Record<string, string> = {
  [BASE]: '#1d4ed8', // blue
  [`${BASE}/about`]: '#c2410c', // orange
  [`${BASE}/contact`]: '#0f766e' // teal
};

export const FALLBACK_COLOR = '#0a0a0a';

// PAGE BACKGROUND GLOW BUILT FROM A ROUTE COLOR (BOTTOM-CENTER GLOW → NEAR-BLACK).
export const glowBackground = (color: string) =>
  `radial-gradient(125% 95% at 50% 115%, ${color} 0%, #06070d 58%, #04050b 100%)`;
