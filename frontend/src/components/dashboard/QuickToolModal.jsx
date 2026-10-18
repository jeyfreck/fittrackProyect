import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Calculator,
  Timer,
  Activity,
  Mic,
  Share2,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Scale
} from 'lucide-react';

export default function QuickToolModal({ toolType, onClose, onStartWorkout }) {
  // State for 1RM Calculator
  const [calcWeight, setCalcWeight] = useState(80);
  const [calcReps, setCalcReps] = useState(8);

  // State for Rest Timer
  const [timerDuration, setTimerDuration] = useState(90);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // State for Voice AI
  const [isListening, setIsListening] = useState(true);
  const [voiceQuery, setVoiceQuery] = useState('¿Qué ejercicio me recomiendas para bíceps hoy?');
  const [voiceAnswer, setVoiceAnswer] = useState(
    'Basado en tu fatiga de tríceps del 15% y recuperación del 100% en bíceps, te recomiendo Curl Martillo en banco inclinado (3x10-12) para atacar el braquial anterior y la cabeza larga.'
  );

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  if (!toolType) return null;

  // Epley 1RM formula: weight * (1 + reps/30)
  const estimated1RM = Math.round(calcWeight * (1 + calcReps / 30));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md glass-panel p-6 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--cyber-cyan-subtle)] border border-[var(--cyber-cyan)]/40 flex items-center justify-center text-[var(--cyber-cyan)] shadow-[0_0_15px_var(--cyber-cyan-glow)]">
              {toolType === '1rm' && <Calculator size={18} />}
              {toolType === 'timer' && <Timer size={18} />}
              {toolType === 'voice' && <Mic size={18} />}
              {toolType === 'scan' && <Activity size={18} />}
              {toolType === 'export' && <Share2 size={18} />}
              {toolType === 'macros' && <Scale size={18} />}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white tracking-wide">
                {toolType === '1rm' && 'Calculadora 1RM Predictiva'}
                {toolType === 'timer' && 'Cronómetro de Hipertrofia'}
                {toolType === 'voice' && 'Asistente FitTrack Voice AI'}
                {toolType === 'scan' && 'Bio-Scan Asimetrías Musculares'}
                {toolType === 'export' && 'Exportar Holograma & Pasaporte'}
                {toolType === 'macros' && 'Bio-Ajuste de Macros AI'}
              </h3>
              <span className="text-[10px] font-mono text-[var(--cyber-cyan)] uppercase tracking-wider block">
                Algoritmo Biométrico Neuronal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1RM TOOL BODY */}
        {toolType === '1rm' && (
          <div className="space-y-4">
            <div className="bg-[#070d24] p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono">1RM Estimado</span>
                <div className="text-3xl font-extrabold font-mono text-[var(--cyber-cyan)] mt-0.5">
                  {estimated1RM} <span className="text-sm text-slate-400 font-normal">kg</span>
                </div>
              </div>
              <div className="text-right text-xs font-mono text-slate-400">
                <div>95% 1RM: <strong className="text-white">{Math.round(estimated1RM * 0.95)} kg</strong></div>
                <div>80% 1RM: <strong className="text-white">{Math.round(estimated1RM * 0.8)} kg</strong></div>
                <div>70% 1RM: <strong className="text-white">{Math.round(estimated1RM * 0.7)} kg</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Peso Levantado</span>
                  <span className="text-[var(--cyber-cyan)] font-bold">{calcWeight} kg</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="2.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
                  className="w-full accent-[var(--cyber-cyan)] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Repeticiones Realizadas</span>
                  <span className="text-[var(--cyber-purple)] font-bold">{calcReps} reps</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={calcReps}
                  onChange={(e) => setCalcReps(parseInt(e.target.value, 10))}
                  className="w-full accent-[var(--cyber-purple)] cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (onStartWorkout) onStartWorkout();
                onClose();
              }}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold mt-2"
            >
              <Zap size={16} /> Entrenar con esta carga
            </button>
          </div>
        )}

        {/* TIMER TOOL BODY */}
        {toolType === 'timer' && (
          <div className="space-y-5 text-center">
            <div className="py-6 bg-[#070d24] rounded-2xl border border-[var(--cyber-cyan)]/25 shadow-[0_0_25px_rgba(0,240,255,0.1)]">
              <div className="text-5xl font-mono font-extrabold text-white tracking-widest">
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
              </div>
              <div className="text-xs text-[var(--cyber-cyan)] font-mono uppercase tracking-wider mt-2">
                Descanso Metabólico para Hipertrofia
              </div>
            </div>

            {/* Presets */}
            <div className="flex justify-center gap-2">
              {[60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setTimerDuration(sec);
                    setTimeLeft(sec);
                    setIsTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                    timerDuration === sec
                      ? 'bg-[var(--cyber-cyan-subtle)] border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Play size={16} /> {isTimerRunning ? 'Pausar' : 'Iniciar Cuenta Regresiva'}
              </button>
              <button
                onClick={() => {
                  setTimeLeft(timerDuration);
                  setIsTimerRunning(false);
                }}
                className="btn-secondary px-4 rounded-xl flex items-center justify-center text-slate-300"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        )}

        {/* VOICE AI BODY */}
        {toolType === 'voice' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-4 bg-[#070d24] rounded-2xl border border-[var(--cyber-cyan)]/30">
              <div className="voice-orb mb-3">
                <Mic size={22} className="text-white animate-pulse" />
              </div>
              <div className="audio-waveform mb-2">
                <div className="audio-bar" />
                <div className="audio-bar" />
                <div className="audio-bar" />
                <div className="audio-bar" />
                <div className="audio-bar" />
                <div className="audio-bar" />
                <div className="audio-bar" />
              </div>
              <span className="text-xs font-mono text-[var(--cyber-cyan)] tracking-wider">
                FitTrack Voice Core // Activo
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
              <div className="text-slate-400 font-mono mb-1 text-[11px]">Pregunta detectada:</div>
              <div className="text-white font-medium italic">"{voiceQuery}"</div>
            </div>

            <div className="bg-[var(--cyber-indigo)]/10 p-3.5 rounded-xl border border-[var(--cyber-indigo)]/30 text-xs leading-relaxed text-slate-200">
              <div className="flex items-center gap-1.5 text-[var(--cyber-cyan)] font-mono font-bold mb-1">
                <Sparkles size={14} /> Recomendación AI:
              </div>
              {voiceAnswer}
            </div>

            <button
              onClick={() => {
                setVoiceQuery('Registrar 4 series de dominadas con 20kg');
                setVoiceAnswer('¡Registrado con éxito! Volumen añadido: 4x6 @ 20kg. Fatiga de dorsales estimada: +32%.');
              }}
              className="w-full btn-secondary py-2.5 rounded-xl text-xs font-mono text-center"
            >
              Simular comando: "Registrar 4 series con 20kg"
            </button>
          </div>
        )}

        {/* BIO-SCAN ASYMMETRY BODY */}
        {toolType === 'scan' && (
          <div className="space-y-3">
            <div className="bg-[#070d24] p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono">Simetría Corporal Global</span>
                <div className="text-2xl font-bold font-mono text-[var(--volt-lime)]">96.4% Óptima</div>
              </div>
              <div className="badge-neon badge-lime text-[10px]">Alineación Pro</div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                <span className="text-slate-300">Dorsal Izq vs Der:</span>
                <span className="text-[var(--volt-lime)] font-bold">100% Simétrico</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                <span className="text-slate-300">Cuádriceps Izq vs Der:</span>
                <span className="text-[var(--volt-lime)] font-bold">98.2% Simétrico</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                <span className="text-slate-300">Bíceps Izq vs Der:</span>
                <span className="text-[var(--amber-warning)] font-bold">+1.2 cm brazo der.</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed p-2.5 rounded-lg bg-[var(--cyber-purple-subtle)] border border-[var(--cyber-purple)]/25">
              <strong className="text-[var(--cyber-purple)]">Prescripción AI:</strong> Agregar 1 serie unilateral extra de curl con mancuerna al brazo izquierdo para nivelar balance antes de la siguiente fase de fuerza.
            </div>
          </div>
        )}

        {/* EXPORT HOLOGRAM BODY */}
        {toolType === 'export' && (
          <div className="space-y-4 text-center">
            <div className="py-6 bg-[#070d24] rounded-2xl border border-[var(--cyber-purple)]/30 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--cyber-cyan)] to-[var(--cyber-purple)] p-0.5 mb-3 shadow-[0_0_20px_var(--cyber-purple-glow)]">
                <div className="w-full h-full bg-[#050814] rounded-2xl flex items-center justify-center text-[var(--cyber-cyan)]">
                  <Cpu size={28} />
                </div>
              </div>
              <h4 className="font-display font-bold text-white text-base">Ficha Biométrica 3D Generada</h4>
              <p className="text-xs text-slate-400 font-mono mt-1">
                UUID: BIO-661-M-2026-TITAN
              </p>
            </div>

            <div className="text-xs text-slate-300 text-left bg-white/5 p-3 rounded-xl border border-white/10 space-y-1 font-mono">
              <div>• 661 Grupos Musculares Analizados</div>
              <div>• Masa Muscular Esquelética: 38.2 kg</div>
              <div>• Índice de Fatiga Acumulada: 18% (Fase Hipertrófica)</div>
            </div>

            <button
              onClick={() => {
                alert('¡Holograma Biométrico descargado exitosamente en formato FitTrack GLTF/JSON!');
                onClose();
              }}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Share2 size={16} /> Descargar Reporte Biomecánico
            </button>
          </div>
        )}

        {/* MACROS SMART BODY */}
        {toolType === 'macros' && (
          <div className="space-y-3">
            <div className="bg-[#070d24] p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono">Gasto Energético Total</span>
                <div className="text-2xl font-bold font-mono text-[var(--cyber-cyan)]">2,550 kcal</div>
              </div>
              <div className="badge-neon badge-cyan text-[10px]">Superávit +300</div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white/5 flex justify-between items-center">
                <span className="text-slate-300">Proteína Óptima (2.2g/kg):</span>
                <strong className="text-[var(--volt-lime)]">175 g (700 kcal)</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 flex justify-between items-center">
                <span className="text-slate-300">Carbohidratos Complejos:</span>
                <strong className="text-[var(--cyber-cyan)]">280 g (1,120 kcal)</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 flex justify-between items-center">
                <span className="text-slate-300">Grasas Saludables:</span>
                <strong className="text-[var(--cyber-magenta)]">70 g (630 kcal)</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold mt-2"
            >
              Aplicar a mi Plan Nutricional
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
