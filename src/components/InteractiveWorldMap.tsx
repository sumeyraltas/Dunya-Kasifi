import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass
} from 'lucide-react';
import { 
  WORLD_MAP_PATHS, 
  WORLD_MAP_LIST, 
  OCEAN_SPHERE_PATH, 
  GRATICULE_PATH 
} from '../data/worldMapSvg.ts';
import { soundService } from '../utils/sound.ts';

interface InteractiveWorldMapProps {
  targetCountryCode: string;
  feedbackState: 'idle' | 'correct' | 'wrong';
  clickedCountryId: string | null;
  showHint: boolean;
  onCountryClick: (code: string) => void;
  language: 'tr' | 'en';
  heightClass?: string;
  autoFocusContinent?: string;
}

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  targetCountryCode,
  feedbackState,
  clickedCountryId,
  showHint,
  onCountryClick,
  language,
  heightClass = 'h-72 sm:h-80 md:h-96',
  autoFocusContinent
}) => {
  const isTr = language === 'tr';
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Center camera on specific coordinates
  const focusOnCoordinates = (cx: number, cy: number, targetZoom: number = 2.4) => {
    const container = containerRef.current;
    const width = container ? container.clientWidth : 800;
    const height = container ? container.clientHeight : 440;
    
    const targetPanX = (500 - cx) * (width / 1000) * targetZoom;
    const targetPanY = (250 - cy) * (height / 500) * targetZoom;

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
  };

  const focusOnTarget = (targetCode: string) => {
    const data = WORLD_MAP_PATHS[targetCode];
    if (data) {
      focusOnCoordinates(data.cx, data.cy, 2.4);
    }
  };

  // Reset or continent focus when target country or continent changes
  useEffect(() => {
    if (autoFocusContinent) {
      handleContinentJump(autoFocusContinent, false);
    } else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [targetCountryCode, autoFocusContinent]);

  // When feedback is wrong, auto zoom to target to reveal it
  useEffect(() => {
    if (feedbackState === 'wrong' && targetCountryCode) {
      focusOnTarget(targetCountryCode);
    }
  }, [feedbackState, targetCountryCode]);

  const handleZoom = (delta: number) => {
    soundService.playClick();
    setZoom(prev => Math.min(4.0, Math.max(0.8, Number((prev + delta).toFixed(1)))));
  };

  const resetView = () => {
    soundService.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleContinentJump = (continentKey: string, playSound: boolean = true) => {
    if (playSound) soundService.playClick();
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
      case 'North America':
      case 'South America':
        focusOnCoordinates(290, 220, 1.6);
        break;
      case 'Oceania':
        focusOnCoordinates(825, 325, 2.2);
        break;
      default:
        setZoom(1);
        setPan({ x: 0, y: 0 });
        break;
    }
  };

  // Drag handlers
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom(prev => Math.min(4.0, Math.max(0.8, Number((prev + delta).toFixed(2)))));
  };

  const continents = [
    { key: 'all', label_tr: 'Tüm Dünya', label_en: 'World' },
    { key: 'Europe', label_tr: 'Avrupa', label_en: 'Europe' },
    { key: 'Asia', label_tr: 'Asya', label_en: 'Asia' },
    { key: 'Africa', label_tr: 'Afrika', label_en: 'Africa' },
    { key: 'Americas', label_tr: 'Amerika', label_en: 'Americas' },
    { key: 'Oceania', label_tr: 'Okyanusya', label_en: 'Oceania' }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Quick Continent Navigation Toolbar */}
      <div className="w-full flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        <div className="flex items-center gap-1">
          {continents.map(c => (
            <button
              key={c.key}
              type="button"
              onClick={() => handleContinentJump(c.key)}
              className="px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap active:scale-95 text-[11px]"
            >
              {isTr ? c.label_tr : c.label_en}
            </button>
          ))}
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => handleZoom(0.3)}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Yakınlaştır"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-0.3)}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Uzaklaştır"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Map Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className={`w-full ${heightClass} relative rounded-2xl overflow-hidden shadow-xl border-2 border-slate-700/60 bg-[#091528] cursor-grab active:cursor-grabbing select-none`}
      >
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%'
          }}
        >
          <defs>
            <radialGradient id="interactiveOceanGrad" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#0f2647" />
              <stop offset="70%" stopColor="#0a1a33" />
              <stop offset="100%" stopColor="#061124" />
            </radialGradient>

            <filter id="interactiveGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="interactiveEmeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ocean Sphere Outline */}
          <path
            d={OCEAN_SPHERE_PATH}
            fill="url(#interactiveOceanGrad)"
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

          {/* Equator Reference Line */}
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

          {/* Render All Countries */}
          {WORLD_MAP_LIST.map((countryData) => {
            const code = countryData.code;
            const isTarget = code === targetCountryCode;
            const isClicked = code === clickedCountryId;
            const isHovered = code === hoveredCountry;

            let fillColor = '#1e293b';
            let strokeColor = '#334155';
            let strokeWidth = 0.75 / Math.sqrt(zoom);
            let filter = undefined;

            if (isHovered && feedbackState === 'idle') {
              fillColor = '#38bdf8';
              strokeColor = '#ffffff';
              strokeWidth = 1.6 / Math.sqrt(zoom);
            }

            if (feedbackState === 'correct' && isTarget) {
              fillColor = '#10b981';
              strokeColor = '#ecfdf5';
              strokeWidth = 2.4 / Math.sqrt(zoom);
              filter = 'url(#interactiveEmeraldGlow)';
            } else if (feedbackState === 'wrong') {
              if (isClicked) {
                fillColor = '#ef4444';
                strokeColor = '#fee2e2';
                strokeWidth = 2.0 / Math.sqrt(zoom);
              }
              if (isTarget) {
                fillColor = '#f59e0b';
                strokeColor = '#fef3c7';
                strokeWidth = 2.5 / Math.sqrt(zoom);
                filter = 'url(#interactiveGoldGlow)';
              }
            }

            if (showHint && isTarget && feedbackState === 'idle') {
              fillColor = '#fbbf24';
              strokeColor = '#ffffff';
              strokeWidth = 2.2 / Math.sqrt(zoom);
              filter = 'url(#interactiveGoldGlow)';
            }

            return (
              <g key={countryData.id || code}>
                <path
                  id={`map-country-${code}`}
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
                    if (feedbackState === 'idle') {
                      onCountryClick(code);
                    }
                  }}
                  onMouseEnter={() => setHoveredCountry(code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />

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

        {/* Subtle Map Drag / Tap instruction badge (NO country names on hover) */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 pointer-events-none flex items-center gap-1">
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>{isTr ? 'Haritada ülkeye dokun' : 'Tap nation on map'}</span>
        </div>
      </div>
    </div>
  );
};
