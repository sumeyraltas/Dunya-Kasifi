import React, { useState } from 'react';
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Sliders, 
  RotateCcw, 
  Check, 
  HelpCircle, 
  Info, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { AppSettings, Difficulty } from '../types.ts';
import { resetAllData } from '../utils/storage.ts';
import { soundService } from '../utils/sound.ts';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetApp: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetApp
}) => {
  const isTr = settings.language === 'tr';
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const handleLangChange = (lang: 'tr' | 'en') => {
    soundService.playClick();
    onUpdateSettings({ language: lang });
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    soundService.playClick();
    onUpdateSettings({ defaultDifficulty: diff });
  };

  const handleReset = () => {
    soundService.playHeartLost();
    resetAllData();
    onResetApp();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-20 select-none">
      
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>⚙️</span>
          <span>{isTr ? 'Uygulama Ayarları' : 'Settings'}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTr ? 'Ses, dil ve oyun tercihlerini kişiselleştir' : 'Configure language, audio & difficulty preferences'}
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Language Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isTr ? 'Arayüz Dili' : 'Interface Language'}
              </h3>
              <p className="text-xs text-slate-400">
                {isTr ? 'Uygulamanın genel dilini belirler' : 'Sets UI display language'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLangChange('tr')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                settings.language === 'tr'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇹🇷 Türkçe</span>
              {settings.language === 'tr' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleLangChange('en')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                settings.language === 'en'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇬🇧 English</span>
              {settings.language === 'en' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Audio & Voice Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isTr ? 'Oyun Ses Efektleri' : 'Sound Effects'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isTr ? 'Doğru/yanlış bildirim sesleri' : 'Auditory feedback on answers'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                soundService.setSoundEnabled(next);
                onUpdateSettings({ soundEnabled: next });
                if (next) soundService.playClick();
              }}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-700/60" />

          {/* TTS Speech Synthesis */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isTr ? 'Sesli Okuma (TTS)' : 'Voice Pronunciation (TTS)'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isTr ? 'Ülke ve başkent telaffuzlarını dinletir' : 'Pronounce country names aloud'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !settings.ttsEnabled;
                soundService.setTtsEnabled(next);
                onUpdateSettings({ ttsEnabled: next });
                soundService.playClick();
              }}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 ${
                settings.ttsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  settings.ttsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* TTS Speed Slider */}
          {settings.ttsEnabled && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">
                  {isTr ? 'Okuma Hızı' : 'Voice Speed'}
                </span>
                <span className="text-slate-400">{settings.ttsVoiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.1"
                value={settings.ttsVoiceSpeed}
                onChange={(e) => {
                  const spd = parseFloat(e.target.value);
                  soundService.setTtsSpeed(spd);
                  onUpdateSettings({ ttsVoiceSpeed: spd });
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          )}

        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isTr ? 'Karanlık Mod' : 'Dark Mode'}
              </h4>
              <p className="text-xs text-slate-400">
                {isTr ? 'Göz yormayan koyu tema' : 'Night time eye comfort theme'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.playClick();
              onUpdateSettings({ darkMode: !settings.darkMode });
            }}
            className={`w-12 h-7 rounded-full transition-colors relative p-0.5 ${
              settings.darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                settings.darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset Progress Section */}
        <div className="bg-rose-50/60 dark:bg-rose-950/20 rounded-3xl p-4 border border-rose-200 dark:border-rose-900/60">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                {isTr ? 'Verileri Sıfırla' : 'Reset All Progress'}
              </h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                {isTr ? 'Öğrenilen ülkeler, puanlar ve rozetler silinir' : 'Clears all learned countries, high scores and badges'}
              </p>
            </div>
          </div>

          {!showConfirmReset ? (
            <button
              onClick={() => {
                soundService.playClick();
                setShowConfirmReset(true);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              {isTr ? 'Verileri Sıfırla...' : 'Reset Data...'}
            </button>
          ) : (
            <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-rose-300 dark:border-rose-800 space-y-2 animate-fade-in">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isTr ? 'Emin misiniz? Bu işlem geri alınamaz!' : 'Are you sure? This cannot be undone!'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                >
                  {isTr ? 'Evet, Sıfırla' : 'Yes, Reset'}
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  {isTr ? 'Vazgeç' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>{isTr ? 'Veriler başarıyla sıfırlandı!' : 'Data reset successfully!'}</span>
            </div>
          )}
        </div>

        {/* About App Box */}
        <div className="p-4 text-center text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-600 dark:text-slate-400">
            Dünya Kaşifi • World Explorer v1.0
          </p>
          <p>
            {isTr 
              ? 'Tüm dünya ülkeleri, bayrakları ve başkentleri için eğitici mobil coğrafya oyunu.'
              : 'Interactive mobile geography game for learning world countries, flags, and capitals.'}
          </p>
        </div>

      </div>
    </div>
  );
};
