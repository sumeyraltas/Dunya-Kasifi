import React, { useState, useEffect } from 'react';
import { AppSettings, CapitalQuizSubMode, Difficulty, GameMode, QuizResult, UserStats, Badge } from './types.ts';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_STATS, 
  loadAppSettings, 
  loadUserStats, 
  recordQuizCompletion, 
  saveAppSettings, 
  saveUserStats, 
  updateDailyStreak 
} from './utils/storage.ts';
import { soundService } from './utils/sound.ts';
import { ALL_BADGES, checkNewBadges } from './data/badges.ts';

import { Header } from './components/Header.tsx';
import { TabBar, MainTab } from './components/TabBar.tsx';
import { HomeMenu } from './components/HomeMenu.tsx';
import { DifficultyModal } from './components/DifficultyModal.tsx';
import { FlagGame } from './components/FlagGame.tsx';
import { CapitalGame } from './components/CapitalGame.tsx';
import { MapGame } from './components/MapGame.tsx';
import { LearnMode } from './components/LearnMode.tsx';
import { MixedQuizGame } from './components/MixedQuizGame.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { StatsScreen } from './components/StatsScreen.tsx';
import { SettingsScreen } from './components/SettingsScreen.tsx';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadAppSettings);
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  // Active quiz session state
  const [activeGame, setActiveGame] = useState<{
    mode: GameMode;
    difficulty: Difficulty;
    subMode?: CapitalQuizSubMode;
  } | null>(null);

  // In-game live telemetry for Header
  const [inGameLives, setInGameLives] = useState<number>(3);
  const [inGameScore, setInGameScore] = useState<number>(0);

  // Difficulty modal state
  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean;
    mode: GameMode;
  }>({ isOpen: false, mode: 'flag' });

  // Quiz Result & Newly Unlocked Badges
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);

  // Apply dark mode and sound settings on mount / update
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    soundService.setSoundEnabled(settings.soundEnabled);
    soundService.setTtsEnabled(settings.ttsEnabled);
    soundService.setTtsSpeed(settings.ttsVoiceSpeed);
  }, [settings]);

  // Check daily streak on app load
  useEffect(() => {
    const updated = updateDailyStreak(stats);
    if (updated.streakUpdated) {
      const newStats = {
        ...stats,
        currentStreak: updated.currentStreak,
        bestStreak: updated.bestStreak,
        lastPlayedDate: new Date().toISOString().split('T')[0]
      };
      setStats(newStats);
      saveUserStats(newStats);
    }
  }, []);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveAppSettings(updated);
  };

  const handleSelectMode = (mode: GameMode) => {
    if (mode === 'learn') {
      setActiveTab('learn');
      setActiveGame(null);
      setCurrentResult(null);
      return;
    }
    setDiffModal({ isOpen: true, mode });
  };

  const handleStartGame = (difficulty: Difficulty, subMode?: CapitalQuizSubMode) => {
    setDiffModal({ isOpen: false, mode: diffModal.mode });
    setCurrentResult(null);
    setInGameLives(3);
    setInGameScore(0);
    setActiveGame({
      mode: diffModal.mode,
      difficulty,
      subMode: subMode || 'country_to_capital'
    });
  };

  const handleFinishQuiz = (result: QuizResult) => {
    // Record to storage and update streak & high scores
    const { stats: updatedStats, isHighScore } = recordQuizCompletion(result);
    
    // Check for badges
    const newBadgeIds = checkNewBadges(updatedStats);
    if (newBadgeIds.length > 0) {
      updatedStats.unlockedBadgeIds = Array.from(
        new Set([...updatedStats.unlockedBadgeIds, ...newBadgeIds])
      );
      saveUserStats(updatedStats);
    }

    const unlockedBadgeObjects = ALL_BADGES.filter(b => newBadgeIds.includes(b.id));

    setStats(updatedStats);
    setNewlyUnlockedBadges(unlockedBadgeObjects);
    setCurrentResult({ ...result, newHighScore: isHighScore });
    setActiveGame(null);
  };

  const handleToggleLearned = (countryCode: string) => {
    const current = new Set(stats.learnedCountries);
    if (current.has(countryCode)) {
      current.delete(countryCode);
    } else {
      current.add(countryCode);
    }
    const updatedLearned = Array.from(current);
    const updatedStats: UserStats = {
      ...stats,
      learnedCountries: updatedLearned
    };

    // Check badges for learned count
    const newBadgeIds = checkNewBadges(updatedStats);
    if (newBadgeIds.length > 0) {
      updatedStats.unlockedBadgeIds = Array.from(
        new Set([...updatedStats.unlockedBadgeIds, ...newBadgeIds])
      );
    }

    setStats(updatedStats);
    saveUserStats(updatedStats);
  };

  const handleQuitGame = () => {
    setActiveGame(null);
    setCurrentResult(null);
  };

  const handleResetApp = () => {
    setStats(DEFAULT_STATS);
    setActiveGame(null);
    setCurrentResult(null);
  };

  // Determine current screen content
  const inGame = activeGame !== null;
  const isTr = settings.language === 'tr';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Universal App Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        stats={stats}
        inGame={inGame}
        lives={inGameLives}
        score={inGameScore}
        onQuitGame={handleQuitGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        
        {/* If Active Game is Running */}
        {activeGame ? (
          <div className="flex-1 flex flex-col justify-center">
            {activeGame.mode === 'flag' && (
              <FlagGame
                difficulty={activeGame.difficulty}
                language={settings.language}
                onFinishQuiz={handleFinishQuiz}
                onQuit={handleQuitGame}
                onUpdateGameStatus={(lives, score) => {
                  setInGameLives(lives);
                  setInGameScore(score);
                }}
              />
            )}

            {activeGame.mode === 'capital' && (
              <CapitalGame
                difficulty={activeGame.difficulty}
                subMode={activeGame.subMode || 'country_to_capital'}
                language={settings.language}
                onFinishQuiz={handleFinishQuiz}
                onQuit={handleQuitGame}
                onUpdateGameStatus={(lives, score) => {
                  setInGameLives(lives);
                  setInGameScore(score);
                }}
              />
            )}

            {activeGame.mode === 'map' && (
              <MapGame
                difficulty={activeGame.difficulty}
                language={settings.language}
                onFinishQuiz={handleFinishQuiz}
                onQuit={handleQuitGame}
                onUpdateGameStatus={(lives, score) => {
                  setInGameLives(lives);
                  setInGameScore(score);
                }}
              />
            )}

            {activeGame.mode === 'mixed' && (
              <MixedQuizGame
                difficulty={activeGame.difficulty}
                language={settings.language}
                onFinishQuiz={handleFinishQuiz}
                onQuit={handleQuitGame}
                onUpdateGameStatus={(lives, score) => {
                  setInGameLives(lives);
                  setInGameScore(score);
                }}
              />
            )}
          </div>
        ) : currentResult ? (
          /* Result / Score Screen */
          <ResultScreen
            result={currentResult}
            newBadges={newlyUnlockedBadges}
            onPlayAgain={() => {
              if (currentResult) {
                handleStartGame(currentResult.difficulty);
              }
            }}
            onGoHome={() => {
              setCurrentResult(null);
              setActiveTab('home');
            }}
            language={settings.language}
          />
        ) : (
          /* Tab Navigation Views */
          <div className="flex-1">
            {activeTab === 'home' && (
              <HomeMenu
                stats={stats}
                onSelectMode={handleSelectMode}
                language={settings.language}
              />
            )}

            {activeTab === 'learn' && (
              <LearnMode
                stats={stats}
                onToggleLearned={handleToggleLearned}
                language={settings.language}
              />
            )}

            {activeTab === 'map' && (
              <div className="pt-2">
                <div className="max-w-2xl mx-auto px-4 mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {isTr ? 'Serbest Harita Keşfi' : 'Free Map Explorer'}
                  </span>
                  <button
                    onClick={() => handleSelectMode('map')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs active:scale-95"
                  >
                    {isTr ? 'Harita Quizini Başlat' : 'Start Map Quiz'}
                  </button>
                </div>
                <MapGame
                  difficulty="easy"
                  language={settings.language}
                  onFinishQuiz={handleFinishQuiz}
                  onQuit={() => setActiveTab('home')}
                  onUpdateGameStatus={() => {}}
                />
              </div>
            )}

            {activeTab === 'stats' && (
              <StatsScreen
                stats={stats}
                language={settings.language}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetApp={handleResetApp}
              />
            )}
          </div>
        )}

      </main>

      {/* Difficulty Selection Modal */}
      <DifficultyModal
        mode={diffModal.mode}
        isOpen={diffModal.isOpen}
        onClose={() => setDiffModal({ ...diffModal, isOpen: false })}
        onStart={handleStartGame}
        language={settings.language}
      />

      {/* Bottom Tab Bar (Visible when not actively playing a quiz) */}
      {!inGame && !currentResult && (
        <TabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          language={settings.language}
        />
      )}

    </div>
  );
}
