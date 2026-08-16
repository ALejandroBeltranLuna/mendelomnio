import React, { useState } from 'react';
import { Shield, BookOpen, Users, Sparkles, Scroll, Flame, Award, Skull, ChevronRight, CheckCircle2, Lock, Coins, AlertTriangle, EyeOff, Eye } from 'lucide-react';
import { CHARACTERS } from '../data/database';
import { CharacterProfile } from '../types/elementbeasts';
import { sounds } from '../utils/audio';

interface LoreAcademyProps {
  coins: number;
  unlockedCharacterIds: string[];
  onUnlockCharacter: (characterId: string, cost: number) => void;
}

export const LoreAcademy: React.FC<LoreAcademyProps> = ({
  coins,
  unlockedCharacterIds,
  onUnlockCharacter,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'characters' | 'rules'>('characters');
  const [characterFilter, setCharacterFilter] = useState<'all' | 'protagonista' | 'secundario' | 'sindicato'>('all');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('leo');

  const filteredCharacters = CHARACTERS.filter(c => {
    if (characterFilter === 'all') return true;
    return c.category === characterFilter;
  });

  const selectedChar = CHARACTERS.find(c => c.id === selectedCharacterId) || CHARACTERS[0];
  const isSelectedUnlocked = unlockedCharacterIds.includes(selectedChar.id);

  const handlePurchaseCharacter = (char: CharacterProfile) => {
    if (unlockedCharacterIds.includes(char.id)) return;
    if (coins < char.costCoins) {
      sounds.playDefeat();
      return;
    }
    sounds.playLockSuccess();
    onUnlockCharacter(char.id, char.costCoins);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-950 text-amber-400 border border-amber-500/40 rounded-md uppercase">
                Academia & Archivo Central
              </span>
              <span className="text-xs text-slate-400 font-mono">Nobelia • Base de Datos</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Academia Elemental de Materia
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
              Expedientes de personajes, héroes, aliados y miembros censurados del Sindicato Isótopo, junto con el reglamento científico fundamental.
            </p>
          </div>

          {/* Player Coins Wallet Status */}
          <div className="hidden sm:flex flex-col items-end justify-center p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl shadow-lg">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Saldo de la Academia</span>
            <div className="flex items-center gap-1.5 text-lg font-black text-amber-300 font-mono">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>{coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('characters')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'characters'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fichas de Personajes</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rules')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'rules'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Scroll className="w-4 h-4 text-cyan-300" />
            <span>Reglamento Científico</span>
          </button>
        </div>
      </div>

      {/* View: Character Profiles & Purchase System */}
      {activeSubTab === 'characters' && (
        <div className="space-y-4">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setCharacterFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                characterFilter === 'all'
                  ? 'bg-slate-700 text-white border border-slate-500'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Todos ({CHARACTERS.length})
            </button>
            <button
              onClick={() => setCharacterFilter('protagonista')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                characterFilter === 'protagonista'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-400'
              }`}
            >
              Protagonistas ({CHARACTERS.filter(c => c.category === 'protagonista').length})
            </button>
            <button
              onClick={() => setCharacterFilter('secundario')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                characterFilter === 'secundario'
                  ? 'bg-blue-950 text-blue-300 border border-blue-500'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-blue-400'
              }`}
            >
              Personajes Secundarios ({CHARACTERS.filter(c => c.category === 'secundario').length})
            </button>
            <button
              onClick={() => setCharacterFilter('sindicato')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                characterFilter === 'sindicato'
                  ? 'bg-purple-950 text-purple-300 border border-purple-500 shadow-md shadow-purple-950/60'
                  : 'bg-slate-900 text-purple-400 border border-purple-900/60 hover:text-purple-300'
              }`}
            >
              <Skull className="w-3.5 h-3.5" />
              Sindicato Isótopo ({CHARACTERS.filter(c => c.category === 'sindicato').length})
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Character Cards List (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-1">
                Expedientes ({filteredCharacters.length})
              </span>
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredCharacters.map(c => {
                  const isUnlocked = unlockedCharacterIds.includes(c.id);
                  const isSelected = selectedCharacterId === c.id;

                  return (
                    <button
                      key={c.id}
                      id={`char-card-${c.id}`}
                      onClick={() => setSelectedCharacterId(c.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? c.category === 'sindicato'
                            ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg shadow-purple-950/50'
                            : 'bg-amber-950/80 border-amber-500 text-white shadow-lg shadow-amber-950/50'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                          isUnlocked 
                            ? 'bg-slate-800 border-slate-700' 
                            : 'bg-slate-950 border-slate-800 text-slate-600'
                        }`}>
                          {isUnlocked ? c.avatar : <Lock className="w-4 h-4 text-slate-500" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold truncate">{c.name}</h4>
                            {c.isCensored && !isUnlocked && (
                              <span className="px-1 py-0.2 text-[9px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/40 rounded uppercase">
                                Censurado
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{c.role}</p>
                        </div>
                      </div>

                      {/* Unlock Status / Price Badge */}
                      <div className="shrink-0">
                        {isUnlocked ? (
                          <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Desbloqueado
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                            <Coins className="w-3 h-3 text-amber-400" /> {c.costCoins}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Character Detailed Sheet & Purchase Dossier (8 cols) */}
            <div className={`lg:col-span-8 rounded-2xl p-6 shadow-2xl space-y-5 border-2 ${
              selectedChar.category === 'sindicato'
                ? 'bg-slate-900 border-purple-500/50'
                : 'bg-slate-900 border-amber-500/40'
            }`}>
              
              {/* Header of Dossier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 border-2 shadow-xl ${
                    isSelectedUnlocked 
                      ? 'bg-slate-800/90 border-amber-500/50' 
                      : selectedChar.isCensored
                      ? 'bg-purple-950/60 border-purple-500/60 text-purple-400'
                      : 'bg-slate-950 border-slate-700 text-slate-600'
                  }`}>
                    {isSelectedUnlocked ? selectedChar.avatar : <Lock className="w-8 h-8 text-amber-400/80" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold uppercase ${
                        selectedChar.category === 'sindicato' ? 'text-purple-400' : 'text-amber-400'
                      }`}>
                        {selectedChar.role}
                      </span>
                      {selectedChar.isCensored && (
                        <span className="px-1.5 py-0.5 bg-red-950 text-red-300 border border-red-500/50 rounded text-[9px] font-mono font-bold uppercase">
                          Sindicato Isótopo
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-white">{selectedChar.name} ({selectedChar.age} años)</h2>
                    <p className="text-xs text-slate-400 font-mono">{selectedChar.archetype}</p>
                  </div>
                </div>

                {/* Right Header Status */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                  {isSelectedUnlocked ? (
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Expediente Disponible
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-950/90 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-400" /> Expediente Bloqueado
                    </span>
                  )}
                </div>
              </div>

              {/* UNLOCKED VIEW: Full details */}
              {isSelectedUnlocked ? (
                <div className="space-y-4 animate-scale-in">
                  
                  {/* Catchphrase */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Frase Canónica:</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 italic">
                      "{selectedChar.catchphrase}"
                    </span>
                  </div>

                  {/* Concept & Visual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="font-mono uppercase text-amber-400 font-bold block">Diseño Visual & Estética:</span>
                      <p className="text-slate-200">{selectedChar.visual}</p>
                      <div className="pt-2 border-t border-slate-850">
                        <span className="font-mono uppercase text-slate-400 font-bold block">Gadget Mendelomnio:</span>
                        <p className="text-cyan-300 font-mono font-semibold">{selectedChar.signatureGadget}</p>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="font-mono uppercase text-amber-400 font-bold block">Psicología & Motor:</span>
                      <p className="text-slate-200">{selectedChar.motivation}</p>
                      <div className="pt-2 border-t border-slate-850">
                        <span className="font-mono uppercase text-slate-400 font-bold block">Mayor Debilidad:</span>
                        <p className="text-red-300">{selectedChar.weakness}</p>
                      </div>
                    </div>
                  </div>

                  {/* Evolution Arc */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold block">
                      Arco de Evolución & Rol en la Trama:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedChar.evolutionArc}
                    </p>
                  </div>

                </div>
              ) : (
                /* LOCKED VIEW: Purchase & Unlock Box */
                <div className="space-y-4">
                  
                  {/* Classified Sindicato Warning if applicable */}
                  {selectedChar.isCensored && (
                    <div className="p-4 bg-gradient-to-r from-purple-950 via-slate-950 to-purple-950 border border-purple-500/60 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs">
                        <Skull className="w-4 h-4 text-purple-400" />
                        <span>EXPEDIENTE CLASIFICADO • SINDICATO ISÓTOPO</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Este archivo de inteligencia está censurado por el Consejo de Nobelia. Se requieren credenciales y <strong>{selectedChar.costCoins} Coins</strong> para desclasificar la información y su retrato biométrico.
                      </p>
                    </div>
                  )}

                  {/* Redacted Preview */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                      Registro Previo (Censurado):
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      {selectedChar.concept.slice(0, 60)}... <span className="text-slate-650 select-none">████████████████████████████████████████████████████████</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                      <div>Gadget: <span className="text-slate-650">████████████</span></div>
                      <div>Debilidad: <span className="text-slate-650">████████████</span></div>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div className="p-5 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 border-2 border-amber-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                        Coste de Desbloqueo de Ficha:
                      </span>
                      <div className="flex items-center gap-2 text-xl font-black text-white font-mono">
                        <Coins className="w-6 h-6 text-amber-400" />
                        <span>{selectedChar.costCoins} Coins</span>
                        <span className="text-xs text-slate-400 font-normal">
                          (Tu saldo: <strong className="text-amber-300">{coins} Coins</strong>)
                        </span>
                      </div>
                    </div>

                    <button
                      id={`unlock-char-${selectedChar.id}-btn`}
                      onClick={() => handlePurchaseCharacter(selectedChar)}
                      disabled={coins < selectedChar.costCoins}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        coins >= selectedChar.costCoins
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/30 active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      <span>
                        {coins >= selectedChar.costCoins 
                          ? `Desbloquear Expediente (${selectedChar.costCoins} Coins)` 
                          : `Coins Insuficientes (Faltan ${selectedChar.costCoins - coins})`}
                      </span>
                    </button>
                  </div>

                  <p className="text-center text-[11px] text-slate-400 font-mono">
                    💡 <em>Gana combates en el Escáner AR para obtener +50 Coins tras cada victoria.</em>
                  </p>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* View: Science Battle Rules (Without physical damage mechanics) */}
      {activeSubTab === 'rules' && (
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
              Reglamento Técnico & Fundamentos de Materia
            </span>
            <h2 className="text-2xl font-black text-white">Fundamentos Científicos del Combate</h2>
            <p className="text-xs text-slate-300 mt-1">
              Las propiedades de combate de cada Elementbeast se derivan estrictamente de parámetros físicos y químicos reales de la Tabla Periódica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Tabla de atributos */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-300 text-sm font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                1. Tabla de Atributos Base & Parámetros
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <strong className="text-amber-400 block font-mono">Fuerza (Ataque):</strong>
                  Dureza en la Escala de Mohs y Densidad molecular del elemento o compuesto.
                </li>
                <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <strong className="text-blue-400 block font-mono">Resistencia (Defensa):</strong>
                  Energía de Enlace Atómico y Punto de Fusión en grados Celsius (°C).
                </li>
                <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block font-mono">Velocidad (Prioridad de Turno):</strong>
                  Electronegatividad en la Escala de Pauling y movilidad electrónica.
                </li>
                <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <strong className="text-pink-400 block font-mono">Poder Especial:</strong>
                  Escala de pH (Acidez &le; 3 / Basicidad &ge; 11) y reactividad química activa.
                </li>
                <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <strong className="text-red-400 block font-mono">Estabilidad (PV Base):</strong>
                  Puntos de vida calculados por categoría atómica sumados a la Masa Atómica.
                </li>
              </ul>
            </div>

            {/* Enlaces y Transformaciones */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm font-mono flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  2. Tipos de Enlaces Químicos en Combate
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                    <strong className="text-white font-mono">Enlace Iónico (Alcalino + Halógeno):</strong>
                    Atracción electrostática de alta estabilidad (ej. Na + Cl &rarr; NaCl).
                  </li>
                  <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                    <strong className="text-white font-mono">Enlace Covalente (No Metales):</strong>
                    Compartición de electrones formando estructuras moleculares cerradas (ej. H2O, CO2, SiC).
                  </li>
                  <li className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                    <strong className="text-white font-mono">Enlace Metálico (Mar de Electrones):</strong>
                    Conducción eléctrica y térmica que otorga alta resistencia física (ej. Cu, Fe, Bronce).
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm font-mono">
                  3. Estados Críticos de la Materia
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Bajo condiciones de presión o temperatura extrema, las criaturas pueden entrar en <strong>Fase Supercrítica</strong>, <strong>Alotropía Metaestable</strong>, <strong>Superfluidez Cuántica</strong> o <strong>Ionización de Plasma</strong> consumiendo Puntos de Mesa.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
