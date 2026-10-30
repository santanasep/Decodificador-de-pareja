import React from 'react';
import { ShieldAlert, BookOpen, Search, Volume2, VolumeX, Sparkles, HeartHandshake, BarChart3, Award } from 'lucide-react';
import { ActiveScreen } from '../types';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  customPhrasesCount: number;
  unlockedAchievementsCount?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  customPhrasesCount,
  unlockedAchievementsCount,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="border-b border-stone-200 bg-stone-900 text-stone-100 sticky top-0 z-40 shadow-sm">
      {/* Top micro-bar: Official Bureaucracy Parody */}
      <div className="bg-stone-950 px-4 py-1 text-xs text-stone-400 border-b border-stone-800 flex justify-between items-center tracking-wider">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono uppercase text-[10px] md:text-xs text-stone-300">
            IOLC • Instituto Oficial de Lingüística Conyugal
          </span>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="hidden sm:inline text-stone-400 text-[11px]">
            Norma ISO-9001 de Desactivación de Indirectas
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.enabled = !soundEnabled;
              onToggleSound();
            }}
            aria-label={soundEnabled ? 'Silenciar sonidos de la app' : 'Activar efectos de sonido'}
            className="text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1 text-[11px]"
            title={soundEnabled ? 'Silenciar audio' : 'Activar efectos de audio'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden md:inline">Audio OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => {
            sounds.playTypewriter();
            onNavigate('search');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-stone-800 flex items-center justify-center shadow-inner border border-amber-500/40">
            <ShieldAlert className="w-6 h-6 text-amber-200 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif tracking-tight font-extrabold text-lg sm:text-xl text-stone-50 flex items-center gap-1.5">
                DECODIFICADOR
                <span className="text-amber-400 font-sans font-bold text-xs px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/50">
                  DE PAREJA
                </span>
              </h1>
            </div>
            <p className="text-stone-400 text-xs tracking-wide">
              Traductor Honestamente Empático de Eufemismos Domésticos
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-2 bg-stone-800/90 p-1 rounded-xl border border-stone-700/80">
          <button
            onClick={() => {
              sounds.playTypewriter();
              onNavigate('search');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentScreen === 'search'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Decodificador</span>
          </button>

          <button
            onClick={() => {
              sounds.playTypewriter();
              onNavigate('dictionary');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all relative ${
              currentScreen === 'dictionary'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Diccionario Privado</span>
            {customPhrasesCount > 0 && (
              <span className="bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {customPhrasesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playTypewriter();
              onNavigate('stats');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentScreen === 'stats'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Estadísticas</span>
          </button>

          <button
            onClick={() => {
              sounds.playTypewriter();
              onNavigate('achievements');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentScreen === 'achievements'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Logros</span>
            {unlockedAchievementsCount !== undefined && unlockedAchievementsCount > 0 && (
              <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                {unlockedAchievementsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
