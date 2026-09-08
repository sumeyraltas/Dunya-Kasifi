import React, { useState, useMemo } from 'react';
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Search, 
  Bookmark, 
  Globe2, 
  Users, 
  Sparkles 
} from 'lucide-react';
import { CONTINENTS, COUNTRIES, getFlagUrl } from '../data/countries.ts';
import { Continent, Country, UserStats } from '../types.ts';
import { soundService } from '../utils/sound.ts';

interface LearnModeProps {
  stats: UserStats;
  onToggleLearned: (countryCode: string) => void;
  language: 'tr' | 'en';
}

export const LearnMode: React.FC<LearnModeProps> = ({
  stats,
  onToggleLearned,
  language
}) => {
  const isTr = language === 'tr';
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');

  // Filter countries
  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => {
      const matchContinent = selectedContinent === 'ALL' || c.continent === selectedContinent;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        c.name_tr.toLowerCase().includes(q) || 
        c.name_en.toLowerCase().includes(q) || 
        c.capital_tr.toLowerCase().includes(q) || 
        c.capital_en.toLowerCase().includes(q);
      return matchContinent && matchSearch;
    });
  }, [selectedContinent, searchQuery]);

  // Ensure index is within bounds
  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCountries.length - 1));
  const currentCountry: Country | undefined = filteredCountries[safeIndex];

  const isCurrentLearned = currentCountry 
    ? stats.learnedCountries.includes(currentCountry.code) 
    : false;

  const handleNext = () => {
    soundService.playClick();
    setIsFlipped(false);
    if (safeIndex < filteredCountries.length - 1) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    soundService.playClick();
    setIsFlipped(false);
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(filteredCountries.length - 1);
    }
  };

  const handleFlip = () => {
    soundService.playClick();
    setIsFlipped(prev => !prev);
  };

  const handleToggleCurrent = () => {
    if (!currentCountry) return;
    soundService.playCorrect();
    onToggleLearned(currentCountry.code);
  };

  const continentInfo = currentCountry 
    ? CONTINENTS.find(c => c.key === currentCountry.continent) 
    : undefined;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 pb-20 select-none">
      
      {/* Title & View Switcher */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>📚</span>
            <span>{isTr ? 'İngilizce & Türkçe Kartlar' : 'Bilingual Flashcards'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isTr 
              ? `${stats.learnedCountries.length} / ${COUNTRIES.length} Ülke Öğrenildi`
              : `${stats.learnedCountries.length} / ${COUNTRIES.length} Countries Learned`}
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              soundService.playClick();
              setViewMode('flashcard');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'flashcard'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {isTr ? 'Kart Modu' : 'Deck'}
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              setViewMode('grid');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {isTr ? 'Liste' : 'List'}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentIndex(0);
          }}
          placeholder={isTr ? 'Ülke veya başkent ara...' : 'Search country or capital...'}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
        />
      </div>

      {/* Continent Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          onClick={() => {
            soundService.playClick();
            setSelectedContinent('ALL');
            setCurrentIndex(0);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedContinent === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {isTr ? 'Tümü' : 'All'} ({COUNTRIES.length})
        </button>

        {CONTINENTS.map(item => (
          <button
            key={item.key}
            onClick={() => {
              soundService.playClick();
              setSelectedContinent(item.key);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedContinent === item.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isTr ? item.label_tr : item.label_en}
          </button>
        ))}
      </div>

      {filteredCountries.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <Globe2 className="w-10 h-10 mx-auto mb-2 text-slate-400" />
          <p className="font-semibold text-sm">
            {isTr ? 'Eşleşen ülke bulunamadı' : 'No countries found matching your filter'}
          </p>
        </div>
      ) : viewMode === 'flashcard' && currentCountry ? (
        /* Single Flashcard View */
        <div className="w-full flex flex-col items-center">
          
          {/* Card index pill */}
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2">
            {safeIndex + 1} / {filteredCountries.length}
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={handleFlip}
            className="w-full max-w-sm min-h-100 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border-2 border-slate-200/80 dark:border-slate-700 cursor-pointer flex flex-col justify-between relative transition-all hover:shadow-2xl active:scale-99"
          >
            {/* Top Bar on Card */}
            <div className="flex items-center justify-between">
              {continentInfo && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${continentInfo.badgeBg}`}>
                  {isTr ? continentInfo.label_tr : continentInfo.label_en}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleCurrent();
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isCurrentLearned
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isCurrentLearned ? (isTr ? 'Öğrenildi' : 'Learned') : (isTr ? 'Öğrendim' : 'Mark Learned')}</span>
              </button>
            </div>

            {/* Front of card (Flag & Turkish Info) */}
            {!isFlipped ? (
              <div className="flex flex-col items-center my-4 animate-fade-in text-center">
                <div className="w-40 h-26 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 dark:border-slate-700 mb-4 bg-slate-50 flex items-center justify-center">
                  <img
                    src={getFlagUrl(currentCountry.code)}
                    alt={currentCountry.name_tr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {currentCountry.name_tr}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundService.speak(currentCountry.name_tr, 'tr');
                    }}
                    className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-110 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">{isTr ? 'Başkent: ' : 'Capital: '}</span>
                  <span className="font-bold">{currentCountry.capital_tr}</span>
                </div>

                {currentCountry.hint_tr && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs italic">
                    "{currentCountry.hint_tr}"
                  </p>
                )}
              </div>
            ) : (
              /* Back of card (English Info & Extra Details) */
              <div className="flex flex-col items-center my-4 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-3xl mb-4 shadow-inner">
                  {currentCountry.flag_emoji}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {currentCountry.name_en}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundService.speak(currentCountry.name_en, 'en');
                    }}
                    className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-110 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">English Capital: </span>
                  <span className="font-bold">{currentCountry.capital_en}</span>
                </div>

                {currentCountry.population && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>Popülasyon: {currentCountry.population}</span>
                  </div>
                )}

                {currentCountry.hint_en && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs italic">
                    "{currentCountry.hint_en}"
                  </p>
                )}
              </div>
            )}

            {/* Flip hint footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isTr ? 'Kartı Çevir' : 'Tap to Flip'}</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-blue-500">
                {!isFlipped ? 'TR 🇹🇷' : 'EN 🇬🇧'}
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="w-full max-w-sm flex items-center justify-between mt-5 gap-3">
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-98 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isTr ? 'Önceki' : 'Previous'}</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-98 shadow-md shadow-blue-500/20"
            >
              <span>{isTr ? 'Sonraki' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* List / Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredCountries.map(country => {
            const isLearned = stats.learnedCountries.includes(country.code);
            return (
              <div
                key={country.code}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isLearned
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">{country.flag_emoji}</span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {country.name_tr} <span className="text-xs font-normal text-slate-400">/ {country.name_en}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      🏛️ {country.capital_tr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => soundService.speak(country.name_en, 'en')}
                    title="İngilizce Telaffuz"
                    className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:text-blue-600"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      soundService.playCorrect();
                      onToggleLearned(country.code);
                    }}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isLearned
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-emerald-500'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
