import { GameResultData, LeaderboardEntry } from '@/types';

const STORAGE_KEY = 'mindgrid_game_history';

export function getLocalHistory(): GameResultData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalResult(data: GameResultData): GameResultData {
  if (typeof window === 'undefined') return data;
  try {
    const history = getLocalHistory();
    const item: GameResultData = {
      ...data,
      _id: 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    history.unshift(item);
    // Keep up to 200 items in local storage
    if (history.length > 200) history.length = 200;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return item;
  } catch (e) {
    console.error('Failed to save to localStorage', e);
    return data;
  }
}

export async function recordGameResult(data: GameResultData): Promise<void> {
  // Always save locally first so user never loses their score
  saveLocalResult(data);

  // Then attempt to sync to MongoDB API
  try {
    await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Backend sync failed, saved locally only:', err);
  }
}

export function getLocalLeaderboard(gameFilter?: string): LeaderboardEntry[] {
  const history = getLocalHistory();
  
  let filtered = history;
  if (gameFilter && gameFilter !== 'all') {
    if (gameFilter === 'xo') {
      filtered = history.filter((h) => h.game === 'xo' || h.game === 'ultimate-xo' || h.game === 'XO');
    } else {
      filtered = history.filter((h) => h.game === gameFilter || h.game?.toLowerCase() === gameFilter.toLowerCase());
    }
  }

  // Convert to Leaderboard entries
  const entries: LeaderboardEntry[] = filtered.map((h) => ({
    _id: h._id,
    playerName: h.playerName || (h.playerX && h.playerO ? `${h.playerX} vs ${h.playerO}` : 'Player'),
    playerX: h.playerX,
    playerO: h.playerO,
    game: h.game,
    gameMode: h.gameMode,
    score: h.score,
    result: h.result,
    moves: h.moves,
    time: h.time,
    difficulty: h.difficulty,
    createdAt: h.createdAt,
  }));

  if (gameFilter === '2048') {
    return entries.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20);
  } else if (gameFilter === 'sudoku') {
    return entries.filter(e => e.time !== undefined).sort((a, b) => (a.time || 999999) - (b.time || 999999)).slice(0, 20);
  } else if (gameFilter === '15-puzzle' || gameFilter === '24-puzzle' || gameFilter === '35-puzzle') {
    return entries.filter(e => e.moves !== undefined).sort((a, b) => (a.moves || 999999) - (b.moves || 999999) || (a.time || 999999) - (b.time || 999999)).slice(0, 20);
  } else if (gameFilter === 'xo') {
    return entries.slice(0, 20);
  }

  // Default 'all'
  return entries.slice(0, 30);
}
