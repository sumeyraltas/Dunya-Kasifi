import React, { useState } from 'react';
import { Trophy, Flame, Target, BookOpen, Award, CheckCircle2, Lock, Calendar, Star } from 'lucide-react';
import { UserStats } from '../types.ts';
import { ALL_BADGES } from '../data/badges.ts';
import { CONTINENTS, COUNTRIES } from '../data/countries.ts';
import { loadLeaderboard } from '../utils/storage.ts';
import { soundService } from '../utils/sound.ts';

interface StatsScreenProps {
  stats: UserStats;
  language: 'tr' | 'en';
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ stats, language }) => {
  const isTr = language === 'tr';
  const [activeSubTab, setActiveSubTab] = useState<'badges' | 'leaderboard'>('badges');
  const leaderboard = loadLeaderboard();

  // Continent learned statistics
  const continentStats = CONTINENTS.map(cont => {
    const totalInContinent = COUNTRIES.filter(c => c.continent === cont.key);
    const learnedInContinent = totalInContinent.filter(c => stats.learnedCountries.includes(c.code));
    const percent = totalInContinent.length > 0
      ? Math.round((learnedInContinent.length / totalInContinent.length) * 100)
      : 0;

    return {
      ...cont,
      total: totalInContinent.length,
      learned: learnedInContinent.length,
      percent
    };
  });

  const totalAnswered = stats.totalCorrect + stats.totalWrong;
  const overallAccuracy = totalAnswered > 0 
    ? Math.round((stats.totalCorrect / totalAnswered) * 100) 
    : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 pb-20 select-none">
      
      {/* Top Header */}
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>🏆</span>
          <span>{isTr ? 'İstatistikler & Başarılar' : 'Stats & Achievements'}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTr ? 'Kişisel ilerlemen ve kazandığın rozetler' : 'Your personal journey and unlocked badges'}
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">{isTr ? 'Öğrenilen' : 'Learned'}</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
            {stats.learnedCountries.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            / {COUNTRIES.length} {isTr ? 'ülke' : 'countries'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">{isTr ? 'Günlük Seri' : 'Streak'}</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <span className="text-xl font-black text-orange-600 dark:text-orange-400 tabular-nums">
            {stats.currentStreak} {isTr ? 'Gün' : 'Days'}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {isTr ? 'En iyi: ' : 'Best: '} {stats.bestStreak}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">{isTr ? 'Toplam Puan' : 'Total Score'}</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
            {stats.totalScore}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {stats.totalGamesPlayed} {isTr ? 'oyun' : 'games'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">{isTr ? 'Doğruluk' : 'Accuracy'}</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            %{overallAccuracy}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {stats.totalCorrect} {isTr ? 'doğru' : 'correct'}
          </span>
        </div>
      </div>

      {/* Progress by Continent Bars */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">
          {isTr ? 'Kıtalara Göre Öğrenme Durumu' : 'Learning Progress by Continent'}
        </h3>
        <div className="space-y-3">
          {continentStats.map(item => (
            <div key={item.key}>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">
                  {isTr ? item.label_tr : item.label_en}
                </span>
                <span className="text-slate-400 tabular-nums">
                  {item.learned} / {item.total} (%{item.percent})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub tabs: Badges vs Leaderboard */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-4">
        <button
          onClick={() => {
            soundService.playClick();
            setActiveSubTab('badges');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'badges'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isTr ? 'Başarı Rozetleri' : 'Badges'}</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setActiveSubTab('leaderboard');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'leaderboard'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{isTr ? 'Liderlik Tablosu' : 'Leaderboard'}</span>
        </button>
      </div>

      {/* Badges Grid */}
      {activeSubTab === 'badges' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_BADGES.map(badge => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-800 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-950/60'
                      : 'bg-slate-200 dark:bg-slate-700 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {isTr ? badge.title_tr : badge.title_en}
                    </h4>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {isTr ? badge.desc_tr : badge.desc_en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Leaderboard Table */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              {isTr ? 'Henüz kaydedilmiş skor yok. Bir oyun tamamla!' : 'No recorded scores yet. Complete a quiz to see rankings!'}
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => {
                const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 text-center font-bold text-sm">
                        {rankBadge}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                          {entry.mode} Modu <span className="text-xs text-slate-400 font-normal">({entry.difficulty})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{entry.date ? new Date(entry.date).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-blue-600 dark:text-blue-400 tabular-nums">
                        {entry.score} pts
                      </div>
                      <div className="text-[10px] text-emerald-500 font-bold">
                        %{entry.accuracy} {isTr ? 'doğruluk' : 'acc'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
