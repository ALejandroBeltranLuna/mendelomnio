import React, { useState } from 'react';
import { FlaskConical, Plus, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCw, Layers } from 'lucide-react';
import { Elementbeast } from '../types/elementbeasts';
import { INITIAL_ELEMENTBEASTS } from '../data/database';
import { sounds } from '../utils/audio';

interface SynthesisLabProps {
  unlockedBeastIds: string[];
  onUnlockNewBeast: (beastId: string) => void;
}

export const SynthesisLab: React.FC<SynthesisLabProps> = ({ unlockedBeastIds, onUnlockNewBeast }) => {
  const [slot1, setSlot1] = useState<Elementbeast | null>(INITIAL_ELEMENTBEASTS.find(b => b.id === 'silicio') || null);
  const [slot2, setSlot2] = useState<Elementbeast | null>(INITIAL_ELEMENTBEASTS.find(b => b.id === 'carbono') || null);
  const [reactionType, setReactionType] = useState<'sintesis' | 'descomposicion' | 'redox' | 'acidobase'>('sintesis');
  const [synthesizedResult, setSynthesizedResult] = useState<Elementbeast | null>(null);
  const [reactionLog, setReactionLog] = useState<string | null>(null);
  const [isReacting, setIsReacting] = useState<boolean>(false);

  const availableElements = INITIAL_ELEMENTBEASTS.filter(b => !b.isCompound);

  const handleExecuteReaction = () => {
    if (!slot1 || !slot2) return;
    setIsReacting(true);
    setSynthesizedResult(null);
    setReactionLog(null);
    sounds.playSynthesisWoosh();

    const pair = [slot1.id, slot2.id].sort().join('+');

    setTimeout(() => {
      setIsReacting(false);
      let targetCompoundId: string | null = null;
      let formulaText = '';

      if (pair === 'carbono+silicio') {
        targetCompoundId = 'sic_abrasor';
        formulaText = 'Si + C -> SiC (Carburo de Silicio / Abrasor Diamantino)';
      } else if (pair === 'cloro+sodio') {
        targetCompoundId = 'nacl';
        formulaText = 'Na + Cl -> NaCl (Cloruro de Sodio / Sal Común)';
      } else if (pair === 'hidrogeno+oxigeno') {
        targetCompoundId = 'agua';
        formulaText = '2H + O -> H2O (Monóxido de Dihidrógeno / Agua Pura)';
      } else if (pair === 'carbono+oxigeno') {
        targetCompoundId = 'co2';
        formulaText = 'C + 2O -> CO2 (Dióxido de Carbono Extintor)';
      } else if (pair === 'magnesio+oxigeno') {
        targetCompoundId = 'oxido_magnesio';
        formulaText = 'Mg + O -> MgO (Óxido de Magnesio Refractario)';
      } else if (pair === 'calcio+carbono') {
        targetCompoundId = 'carbonato_calcio';
        formulaText = 'Ca + C + 3O -> CaCO3 (Carbonato Cálcico Neutralizador)';
      } else if (pair === 'cobre+estano') {
        targetCompoundId = 'bronce';
        formulaText = 'Cu + Sn -> CuSn (Gólem de Bronce / Aleación Milenaria)';
      } else if (pair === 'hierro+silicio') {
        targetCompoundId = 'ferrosilicio';
        formulaText = 'Fe + Si -> FeSi (Ferrosilicio Desoxidante)';
      } else if (pair === 'fosforo+hierro') {
        targetCompoundId = 'fosfuro_hierro';
        formulaText = '3Fe + P -> Fe3P (Fosfuro de Hierro Lacerante)';
      } else if (pair === 'bario+oxigeno') {
        targetCompoundId = 'sulfato_bario';
        formulaText = 'Ba + SO4 -> BaSO4 (Sulfato de Bario Insoluble)';
      } else if (pair === 'cloro+hierro') {
        targetCompoundId = 'cloruro_hierro';
        formulaText = 'Fe + 3Cl -> FeCl3 (Cloruro Férrico Floculante)';
      }

      if (targetCompoundId) {
        const found = INITIAL_ELEMENTBEASTS.find(b => b.id === targetCompoundId);
        if (found) {
          setSynthesizedResult(found);
          setReactionLog(`¡REACCIÓN QUÍMICA COMPLETADA! ${formulaText}`);
          sounds.playLockSuccess();
          onUnlockNewBeast(found.id);
        }
      } else {
        setReactionLog(`Los átomos ${slot1.name} y ${slot2.name} no forman un enlace estable bajo estas condiciones estándar.`);
      }
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-teal-950 text-teal-400 border border-teal-500/40 rounded-md uppercase">
            Laboratorio de la Academia
          </span>
          <span className="text-xs text-slate-400 font-mono">Mesa de Trabajo Químico</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
          Mesa de Síntesis y Enlaces Moleculares
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
          Experimenta combinando átomos de tu Mendelomnio para forjar nuevas moléculas, compuestos y aleaciones elementales tal como aprenden Leo, Ana y Kai.
        </p>
      </div>

      {/* Main Workbench Stage */}
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Reactor Chambers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Chamber 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
              Reactivo A (Átomo Base)
            </span>
            {slot1 ? (
              <div className="p-4 rounded-xl border bg-slate-900/80 border-slate-700 flex flex-col items-center">
                <span className="text-4xl mb-2">{slot1.avatarEmoji}</span>
                <span className="font-black text-white text-base">{slot1.name}</span>
                <span className="text-xs font-mono text-cyan-400">{slot1.symbol} (Z={slot1.atomicNumber})</span>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                Selecciona reactivo
              </div>
            )}

            <select
              value={slot1?.id || ''}
              onChange={(e) => setSlot1(availableElements.find(b => b.id === e.target.value) || null)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-400"
            >
              {availableElements.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Center: Operator & Spark */}
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="w-12 h-12 rounded-full bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-lg shadow-teal-950/50">
              <Plus className="w-6 h-6" />
            </div>

            <button
              id="execute-reaction-btn"
              onClick={handleExecuteReaction}
              disabled={isReacting || !slot1 || !slot2}
              className={`w-full max-w-xs py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider text-white shadow-xl transition-all cursor-pointer ${
                isReacting
                  ? 'bg-teal-950 text-teal-400 border border-teal-500 cursor-wait'
                  : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-teal-600/30 active:scale-95'
              }`}
            >
              {isReacting ? 'Reaccionando Enlace...' : '⚡ Forjar Síntesis Molecular'}
            </button>
          </div>

          {/* Chamber 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
              Reactivo B (Catalizador / Enlace)
            </span>
            {slot2 ? (
              <div className="p-4 rounded-xl border bg-slate-900/80 border-slate-700 flex flex-col items-center">
                <span className="text-4xl mb-2">{slot2.avatarEmoji}</span>
                <span className="font-black text-white text-base">{slot2.name}</span>
                <span className="text-xs font-mono text-cyan-400">{slot2.symbol} (Z={slot2.atomicNumber})</span>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                Selecciona reactivo
              </div>
            )}

            <select
              value={slot2?.id || ''}
              onChange={(e) => setSlot2(availableElements.find(b => b.id === e.target.value) || null)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-400"
            >
              {availableElements.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.symbol})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Reaction Output Dossier */}
        {synthesizedResult && (() => {
          const isEncounteredInWorld = unlockedBeastIds.includes(synthesizedResult.id);
          return (
            <div className="bg-gradient-to-r from-slate-950 via-teal-950/40 to-slate-950 border-2 border-teal-500/60 rounded-2xl p-5 shadow-xl animate-scale-in flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-2 shrink-0 shadow-lg ${
                    isEncounteredInWorld 
                      ? 'bg-slate-900/90' 
                      : 'bg-slate-950 border-slate-700 text-slate-600'
                  }`}
                  style={isEncounteredInWorld ? { backgroundColor: `${synthesizedResult.color}22`, borderColor: synthesizedResult.color } : {}}
                >
                  {isEncounteredInWorld ? (
                    synthesizedResult.avatarEmoji
                  ) : (
                    <span className="text-3xl filter grayscale opacity-40 select-none" title="Silueta no descubierta en el mundo">
                      ❓
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-teal-400 uppercase font-bold">
                      ¡Fórmula Molecular Enlazada!
                    </span>
                    {!isEncounteredInWorld && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
                        Silueta Oculta (Sin Escanear)
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white">{synthesizedResult.name} ({synthesizedResult.symbol})</h3>
                  <p className="text-xs text-slate-300">
                    {isEncounteredInWorld 
                      ? synthesizedResult.visualDescription 
                      : "Estructura molecular sintetizada con éxito. Su imagen y avatar de criatura permanecen ocultos hasta que la encuentres y escanees por el mundo real."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEncounteredInWorld ? (
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Registrado en Mendelomnio
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono flex items-center gap-1.5">
                    🔍 Pendiente de Escaneo en Mundo
                  </span>
                )}
              </div>
            </div>
          );
        })()}

        {reactionLog && (
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300">
            {reactionLog}
          </div>
        )}

        {/* Suggested Combination Guide from the Series */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
            Fórmulas Canónicas de la Temporada 1:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              <strong className="text-cyan-300">Si + C</strong> → Carburo de Silicio (SiC)
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              <strong className="text-cyan-300">Na + Cl</strong> → Cloruro de Sodio (NaCl)
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              <strong className="text-cyan-300">Mg + O</strong> → Óxido de Magnesio (MgO)
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              <strong className="text-cyan-300">Cu + Sn</strong> → Gólem de Bronce (CuSn)
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              <strong className="text-cyan-300">Fe + Si</strong> → Ferrosilicio (FeSi)
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              <strong className="text-cyan-300">3Fe + P</strong> → Fosfuro de Hierro (Fe3P)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
