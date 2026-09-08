import React, { useState } from 'react';
import { X, Play, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { CapitalQuizSubMode, Difficulty, GameMode } from '../types.ts';
import { soundService } from '../utils/sound.ts';

interface DifficultyModalProps {
  mode: GameMode;
  isOpen: boolean;
  onClose: () => void;
  onStart: (difficulty: Difficulty, subMode?: CapitalQuizSubMode) => void;
  language: 'tr' | 'en';
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  mode,
  isOpen,
  onClose,
  onStart,
  language
}) => {
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>('easy');
  const [subMode, setSubMode] = useState<CapitalQuizSubMode>('country_to_capital');

  if (!isOpen) return null;
  const isTr = language === 'tr';

  const modeTitles: Record<GameMode, { tr: string; en: string; icon: string; desc_tr: string; desc_en: string }> = {
    map: {
      tr: 'Harita Modu',
      en: 'Map Tap Mode',
      icon: '🗺️',
      desc_tr: 'İnteraktif dünya haritasında hedef ülkeleri dokunarak bul.',
      desc_en: 'Tap and locate target countries on the interactive world map.'
    },
    flag: {
      tr: 'Bayrak Quiz',
      en: 'Flag Quiz',
      icon: '🚩',
      desc_tr: 'Ekrana gelen bayrakların hangi ülkeye ait olduğunu bil.',
      desc_en: 'Identify the country for each presented national flag.'
    },
    capital: {
      tr: 'Başkent Quiz',
      en: 'Capital Quiz',
      icon: '🏛️',
      desc_tr: 'Ülkelerin başkentlerini veya başkentlerin ülkelerini eşleştir.',
      desc_en: 'Match countries with their capitals or vice versa.'
    },
    learn: {
      tr: 'Öğrenme Modu',
      en: 'Learn Mode',
      icon: '📖',
      desc_tr: 'Flashcardlar ile Türkçe & İngilizce ülkeleri ve başkentleri öğren.',
      desc_en: 'Master countries in Turkish and English with interactive flashcards.'
    },
    mixed: {
      tr: 'Genel Karma Quiz',
      en: 'Grand Mixed Quiz',
      icon: '⚡',
      desc_tr: 'Tüm oyun modlarından harmanlanmış 12 soruluk test.',
      desc_en: 'A 12-question challenge mixing all modes for maximum mastery.'
    }
  };

  const currentMode = modeTitles[mode];

  const diffCards: { key: Difficulty; title: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      key: 'easy',
      title: isTr ? 'Kolay' : 'Easy',
      desc: isTr ? 'Büyük ve en bilinen ülkeler' : 'Major, well-known global nations',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      color: 'hover:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
    },
    {
      key: 'medium',
      title: isTr ? 'Orta' : 'Medium',
      desc: isTr ? 'Daha geniş ülke yelpazesi' : 'Expanded pool of countries worldwide',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: 'hover:border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
    },
    {
      key: 'hard',
      title: isTr ? 'Zor' : 'Hard',
      desc: isTr ? 'Küçük ülkeler, adalar ve benzer sınırlar' : 'Small nations, archipelagos & borders',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      color: 'hover:border-purple-400 bg-purple-50/50 dark:bg-purple-950/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentMode.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isTr ? currentMode.tr : currentMode.en}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTr ? 'Zorluk ve Seçenekler' : 'Difficulty & Options'}
              </p>
            </div>
          </div>
          <button
            id="close-diff-modal"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode description */}
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {isTr ? currentMode.desc_tr : currentMode.desc_en}
        </p>

        {/* Capital submode toggle if capital quiz */}
        {mode === 'capital' && (
          <div className="mt-4 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex gap-1">
            <button
              onClick={() => {
                soundService.playClick();
                setSubMode('country_to_capital');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                subMode === 'country_to_capital'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isTr ? 'Ülke → Başkent' : 'Country → Capital'}
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setSubMode('capital_to_country');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                subMode === 'capital_to_country'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isTr ? 'Başkent → Ülke (Ters)' : 'Capital → Country (Rev)'}
            </button>
          </div>
        )}

        {/* Difficulty Selection */}
        <div className="mt-4 space-y-2.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {isTr ? 'Zorluk Seviyesi Seç' : 'Select Difficulty'}
          </label>
          {diffCards.map(item => {
            const isSelected = selectedDiff === item.key;
            return (
              <div
                key={item.key}
                onClick={() => {
                  soundService.playClick();
                  setSelectedDiff(item.key);
                }}
                className={`flex items-center gap-3.5 p-3 rounded-2xl border-2 cursor-pointer transition-all ${item.color} ${
                  isSelected
                    ? 'border-blue-500 dark:border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">
                      {item.title}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white">
                        {isTr ? 'Seçildi' : 'Selected'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Button */}
        <button
          id="modal-start-game-btn"
          onClick={() => {
            soundService.playClick();
            onStart(selectedDiff, subMode);
          }}
          className="mt-6 w-full py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>{isTr ? 'Oyunu Başlat' : 'Start Game'}</span>
        </button>

      </div>
    </div>
  );
};
