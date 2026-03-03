// Leaderboard localStorage persistence — no store dependency.

import { LeaderboardEntry, BirdSpeciesId } from '@/types';

const STORAGE_KEY = 'backyard-skies-leaderboard';
const MAX_ENTRIES = 20;

export function loadLeaderboardFromStorage(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLeaderboardEntry(
  name: string,
  species: BirdSpeciesId,
  score: number,
  distance: number,
): LeaderboardEntry[] {
  const leaderboard = loadLeaderboardFromStorage();
  leaderboard.push({
    name,
    species,
    score,
    distance: Math.round(distance * 100) / 100,
    date: new Date().toISOString(),
  });
  leaderboard.sort((a, b) => b.score - a.score);
  const top = leaderboard.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
  return top;
}
