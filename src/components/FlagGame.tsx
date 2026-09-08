import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, XCircle, Sparkles, Volume2 } from 'lucide-react';
import { Country, Difficulty, QuizQuestion, QuizResult } from '../types.ts';
import { generateFlagQuestions } from '../utils/quizGenerator.ts';
import { getFlagUrl } from '../data/countries.ts';
import { soundService } from '../utils/sound.ts';

interface FlagGameProps {
  difficulty: Difficulty;
  language: 'tr' | 'en';
  onFinishQuiz: (result: QuizResult) => void;
  onQuit: () => void;
  onUpdateGameStatus: (lives: number, score: number) => void;
}

const QUESTION_TIME_LIMIT = 10; // seconds

export const FlagGame: React.FC<FlagGameProps> = ({
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
  const [imgError, setImgError] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const gameStartTimeRef = useRef<number>(Date.now());

  // Initialize questions
  useEffect(() => {
    const qList = generateFlagQuestions(difficulty, 10);
    setQuestions(qList);
    gameStartTimeRef.current = Date.now();
  }, [difficulty]);

  // Sync lives and score to header
  useEffect(() => {
    onUpdateGameStatus(lives, score);
  }, [lives, score, onUpdateGameStatus]);

  // Timer per question
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

  const proceedAfterDelay = (remainingLives: number) => {
    setTimeout(() => {
      if (remainingLives <= 0 || currentIndex + 1 >= questions.length) {
        // End Game
        const totalSpentSec = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
        const total = correctCount + wrongCount + (remainingLives <= 0 ? 1 : 0);
        const acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;

        onFinishQuiz({
          mode: 'flag',
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
        // Next Question
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setBonusEarned(false);
        setImgError(false);
      }
    }, 1400);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        Loading questions...
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const targetCountry = currentQ.targetCountry;
  const flagUrl = getFlagUrl(targetCountry.code);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center">
      
      {/* Progress & Timer Header */}
      <div className="w-full flex items-center justify-between gap-3 mb-3">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isTr ? 'Soru' : 'Question'} {currentIndex + 1} / {questions.length}
        </div>
        
        {/* Countdown pill */}
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
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-blue-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Flag Showcase Card */}
      <div className="w-full bg-white dark:bg-slate-800/90 rounded-3xl p-5 shadow-lg border border-slate-200/80 dark:border-slate-700 flex flex-col items-center relative overflow-hidden">
        
        {/* Speed bonus indicator banner */}
        {bonusEarned && (
          <div className="absolute top-2 right-3 flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs animate-bounce">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>+5 Hızlı Bonus</span>
          </div>
        )}

        {/* Flag Image Container */}
        <div className="w-48 h-32 sm:w-56 sm:h-36 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center my-2">
          {!imgError ? (
            <img
              src={flagUrl}
              alt="Country Flag"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl select-none">{targetCountry.flag_emoji}</span>
          )}
        </div>

        {/* Prompt */}
        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">
          {isTr ? currentQ.prompt_tr : currentQ.prompt_en}
        </p>

        {/* Pronunciation helper button when answer is checked */}
        {isAnswerChecked && (
          <button
            onClick={() => soundService.speak(isTr ? targetCountry.name_tr : targetCountry.name_en, isTr ? 'tr' : 'en')}
            className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isTr ? targetCountry.name_tr : targetCountry.name_en}</span>
          </button>
        )}
      </div>

      {/* 4 Multiple Choice Options */}
      <div className="w-full mt-5 grid grid-cols-1 gap-2.5">
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

          const optionName = isTr ? option.name_tr : option.name_en;
          const letters = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={option.code}
              id={`flag-opt-${idx}`}
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
                <span>{optionName}</span>
              </div>

              {isAnswerChecked && isCorrectOption && (
                <CheckCircle2 className="w-5 h-5 text-white animate-scale-in" />
              )}
              {isAnswerChecked && isUserSelected && !isCorrectOption && (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
