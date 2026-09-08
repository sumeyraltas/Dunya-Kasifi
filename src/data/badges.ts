import { Badge, UserStats } from '../types.ts';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_quiz',
    title_tr: 'İlk Adım',
    title_en: 'First Step',
    desc_tr: 'İlk quizini başarıyla tamamla.',
    desc_en: 'Complete your first quiz game.',
    icon: '🎯',
    unlocked: false,
    category: 'score',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'flag_master',
    title_tr: 'Bayrak Dehası',
    title_en: 'Flag Master',
    desc_tr: 'Bayrak modunda 100 puan veya üzeri al.',
    desc_en: 'Score 100+ points in Flag Quiz.',
    icon: '🚩',
    unlocked: false,
    category: 'flags',
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'capital_expert',
    title_tr: 'Başkent Profesörü',
    title_en: 'Capital Professor',
    desc_tr: 'Başkent modunda 10 soru doğru bil.',
    desc_en: 'Answer 10 capital questions correctly.',
    icon: '🏛️',
    unlocked: false,
    category: 'score',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'map_explorer',
    title_tr: 'Harita Ustası',
    title_en: 'Map Explorer',
    desc_tr: 'Harita modunda 5 ülkeyi hatasız bul.',
    desc_en: 'Locate 5 countries on the map without mistakes.',
    icon: '🗺️',
    unlocked: false,
    category: 'map',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'streak_3',
    title_tr: 'Ateşli Seri',
    title_en: 'On Fire',
    desc_tr: '3 günlük giriş serisine ulaş.',
    desc_en: 'Achieve a 3-day daily play streak.',
    icon: '🔥',
    unlocked: false,
    category: 'streak',
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'streak_7',
    title_tr: 'Haftalık Kaşif',
    title_en: 'Weekly Explorer',
    desc_tr: '7 günlük giriş serisine ulaş.',
    desc_en: 'Achieve a 7-day daily play streak.',
    icon: '⚡',
    unlocked: false,
    category: 'streak',
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'learned_20',
    title_tr: '20 Ülke Öğrenildi',
    title_en: '20 Countries Learned',
    desc_tr: 'Flashcard modunda 20 ülkeyi öğrendim olarak işaretle.',
    desc_en: 'Mark 20 countries as learned in flashcards.',
    icon: '📚',
    unlocked: false,
    category: 'learning',
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'learned_50',
    title_tr: '50 Ülke Bildin',
    title_en: '50 Countries Known',
    desc_tr: '50 ülkeyi başarıyla öğren.',
    desc_en: 'Master 50 countries.',
    icon: '🌟',
    unlocked: false,
    category: 'learning',
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'europe_expert',
    title_tr: 'Avrupa Uzmanı',
    title_en: 'Europe Expert',
    desc_tr: 'Avrupa kıtasından 15 ülke öğren veya doğru yanıtla.',
    desc_en: 'Learn or answer 15 European countries.',
    icon: '🏰',
    unlocked: false,
    category: 'learning',
    progress: 0,
    maxProgress: 15
  },
  {
    id: 'high_scorer',
    title_tr: 'Yüksek Uçan',
    title_en: 'High Flyer',
    desc_tr: 'Toplamda 500 puana ulaş.',
    desc_en: 'Reach an accumulative total of 500 points.',
    icon: '🏆',
    unlocked: false,
    category: 'score',
    progress: 0,
    maxProgress: 500
  }
];

export function checkNewBadges(stats: UserStats): string[] {
  const newUnlocked: string[] = [];
  const current = new Set(stats.unlockedBadgeIds);

  if (!current.has('first_quiz') && stats.totalGamesPlayed >= 1) {
    newUnlocked.push('first_quiz');
  }
  if (!current.has('streak_3') && stats.currentStreak >= 3) {
    newUnlocked.push('streak_3');
  }
  if (!current.has('streak_7') && stats.currentStreak >= 7) {
    newUnlocked.push('streak_7');
  }
  if (!current.has('learned_20') && stats.learnedCountries.length >= 20) {
    newUnlocked.push('learned_20');
  }
  if (!current.has('learned_50') && stats.learnedCountries.length >= 50) {
    newUnlocked.push('learned_50');
  }
  if (!current.has('high_scorer') && stats.totalScore >= 500) {
    newUnlocked.push('high_scorer');
  }

  // Check flag score
  const flagScore = Math.max(
    stats.highScores['flag_easy'] || 0,
    stats.highScores['flag_medium'] || 0,
    stats.highScores['flag_hard'] || 0
  );
  if (!current.has('flag_master') && flagScore >= 100) {
    newUnlocked.push('flag_master');
  }

  return newUnlocked;
}
