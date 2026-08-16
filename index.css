import React, { useState, useEffect, useRef } from 'react';
import { Camera, Zap, CheckCircle2, Crosshair, Atom, FileText, Layers, Swords, RotateCcw } from 'lucide-react';
import { Elementbeast } from '../types/elementbeasts';
import { SCANNABLE_OBJECTS } from '../data/database';
import { analyzeImageOrObject, AnalysisResult } from '../services/materialAnalyzer';
import { sounds } from '../utils/audio';

interface ScannerARProps {
  onStartBattle?: (enemyBeast: Elementbeast, scannedObject: string) => void;
  unlockedBeastIds?: string[];
}

export const ScannerAR: React.FC<ScannerARProps> = ({ onStartBattle }) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanSeconds, setScanSeconds] = useState<number>(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Initialize camera automatically on mount
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      }
    } catch (err: unknown) {
      console.warn('Camera access:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  // 3-Second Focus Scan (Google Lens / Mendelomnio Mode)
  const trigger3SecondScan = () => {
    if (isScanning) return;
    if (!cameraActive) {
      startCamera();
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanSeconds(0);
    setAnalysis(null);

    sounds.playScanBeep(520, 0.1);

    const startTime = Date.now();
    const totalDuration = 3000; // 3 seconds focus

    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      const secs = (elapsed / 1000).toFixed(1);
      
      setScanProgress(progress);
      setScanSeconds(parseFloat(secs));

      if (elapsed % 600 < 50) {
        sounds.playScanBeep(600 + (elapsed / totalDuration) * 300, 0.08);
      }

      if (elapsed >= totalDuration) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setIsScanning(false);
        setScanProgress(100);
        setScanSeconds(3.0);
        sounds.playLockSuccess();

        // Select a sample or random spectral reading
        const randomSample = SCANNABLE_OBJECTS[Math.floor(Math.random() * SCANNABLE_OBJECTS.length)];
        analyzeImageOrObject(undefined, randomSample.name).then(res => {
          setAnalysis(res);
        });
      }
    }, 50);
  };

  const handleCombatClick = () => {
    if (!analysis || !onStartBattle) return;
    sounds.playCombatTransition();
    onStartBattle(analysis.elementbeast, analysis.objectName);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      
      {/* Camera Viewfinder */}
      <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 flex items-center justify-center">
        
        {/* Real Camera Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback Viewport if Camera is loading or permission pending */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-slate-950">
            <Camera className="w-12 h-12 text-cyan-400/60 mb-2 animate-pulse" />
            <p className="text-sm font-mono text-slate-300">Enfoque Óptico de Cámara</p>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Apunta la cámara a cualquier objeto y presiona el botón inferior para analizar su composición molecular.
            </p>
          </div>
        )}

        {/* AR HUD Overlay: Reticle & Focus Progress */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
          
          {/* Top HUD */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SENSOR_AR_ACTIVO</span>
            </div>
            <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-mono text-slate-300">
              MODO: LENS_MOLECULAR
            </div>
          </div>

          {/* Central 3-Second Focus Reticle */}
          <div className="relative flex items-center justify-center my-auto">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              
              {/* Circular Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  className="stroke-slate-800/80 fill-none"
                  strokeWidth="4"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  className={`fill-none transition-all duration-75 ${
                    scanProgress >= 100 ? 'stroke-emerald-400' : 'stroke-cyan-400'
                  }`}
                  strokeWidth="5"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * scanProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              {/* Corner Reticle Brackets */}
              <div className={`w-36 h-36 sm:w-40 sm:h-40 border-2 transition-all duration-300 rounded-xl relative ${
                isScanning ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-400/30' : 'border-cyan-500/40'
              }`}>
                <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
                <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />

                {isScanning && (
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-pulse top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Central Information */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                {isScanning ? (
                  <div className="space-y-0.5">
                    <span className="text-2xl font-black font-mono text-cyan-300 drop-shadow">
                      {scanSeconds.toFixed(1)}s / 3.0s
                    </span>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-cyan-200 animate-pulse">
                      Identificando...
                    </p>
                  </div>
                ) : scanProgress >= 100 && analysis ? (
                  <div className="space-y-0.5 animate-scale-in">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto" />
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                      ¡Identificado!
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Crosshair className="w-8 h-8 text-cyan-400/80 animate-spin" style={{ animationDuration: '10s' }} />
                    <span className="text-[10px] font-mono text-cyan-400/90 mt-1 uppercase tracking-wider">
                      Enfocar 3s
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom HUD bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="bg-slate-950/80 px-2.5 py-0.5 rounded border border-slate-800">
              ESPECTRÓMETRO ÓPTICO
            </span>
            <span className="bg-slate-950/80 px-2.5 py-0.5 rounded border border-slate-800 text-cyan-400">
              MENDELOMNIO_LENS
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: Turns Red to Combat when Analyzed */}
      <div className="flex items-center gap-3">
        {analysis ? (
          <>
            <button
              id="trigger-combat-btn"
              onClick={handleCombatClick}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-orange-500 text-white shadow-xl shadow-red-600/40 hover:shadow-red-600/60 active:scale-[0.99] transition-all cursor-pointer animate-pulse"
            >
              <Swords className="w-6 h-6 text-amber-300" />
              <span>Combatir</span>
            </button>
            <button
              onClick={trigger3SecondScan}
              title="Escanear otro objeto"
              className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-cyan-400" />
            </button>
          </>
        ) : (
          <button
            id="trigger-3s-scan-btn"
            onClick={trigger3SecondScan}
            disabled={isScanning}
            className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider transition-all cursor-pointer ${
              isScanning
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/50 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 active:scale-[0.99]'
            }`}
          >
            <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>{isScanning ? `Enfocando (${scanSeconds.toFixed(1)}s)...` : 'Enfocar y Analizar'}</span>
          </button>
        )}
      </div>

      {/* Materia Identificada y Descripción */}
      {analysis && (
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm sm:text-base font-mono font-bold text-emerald-400 uppercase tracking-wide">
                Materia Identificada
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              {analysis.purity}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 uppercase">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Objeto Enfocado
              </span>
              <p className="text-lg font-black text-white">{analysis.objectName}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 uppercase">
                <Atom className="w-3.5 h-3.5 text-amber-400" />
                Material Mayoritario
              </span>
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-black text-cyan-300">{analysis.majorityMaterial}</p>
                <span className="text-sm font-mono font-bold text-amber-300">{analysis.chemicalFormula}</span>
              </div>
            </div>

          </div>

          {/* Description Section */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 uppercase">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Descripción del Material
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              {analysis.explanation}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

