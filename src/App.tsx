/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerAR } from './components/ScannerAR';
import { BattleRing } from './components/BattleRing';
import { MendelomnioDex } from './components/MendelomnioDex';
import { SynthesisLab } from './components/SynthesisLab';
import { LoreAcademy } from './components/LoreAcademy';
import { Elementbeast } from './types/elementbeasts';
import { INITIAL_ELEMENTBEASTS } from './data/database';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'battle' | 'mendelomnio' | 'lab' | 'lore'>('scanner');
  const [activeCharacterId, setActiveCharacterId] = useState<string>('leo');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Player's Coins for character unlocks
  const [coins, setCoins] = useState<number>(100);

  // Unlocked characters (starts with Leo, others purchasable with Coins)
  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<string[]>(['leo']);

  // Unlocked creatures in player's Mendelomnio (scanned or defeated in combat)
  const [unlockedBeastIds, setUnlockedBeastIds] = useState<string[]>([
    'hidrogeno',
    'carbono',
    'hierro',
    'silicio',
    'agua',
    'co2',
    'nacl',
  ]);

  // Battle encounter state
  const [battleEnemy, setBattleEnemy] = useState<Elementbeast>(INITIAL_ELEMENTBEASTS[9]); // Cesio or default
  const [scannedObjectLabel, setScannedObjectLabel] = useState<string>('Batería Alcalina');
  const [inActiveBattle, setInActiveBattle] = useState<boolean>(false);

  // Start battle triggered from Scanner
  const handleStartBattleFromScanner = (enemy: Elementbeast, objectName: string) => {
    setBattleEnemy(enemy);
    setScannedObjectLabel(objectName);
    setInActiveBattle(true);
    setActiveTab('battle');
  };

  // Handle victory in battle: unlocks beast and awards +50 coins
  const handleBattleVictory = (beast: Elementbeast) => {
    setCoins(prev => prev + 50);
    if (!unlockedBeastIds.includes(beast.id)) {
      setUnlockedBeastIds(prev => [...prev, beast.id]);
    }
  };

  // Handle unlock character purchase
  const handleUnlockCharacter = (charId: string, cost: number) => {
    setCoins(prev => Math.max(0, prev - cost));
    setUnlockedCharacterIds(prev => {
      if (!prev.includes(charId)) {
        return [...prev, charId];
      }
      return prev;
    });
  };

  // Handle unlock from Synthesis Lab
  const handleUnlockFromLab = (beastId: string) => {
    if (!unlockedBeastIds.includes(beastId)) {
      setUnlockedBeastIds(prev => [...prev, beastId]);
    }
  };

  const handleExitBattle = () => {
    setInActiveBattle(false);
    setActiveTab('scanner');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      
      {/* Top OS Navigation */}
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unlockedCount={unlockedBeastIds.length}
          totalCount={INITIAL_ELEMENTBEASTS.length}
          coins={coins}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          inBattle={inActiveBattle}
        />

        {/* Dynamic Viewport */}
        <main className="pb-12 pt-2">
          {activeTab === 'scanner' && (
            <ScannerAR
              onStartBattle={handleStartBattleFromScanner}
            />
          )}

          {activeTab === 'battle' && (
            <BattleRing
              enemyBeast={battleEnemy}
              scannedObjectName={scannedObjectLabel}
              activeCharacterId={activeCharacterId}
              unlockedBeastIds={unlockedBeastIds}
              onVictory={handleBattleVictory}
              onExitBattle={handleExitBattle}
            />
          )}

          {activeTab === 'mendelomnio' && (
            <MendelomnioDex
              unlockedBeastIds={unlockedBeastIds}
            />
          )}

          {activeTab === 'lab' && (
            <SynthesisLab
              unlockedBeastIds={unlockedBeastIds}
              onUnlockNewBeast={handleUnlockFromLab}
            />
          )}

          {activeTab === 'lore' && (
            <LoreAcademy
              coins={coins}
              unlockedCharacterIds={unlockedCharacterIds}
              onUnlockCharacter={handleUnlockCharacter}
            />
          )}
        </main>
      </div>

      {/* Footer Status Bar (Credit removed as requested) */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-3 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Mendelomnio OS &bull; Sistema de Registro y Análisis de Materia</span>
          <span className="text-cyan-500/80">Academia Elemental de Materia &bull; Versión 2.4</span>
        </div>
      </footer>

    </div>
  );
}
