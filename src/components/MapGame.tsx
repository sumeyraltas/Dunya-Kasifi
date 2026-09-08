import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Lightbulb, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Compass, 
  Navigation
} from 'lucide-react';
import { Country, Difficulty, QuizQuestion, QuizResult } from '../types.ts';
import { generateMapQuestions } from '../utils/quizGenerator.ts';
import { 
  WORLD_MAP_PATHS, 
  WORLD_MAP_LIST, 
  OCEAN_SPHERE_PATH, 
  GRATICULE_PATH,
  SvgCountryData
} from '../data/worldMapSvg.ts';
import { CONTINENTS } from '../data/countries.ts';
import { soundService } from '../utils/sound.ts';

interface MapGameProps {
  difficulty: Difficulty;
  language: 'tr' | 'en';
  onFinishQuiz: (result: QuizResult) => void;
  onQuit: () => void;
  onUpdateGameStatus: (lives: number, score: number) => void;
}

export const MapGame: React.FC<MapGameProps> = ({
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

  // Map viewport & pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Answer status for animation
  const [clickedCountryId, setClickedCountryId] = useState<string | null>(null);
  const [clickedCountryName, setClickedCountryName] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const gameStartTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const qList = generateMapQuestions(difficulty, 10);
    setQuestions(qList);
    gameStartTimeRef.current = Date.now();
  }, [difficulty]);

  useEffect(() => {
    onUpdateGameStatus(lives, score);
  }, [lives, score, onUpdateGameStatus]);

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setShowHint(false);
    setFeedbackState('idle');
    setClickedCountryId(null);
    setClickedCountryName(null);
  }, [currentIndex]);

  const handleZoom = (delta: number) => {
    soundService.playClick();
    setZoom(prev => Math.min(4.0, Math.max(0.8, Number((prev + delta).toFixed(1)))));
  };

  const resetView = () => {
    soundService.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center camera precisely on specific map coordinates
  const focusOnCoordinates = (cx: number, cy: number, targetZoom: number = 2.4) => {
    const container = svgContainerRef.current;
    const width = container ? container.clientWidth : 800;
    const height = container ? container.clientHeight : 440;
    
    // Convert SVG viewBox center (500, 250) offset into container pixels
    const targetPanX = (500 - cx) * (width / 1000) * targetZoom;
    const targetPanY = (250 - cy) * (height / 500) * targetZoom;

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
  };

  // Auto-focus camera on target country
  const focusOnTarget = (targetCode: string) => {
    const data = WORLD_MAP_PATHS[targetCode];
    if (data) {
      focusOnCoordinates(data.cx, data.cy, 2.4);
    }
  };

  // Quick continent jump handler
  const handleContinentJump = (continentKey: string) => {
    soundService.playClick();
    switch (continentKey) {
      case 'Europe':
        focusOnCoordinates(530, 115, 2.7);
        break;
      case 'Asia':
        focusOnCoordinates(710, 160, 1.9);
        break;
      case 'Africa':
        focusOnCoordinates(530, 260, 1.9);
        break;
      case 'Americas':
        focusOnCoordinates(290, 220, 1.6);
        break;
      case 'Oceania':
        focusOnCoordinates(825, 325, 2.2);
        break;
      default:
        resetView();
        break;
    }
  };

  // Drag Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom(prev => Math.min(4.0, Math.max(0.8, Number((prev + delta).toFixed(2)))));
  };

  // Country Tap Logic
  const handleCountryClick = (countryCode: string) => {
    if (feedbackState !== 'idle' || questions.length === 0) return;

    const curQ = questions[currentIndex];
    const isCorrect = countryCode === curQ.targetCountry.code;
    const timeSpent = (Date.now() - questionStartTimeRef.current) / 1000;
    const isFast = timeSpent <= 6;

    const clickedData = WORLD_MAP_PATHS[countryCode];
    const clickedName = clickedData ? (isTr ? clickedData.name_tr : clickedData.name_en) : '';

    setClickedCountryId(countryCode);
    setClickedCountryName(clickedName || null);

    if (isCorrect) {
      setFeedbackState('correct');
      soundService.playCorrect();
      const points = isFast ? 15 : 10;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      proceedAfterDelay(lives);
    } else {
      setFeedbackState('wrong');
      soundService.playWrong();
      soundService.playHeartLost();
      const newLives = lives - 1;
      setLives(newLives);
      setWrongCount(prev => prev + 1);

      // Smoothly zoom in to reveal the correct country to help learning
      focusOnTarget(curQ.targetCountry.code);

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
          mode: 'map',
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
        setFeedbackState('idle');
        setClickedCountryId(null);
        setClickedCountryName(null);
        setShowHint(false);
      }
    }, 2200);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        Harita yükleniyor...
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const targetCountry = currentQ.targetCountry;
  const continentInfo = CONTINENTS.find(c => c.key === targetCountry.continent);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-3 py-2 flex flex-col items-center select-none">
      
      {/* Top Banner: Target Country Prompt */}
      <div className="w-full bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white rounded-3xl p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5 border border-blue-400/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl drop-shadow-sm">{targetCountry.flag_emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                {isTr ? 'Hedef Ülke' : 'Target Country'} {currentIndex + 1}/{questions.length}
              </span>
              {continentInfo && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/25">
                  {isTr ? continentInfo.label_tr : continentInfo.label_en}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5 drop-shadow-xs flex items-center gap-2">
              <span>{isTr ? targetCountry.name_tr : targetCountry.name_en}</span>
            </h2>
          </div>
        </div>

        {/* Hint & Focus Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="map-hint-btn"
            onClick={() => {
              soundService.playClick();
              setShowHint(true);
              if (targetCountry.code) focusOnTarget(targetCountry.code);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs hover:bg-amber-300 transition-all active:scale-95 shadow-md hover:shadow-amber-400/20"
          >
            <Lightbulb className="w-4 h-4 fill-current" />
            <span>{isTr ? 'İpucu & Yaklaş' : 'Hint & Zoom'}</span>
          </button>
        </div>
      </div>

      {/* Continent Quick Navigation Toolbar */}
      <div className="w-full flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1.5 mb-2 no-scrollbar text-xs font-semibold text-slate-700 dark:text-slate-300">
        <button
          onClick={() => resetView()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>{isTr ? 'Tüm Dünya' : 'World'}</span>
        </button>
        <button
          onClick={() => handleContinentJump('Europe')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <span>🇪🇺</span>
          <span>{isTr ? 'Avrupa' : 'Europe'}</span>
        </button>
        <button
          onClick={() => handleContinentJump('Asia')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <span>🌏</span>
          <span>{isTr ? 'Asya' : 'Asia'}</span>
        </button>
        <button
          onClick={() => handleContinentJump('Africa')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <span>🌍</span>
          <span>{isTr ? 'Afrika' : 'Africa'}</span>
        </button>
        <button
          onClick={() => handleContinentJump('Americas')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <span>🌎</span>
          <span>{isTr ? 'Amerika' : 'Americas'}</span>
        </button>
        <button
          onClick={() => handleContinentJump('Oceania')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <span>🏝️</span>
          <span>{isTr ? 'Okyanusya' : 'Oceania'}</span>
        </button>
      </div>

      {/* Interactive Cartographic Map Card */}
      <div
        ref={svgContainerRef}
        className="w-full h-85 sm:h-115 md:h-125 bg-slate-950 rounded-3xl relative overflow-hidden shadow-2xl border-2 border-slate-700/80 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Map SVG */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%'
          }}
        >
          <defs>
            {/* Radial ocean gradient giving depth to the globe */}
            <radialGradient id="oceanGradient" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#0f2647" />
              <stop offset="70%" stopColor="#0a1a33" />
              <stop offset="100%" stopColor="#061124" />
            </radialGradient>

            {/* Glowing gold filter for hints & revealed target */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing emerald filter for correct answer */}
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ocean Sphere Outline (Globe Shape) */}
          <path
            d={OCEAN_SPHERE_PATH}
            fill="url(#oceanGradient)"
            stroke="#1e3a5f"
            strokeWidth="1.5"
          />

          {/* Graticule Latitude / Longitude lines */}
          <path
            d={GRATICULE_PATH}
            fill="none"
            stroke="#203a5c"
            strokeWidth="0.55"
            strokeDasharray="2 3"
            opacity="0.5"
          />

          {/* Subtle Equator Reference Line */}
          <line
            x1="20"
            y1="250"
            x2="980"
            y2="250"
            stroke="#2563eb"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            opacity="0.35"
          />

          {/* Render All Countries in Natural Earth Projection */}
          {WORLD_MAP_LIST.map((countryData) => {
            const code = countryData.code;
            const isTarget = code === targetCountry.code;
            const isClicked = code === clickedCountryId;
            const isHovered = code === hoveredCountry;

            // Default authentic atlas slate styling
            let fillColor = '#1e293b'; // Slate 800 land
            let strokeColor = '#334155'; // Slate 700 borders
            let strokeWidth = 0.75 / Math.sqrt(zoom);
            let filter = undefined;

            // Hover state
            if (isHovered && feedbackState === 'idle') {
              fillColor = '#38bdf8'; // Sky blue
              strokeColor = '#ffffff';
              strokeWidth = 1.6 / Math.sqrt(zoom);
            }

            // In feedback state
            if (feedbackState === 'correct' && isTarget) {
              fillColor = '#10b981'; // Vibrant emerald green
              strokeColor = '#ecfdf5';
              strokeWidth = 2.4 / Math.sqrt(zoom);
              filter = 'url(#emeraldGlow)';
            } else if (feedbackState === 'wrong') {
              if (isClicked) {
                fillColor = '#ef4444'; // Wrong tapped red
                strokeColor = '#fee2e2';
                strokeWidth = 2.0 / Math.sqrt(zoom);
              }
              if (isTarget) {
                // Reveal the correct target in pulsing gold/amber!
                fillColor = '#f59e0b';
                strokeColor = '#fef3c7';
                strokeWidth = 2.5 / Math.sqrt(zoom);
                filter = 'url(#goldGlow)';
              }
            }

            // Hint highlight: gentle golden glow on target
            if (showHint && isTarget && feedbackState === 'idle') {
              fillColor = '#fbbf24';
              strokeColor = '#ffffff';
              strokeWidth = 2.2 / Math.sqrt(zoom);
              filter = 'url(#goldGlow)';
            }

            return (
              <g key={countryData.id || code}>
                <path
                  id={code}
                  d={countryData.d}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={filter}
                  className="transition-colors duration-150 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCountryClick(code);
                  }}
                  onMouseEnter={() => setHoveredCountry(code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />

                {/* Pinpoint ripple circle when revealed or correct */}
                {((feedbackState === 'correct' && isTarget) || (feedbackState === 'wrong' && isTarget)) && (
                  <circle
                    cx={countryData.cx}
                    cy={countryData.cy}
                    r={6 / zoom}
                    fill="#ffffff"
                    stroke={feedbackState === 'correct' ? '#10b981' : '#f59e0b'}
                    strokeWidth={2.5 / zoom}
                    className="animate-ping pointer-events-none"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Map Control Buttons (Zoom in / out / reset) */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
          <button
            onClick={() => handleZoom(0.3)}
            title={isTr ? 'Yakınlaştır' : 'Zoom In'}
            className="w-9 h-9 rounded-xl bg-slate-800/95 text-white flex items-center justify-center hover:bg-slate-700 shadow-lg border border-slate-600 active:scale-95 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.3)}
            title={isTr ? 'Uzaklaştır' : 'Zoom Out'}
            className="w-9 h-9 rounded-xl bg-slate-800/95 text-white flex items-center justify-center hover:bg-slate-700 shadow-lg border border-slate-600 active:scale-95 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            title={isTr ? 'Sıfırla' : 'Reset View'}
            className="w-9 h-9 rounded-xl bg-slate-800/95 text-white flex items-center justify-center hover:bg-slate-700 shadow-lg border border-slate-600 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Zoom level pill */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-[11px] font-mono text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 shadow-sm">
          Zoom: {Math.round(zoom * 100)}%
        </div>

        {/* In-Map Feedback Message Banner */}
        {feedbackState !== 'idle' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-[90%] flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-white font-bold text-xs sm:text-sm bg-slate-900/95 border border-slate-600 animate-in fade-in zoom-in-95">
            {feedbackState === 'correct' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">
                  {isTr ? 'Tebrikler! Doğru Ülkeyi Buldun (+10)' : 'Awesome! Correct Country (+10)'}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-rose-200">
                  {isTr ? (
                    <>
                      {clickedCountryName ? `Yanlış! Burası ${clickedCountryName}. ` : 'Yanlış! '}
                      <span className="text-amber-300 underline font-extrabold">{targetCountry.name_tr}</span> haritada altın sarısı ile işaretlendi.
                    </>
                  ) : (
                    <>
                      {clickedCountryName ? `Wrong! That was ${clickedCountryName}. ` : 'Wrong! '}
                      <span className="text-amber-300 underline font-extrabold">{targetCountry.name_en}</span> is highlighted in gold.
                    </>
                  )}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Hint / Navigation Tip */}
      <div className="w-full mt-2 p-2.5 sm:p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 shadow-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            {isTr 
              ? 'Haritayı sürükleyerek kaydırabilir, fare tekerleğiyle veya butonlarla yakınlaştırabilirsin.' 
              : 'Drag map to pan, mouse wheel or buttons to zoom into countries.'}
          </span>
        </div>
      </div>

    </div>
  );
};
