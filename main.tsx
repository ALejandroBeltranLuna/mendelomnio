import React, { useState, useEffect, useRef } from 'react';
import { Swords, Shield, Zap, Sparkles, RefreshCw, AlertOctagon, Trophy, RotateCcw, Info, LogOut } from 'lucide-react';
import { Elementbeast, CriticalMode, DebuffType, FieldEffect } from '../types/elementbeasts';
import { INITIAL_ELEMENTBEASTS, CHARACTERS } from '../data/database';
import { sounds } from '../utils/audio';

interface BattleRingProps {
  enemyBeast: Elementbeast;
  scannedObjectName: string;
  activeCharacterId: string;
  unlockedBeastIds: string[];
  onVictory: (beast: Elementbeast) => void;
  onExitBattle: () => void;
}

export const BattleRing: React.FC<BattleRingProps> = ({
  enemyBeast: initialEnemy,
  scannedObjectName,
  activeCharacterId,
  onVictory,
  onExitBattle,
}) => {
  const currentTrainer = CHARACTERS.find(c => c.id === activeCharacterId) || CHARACTERS[0];

  // Team of 3 core beasts
  const [team, setTeam] = useState<Elementbeast[]>(() => {
    const starter = INITIAL_ELEMENTBEASTS.find(b => b.id === currentTrainer.starterElementId) || INITIAL_ELEMENTBEASTS[0];
    const iron = INITIAL_ELEMENTBEASTS.find(b => b.id === 'hierro') || INITIAL_ELEMENTBEASTS[2];
    const silicon = INITIAL_ELEMENTBEASTS.find(b => b.id === 'silicio') || INITIAL_ELEMENTBEASTS[3];
    return [
      JSON.parse(JSON.stringify(starter)),
      JSON.parse(JSON.stringify(iron)),
      JSON.parse(JSON.stringify(silicon)),
    ];
  });

  const [activeBeastIndex, setActiveBeastIndex] = useState<number>(0);
  const activeBeast = team[activeBeastIndex];

  // Enemy state
  const [enemy, setEnemy] = useState<Elementbeast>(() => JSON.parse(JSON.stringify(initialEnemy)));

  // Combat status
  const [turnCount, setTurnCount] = useState<number>(1);
  const [alterationPoints, setAlterationPoints] = useState<number>(3);
  const [activeField, setActiveField] = useState<FieldEffect>('Vacío Químico');
  const [playerDebuffs, setPlayerDebuffs] = useState<DebuffType[]>([]);
  const [enemyDebuffs, setEnemyDebuffs] = useState<DebuffType[]>([]);
  const [playerCriticalMode, setPlayerCriticalMode] = useState<CriticalMode | null>(null);
  const [enemyCriticalMode, setEnemyCriticalMode] = useState<CriticalMode | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [synthesisModalOpen, setSynthesisModalOpen] = useState<boolean>(false);
  const [criticalModalOpen, setCriticalModalOpen] = useState<boolean>(false);
  const [attackAnimation, setAttackAnimation] = useState<'player' | 'enemy' | null>(null);
  const [floatingDamage, setFloatingDamage] = useState<{ target: 'player' | 'enemy'; text: string } | null>(null);

  // Special Property Long-Press State
  const [showPropertyTooltip, setShowPropertyTooltip] = useState<boolean>(false);
  const longPressTimerRef = useRef<number | null>(null);

  // Check if double speed rule applies
  const checkDoubleSpeed = (attackerVel: number, defenderVel: number) => {
    return attackerVel >= defenderVel * 2;
  };

  // Calculate damage strictly based on rules: Caso A, Caso B, Caso C
  const calculateDamage = (
    attacker: Elementbeast,
    defender: Elementbeast,
    attackerIsPlayer: boolean,
    critMode: CriticalMode | null
  ): { defenderDamage: number; recoilDamage: number; desc: string } => {
    let fza = attacker.stats.fuerza;
    let res = defender.stats.resistencia;

    // Apply Critical Mode buffs/debuffs
    if (critMode === 'Fase Supercrítica') {
      res = Math.round(res * 0.5);
    } else if (critMode === 'Alotropía Metaestable') {
      fza = fza * 2;
    } else if (critMode === 'Superfluidez Cuántica') {
      fza = Math.round(fza * 0.5);
    } else if (critMode === 'Ionización de Plasma') {
      fza = fza * 3;
      res = 0;
    }

    // Apply field effects
    if (activeField === 'Excitación Eléctrica' && attacker.category.includes('Metal')) {
      fza = Math.max(10, fza - 20);
    }
    if (activeField === 'Oxidación Ambiental' && defender.category.includes('Metal')) {
      res = Math.max(10, res - 20);
    }

    // Check Debuffs
    const defenderDebuffs = attackerIsPlayer ? enemyDebuffs : playerDebuffs;
    const attackerDebuffs = attackerIsPlayer ? playerDebuffs : enemyDebuffs;

    if (attackerDebuffs.includes('Amalgamación')) {
      fza = Math.round(fza * 0.5);
    }

    let multiplier = 1;
    if (defenderDebuffs.includes('Fragilización')) {
      multiplier = 1.5;
    }

    // Scenario A: Impacto Efectivo (Fuerza >= Resistencia)
    if (fza >= res) {
      const baseDmg = (fza - res) * 2 + 10;
      const finalDmg = Math.max(15, Math.round(baseDmg * multiplier));
      return {
        defenderDamage: finalDmg,
        recoilDamage: 0,
        desc: `¡Impacto Efectivo! -${finalDmg} PV`
      };
    }

    // Scenario B: Impacto Absorbido (Fuerza < Resistencia < 2 * Fuerza)
    if (fza < res && res < 2 * fza) {
      const finalDmg = Math.round(10 * multiplier);
      return {
        defenderDamage: finalDmg,
        recoilDamage: 0,
        desc: `Impacto Absorbido -${finalDmg} PV`
      };
    }

    // Scenario C: El Rebote / Recoil (Resistencia >= 2 * Fuerza)
    const defDmg = 5;
    let recoilDmg = 2 * res - fza;
    if (critMode === 'Alotropía Metaestable') {
      recoilDmg *= 2;
    }
    recoilDmg = Math.max(10, recoilDmg);

    return {
      defenderDamage: defDmg,
      recoilDamage: recoilDmg,
      desc: `¡Rebote! Defensor -${defDmg} PV | Atacante -${recoilDmg} PV`
    };
  };

  // Perform Player Attack
  const handlePlayerAttack = () => {
    if (isProcessing || battleResult) return;
    setIsProcessing(true);

    const enemyHasDoubleSpeed = checkDoubleSpeed(enemy.stats.velocidad, activeBeast.stats.velocidad);

    if (enemyHasDoubleSpeed) {
      // Enemy strikes first due to 2x speed
      resolveEnemyTurn(() => {
        if (activeBeast.stats.hp > 0) {
          resolvePlayerStrike();
        } else {
          finishTurn();
        }
      });
    } else {
      resolvePlayerStrike(() => {
        if (enemy.stats.hp > 0) {
          resolveEnemyTurn(() => {
            finishTurn();
          });
        } else {
          handleVictory();
        }
      });
    }
  };

  const resolvePlayerStrike = (callback?: () => void) => {
    setAttackAnimation('player');
    sounds.playAttackHit('effective');

    const result = calculateDamage(activeBeast, enemy, true, playerCriticalMode);
    
    setTimeout(() => {
      setAttackAnimation(null);
      const newEnemyHp = Math.max(0, enemy.stats.hp - result.defenderDamage);
      setEnemy(prev => ({ ...prev, stats: { ...prev.stats, hp: newEnemyHp } }));

      setFloatingDamage({ target: 'enemy', text: `-${result.defenderDamage} PV` });
      setTimeout(() => setFloatingDamage(null), 1000);

      if (result.recoilDamage > 0) {
        sounds.playAttackHit('recoil');
        const newPlayerHp = Math.max(0, activeBeast.stats.hp - result.recoilDamage);
        updateActiveBeastHp(newPlayerHp);
      }

      if (newEnemyHp <= 0) {
        handleVictory();
      } else if (callback) {
        callback();
      }
    }, 500);
  };

  const resolveEnemyTurn = (callback?: () => void) => {
    setAttackAnimation('enemy');
    sounds.playAttackHit('laser');

    setTimeout(() => {
      setAttackAnimation(null);
      const result = calculateDamage(enemy, activeBeast, false, enemyCriticalMode);
      const newPlayerHp = Math.max(0, activeBeast.stats.hp - result.defenderDamage);
      updateActiveBeastHp(newPlayerHp);

      setFloatingDamage({ target: 'player', text: `-${result.defenderDamage} PV` });
      setTimeout(() => setFloatingDamage(null), 1000);

      if (result.recoilDamage > 0) {
        const newEnemyHp = Math.max(0, enemy.stats.hp - result.recoilDamage);
        setEnemy(prev => ({ ...prev, stats: { ...prev.stats, hp: newEnemyHp } }));
      }

      if (newPlayerHp <= 0) {
        handlePlayerKnockout();
      } else if (callback) {
        callback();
      }
    }, 500);
  };

  const updateActiveBeastHp = (newHp: number) => {
    setTeam(prev => {
      const copy = [...prev];
      copy[activeBeastIndex].stats.hp = newHp;
      return copy;
    });
  };

  const handlePlayerKnockout = () => {
    const aliveIndex = team.findIndex((b, idx) => idx !== activeBeastIndex && b.stats.hp > 0);
    if (aliveIndex !== -1) {
      setActiveBeastIndex(aliveIndex);
      finishTurn();
    } else {
      setBattleResult('defeat');
      setIsProcessing(false);
    }
  };

  const handleVictory = () => {
    setBattleResult('victory');
    sounds.playVictory();
    onVictory(enemy);
    setIsProcessing(false);
  };

  const finishTurn = () => {
    // Process debuffs end of turn
    if (playerDebuffs.includes('Disolución')) {
      updateActiveBeastHp(Math.max(0, activeBeast.stats.hp - 10));
    }
    setTurnCount(prev => prev + 1);
    setIsProcessing(false);
  };

  // Perform Workbench Synthesis
  const handleSynthesizeCompound = (reagent: Elementbeast) => {
    if (alterationPoints <= 0) return;
    setSynthesisModalOpen(false);
    setIsProcessing(true);
    sounds.playSynthesisWoosh();

    const pair = [activeBeast.id, reagent.id].sort().join('+');
    let compoundId: string | null = null;

    if (pair === 'carbono+hierro') compoundId = 'sic_abrasor';
    else if (pair === 'carbono+silicio') compoundId = 'sic_abrasor';
    else if (pair === 'cloro+sodio') compoundId = 'nacl';
    else if (pair === 'magnesio+oxigeno') compoundId = 'oxido_magnesio';
    else if (pair === 'calcio+carbono') compoundId = 'carbonato_calcio';
    else if (pair === 'cobre+estano') compoundId = 'bronce';
    else if (pair === 'hierro+silicio') compoundId = 'ferrosilicio';
    else if (pair === 'fosforo+hierro') compoundId = 'fosfuro_hierro';
    else if (pair === 'hidrogeno+oxigeno') compoundId = 'agua';
    else if (pair === 'carbono+oxigeno') compoundId = 'co2';
    else if (pair === 'bario+oxigeno') compoundId = 'sulfato_bario';
    else if (pair === 'cloro+hierro') compoundId = 'cloruro_hierro';

    const compound = compoundId ? INITIAL_ELEMENTBEASTS.find(b => b.id === compoundId) : null;

    setAlterationPoints(prev => prev - 1);

    setTimeout(() => {
      if (compound) {
        setTeam(prev => {
          const copy = [...prev];
          copy[activeBeastIndex] = {
            ...compound,
            stats: {
              ...compound.stats,
              hp: copy[activeBeastIndex].stats.hp + 25,
              maxHp: compound.stats.maxHp,
            }
          };
          return copy;
        });
      } else {
        setTeam(prev => {
          const copy = [...prev];
          copy[activeBeastIndex].stats.fuerza += 15;
          copy[activeBeastIndex].stats.resistencia += 15;
          return copy;
        });
      }

      resolveEnemyTurn(() => {
        finishTurn();
      });
    }, 600);
  };

  // Perform Critical Mode Activation
  const handleActivateCriticalMode = (mode: CriticalMode) => {
    if (alterationPoints < 2) return;
    setCriticalModalOpen(false);
    setIsProcessing(true);
    setAlterationPoints(prev => prev - 2);
    setPlayerCriticalMode(mode);
    sounds.playCombatTransition();

    setTimeout(() => {
      resolveEnemyTurn(() => {
        finishTurn();
      });
    }, 500);
  };

  // Long press property handlers
  const handlePropertyStart = () => {
    longPressTimerRef.current = window.setTimeout(() => {
      setShowPropertyTooltip(true);
      sounds.playScanBeep(650, 0.05);
    }, 350);
  };

  const handlePropertyEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      
      {/* Neutral & Basic Pokémon Battle Arena */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Battle Stadium Ground Grid (Neutral Ring Floor) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(51,65,85,0.25)_0,rgba(15,23,42,0.95)_100%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-slate-900/90 via-slate-950/60 to-transparent pointer-events-none" />

        {/* Floating Neutral Pedestals */}
        {/* Top-Right Enemy Pedestal */}
        <div className="absolute top-20 right-10 sm:right-24 w-36 sm:w-48 h-10 sm:h-12 bg-slate-800/80 rounded-[100%] border border-slate-700/80 shadow-lg shadow-black/60 pointer-events-none -rotate-2" />
        
        {/* Bottom-Left Player Pedestal */}
        <div className="absolute bottom-12 left-8 sm:left-20 w-44 sm:w-56 h-12 sm:h-14 bg-slate-800/80 rounded-[100%] border border-slate-700/80 shadow-xl shadow-black/80 pointer-events-none rotate-2" />

        {/* Floating Damage Text */}
        {floatingDamage && (
          <div className={`absolute z-30 font-black text-lg sm:text-2xl drop-shadow-md animate-bounce ${
            floatingDamage.target === 'enemy' ? 'top-16 right-20 text-amber-300' : 'bottom-24 left-24 text-red-400'
          }`}>
            {floatingDamage.text}
          </div>
        )}

        {/* UPPER AREA: Enemy Status HUD (Top-Left) + Enemy Appearance (Top-Right) */}
        <div className="relative z-10 flex items-start justify-between w-full">
          
          {/* Enemy Status HUD (Pokémon Style: Name + HP Bar + PV Numbers) */}
          <div className="w-48 sm:w-64 bg-slate-900/90 border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                {enemy.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {enemy.symbol || enemy.formula}
              </span>
            </div>

            {/* Enemy HP Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${
                    (enemy.stats.hp / enemy.stats.maxHp) > 0.5 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                      : (enemy.stats.hp / enemy.stats.maxHp) > 0.2 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                      : 'bg-gradient-to-r from-red-600 to-rose-500'
                  }`}
                  style={{ width: `${Math.max(0, (enemy.stats.hp / enemy.stats.maxHp) * 100)}%` }}
                />
              </div>
              <div className="text-right text-[11px] font-mono font-bold text-slate-300">
                {enemy.stats.hp} / {enemy.stats.maxHp} PV
              </div>
            </div>
          </div>

          {/* Enemy Creature Appearance (Full Body Facing Player on Pedestal, NO Icon Box) */}
          <div className={`relative pr-6 sm:pr-16 pt-2 transition-transform duration-300 ${
            attackAnimation === 'enemy' ? 'scale-125 -translate-x-10 translate-y-4' : 'scale-100 hover:scale-105'
          }`}>
            <div className="text-6xl sm:text-8xl drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] filter transition-all select-none animate-pulse" style={{ animationDuration: '3s' }}>
              {enemy.avatarEmoji}
            </div>
          </div>

        </div>

        {/* LOWER AREA: Player Creature Back Sprite (Bottom-Left) + Player Status HUD (Bottom-Right) */}
        <div className="relative z-10 flex items-end justify-between w-full pt-4">
          
          {/* Player Creature Back-View (Espalda de la Criatura) */}
          <div className={`relative pl-8 sm:pl-20 transition-transform duration-300 ${
            attackAnimation === 'player' ? 'scale-125 translate-x-10 -translate-y-4' : 'scale-100'
          }`}>
            {/* Back sprite representation with perspective angle */}
            <div className="relative flex flex-col items-center">
              <div className="text-6xl sm:text-8xl drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)] filter select-none brightness-90 saturate-125 transform -scale-x-100 -rotate-6">
                {activeBeast.avatarEmoji}
              </div>
              {/* Back perspective indicator */}
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 mt-1">
                Espalda ({activeBeast.name})
              </span>
            </div>
          </div>

          {/* Player Status HUD (Name, HP, Atq/Def, Efecto Especial sin descripción hasta toque prolongado) */}
          <div className="w-56 sm:w-72 bg-slate-900/90 border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md space-y-2">
            
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm sm:text-base text-cyan-300 tracking-wide">
                {activeBeast.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {activeBeast.symbol || activeBeast.formula}
              </span>
            </div>

            {/* Player HP Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${
                    (activeBeast.stats.hp / activeBeast.stats.maxHp) > 0.5 
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' 
                      : (activeBeast.stats.hp / activeBeast.stats.maxHp) > 0.2 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                      : 'bg-gradient-to-r from-red-600 to-rose-500'
                  }`}
                  style={{ width: `${Math.max(0, (activeBeast.stats.hp / activeBeast.stats.maxHp) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">PV</span>
                <span className="font-extrabold text-cyan-300">{activeBeast.stats.hp} / {activeBeast.stats.maxHp}</span>
              </div>
            </div>

            {/* Player Attributes: Ataque y Defensa */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] font-mono">
              <span className="text-slate-300">
                Ataque: <strong className="text-amber-300">{activeBeast.stats.fuerza}</strong>
              </span>
              <span className="text-slate-300">
                Defensa: <strong className="text-blue-300">{activeBeast.stats.resistencia}</strong>
              </span>
            </div>

            {/* Efecto Especial: Solo nombre, descripción solo con toque prolongado */}
            <div className="relative pt-1 border-t border-slate-800">
              <button
                type="button"
                onMouseDown={handlePropertyStart}
                onMouseUp={handlePropertyEnd}
                onTouchStart={handlePropertyStart}
                onTouchEnd={handlePropertyEnd}
                onClick={() => setShowPropertyTooltip(prev => !prev)}
                className="w-full text-left px-2 py-1 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-[10px] font-mono text-amber-300 flex items-center justify-between border border-amber-500/30 cursor-pointer select-none"
                title="Mantén presionado para ver la descripción"
              >
                <span className="truncate font-semibold">⚡ {activeBeast.property.name}</span>
                <span className="text-[9px] text-slate-400">(Mantén pulsado)</span>
              </button>

              {/* Long Press Tooltip Modal */}
              {showPropertyTooltip && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-2.5 bg-slate-950 border border-amber-500/70 rounded-xl text-xs shadow-2xl z-40 text-slate-200 animate-scale-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-300 text-[11px] font-mono">
                      {activeBeast.property.name}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowPropertyTooltip(false); }}
                      className="text-slate-400 hover:text-white text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {activeBeast.property.description}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Victory / Defeat Overlay on Arena */}
        {battleResult && (
          <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-scale-in space-y-3">
            {battleResult === 'victory' ? (
              <>
                <Trophy className="w-14 h-14 text-amber-300 animate-bounce" />
                <h3 className="text-2xl font-black text-white">¡VICTORIA!</h3>
                <p className="text-sm text-emerald-300 max-w-sm">
                  Has vencido y estabilizado a <strong>{enemy.name}</strong>. ¡Ha sido registrado en tu Mendelomnio!
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/80 border border-amber-500/50 rounded-xl text-amber-300 font-mono text-sm font-bold shadow-lg">
                  <span className="text-base">🪙</span>
                  <span>+50 Coins Ganados para la Academia</span>
                </div>
                <button
                  id="finish-battle-btn"
                  onClick={onExitBattle}
                  className="mt-2 py-3 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/40 cursor-pointer"
                >
                  Continuar Explorando
                </button>
              </>
            ) : (
              <>
                <AlertOctagon className="w-14 h-14 text-red-400 animate-pulse" />
                <h3 className="text-2xl font-black text-white">ENLACE COLAPSADO</h3>
                <p className="text-sm text-red-300 max-w-sm">
                  Tu equipo ha caído. Vuelve a calibrar tus reactivos y vuelve a intentarlo.
                </p>
                <button
                  onClick={onExitBattle}
                  className="mt-2 py-3 px-8 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl border border-slate-700 cursor-pointer"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        )}

      </div>

      {/* BOTTOM CONTROLS & SIDEBAR WIDGETS (COMBINED) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* Left: Combat Commands Panel (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-xl">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold">
            Comandos de Combate
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* Attack Button (Without Mohs) */}
            <button
              id="battle-attack-btn"
              onClick={handlePlayerAttack}
              disabled={isProcessing || battleResult !== null}
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md shadow-red-600/30 transition-all cursor-pointer active:scale-95 text-xs uppercase"
            >
              <Swords className="w-5 h-5 text-amber-300" />
              <span>Atacar</span>
            </button>

            {/* Workbench / Synthesis Button */}
            <button
              id="battle-synthesis-btn"
              onClick={() => setSynthesisModalOpen(true)}
              disabled={isProcessing || alterationPoints <= 0 || battleResult !== null}
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md shadow-cyan-600/30 transition-all cursor-pointer active:scale-95 text-xs uppercase"
            >
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>Mesa de Trabajo</span>
            </button>

            {/* Critical Mode Button */}
            <button
              id="battle-critical-btn"
              onClick={() => setCriticalModalOpen(true)}
              disabled={isProcessing || alterationPoints < 2 || battleResult !== null}
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95 text-xs uppercase"
            >
              <Zap className="w-5 h-5 text-yellow-300" />
              <span>Fase Crítica</span>
            </button>

            {/* Switch Active Beast */}
            <div className="flex gap-1">
              {team.map((beast, idx) => (
                <button
                  key={beast.id}
                  id={`switch-beast-${idx}`}
                  onClick={() => {
                    if (idx !== activeBeastIndex && beast.stats.hp > 0) {
                      setActiveBeastIndex(idx);
                    }
                  }}
                  disabled={isProcessing || beast.stats.hp <= 0 || idx === activeBeastIndex}
                  className={`flex-1 flex flex-col items-center justify-center rounded-xl p-1 text-[10px] font-mono border transition-all ${
                    idx === activeBeastIndex
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                      : beast.stats.hp <= 0
                      ? 'bg-slate-900/40 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 cursor-pointer'
                  }`}
                >
                  <span className="text-base">{beast.avatarEmoji}</span>
                  <span className="truncate w-full text-center">{beast.symbol}</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Right: Side Widgets (Campo, Puntos de Mesa, Retirada) situated right beside combat commands (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-xl">
          
          <div className="space-y-2">
            {/* Campo */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono">
              <span className="text-slate-400">Campo:</span>
              <span className="font-bold text-amber-300">{activeField}</span>
            </div>

            {/* Puntos de Mesa */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-cyan-950/70 border border-cyan-500/40 rounded-xl text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Puntos Mesa:
              </span>
              <span className="font-bold text-cyan-300">{alterationPoints}/3</span>
            </div>
          </div>

          {/* Retirada Button */}
          <button
            onClick={onExitBattle}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Retirada</span>
          </button>

        </div>

      </div>

      {/* Synthesis / Workbench Modal */}
      {synthesisModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Mesa de Trabajo: Síntesis en Combate</h3>
              </div>
              <button
                onClick={() => setSynthesisModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cerrar
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Selecciona un elemento reactivo para fusionarlo con <strong>{activeBeast.name}</strong>:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {INITIAL_ELEMENTBEASTS.filter(b => !b.isCompound).map(reagent => (
                <button
                  key={reagent.id}
                  id={`reagent-btn-${reagent.id}`}
                  onClick={() => handleSynthesizeCompound(reagent)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-left transition-all cursor-pointer"
                >
                  <span className="text-2xl">{reagent.avatarEmoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{reagent.name}</p>
                    <p className="text-[10px] text-cyan-400 font-mono">{reagent.symbol}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Critical Mode Modal */}
      {criticalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500/60 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <h3 className="text-base font-black text-white">Modos Críticos (Fase Crítica)</h3>
              </div>
              <button
                onClick={() => setCriticalModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cerrar
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Consume <strong className="text-purple-300">2 Puntos de Mesa</strong> para forzar una transformación física de estado:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleActivateCriticalMode('Fase Supercrítica')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs font-bold text-purple-300">
                  <span>Fase Supercrítica</span>
                  <span className="font-mono text-[10px] text-slate-400">Vel +100% | Res -50%</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">Ignora el 50% de la Resistencia del rival.</p>
              </button>

              <button
                onClick={() => handleActivateCriticalMode('Alotropía Metaestable')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                  <span>Alotropía Metaestable</span>
                  <span className="font-mono text-[10px] text-slate-400">Fza +100% | Res +200%</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">Inmune a debuffs físicos. Daño por Rebote duplicado.</p>
              </button>

              <button
                onClick={() => handleActivateCriticalMode('Superfluidez Cuántica')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs font-bold text-cyan-300">
                  <span>Superfluidez Cuántica</span>
                  <span className="font-mono text-[10px] text-slate-400">Vel +200% | Prioridad</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">Prioridad absoluta y 50% de probabilidad de esquiva.</p>
              </button>

              <button
                onClick={() => handleActivateCriticalMode('Ionización de Plasma')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs font-bold text-red-300">
                  <span>Ionización de Plasma</span>
                  <span className="font-mono text-[10px] text-slate-400">Fza +200% | Ataque Puro</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">Ataque de energía pura que ignora la resistencia física.</p>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
