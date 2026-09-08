import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Share2, 
  Check, 
  Heart, 
  Clock, 
  Flame, 
  Sparkles, 
  Target 
} from 'lucide-react';
import { Badge, QuizResult } from '../types.ts';
import { soundService } from '../utils/sound.ts';

interface ResultScreenProps {
  result: QuizResult;
  newBadges: Badge[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  language: 'tr' | 'en';
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  newBadges,
  onPlayAgain,
  onGoHome,
  language
}) => {
  const isTr = language === 'tr';
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    soundService.playVictory();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const handleShare = () => {
    soundService.playClick();
    const modeName = {
      map: isTr ? 'Harita Modu' : 'Map Mode',
      flag: isTr ? 'Bayrak Quiz' : 'Flag Quiz',
      capital: isTr ? 'Başkent Quiz' : 'Capital Quiz',
      learn: isTr ? 'Öğrenme Modu' : 'Learn Mode',
      mixed: isTr ? 'Karma Quiz' : 'Mixed Quiz'
    }[result.mode];

    const shareText = `🌍 Dünya Kaşifi (World Explorer)
🎮 Mod: ${modeName} (${result.difficulty.toUpperCase()})
⭐ Puan: ${result.score} / ${result.maxPossibleScore}
🎯 Doğruluk: %${result.accuracy} (${result.correctCount}/${result.totalQuestions})
⏱️ Süre: ${result.timeSpentSeconds} sn
Sen de dünyayı keşfet! 🚩🗺️`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Performance tier
  let title = isTr ? 'Tebrikler Kaşif!' : 'Great Explorer!';
  let sub = isTr ? 'Harika bir performans sergiledin.' : 'Outstanding performance!';
  let medalEmoji = '🥉';

  if (result.accuracy >= 90) {
    title = isTr ? 'Efsanevi Coğrafyacı! 🌟' : 'Legendary Geographer! 🌟';
    sub = isTr ? 'Neredeyse kusursuz bir tur!' : 'Near flawless execution!';
    medalEmoji = '🥇';
  } else if (result.accuracy >= 70) {
    title = isTr ? 'Harika İş Çıkardın! 🎖️' : 'Great Job! 🎖️';
    sub = isTr ? 'Dünya bilgini adım adım geliştiriyorsun.' : 'Steadily mastering the globe.';
    medalEmoji = '🥈';
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col items-center">
      
      {/* Result Card */}
      <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Confetti / Medal Top Badge */}
        <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30 mb-3 animate-bounce">
          {medalEmoji}
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          {sub}
        </p>

        {/* Big Score Display */}
        <div className="my-5 p-4 w-full rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-around">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTr ? 'Toplam Puan' : 'Total Score'}
            </div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
              {result.score}
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTr ? 'Doğruluk' : 'Accuracy'}
            </div>
            <div className="text-3xl font-black text-emerald-500 tabular-nums">
              %{result.accuracy}
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="w-full grid grid-cols-2 gap-2 text-left mb-4">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">{isTr ? 'Doğru / Yanlış' : 'Correct / Wrong'}</div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                {result.correctCount} / {result.wrongCount}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">{isTr ? 'Toplam Süre' : 'Time Elapsed'}</div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                {result.timeSpentSeconds} {isTr ? 'saniye' : 'seconds'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">{isTr ? 'Kalan Can' : 'Lives Remaining'}</div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                {result.livesRemaining} / 3
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">{isTr ? 'Zorluk' : 'Difficulty'}</div>
              <div className="text-xs font-bold text-slate-800 dark:text-white uppercase">
                {result.difficulty}
              </div>
            </div>
          </div>
        </div>

        {/* Newly Unlocked Badges Notice */}
        {newBadges.length > 0 && (
          <div className="w-full mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-center gap-3 text-left">
            <span className="text-2xl">{newBadges[0].icon}</span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {isTr ? 'Yeni Rozet Açıldı!' : 'New Badge Unlocked!'}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                {isTr ? newBadges[0].title_tr : newBadges[0].title_en}
              </div>
            </div>
          </div>
        )}

        {/* Share Button */}
        <button
          id="share-score-btn"
          onClick={handleShare}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">
                {isTr ? 'Kopyalandı!' : 'Copied to Clipboard!'}
              </span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-blue-500" />
              <span>{isTr ? 'Skor Kartını Paylaş' : 'Share Score Card'}</span>
            </>
          )}
        </button>

      </div>

      {/* Action Buttons */}
      <div className="w-full flex gap-3 mt-4">
        <button
          id="play-again-btn"
          onClick={() => {
            soundService.playClick();
            onPlayAgain();
          }}
          className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isTr ? 'Tekrar Oyna' : 'Play Again'}</span>
        </button>

        <button
          id="go-home-btn"
          onClick={() => {
            soundService.playClick();
            onGoHome();
          }}
          className="flex-1 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{isTr ? 'Ana Menü' : 'Main Menu'}</span>
        </button>
      </div>

    </div>
  );
};
