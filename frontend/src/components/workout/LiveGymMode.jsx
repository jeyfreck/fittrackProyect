import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Check, Volume2, VolumeX, Sparkles, Dumbbell, Award, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LiveGymMode({ initialExercise, onBackToDashboard }) {
  // Current active exercise
  const [exercise, setExercise] = useState(
    initialExercise || {
      name: 'Press de Banca Plano con Barra',
      targetSets: 4,
      targetReps: 8,
      initialWeight: 80,
      rpe: 8.5
    }
  );

  // Sets state
  const [sets, setSets] = useState([
    { id: 1, reps: 8, weight: 80, rpe: 8, completed: true },
    { id: 2, reps: 8, weight: 80, rpe: 8.5, completed: true },
    { id: 3, reps: 8, weight: 82.5, rpe: 9, completed: false },
    { id: 4, reps: 8, weight: 82.5, rpe: 9.5, completed: false },
  ]);

  const [activeSetIndex, setActiveSetIndex] = useState(2);
  const [currentWeight, setCurrentWeight] = useState(82.5);
  const [currentReps, setCurrentReps] = useState(8);

  // Rest Timer State
  const [restDuration, setRestDuration] = useState(90); // 90 seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Context synthesizer for crisp latency-free gym cues
  const audioCtxRef = useRef(null);

  const playBeep = (freq = 880, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio playback prevented or unsupported', e);
    }
  };

  // Timer Tick Hook
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 4 || prev === 3 || prev === 2) {
            playBeep(600, 0.1); // Countdown warning beeps
          }
          if (prev <= 1) {
            playBeep(1200, 0.4); // Completion celebration bell
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startRestTimer = (seconds = 90) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const handleCompleteCurrentSet = () => {
    playBeep(980, 0.2);

    const updated = [...sets];
    updated[activeSetIndex] = {
      ...updated[activeSetIndex],
      weight: currentWeight,
      reps: currentReps,
      completed: true
    };
    setSets(updated);

    // If this was the last set, launch confetti
    if (activeSetIndex === sets.length - 1) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ccff00', '#00f0ff', '#ffffff']
      });
    } else {
      setActiveSetIndex(activeSetIndex + 1);
      // Auto-start rest timer
      startRestTimer(restDuration);
    }
  };

  // Plate Calculator (Calculadora de Discos)
  // Assumes Olympic bar = 20kg
  const calculatePlates = (totalKg) => {
    const barWeight = 20;
    let weightPerSide = (totalKg - barWeight) / 2;
    if (weightPerSide <= 0) return [];

    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const plates = [];

    for (const plate of availablePlates) {
      while (weightPerSide >= plate) {
        plates.push(plate);
        weightPerSide = Math.round((weightPerSide - plate) * 100) / 100;
      }
    }
    return plates;
  };

  const sidePlates = calculatePlates(currentWeight);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 pt-3 select-none">
      {/* Top Bar with Back Button & Sound Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToDashboard}
          className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3"
        >
          <ArrowLeft size={16} />
          Volver al 3D
        </button>

        <div className="flex items-center gap-2">
          <span className="badge-neon badge-lime text-[11px] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[var(--volt-lime)]" />
            Live Gym Arena
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-muted)] hover:text-white"
            aria-label="Alternar sonido"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Active Exercise Header Card */}
      <div className="glass-panel p-5 mb-4 border-l-4 border-l-[var(--volt-lime)] relative overflow-hidden">
        <div className="absolute right-3 top-3 text-[var(--volt-lime)] opacity-10 pointer-events-none">
          <Dumbbell size={80} />
        </div>
        <div className="text-xs text-[var(--text-dim)] font-mono uppercase tracking-wider mb-1">
          Ejercicio en Curso
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          {exercise.name}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
          <span>Serie Actual: <strong className="text-white">{activeSetIndex + 1} de {sets.length}</strong></span>
          <span>•</span>
          <span>RPE Objetivo: <strong className="text-[var(--volt-lime)]">8.5 - 9</strong></span>
          <span>•</span>
          <span>1RM Estimado: <strong className="text-[var(--electric-cyan)]">{Math.round(currentWeight * (1 + currentReps / 30))} kg</strong></span>
        </div>
      </div>

      {/* REST TIMER HUD (Floating / Prominent for phone ergonomics) */}
      {timeLeft > 0 && (
        <div className="glass-panel p-4 mb-4 border-[var(--volt-lime)]/40 bg-[var(--volt-lime-subtle)] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--volt-lime)] transition-all duration-1000 ease-linear"
                  strokeDasharray={`${(timeLeft / restDuration) * 100}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-white">
                {timeLeft}s
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Descanso Activo
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Recuperando fosfocreatina (ATP-PC)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeLeft(timeLeft + 30)}
              className="btn-secondary text-xs py-1.5 px-2.5 font-mono"
            >
              +30s
            </button>
            <button
              onClick={() => {
                setTimeLeft(0);
                setIsTimerRunning(false);
              }}
              className="btn-secondary text-xs py-1.5 px-2.5 text-[var(--crimson-pulse)] font-mono"
            >
              Saltar
            </button>
          </div>
        </div>
      )}

      {/* QUICK SET INPUTS (Optimized for single-hand mobile use) */}
      <div className="glass-panel p-5 mb-4">
        <div className="text-xs uppercase font-mono text-[var(--text-dim)] font-bold mb-3 flex items-center justify-between">
          <span>Configurar Serie {activeSetIndex + 1}</span>
          <span className="text-[var(--volt-lime)] font-mono text-[11px]">Discos por lado: {sidePlates.join(' + ') || 'Solo barra'}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Weight Control */}
          <div className="bg-[var(--bg-deep)] p-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[11px] font-mono text-[var(--text-muted)] mb-1">Carga (kg)</span>
            <div className="text-3xl font-extrabold font-mono text-white mb-2">
              {currentWeight}
            </div>
            <div className="flex items-center gap-2 w-full justify-center">
              <button
                onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-all"
                aria-label="Menos peso"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => setCurrentWeight(currentWeight + 2.5)}
                className="w-11 h-11 rounded-xl bg-[var(--volt-lime)] text-black font-bold flex items-center justify-center active:scale-95 transition-all shadow-[0_0_12px_var(--volt-lime-glow)]"
                aria-label="Más peso"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Reps Control */}
          <div className="bg-[var(--bg-deep)] p-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[11px] font-mono text-[var(--text-muted)] mb-1">Repeticiones</span>
            <div className="text-3xl font-extrabold font-mono text-white mb-2">
              {currentReps}
            </div>
            <div className="flex items-center gap-2 w-full justify-center">
              <button
                onClick={() => setCurrentReps(Math.max(1, currentReps - 1))}
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-all"
                aria-label="Menos repeticiones"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => setCurrentReps(currentReps + 1)}
                className="w-11 h-11 rounded-xl bg-[var(--electric-cyan)] text-black font-bold flex items-center justify-center active:scale-95 transition-all shadow-[0_0_12px_var(--electric-cyan-glow)]"
                aria-label="Más repeticiones"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Micro-Load Weight Chips */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 mb-4">
          {[1.25, 2.5, 5, 10, 20].map((kg) => (
            <button
              key={kg}
              onClick={() => setCurrentWeight(currentWeight + kg)}
              className="flex-1 py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-[var(--text-muted)] hover:text-white transition-all text-center"
            >
              +{kg}
            </button>
          ))}
        </div>

        {/* Big Complete Set Button (Thumb ergonomic) */}
        <button
          onClick={handleCompleteCurrentSet}
          className="btn-primary w-full py-4 text-base font-bold shadow-xl flex items-center justify-center gap-2"
        >
          <Check size={20} className="stroke-[3]" />
          Completar Serie {activeSetIndex + 1} ({currentWeight}kg × {currentReps} reps)
        </button>
      </div>

      {/* SERIES TABLE / LOG */}
      <div className="glass-panel p-4">
        <h4 className="text-xs uppercase font-bold tracking-wider text-[var(--text-dim)] font-mono mb-3">
          Registro de Series
        </h4>

        <div className="space-y-2">
          {sets.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setActiveSetIndex(idx)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                idx === activeSetIndex
                  ? 'border-[var(--volt-lime)] bg-[var(--volt-lime-subtle)]'
                  : s.completed
                  ? 'border-white/5 bg-white/[0.02] opacity-80'
                  : 'border-white/5 bg-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                  s.completed
                    ? 'bg-[var(--volt-lime)] text-black'
                    : idx === activeSetIndex
                    ? 'border border-[var(--volt-lime)] text-[var(--volt-lime)]'
                    : 'bg-white/5 text-[var(--text-dim)]'
                }`}>
                  {s.completed ? '✓' : idx + 1}
                </span>

                <div>
                  <div className="text-sm font-semibold text-white font-mono">
                    {s.weight} kg × {s.reps} reps
                  </div>
                  <div className="text-[11px] text-[var(--text-dim)] font-mono">
                    RPE {s.rpe} • Volumen: {s.weight * s.reps} kg
                  </div>
                </div>
              </div>

              <div>
                {s.completed ? (
                  <span className="badge-neon badge-lime text-[10px]">Listo</span>
                ) : idx === activeSetIndex ? (
                  <span className="badge-neon badge-cyan text-[10px]">En Curso</span>
                ) : (
                  <span className="text-xs text-[var(--text-dim)] font-mono">Pendiente</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
