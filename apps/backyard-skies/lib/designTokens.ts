import { BirdSpeciesId } from '@/types';

export const ACCENT = {
  main: '#ffd24b',
  soft: 'rgba(255,210,75,0.18)',
  ink: '#1a0f00'
} as const;

export const BG_IMAGE =
  'radial-gradient(120% 80% at 50% 0%, #1f3a5f 0%, #0a1530 45%, #050a1a 100%)';

export const SPECIES_TINT: Record<
  BirdSpeciesId,
  { main: string; glow: string }
> = {
  cardinal: { main: '#ff3d5a', glow: 'rgba(255,61,90,0.55)' },
  tanager: { main: '#ff2a1c', glow: 'rgba(255,42,28,0.55)' },
  bunting: { main: '#2f7bff', glow: 'rgba(47,123,255,0.55)' },
  starling: { main: '#9f6bff', glow: 'rgba(159,107,255,0.55)' }
};

export const SPECIES_ICON: Record<BirdSpeciesId, string> = {
  cardinal: '/bird-icons/Northern-Cardinal.png',
  tanager: '/bird-icons/Scarlet-Tanager.png',
  bunting: '/bird-icons/Indigo-Bunding.png',
  starling: '/bird-icons/Starling.png'
};

export const SPECIES_TAGLINE: Record<BirdSpeciesId, string> = {
  cardinal: 'Balanced & reliable',
  tanager: 'Fast but hungry',
  bunting: 'Agile & efficient',
  starling: 'Tough survivor'
};

export function shade(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4, 6), 16) + amount));
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}
