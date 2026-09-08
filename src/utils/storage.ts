import { AppSettings, LeaderboardEntry, QuizResult, UserStats } from '../types.ts';

const STATS_KEY = 'dunya_kasifi_stats_v1';
const SETTINGS_KEY = 'dunya_kasifi_settings_v1';
const LEADERBOARD_KEY = 'dunya_kasifi_leaderboard_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'tr',
  soundEnabled: true,
  ttsEnabled: true,
  ttsVoiceSpeed: 1.0,
  darkMode: false,
  defaultDifficulty: 'medium',
  vibrationEnabled: true
};

export const DEFAULT_STATS: UserStats = {
  totalGamesPlayed: 0,
  totalScore: 0,
  totalCorrect: 0,
  totalWrong: 0,
  currentStreak: 1,
  bestStreak: 1,
  lastPlayedDate: '',
  learnedCountries: ['TR'], // Starts with home country learned
  highScores: {},
  unlockedBadgeIds: []
};

// Calculate & update daily streak
export function updateDailyStreak(stats: UserStats): { currentStreak: number; bestStreak: number; streakUpdated: boolean } {
  const today = new Date().toISOString().split('T')[0];
  if (stats.lastPlayedDate === today) {
    return { currentStreak: stats.currentStreak, bestStreak: stats.bestStreak, streakUpdated: false };
  }

  if (!stats.lastPlayedDate) {
    return { currentStreak: 1, bestStreak: 1, streakUpdated: true };
  }

  const lastDate = new Date(stats.lastPlayedDate);
  const curDate = new Date(today);
  const diffTime = curDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  let newStreak = stats.currentStreak;
  if (diffDays === 1) {
    newStreak += 1;
  } else if (diffDays > 1) {
    newStreak = 1;
  }

  const best = Math.max(stats.bestStreak || 1, newStreak);
  return { currentStreak: newStreak, bestStreak: best, streakUpdated: true };
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage quota or private mode
  }
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id'>): void {
  try {
    const list = loadLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: 'score_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
    };
    list.unshift(newEntry);
    // Keep top 30
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 30)));
  } catch {
    // ignore
  }
}

export function recordQuizCompletion(result: QuizResult): { stats: UserStats; isHighScore: boolean } {
  const stats = loadUserStats();
  const streakInfo = updateDailyStreak(stats);

  const highScoreKey = `${result.mode}_${result.difficulty}`;
  const previousHigh = stats.highScores[highScoreKey] || 0;
  const isHighScore = result.score > previousHigh;

  const newHighScores = {
    ...stats.highScores,
    [highScoreKey]: Math.max(previousHigh, result.score)
  };

  const updatedStats: UserStats = {
    ...stats,
    totalGamesPlayed: stats.totalGamesPlayed + 1,
    totalScore: stats.totalScore + result.score,
    totalCorrect: stats.totalCorrect + result.correctCount,
    totalWrong: stats.totalWrong + result.wrongCount,
    currentStreak: streakInfo.currentStreak,
    bestStreak: streakInfo.bestStreak,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    highScores: newHighScores
  };

  saveUserStats(updatedStats);

  // Save to leaderboard
  addLeaderboardEntry({
    playerName: 'Kaşif',
    mode: result.mode,
    difficulty: result.difficulty,
    score: result.score,
    accuracy: result.accuracy,
    date: result.date
  });

  return { stats: updatedStats, isHighScore };
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch {
    // ignore
  }
}
