import { BirdSpeciesId, DeathReason, LeaderboardEntry } from '@/types';
import { createSupabaseClient } from '@repo/database/supabase';

const MAX_ENTRIES = 20;

function getClient() {
  return createSupabaseClient();
}

export async function loadLeaderboardFromStorage(): Promise<
  LeaderboardEntry[]
> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('backyard-skies-leaderboard')
    .select('name, score, species, distance, created_at')
    .order('score', { ascending: false })
    .limit(MAX_ENTRIES);

  if (error) {
    console.error('Failed to load leaderboard:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    name: row.name,
    species: row.species as BirdSpeciesId,
    score: Number(row.score),
    distance: Number(row.distance),
    date: row.created_at
  }));
}

export async function saveLeaderboardEntry(
  name: string,
  species: BirdSpeciesId,
  score: number,
  distance: number,
  deathReason: DeathReason,
  eagleDodges: number,
  feedingScore: number
): Promise<LeaderboardEntry[]> {
  const supabase = getClient();
  const { error } = await supabase.from('backyard-skies-leaderboard').insert({
    name,
    score: Math.floor(score),
    species,
    distance: Math.round(distance * 100) / 100,
    death_reason: deathReason,
    eagle_dodges: eagleDodges,
    feeding_score: Math.floor(feedingScore)
  });

  if (error) {
    console.error('Failed to save leaderboard entry:', error.message);
  }

  return loadLeaderboardFromStorage();
}
