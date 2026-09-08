export type Difficulty = 'easy' | 'medium' | 'hard';

export type Continent = 
  | 'Europe' 
  | 'Asia' 
  | 'Africa' 
  | 'Americas' 
  | 'Oceania';

export interface Country {
  code: string; // ISO 3166-1 alpha-2, e.g. "TR"
  name_tr: string;
  name_en: string;
  capital_tr: string;
  capital_en: string;
  continent: Continent;
  flag_emoji: string;
  difficulty: Difficulty;
  population?: string;
  hint_tr?: string;
  hint_en?: string;
}

export type GameMode = 
  | 'map' 
  | 'flag' 
  | 'capital' 
  | 'learn' 
  | 'mixed';

export type CapitalQuizSubMode = 'country_to_capital' | 'capital_to_country';

export interface QuizQuestion {
  id: string;
  type: 'flag' | 'capital' | 'capital_reverse' | 'map' | 'en_match';
  targetCountry: Country;
  prompt_tr: string;
  prompt_en: string;
  options: Country[]; // 4 options for multiple choice
  correctOptionIndex: number;
}

export interface QuizResult {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  maxPossibleScore: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  accuracy: number;
  date: string;
  newHighScore: boolean;
  livesRemaining: number;
}

export interface Badge {
  id: string;
  title_tr: string;
  title_en: string;
  desc_tr: string;
  desc_en: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'score' | 'learning' | 'streak' | 'map' | 'flags';
  progress: number;
  maxProgress: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  accuracy: number;
  date: string;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  totalCorrect: number;
  totalWrong: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  learnedCountries: string[]; // country codes
  highScores: Record<string, number>; // key: `${mode}_${difficulty}`
  unlockedBadgeIds: string[];
}

export interface AppSettings {
  language: 'tr' | 'en';
  soundEnabled: boolean;
  ttsEnabled: boolean;
  ttsVoiceSpeed: number; // 0.8 - 1.2
  darkMode: boolean;
  defaultDifficulty: Difficulty;
  vibrationEnabled: boolean;
}
