import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Flag, 
  Building2, 
  Globe2, 
  Languages,
  Lightbulb
} from 'lucide-react';
import { Country, Difficulty, QuizQuestion, QuizResult } from '../types.ts';
import { generateMixedQuestions } from '../utils/quizGenerator.ts';
import { getFlagUrl } from '../data/countries.ts';
import { soundService } from '../utils/sound.ts';
import { InteractiveWorldMap } from './InteractiveWorldMap.tsx';

interface MixedQuizGameProps {
  difficulty: Difficulty;
  language: 'tr' | 'en';
  onFinishQuiz: (result: QuizResult) => void;
  onQuit: () => void;
  onUpdateGameStatus: (lives: number, score: number) => void;
}

const QUESTION_TIME_LIMIT = 12;

export const MixedQuizGame: React.FC<MixedQuizGameProps> = ({
  difficulty,
  language,
  onFinishQuiz,
  onQuit,
  onUpdateGameStatus
}) => {
  const isTr = language === 'tr';
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [bonusEarned, setBonusEarned] = useState<boolean>(false);

  // Map-specific state
  const [mapFeedbackState, setMapFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [clickedMapCountryId, setClickedMapCountryId] = useState<string | null>(null);
  const [showMapHint, setShowMapHint] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const gameStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const qList = generateMixedQuestions(difficulty, 12);
    setQuestions(qList);
    gameStartTimeRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    onUpdateGameStatus(lives, score);
  }, [lives, score, onUpdateGameStatus]);

  useEffect(() => {
    if (isAnswerChecked || questions.length === 0) return;

    setTimeLeft(QUESTION_TIME_LIMIT);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswerChecked, questions.length]);

  const handleTimeOut = () => {
    if (isAnswerChecked) return;
    setIsAnswerChecked(true);
    soundService.playWrong();
    soundService.playHeartLost();

    if (questions[currentIndex]?.type === 'map') {
      setMapFeedbackState('wrong');
    }

    const newLives = lives - 1;
    setLives(newLives);
    setWrongCount(prev => prev + 1);

    proceedAfterDelay(newLives);
  };

  const handleSelect = (index: number) => {
    if (isAnswerChecked || questions.length === 0) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(index);
    setIsAnswerChecked(true);

    const curQ = questions[currentIndex];
    const isCorrect = index === curQ.correctOptionIndex;
    const timeSpent = (Date.now() - startTimeRef.current) / 1000;
    const isFast = timeSpent <= 5;

    if (isCorrect) {
      soundService.playCorrect();
      const points = isFast ? 15 : 10;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setBonusEarned(isFast);
      proceedAfterDelay(lives);
    } else {
      soundService.playWrong();
      soundService.playHeartLost();
      const newLives = lives - 1;
      setLives(newLives);
      setWrongCount(prev => prev + 1);
      proceedAfterDelay(newLives);
    }
  };

  const handleMapCountryClick = (countryCode: string) => {
    if (isAnswerChecked || mapFeedbackState !== 'idle' || questions.length === 0) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswerChecked(true);

    const curQ = questions[currentIndex];
    const isCorrect = countryCode === curQ.targetCountry.code;
    const timeSpent = (Date.now() - startTimeRef.current) / 1000;
    const isFast = timeSpent <= 5;

    setClickedMapCountryId(countryCode);

    if (isCorrect) {
      setMapFeedbackState('correct');
      soundService.playCorrect();
      const points = isFast ? 15 : 10;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setBonusEarned(isFast);
      proceedAfterDelay(lives);
    } else {
      setMapFeedbackState('wrong');
      soundService.playWrong();
      soundService.playHeartLost();
      const newLives = lives - 1;
      setLives(newLives);
      setWrongCount(prev => prev + 1);
      proceedAfterDelay(newLives);
    }
  };

  const proceedAfterDelay = (remainingLives: number) => {
    setTimeout(() => {
      if (remainingLives <= 0 || currentIndex + 1 >= questions.length) {
        const totalSpentSec = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
        const total = correctCount + wrongCount + (remainingLives <= 0 ? 1 : 0);
        const acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;

        onFinishQuiz({
          mode: 'mixed',
          difficulty,
          score,
          maxPossibleScore: questions.length * 15,
          correctCount,
          wrongCount,
          totalQuestions: questions.length,
          timeSpentSeconds: totalSpentSec,
          accuracy: acc,
          date: new Date().toISOString(),
          newHighScore: false,
          livesRemaining: Math.max(0, remainingLives)
        });
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setBonusEarned(false);
        setMapFeedbackState('idle');
        setClickedMapCountryId(null);
        setShowMapHint(false);
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        Loading Mixed Quiz...
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const targetCountry = currentQ.targetCountry;
  const isMapQuestion = currentQ.type === 'map';

  // Question Type Badges
  const typeIcons: Record<string, { label_tr: string; label_en: string; icon: React.ReactNode; color: string }> = {
    flag: { label_tr: 'Bayrak Sorusu', label_en: 'Flag Round', icon: <Flag className="w-3.5 h-3.5" />, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200' },
    capital: { label_tr: 'Başkent Sorusu', label_en: 'Capital Round', icon: <Building2 className="w-3.5 h-3.5" />, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200' },
    capital_reverse: { label_tr: 'Ters Başkent', label_en: 'Reverse Capital', icon: <Building2 className="w-3.5 h-3.5" />, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200' },
    map: { label_tr: 'Harita / Kıta', label_en: 'Map & Geography', icon: <Globe2 className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200' },
    en_match: { label_tr: 'İngilizce Adı', label_en: 'English Name Match', icon: <Languages className="w-3.5 h-3.5" />, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200' }
  };

  const currentTypeInfo = typeIcons[currentQ.type] || typeIcons['flag'];

  return (
    <div className={`w-full ${isMapQuestion ? 'max-w-2xl' : 'max-w-md'} mx-auto px-4 py-4 flex flex-col items-center transition-all duration-200`}>
      
      {/* Progress & Timer Header */}
      <div className="w-full flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isTr ? 'Soru' : 'Question'} {currentIndex + 1} / {questions.length}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentTypeInfo.color}`}>
            {currentTypeInfo.icon}
            <span>{isTr ? currentTypeInfo.label_tr : currentTypeInfo.label_en}</span>
          </span>
        </div>
        
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            timeLeft <= 3
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 animate-pulse ring-2 ring-rose-400/40'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="tabular-nums">{timeLeft}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="w-full bg-white dark:bg-slate-800/90 rounded-3xl p-5 shadow-lg border border-slate-200/80 dark:border-slate-700 flex flex-col items-center relative overflow-hidden text-center mb-4">
        
        {bonusEarned && (
          <div className="absolute top-2 right-3 flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs animate-bounce">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>+5 Hızlı Bonus</span>
          </div>
        )}

        {/* Dynamic Display based on type */}
        {currentQ.type === 'flag' ? (
          <div className="w-40 h-26 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 dark:border-slate-700 my-2 bg-slate-50 flex items-center justify-center">
            <img
              src={getFlagUrl(targetCountry.code)}
              alt="Flag"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        ) : currentQ.type === 'capital' || currentQ.type === 'capital_reverse' ? (
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center mb-2 shadow-inner">
            <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        ) : currentQ.type === 'map' ? (
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center mb-2 shadow-inner">
            <Globe2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 flex items-center justify-center mb-2 shadow-inner">
            <Languages className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        )}

        {/* Prompt Title */}
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1 mb-1">
          {isTr ? currentQ.prompt_tr : currentQ.prompt_en}
        </h3>
        
        <p className="text-xs font-medium text-slate-400">
          {targetCountry.continent}
        </p>

        {/* Map round hint & feedback messages */}
        {isMapQuestion && (
          <div className="mt-2 flex items-center gap-2">
            {mapFeedbackState === 'idle' && (
              <button
                type="button"
                onClick={() => setShowMapHint(true)}
                className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{isTr ? 'İpucu (Vurgula)' : 'Hint (Highlight)'}</span>
              </button>
            )}

            {mapFeedbackState === 'correct' && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isTr ? 'Harika! Doğru ülkeyi buldun.' : 'Great job! Correct nation found.'}</span>
              </div>
            )}

            {mapFeedbackState === 'wrong' && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 animate-in fade-in">
                <XCircle className="w-4 h-4" />
                <span>{isTr ? 'Doğru ülke sarı renkle gösterildi.' : 'Target highlighted in golden yellow.'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RENDER INTERACTIVE MAP OR 4 MULTIPLE-CHOICE BUTTONS */}
      {isMapQuestion ? (
        /* Real Interactive World Map */
        <div className="w-full">
          <InteractiveWorldMap
            targetCountryCode={targetCountry.code}
            feedbackState={mapFeedbackState}
            clickedCountryId={clickedMapCountryId}
            showHint={showMapHint}
            onCountryClick={handleMapCountryClick}
            language={language}
            heightClass="h-72 sm:h-80 md:h-96"
            autoFocusContinent={targetCountry.continent}
          />
        </div>
      ) : (
        /* 4 Multiple Choice Buttons for text/flag/capital rounds */
        <div className="w-full grid grid-cols-1 gap-2.5">
          {currentQ.options.map((option: Country, idx: number) => {
            const isCorrectOption = idx === currentQ.correctOptionIndex;
            const isUserSelected = selectedOption === idx;

            let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-blue-400 dark:hover:border-blue-500';
            
            if (isAnswerChecked) {
              if (isCorrectOption) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md ring-2 ring-emerald-300';
              } else if (isUserSelected) {
                btnStyle = 'bg-rose-500 text-white border-rose-500';
              } else {
                btnStyle = 'opacity-50 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400';
              }
            }

            let displayText = isTr ? option.name_tr : option.name_en;
            if (currentQ.type === 'capital') {
              displayText = isTr ? option.capital_tr : option.capital_en;
            } else if (currentQ.type === 'capital_reverse') {
              // NO flag emoji so the quiz isn't made trivially easy
              displayText = isTr ? option.name_tr : option.name_en;
            } else if (currentQ.type === 'en_match') {
              displayText = option.name_en;
            }

            const letters = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={option.code}
                id={`mixed-opt-${idx}`}
                disabled={isAnswerChecked}
                onClick={() => handleSelect(idx)}
                className={`w-full min-h-12 py-3 px-4 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-between transition-all active:scale-98 shadow-xs ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    isAnswerChecked && isCorrectOption ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {letters[idx]}
                  </span>
                  <span>{displayText}</span>
                </div>

                {isAnswerChecked && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
                {isAnswerChecked && isUserSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-white" />
                )}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};
