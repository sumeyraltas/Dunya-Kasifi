import React from 'react';
import { 
  Globe2, 
  Flag, 
  Building2, 
  BookOpen, 
  Zap, 
  Flame, 
  Trophy, 
  ChevronRight, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { GameMode, UserStats } from '../types.ts';
import { soundService } from '../utils/sound.ts';
import { COUNTRIES } from '../data/countries.ts';

interface HomeMenuProps {
  stats: UserStats;
  onSelectMode: (mode: GameMode) => void;
  language: 'tr' | 'en';
}

export const HomeMenu: React.FC<HomeMenuProps> = ({
  stats,
  onSelectMode,
  language
}) => {
  const isTr = language === 'tr';

  const modes: {
    key: GameMode;
    title_tr: string;
    title_en: string;
    desc_tr: string;
    desc_en: string;
    badge_tr: string;
    badge_en: string;
    icon: string;
    gradient: string;
    shadow: string;
    border: string;
  }[] = [
    {
      key: 'map',
      title_tr: 'Harita Modu',
      title_en: 'Map Tap Mode',
      desc_tr: 'İnteraktif dünya haritasında hedef ülkeleri dokunarak bul.',
      desc_en: 'Explore the interactive SVG world map and locate nations.',
      badge_tr: 'İnteraktif SVG',
      badge_en: 'Interactive SVG',
      icon: '🗺️',
      gradient: 'from-blue-600 to-cyan-600',
      shadow: 'shadow-blue-500/20',
      border: 'hover:border-blue-400'
    },
    {
      key: 'flag',
      title_tr: 'Bayrak Quiz',
      title_en: 'Flag Quiz',
      desc_tr: 'Dünya bayraklarını tanı, 10 saniyelik sürede doğru ülkeyi seç.',
      desc_en: 'Identify world flags in dynamic 10-second fast rounds.',
      badge_tr: 'Popüler Mod',
      badge_en: 'Popular Mode',
      icon: '🚩',
      gradient: 'from-rose-500 to-red-600',
      shadow: 'shadow-rose-500/20',
      border: 'hover:border-rose-400'
    },
    {
      key: 'capital',
      title_tr: 'Başkent Quiz',
      title_en: 'Capital Quiz',
      desc_tr: 'Ülke-başkent eşleştirmeleri ve ters başkent modları.',
      desc_en: 'Test capitals with dual-mode country & capital matching.',
      badge_tr: 'Klasik Bilgi',
      badge_en: 'Classic Trivia',
      icon: '🏛️',
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-orange-500/20',
      border: 'hover:border-amber-400'
    },
    {
      key: 'learn',
      title_tr: 'İngilizce Flashcard',
      title_en: 'Learn & Flashcards',
      desc_tr: 'Türkçe & İngilizce telaffuzlar ile kaydırmalı öğrenme kartları.',
      desc_en: 'Bilingual flashcards with audio voice pronunciation.',
      badge_tr: 'Sesli Okuma (TTS)',
      badge_en: 'Voice TTS',
      icon: '📚',
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      border: 'hover:border-emerald-400'
    },
    {
      key: 'mixed',
      title_tr: 'Karma Şampiyona',
      title_en: 'Mixed Grand Quiz',
      desc_tr: 'Harita, bayrak, başkent ve dil sorularından oluşan 12 test.',
      desc_en: 'A 12-question master challenge covering all 4 game types.',
      badge_tr: '12 Soru • Bonus',
      badge_en: '12 Questions • Bonus',
      icon: '⚡',
      gradient: 'from-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/20',
      border: 'hover:border-purple-400'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 pb-20 select-none">
      
      {/* Daily Motivation & Streak Hero Banner */}
      <div className="w-full bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden mb-5">
        {/* Abstract globe outline glow */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTr ? 'Günün Kaşifi Görevi' : 'Explorer Daily Mission'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              {isTr ? 'Dünyayı Keşfetmeye Hazır mısın?' : 'Ready to Explore the World?'}
            </h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-sm leading-relaxed">
              {isTr 
                ? 'Haritada yerleri bul, bayrakları öğren ve rozetleri topla!' 
                : 'Locate countries, identify flags, and build your daily streak!'}
            </p>
          </div>

          <div className="flex flex-col items-center bg-white/15 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 shrink-0 ml-3">
            <Flame className="w-6 h-6 text-orange-400 fill-orange-400 animate-pulse" />
            <span className="text-lg font-black tracking-tight tabular-nums">
              {stats.currentStreak}
            </span>
            <span className="text-[9px] font-bold uppercase text-blue-200">
              {isTr ? 'Günlük Seri' : 'Day Streak'}
            </span>
          </div>
        </div>

        {/* Quick Stats bar inside hero */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-100 font-medium">
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-emerald-300" />
            <span>
              <strong className="text-white">{stats.learnedCountries.length}</strong> / {COUNTRIES.length} {isTr ? 'öğrenildi' : 'learned'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>
              {isTr ? 'Toplam Puan: ' : 'Score: '}
              <strong className="text-white">{stats.totalScore}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isTr ? 'Oyun Modunu Seç' : 'Choose Game Mode'}
        </h3>
        <span className="text-xs font-semibold text-slate-400">
          5 {isTr ? 'Farklı Mod' : 'Unique Modes'}
        </span>
      </div>

      {/* 5 Mode Cards */}
      <div className="space-y-3">
        {modes.map((modeItem) => {
          return (
            <div
              key={modeItem.key}
              id={`home-mode-${modeItem.key}`}
              onClick={() => {
                soundService.playClick();
                onSelectMode(modeItem.key);
              }}
              className={`w-full bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border-2 border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-between gap-4 ${modeItem.border}`}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                
                {/* Mode Icon Box with Gradient */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-linear-to-tr ${modeItem.gradient} flex items-center justify-center text-2xl shadow-md ${modeItem.shadow} shrink-0 text-white`}
                >
                  {modeItem.icon}
                </div>

                {/* Mode Text & Badge */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight truncate">
                      {isTr ? modeItem.title_tr : modeItem.title_en}
                    </h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                      {isTr ? modeItem.badge_tr : modeItem.badge_en}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
                    {isTr ? modeItem.desc_tr : modeItem.desc_en}
                  </p>
                </div>

              </div>

              {/* Right Chevron Button */}
              <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
