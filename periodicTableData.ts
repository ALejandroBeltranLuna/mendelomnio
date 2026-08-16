import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Shield, Zap, Lock, Unlock, Mail, CheckCircle2, Atom, Info } from 'lucide-react';
import { Elementbeast, ElementCategory } from '../types/elementbeasts';
import { INITIAL_ELEMENTBEASTS } from '../data/database';
import { PERIODIC_TABLE_ELEMENTS, PeriodicElement } from '../data/periodicTableData';

interface MendelomnioDexProps {
  unlockedBeastIds: string[];
}

type TabType = 'periodic_table' | 'Alcalinos' | 'Alcalinotérreos' | 'Transición' | 'No Metales' | 'Halógenos' | 'Gases Nobles';

export const MendelomnioDex: React.FC<MendelomnioDexProps> = ({ unlockedBeastIds }) => {
  const [activeTab, setActiveTab] = useState<TabType>('periodic_table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(PERIODIC_TABLE_ELEMENTS[0]);
  const [syncEmail, setSyncEmail] = useState<string>('');
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  // Category filter tabs requested by user
  const tabs: { id: TabType; label: string; badgeColor: string }[] = [
    { id: 'periodic_table', label: 'Tabla Periódica', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    { id: 'Alcalinos', label: 'Alcalinos', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { id: 'Alcalinotérreos', label: 'Alcalinotérreos', badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/40' },
    { id: 'Transición', label: 'Transición', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    { id: 'No Metales', label: 'No Metales', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    { id: 'Halógenos', label: 'Halógenos', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
    { id: 'Gases Nobles', label: 'Gases Nobles', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  ];

  // Check if an element matches current filter
  const isElementHighlightedInTab = (el: PeriodicElement): boolean => {
    if (activeTab === 'periodic_table') return false; // In general periodic table, all are attenuated unless selected
    if (activeTab === 'Alcalinos') return el.filterGroup === 'Alcalinos';
    if (activeTab === 'Alcalinotérreos') return el.filterGroup === 'Alcalinotérreos';
    if (activeTab === 'Transición') return el.filterGroup === 'Transición';
    if (activeTab === 'No Metales') return el.filterGroup === 'No Metales';
    if (activeTab === 'Halógenos') return el.filterGroup === 'Halógenos';
    if (activeTab === 'Gases Nobles') return el.filterGroup === 'Gases Nobles';
    return false;
  };

  // Check if element matches search
  const isElementMatchingSearch = (el: PeriodicElement): boolean => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      el.name.toLowerCase().includes(q) ||
      el.symbol.toLowerCase().includes(q) ||
      String(el.atomicNumber).includes(q) ||
      el.category.toLowerCase().includes(q)
    );
  };

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncEmail) return;
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 4000);
  };

  // Periodic table cell rendering helper
  const renderCell = (atomicNumber: number) => {
    const el = PERIODIC_TABLE_ELEMENTS.find(e => e.atomicNumber === atomicNumber);
    if (!el) return <div className="aspect-square" />;

    const isSelected = selectedElement.atomicNumber === el.atomicNumber;
    const isGroupStrong = isElementHighlightedInTab(el);
    const matchesSearch = isElementMatchingSearch(el);
    const isUnlocked = el.beastId ? unlockedBeastIds.includes(el.beastId) : false;

    // Determine visual style according to instructions:
    // When selected: bright glow, fully illuminated with ring
    // When tab active for group: colored with strong intensity (coloreados con más fuerza)
    // Default in general table: dimmed / attenuated color (atenuados de color)
    let opacityClass = 'opacity-35 hover:opacity-100 hover:scale-105';
    let borderClass = 'border-slate-800/80 bg-slate-900/60';
    let glowStyle = {};

    if (isSelected) {
      opacityClass = 'opacity-100 scale-110 z-20 ring-2 ring-white shadow-lg shadow-cyan-500/50';
      borderClass = 'border-white bg-slate-900';
      glowStyle = {
        boxShadow: `0 0 16px ${el.color}99, inset 0 0 8px ${el.color}66`,
        borderColor: '#ffffff',
      };
    } else if (isGroupStrong) {
      opacityClass = 'opacity-100 scale-100 z-10';
      borderClass = 'border-opacity-90';
      glowStyle = {
        backgroundColor: `${el.color}25`,
        borderColor: el.color,
        boxShadow: `0 0 8px ${el.color}44`,
      };
    } else if (activeTab === 'periodic_table') {
      // General view: elements attenuated
      opacityClass = 'opacity-40 hover:opacity-100 hover:scale-105 transition-all';
      glowStyle = {
        backgroundColor: `${el.color}10`,
        borderColor: `${el.color}30`,
      };
    } else {
      // Other group selected: non-matching elements are very dimmed
      opacityClass = 'opacity-20 hover:opacity-80 transition-all';
      glowStyle = {
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderColor: 'rgba(51, 65, 85, 0.4)',
      };
    }

    if (!matchesSearch) {
      opacityClass = 'opacity-10 pointer-events-none';
    }

    return (
      <button
        key={el.atomicNumber}
        id={`periodic-cell-${el.atomicNumber}`}
        onClick={() => setSelectedElement(el)}
        style={glowStyle}
        className={`aspect-square p-1 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative group ${opacityClass} ${borderClass}`}
        title={`${el.atomicNumber}. ${el.name} (${el.symbol}) - ${el.category}`}
      >
        <div className="flex justify-between items-start w-full leading-none">
          <span className="text-[9px] font-mono text-slate-400 font-bold">
            {el.atomicNumber}
          </span>
          {isUnlocked && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Registrado en Mendelomnio" />
          )}
        </div>

        <div className="text-center my-auto">
          <span
            className="text-xs sm:text-sm font-black font-mono tracking-tight block"
            style={{ color: isSelected || isGroupStrong ? '#ffffff' : el.color }}
          >
            {el.symbol}
          </span>
        </div>

        <div className="text-[8px] font-medium text-slate-300 truncate w-full text-center hidden md:block">
          {el.name}
        </div>
      </button>
    );
  };

  // Check if active element has a linked beast
  const linkedBeast = useMemo(() => {
    return INITIAL_ELEMENTBEASTS.find(
      b => b.id === selectedElement.beastId || b.symbol.toLowerCase() === selectedElement.symbol.toLowerCase()
    );
  }, [selectedElement]);

  const isSelectedUnlocked = linkedBeast ? unlockedBeastIds.includes(linkedBeast.id) : false;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 space-y-5">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded-md uppercase flex items-center gap-1">
              <Atom className="w-3.5 h-3.5" /> Base de Datos Científica
            </span>
            <span className="text-xs text-slate-400 font-mono">118 Especies de la Materia</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            El Mendelomnio: Tabla Periódica Interactiva
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Explora la tabla periódica completa. Selecciona cualquier elemento o filtra por grupo para iluminar sus propiedades y visualizar sus parámetros atómicos y de combate.
          </p>
        </div>

        {/* Sync Feature */}
        <form onSubmit={handleSyncSubmit} className="flex flex-col gap-1.5 w-full sm:w-auto bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> Sincronizar con Videojuego PC/Consola
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="email"
              placeholder="tu.correo@academia.com"
              value={syncEmail}
              onChange={(e) => setSyncEmail(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono w-44"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Sync
            </button>
          </div>
          {syncSuccess && (
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ¡Mendelomnio sincronizado con éxito!
            </span>
          )}
        </form>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30 scale-105'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar elemento (ej: Fe, Oro, 26)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Main Grid: Periodic Table (Left) + Element Scientific Dossier (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Periodic Table Grid (XL: 8 cols) */}
        <div className="xl:col-span-8 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl overflow-hidden">
          
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                {activeTab === 'periodic_table'
                  ? 'Vista General: Elementos en tono atenuado. Pulsa sobre cualquier elemento para iluminarlo.'
                  : `Grupo Activo: ${tabs.find(t => t.id === activeTab)?.label} resaltado con color intenso.`}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:block">
              18 Grupos • 7 Periodos
            </span>
          </div>

          {/* Periodic Table Scrollable Container for small screens */}
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <div className="min-w-[760px] space-y-1.5">
              
              {/* Period 1 */}
              <div className="grid grid-cols-18 gap-1">
                {renderCell(1)}
                <div className="col-span-16" />
                {renderCell(2)}
              </div>

              {/* Period 2 */}
              <div className="grid grid-cols-18 gap-1">
                {renderCell(3)}
                {renderCell(4)}
                <div className="col-span-10" />
                {renderCell(5)}
                {renderCell(6)}
                {renderCell(7)}
                {renderCell(8)}
                {renderCell(9)}
                {renderCell(10)}
              </div>

              {/* Period 3 */}
              <div className="grid grid-cols-18 gap-1">
                {renderCell(11)}
                {renderCell(12)}
                <div className="col-span-10" />
                {renderCell(13)}
                {renderCell(14)}
                {renderCell(15)}
                {renderCell(16)}
                {renderCell(17)}
                {renderCell(18)}
              </div>

              {/* Period 4 */}
              <div className="grid grid-cols-18 gap-1">
                {Array.from({ length: 18 }, (_, i) => renderCell(19 + i))}
              </div>

              {/* Period 5 */}
              <div className="grid grid-cols-18 gap-1">
                {Array.from({ length: 18 }, (_, i) => renderCell(37 + i))}
              </div>

              {/* Period 6 (Cs, Ba, [57-71 placeholder], Hf -> Rn) */}
              <div className="grid grid-cols-18 gap-1">
                {renderCell(55)}
                {renderCell(56)}
                <div className="aspect-square p-1 rounded-lg border border-purple-500/30 bg-purple-950/20 text-purple-400 font-mono text-[9px] flex items-center justify-center text-center leading-none">
                  57-71<br/>La-Lu
                </div>
                {Array.from({ length: 15 }, (_, i) => renderCell(72 + i))}
              </div>

              {/* Period 7 (Fr, Ra, [89-103 placeholder], Rf -> Og) */}
              <div className="grid grid-cols-18 gap-1">
                {renderCell(87)}
                {renderCell(88)}
                <div className="aspect-square p-1 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-mono text-[9px] flex items-center justify-center text-center leading-none">
                  89-103<br/>Ac-Lr
                </div>
                {Array.from({ length: 15 }, (_, i) => renderCell(104 + i))}
              </div>

              {/* Spacer divider */}
              <div className="pt-2" />

              {/* Lanthanides Row (57-71) */}
              <div className="grid grid-cols-18 gap-1 pt-1 border-t border-slate-800/60">
                <div className="col-span-3 text-[10px] font-mono text-purple-300 flex items-center px-1 font-bold">
                  Lantánidos:
                </div>
                {Array.from({ length: 15 }, (_, i) => renderCell(57 + i))}
              </div>

              {/* Actinides Row (89-103) */}
              <div className="grid grid-cols-18 gap-1">
                <div className="col-span-3 text-[10px] font-mono text-emerald-300 flex items-center px-1 font-bold">
                  Actínidos:
                </div>
                {Array.from({ length: 15 }, (_, i) => renderCell(89 + i))}
              </div>

            </div>
          </div>

          {/* Quick Legend Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Alcalinos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-lime-500 inline-block" /> Alcalinotérreos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" /> Transición
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> No Metales
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-teal-500 inline-block" /> Halógenos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" /> Gases Nobles
              </span>
            </div>
            <span className="text-cyan-400 font-bold">
              Seleccionado: #{selectedElement.atomicNumber} {selectedElement.name}
            </span>
          </div>

        </div>

        {/* Element Scientific Dossier & Stats (XL: 4 cols) */}
        <div className="xl:col-span-4 sticky top-20">
          <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
            
            {/* Background element aura */}
            <div 
              className="absolute top-0 right-0 w-48 h-48 opacity-20 rounded-bl-full pointer-events-none transition-all duration-500"
              style={{ background: selectedElement.color }}
            />

            {/* Dossier Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                    Ficha Técnica Mendelomnio
                  </span>
                  <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded text-[9px] font-mono">
                    #{String(selectedElement.atomicNumber).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedElement.name}</h3>
              </div>
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: `${selectedElement.color}22`, borderColor: selectedElement.color }}
              >
                {selectedElement.avatarEmoji}
              </div>
            </div>

            {/* Classification Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Símbolo</span>
                <span className="font-extrabold text-cyan-300 text-base">{selectedElement.symbol}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Categoría</span>
                <span className="font-bold text-purple-300 text-[11px] truncate block">{selectedElement.category}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Estado</span>
                <span className="font-bold text-amber-300 text-xs">{selectedElement.state}</span>
              </div>
            </div>

            {/* Combat & Chemical Metrics (No history/lore section as requested) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold flex items-center justify-between">
                <span>Parámetros de Combate y Química:</span>
                <span className="text-slate-500 text-[10px]">Masa: {selectedElement.atomicMass} u</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                
                {/* Fuerza (Ataque / Mohs) */}
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Fuerza (Ataque):</span>
                    <span className="font-bold text-amber-400">
                      {selectedElement.stats.fuerza} {selectedElement.stats.durezaMohs ? `(${selectedElement.stats.durezaMohs} Mohs)` : ''}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedElement.stats.fuerza / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Resistencia (Defensa / Punto Fusión) */}
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Resistencia (Defensa):</span>
                    <span className="font-bold text-blue-400">
                      {selectedElement.stats.resistencia} {selectedElement.stats.puntoFusionC !== undefined ? `(${selectedElement.stats.puntoFusionC}°C)` : ''}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedElement.stats.resistencia / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Velocidad (Pauling) */}
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Velocidad (Prioridad):</span>
                    <span className="font-bold text-emerald-400">
                      {selectedElement.stats.velocidad} {selectedElement.stats.electronegatividad ? `(${selectedElement.stats.electronegatividad} Pauling)` : ''}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedElement.stats.velocidad / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Poder Especial (pH / Acidez) */}
                <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">Poder Especial:</span>
                  <span className="font-bold text-pink-400">
                    {selectedElement.stats.ph !== undefined ? `pH ${selectedElement.stats.ph}` : 'Reactividad Neutra'}
                  </span>
                </div>

                {/* Vitalidad */}
                <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">PV Totales (Base + Masa):</span>
                  <span className="font-bold text-red-400 text-sm">
                    {selectedElement.stats.maxHp} PV
                  </span>
                </div>

              </div>
            </div>

            {/* Strategic Property Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Propiedad: {selectedElement.property.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-700">
                  {selectedElement.property.effectCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                {selectedElement.property.description}
              </p>
            </div>

            {/* Registration Status */}
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">Estado de Captura:</span>
              {isSelectedUnlocked ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <Unlock className="w-3.5 h-3.5" /> Registrado en tu Mendelomnio
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Por capturar en Materia
                </span>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
