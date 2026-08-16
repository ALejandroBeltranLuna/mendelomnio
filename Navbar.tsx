import React from 'react';
import { Camera, BookOpen, FlaskConical, Volume2, VolumeX, Shield, Atom, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'scanner' | 'battle' | 'mendelomnio' | 'lab' | 'lore';
  setActiveTab: (tab: 'scanner' | 'battle' | 'mendelomnio' | 'lab' | 'lore') => void;
  unlockedCount: number;
  totalCount: number;
  coins: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  inBattle: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unlockedCount,
  totalCount,
  coins,
  soundEnabled,
  setSoundEnabled,
  inBattle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/30 text-white shadow-lg shadow-cyan-950/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo / Brand - Mendelomnio */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 p-0.5 shadow-md shadow-cyan-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Atom className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 text-base sm:text-lg uppercase">
                  Mendelomnio
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded">
                  OS v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                Dispositivo Espectral y Registro Universal de Materia
              </p>
            </div>
          </div>

          {/* Right Header: Elements Count, Coins & Sound Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Total Tabla Periódica: X/118 */}
            <div className="flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-500/40 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 hidden md:inline">Tabla:</span>
              <span className="font-extrabold text-cyan-300">{unlockedCount}/{totalCount}</span>
              <span className="text-slate-400 hidden sm:inline">Registrados</span>
            </div>

            {/* Coins Counter */}
            <div 
              id="header-coins-counter"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/70 to-orange-950/70 border border-amber-500/50 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono shadow-md shadow-amber-950/40"
              title="Monedas de Combate para desbloquear personajes en Academia & Lore"
            >
              <span className="text-amber-400 text-sm">🪙</span>
              <span className="font-black text-amber-300">{coins}</span>
              <span className="text-amber-200/80 font-bold hidden xs:inline">Coins</span>
            </div>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Silenciar audio" : "Activar efectos sonoros"}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-700 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Without Battle Ring) */}
        <nav className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 mt-2 pt-2 border-t border-slate-800 overflow-x-auto no-scrollbar">
          
          <button
            id="tab-scanner"
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'scanner' || activeTab === 'battle'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-4 h-4 text-cyan-300" />
            <span>Escáner AR</span>
          </button>

          <button
            id="tab-mendelomnio"
            onClick={() => setActiveTab('mendelomnio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'mendelomnio'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>Mendelomnio</span>
          </button>

          <button
            id="tab-lab"
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'lab'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-emerald-300" />
            <span>Mesa de Síntesis</span>
          </button>

          <button
            id="tab-lore"
            onClick={() => setActiveTab('lore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'lore'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span>Academia & Lore</span>
          </button>

        </nav>
      </div>
    </header>
  );
};
