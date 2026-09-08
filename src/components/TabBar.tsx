import React from 'react';
import { Home, BookOpen, Globe2, Trophy, Settings } from 'lucide-react';
import { soundService } from '../utils/sound.ts';

export type MainTab = 'home' | 'learn' | 'map' | 'stats' | 'settings';

interface TabBarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  language: 'tr' | 'en';
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab, language }) => {
  const isTr = language === 'tr';

  const tabs: { key: MainTab; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: isTr ? 'Ana Sayfa' : 'Home', icon: <Home className="w-5 h-5" /> },
    { key: 'learn', label: isTr ? 'Kartlar' : 'Flashcards', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'map', label: isTr ? 'Harita' : 'Map', icon: <Globe2 className="w-5 h-5" /> },
    { key: 'stats', label: isTr ? 'Başarılar' : 'Badges', icon: <Trophy className="w-5 h-5" /> },
    { key: 'settings', label: isTr ? 'Ayarlar' : 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-16">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-btn-${tab.key}`}
              onClick={() => {
                soundService.playClick();
                onSelectTab(tab.key);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-blue-50 dark:bg-blue-950/60 scale-110' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
