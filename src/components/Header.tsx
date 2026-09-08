import React from 'react';
import { Flame, Heart, Moon, Sun, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { AppSettings, UserStats } from '../types.ts';
import { soundService } from '../utils/sound.ts';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  stats: UserStats;
  inGame?: boolean;
  lives?: number;
  score?: number;
  onQuitGame?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  stats,
  inGame = false,
  lives = 3,
  score = 0,
  onQuitGame,
  title
}) => {
  const isTr = settings.language === 'tr';

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    soundService.setSoundEnabled(next);
    onUpdateSettings({ soundEnabled: next });
    if (next) soundService.playClick();
  };

  const toggleDark = () => {
    soundService.playClick();
    onUpdateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
        
        {/* Left Section: Back button if in game, or logo */}
        <div className="flex items-center gap-3">
          {inGame ? (
            <button
              id="header-back-btn"
              onClick={() => {
                soundService.playClick();
                if (onQuitGame) onQuitGame();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isTr ? 'Çıkış' : 'Exit'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-lg shadow-sm">
                🌍
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {isTr ? 'Dünya Kaşifi' : 'World Explorer'}
                </h1>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none">
                  {isTr ? 'Coğrafya & Bilgi Oyunu' : 'Geography Quiz & Learn'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Center: In-Game Status (Hearts & Score) or Title */}
        {inGame ? (
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/60">
              {[1, 2, 3].map(heartIdx => (
                <Heart
                  key={heartIdx}
                  className={`w-4 h-4 transition-all duration-300 ${
                    heartIdx <= lives
                      ? 'text-rose-500 fill-rose-500 scale-100'
                      : 'text-slate-300 dark:text-slate-700 scale-75'
                  }`}
                />
              ))}
            </div>

            {/* Score */}
            <div className="bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/60 flex items-center gap-1.5">
              <span className="text-amber-500 font-bold text-xs">⭐</span>
              <span className="font-extrabold text-sm text-amber-700 dark:text-amber-400 tabular-nums">
                {score}
              </span>
            </div>
          </div>
        ) : title ? (
          <div className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {title}
          </div>
        ) : (
          /* Daily streak badge when on main screen */
          <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-900/50 shadow-xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
              {stats.currentStreak} {isTr ? 'Gün Seri' : 'Days'}
            </span>
          </div>
        )}

        {/* Right Section: Sound toggle & Dark mode */}
        <div className="flex items-center gap-1.5">
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            title={settings.soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            id="darkmode-toggle-btn"
            onClick={toggleDark}
            title={settings.darkMode ? 'Açık Mod' : 'Karanlık Mod'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
