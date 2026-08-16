import React, { useState } from 'react';
import { Navbar } from './Navbar';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'battle' | 'mendelomnio' | 'lab' | 'lore'>('scanner');
  const [activeCharacterId, setActiveCharacterId] = useState<string>('leo');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [unlockedCount, setUnlockedCount] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const totalCount = 118;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        coins={coins}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        inBattle={false}
      />

      <main className="flex-1 p-4 max-w-7xl w-full mx-auto">
        {activeTab === 'scanner' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Escáner AR</h2>
            <p className="text-slate-400">Sistema activo y preparado.</p>
          </div>
        )}
        {activeTab === 'mendelomnio' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Mendelomnio</h2>
            <p className="text-slate-400">Registro Universal de Materia.</p>
          </div>
        )}
        {activeTab === 'lab' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Mesa de Síntesis</h2>
            <p className="text-slate-400">Laboratorio de combinaciones.</p>
          </div>
        )}
        {activeTab === 'lore' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-400 mb-2">Academia & Lore</h2>
            <p className="text-slate-400">Historia y personajes.</p>
          </div>
        )}
      </main>
    </div>
  );
}
