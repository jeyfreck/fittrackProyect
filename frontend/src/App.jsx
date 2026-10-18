import React, { useState } from 'react';
import {
  Flame,
  Dumbbell,
  Apple,
  Trophy,
  User,
  Zap,
  Activity,
  Play,
  RotateCw,
  Sparkles,
  ShieldAlert,
  Mic,
  Calculator,
  Timer,
  Scale,
  Share2,
  Watch,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Clock,
  Compass,
  ArrowUpRight,
  Cpu,
  Camera,
  Barcode
} from 'lucide-react';
import Avatar3D from './components/3d/Avatar3D';
import MuscleDetailsDrawer from './components/dashboard/MuscleDetailsDrawer';
import QuickToolModal from './components/dashboard/QuickToolModal';
import FoodScannerModal from './components/nutrition/FoodScannerModal';
import LiveGymMode from './components/workout/LiveGymMode';
import NutritionView from './components/nutrition/NutritionView';
import ProgressView from './components/progress/ProgressView';
import ProfileView from './components/profile/ProfileView';
import AuthModal from './components/auth/AuthModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('3d');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [activeExerciseForGym, setActiveExerciseForGym] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFoodScannerModal, setShowFoodScannerModal] = useState(false);
  const [activeToolModal, setActiveToolModal] = useState(null);
  const [currentUser, setCurrentUser] = useState(api.getCurrentUser());

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // When user clicks "Entrenar este músculo" from the 3D drawer
  const handleStartWorkoutFromMuscle = (muscle) => {
    if (muscle && muscle.recommendedExercises && muscle.recommendedExercises.length > 0) {
      const rec = muscle.recommendedExercises[0];
      setActiveExerciseForGym({
        name: rec.name,
        targetSets: 4,
        targetReps: 8,
        initialWeight: 80,
        rpe: rec.rpe || 8.5
      });
    }
    setActiveTab('live');
  };

  const userName = currentUser ? currentUser.name || 'Alex' : 'Alex';

  return (
    <div className="w-full min-h-screen bg-[var(--bg-dark)] text-white flex flex-col font-sans pb-28 md:pb-10 relative">
      {/* Top Cyber-Athletic App Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#050818]/85 backdrop-blur-2xl border-b border-white/[0.08] px-4 md:px-8 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--cyber-cyan)] to-[var(--cyber-purple)] flex items-center justify-center text-[#050818] font-black text-sm shadow-[0_0_20px_var(--cyber-cyan-glow)]">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base md:text-lg tracking-tight text-white leading-none flex items-center gap-1.5">
              FITTRACK <span className="text-[var(--cyber-cyan)] font-mono text-sm">3D</span>
            </h1>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">
              Cybernetic Performance OS
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          <button
            onClick={() => setActiveTab('3d')}
            className={`desktop-nav-btn ${activeTab === '3d' ? 'active' : ''}`}
          >
            <Zap size={16} /> 3D Avatar
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`desktop-nav-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
          >
            <Apple size={16} /> Nutrición
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`desktop-nav-btn ${activeTab === 'live' ? 'active' : ''}`}
          >
            <Dumbbell size={16} /> Live Gym
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`desktop-nav-btn ${activeTab === 'progress' ? 'active' : ''}`}
          >
            <Trophy size={16} /> Progreso
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`desktop-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={16} /> Perfil
          </button>
        </nav>

        {/* Status Pill & User button */}
        <div className="flex items-center gap-2.5">
          <div className="glass-panel py-1 px-3 flex items-center gap-2 text-xs font-mono border-[var(--cyber-cyan)]/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <span className="w-2 h-2 rounded-full bg-[var(--cyber-cyan)] animate-ping" />
            <span className="text-slate-400 text-[11px] hidden sm:inline">Recuperación:</span>
            <strong className="text-[var(--cyber-cyan)]">82%</strong>
          </div>

          <button
            onClick={() => currentUser ? setActiveTab('profile') : setShowAuthModal(true)}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-2 rounded-xl"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--cyber-cyan)] to-[var(--cyber-purple)] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#070b1e] rounded-full flex items-center justify-center">
                <User size={12} className={currentUser ? 'text-[var(--cyber-cyan)]' : 'text-slate-400'} />
              </div>
            </div>
            <span className="hidden sm:inline font-medium">{currentUser ? currentUser.name || 'Alex' : 'Ingresar'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === '3d' && (
          <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-3 md:px-8 pt-4 gap-6">

            {/* 1. GREETING & AUDIO WAVEFORM HEADER (Matching Image 2) */}
            <div className="glass-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                    Hola, {userName}
                  </h2>
                  {/* Animated Waveform Equalizer */}
                  <div className="audio-waveform" title="FitTrack AI Voice Stream Activo">
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
                  ¿Qué objetivo conquistaremos hoy en el laboratorio biométrico?
                </p>
              </div>

              {/* Biological / Environmental Status Pill */}
              <div className="flex items-center gap-3 text-xs font-mono bg-white/5 py-2 px-3.5 rounded-xl border border-white/10 self-start md:self-auto">
                <div className="flex items-center gap-1.5 text-[var(--cyber-cyan)]">
                  <Activity size={14} />
                  <span>24°C Clima Óptimo</span>
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-1.5 text-[var(--volt-lime)]">
                  <Zap size={14} />
                  <span>Fase Hipertrofia (Titán)</span>
                </div>
              </div>
            </div>

            {/* 2. MAIN 2-COLUMN CYBER DASHBOARD GRID */}
            <div className="dashboard-grid gap-6 items-start">

              {/* LEFT COLUMN: 3D HOLOGRAPHIC CHAMBER & AI ASSISTANT DIALOGUE */}
              <div className="flex flex-col gap-4">
                {/* 3D Holographic Chamber */}
                <div className="hud-chamber relative w-full h-[540px] md:h-[620px]">
                  <Avatar3D
                    onSelectMuscle={(muscle) => setSelectedMuscle(muscle)}
                    selectedMuscleId={selectedMuscle ? selectedMuscle.id : null}
                  />
                </div>

                {/* AI Conversational Assistant Bubble (Matching Image 2) */}
                <div className="glass-panel p-4 flex items-start gap-3.5 border-[var(--cyber-cyan)]/25 cyber-card-glow-cyan">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--cyber-cyan)] to-[var(--cyber-purple)] p-0.5 flex-shrink-0 shadow-[0_0_15px_var(--cyber-cyan-glow)]">
                    <div className="w-full h-full bg-[#070b1e] rounded-xl flex items-center justify-center text-[var(--cyber-cyan)]">
                      <Cpu size={20} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-[var(--cyber-cyan)] uppercase tracking-wider">
                        FitTrack AI Assistant
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Hoy 12:45</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                      "¡Buenos días, {userName}! Tu musculatura del tren superior está al <strong>100% recuperada</strong> tras 48h de descanso. Hoy sugiero hipertrofia de <strong>Dorsales y Bíceps</strong> para maximizar tu curva de supercompensación."
                    </p>
                    {/* Quick Action Chips */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => {
                          setActiveExerciseForGym({
                            name: 'Dominadas Lastradas & Dorsales',
                            targetSets: 4,
                            targetReps: 8,
                            initialWeight: 20,
                            rpe: 8.5
                          });
                          setActiveTab('live');
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--cyber-cyan-subtle)] text-[var(--cyber-cyan)] border border-[var(--cyber-cyan)]/40 hover:bg-[var(--cyber-cyan)]/20 transition-all flex items-center gap-1.5"
                      >
                        <Zap size={12} /> Entrenar Dorsales
                      </button>

                      <button
                        onClick={() => setShowFoodScannerModal(true)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--volt-lime-subtle)] text-[var(--volt-lime)] border border-[var(--volt-lime)]/40 hover:bg-[var(--volt-lime)]/20 transition-all flex items-center gap-1.5"
                      >
                        <Camera size={12} /> Escanear Comida AI
                      </button>

                      <button
                        onClick={() => setActiveToolModal('scan')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5"
                      >
                        <Activity size={12} /> Ver Simetrías
                      </button>

                      <button
                        onClick={() => setActiveToolModal('1rm')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5"
                      >
                        <Calculator size={12} /> Calcular 1RM
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: AI INSIGHTS GAUGE, SCHEDULE & CONNECTED SENSORS */}
              <div className="flex flex-col gap-4">

                {/* WIDGET 1: AI INSIGHTS & NEON CIRCULAR RADIAL GAUGE (Exact replica of Image 2) */}
                <div className="glass-panel p-5 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[var(--cyber-cyan)]" />
                      <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                        AI Insights // Recuperación
                      </h3>
                    </div>
                    <span className="badge-neon badge-cyan text-[10px]">Tiempo Real</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {/* Left Stats */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="text-xs text-slate-400 font-mono">Rendimiento Biomecánico</div>
                        <div className="text-xl font-bold font-mono text-[var(--volt-lime)] flex items-center gap-1">
                          <ArrowUpRight size={18} /> +18%
                          <span className="text-xs text-slate-400 font-normal">vs ayer</span>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-slate-300 space-y-1 pt-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fatiga SNC:</span>
                          <span className="text-[var(--volt-lime)] font-bold">18% (Baja)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Volumen Semanal:</span>
                          <span className="text-white font-bold">14,200 kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Circular Radial Gauge (Matching Image 2's glowing ring) */}
                    <div className="radial-gauge-container">
                      <svg className="radial-gauge-svg" viewBox="0 0 100 100">
                        {/* Background Ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="8"
                        />
                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f0ff" />
                            <stop offset="50%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                        {/* Foreground Arc (82% of 251.2 circumference) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="url(#scoreGaugeGrad)"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 * (1 - 0.82)}
                          strokeLinecap="round"
                          style={{ filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.5))' }}
                        />
                      </svg>
                      {/* Center Gauge Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-black font-mono text-white leading-none">82</span>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--cyber-cyan)] mt-0.5">
                          Score
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WIDGET 2: TODAY'S SCHEDULE & HYPERTROPHY PROTOCOL (Exact replica of Image 2) */}
                <div className="glass-panel p-5 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[var(--cyber-purple)]" />
                      <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                        Protocolo de Hoy // Schedule
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Push & Pull</span>
                  </div>

                  {/* Schedule Timeline Items */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--volt-lime)]/30 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-400">09:30</span>
                        <div>
                          <div className="text-xs font-semibold text-white">Movilidad & Activación</div>
                          <div className="text-[10px] text-slate-400">10 min • Calentamiento articular</div>
                        </div>
                      </div>
                      <span className="badge-neon badge-lime text-[10px]">Hecho ✓</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--cyber-cyan-subtle)] border border-[var(--cyber-cyan)]/30">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[var(--cyber-cyan)]">10:00</span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            Dominadas Lastradas <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-cyan)] animate-ping" />
                          </div>
                          <div className="text-[10px] text-slate-300">4 series x 6 reps @ +20kg</div>
                        </div>
                      </div>
                      <span className="badge-neon badge-cyan text-[10px]">En Curso</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 opacity-80">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">10:45</span>
                        <div>
                          <div className="text-xs font-medium text-white">Remo con Barra T</div>
                          <div className="text-[10px] text-slate-400">4 series x 10 reps @ 75kg</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Pendiente</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 opacity-70">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">11:15</span>
                        <div>
                          <div className="text-xs font-medium text-white">Curl Bíceps Inclinado</div>
                          <div className="text-[10px] text-slate-400">3 series x 12 reps @ 16kg</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Pendiente</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('live')}
                    className="w-full mt-3 py-2 text-xs font-mono text-[var(--cyber-cyan)] hover:text-white flex items-center justify-center gap-1 transition-all"
                  >
                    Abrir Modo Gimnasio en Vivo <ChevronRight size={14} />
                  </button>
                </div>

                {/* WIDGET 3: CONNECTED BIO-SENSORS (Exact replica of Image 2) */}
                <div className="glass-panel p-5 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-[var(--volt-lime)]" />
                      <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                        Sensores Conectados // IoT
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--volt-lime)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--volt-lime)]" /> 4 Activos
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Smartphone size={14} className="text-[var(--cyber-cyan)]" />
                        <span>Dispositivo Principal</span>
                      </div>
                      <span className="text-[var(--volt-lime)] font-bold">Activo</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Watch size={14} className="text-[var(--cyber-purple)]" />
                        <span>Smart Watch Ultra</span>
                      </div>
                      <span className="text-white font-bold">85% • 68 BPM</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Activity size={14} className="text-[var(--volt-lime)]" />
                        <span>Cinta Torácica HRV</span>
                      </div>
                      <span className="text-white font-bold">100% • 78ms</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Scale size={14} className="text-[var(--amber-warning)]" />
                        <span>Báscula Bio-Impedancia</span>
                      </div>
                      <span className="text-white font-bold">72.4 kg • 11.8%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. 6-TILE "AI TOOLS" GRID (Exact replica of Image 2) */}
            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu size={18} className="text-[var(--cyber-cyan)]" />
                  <h3 className="font-display font-bold text-base text-white tracking-wide uppercase">
                    AI Tools // Herramientas Biométricas
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Algoritmos Activos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. 1RM Calculator */}
                <div
                  onClick={() => setActiveToolModal('1rm')}
                  className="tool-tile group"
                >
                  <div className="tool-tile-icon bg-gradient-to-br from-indigo-500/20 to-purple-500/30 text-[var(--cyber-purple)] border border-[var(--cyber-purple)]/40 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Calculator size={20} />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">Calculadora 1RM</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Predicción Carga</span>
                </div>

                {/* 2. Hipertrofia Timer */}
                <div
                  onClick={() => setActiveToolModal('timer')}
                  className="tool-tile group"
                >
                  <div className="tool-tile-icon bg-gradient-to-br from-cyan-500/20 to-blue-500/30 text-[var(--cyber-cyan)] border border-[var(--cyber-cyan)]/40 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <Timer size={20} />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">Rest Timer</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Densidad de Serie</span>
                </div>

                {/* 3. Quick Workout Mode */}
                <div
                  onClick={() => setActiveTab('live')}
                  className="tool-tile group"
                >
                  <div className="tool-tile-icon bg-gradient-to-br from-emerald-500/20 to-lime-500/30 text-[var(--volt-lime)] border border-[var(--volt-lime)]/40 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Dumbbell size={20} />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">Live Gym Log</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Registro 1-Tap</span>
                </div>

                {/* 4. Bio-Scan Asymmetries */}
                <div
                  onClick={() => setActiveToolModal('scan')}
                  className="tool-tile group"
                >
                  <div className="tool-tile-icon bg-gradient-to-br from-pink-500/20 to-rose-500/30 text-[var(--cyber-magenta)] border border-[var(--cyber-magenta)]/40 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                    <Activity size={20} />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">Bio-Scan AI</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Simetría Muscular</span>
                </div>

                {/* 5. Nutri-Scan AI (Photo & Barcode) */}
                <div
                  onClick={() => setShowFoodScannerModal(true)}
                  className="tool-tile group"
                >
                  <div className="tool-tile-icon bg-gradient-to-br from-amber-500/20 to-orange-500/30 text-[var(--amber-warning)] border border-[var(--amber-warning)]/40 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Camera size={20} />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">Nutri-Scan AI</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Foto / Código Barras</span>
                </div>

                {/* 6. Export Hologram Passport */}
                <div
                  onClick={() => setActiveToolModal('export')}
                  className="tool-tile group"
                >
                  <div className="tool-tile-icon bg-gradient-to-br from-sky-500/20 to-indigo-500/30 text-[#38bdf8] border border-[#38bdf8]/40 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    <Share2 size={20} />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">Holograma 3D</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Exportar Ficha</span>
                </div>
              </div>
            </div>

            {/* 4. VOICE ASSISTANT VISUALIZER BAR (Matching Image 2) */}
            <div
              onClick={() => setActiveToolModal('voice')}
              className="voice-assistant-bar mb-6 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="audio-waveform hidden sm:inline-flex">
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                </div>
                <div className="voice-orb">
                  <Mic size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                    FitTrack Voice AI <span className="badge-neon badge-cyan text-[9px]">En Escucha</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Toca para dictar tus series o consultar recomendaciones de volumen
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>

          </div>
        )}

        {/* Live Gym Mode */}
        {activeTab === 'live' && (
          <LiveGymMode
            initialExercise={activeExerciseForGym}
            onBackToDashboard={() => setActiveTab('3d')}
          />
        )}

        {/* Nutrition View */}
        {activeTab === 'nutrition' && <NutritionView />}

        {/* Progress Analytics View */}
        {activeTab === 'progress' && <ProgressView />}

        {/* Profile & Settings View */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Interactive Muscle Inspection Drawer */}
      {selectedMuscle && (
        <MuscleDetailsDrawer
          muscle={selectedMuscle}
          onClose={() => setSelectedMuscle(null)}
          onStartWorkout={handleStartWorkoutFromMuscle}
        />
      )}

      {/* Quick Tool Modals (1RM, Rest Timer, Voice AI, Asymmetries, Hologram) */}
      {activeToolModal && (
        <QuickToolModal
          toolType={activeToolModal}
          onClose={() => setActiveToolModal(null)}
          onStartWorkout={() => setActiveTab('live')}
        />
      )}

      {/* Nutri-Scan AI Food & Barcode Scanner Modal */}
      <FoodScannerModal
        isOpen={showFoodScannerModal}
        onClose={() => setShowFoodScannerModal(false)}
        onMealAdded={() => setActiveTab('nutrition')}
      />

      {/* Bottom Floating Navigation Dock (Matching Image 2) */}
      <nav className="bottom-nav-bar" aria-label="Navegación principal">
        <button
          onClick={() => setActiveTab('3d')}
          className={`nav-item-btn ${activeTab === '3d' ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <Zap size={18} />
          </div>
          <span>3D Avatar</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`nav-item-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <Apple size={18} />
          </div>
          <span>Nutrición</span>
        </button>

        {/* Centered Glowing AI / Gym Action Orb (Matching Image 2) */}
        <button
          onClick={() => setActiveTab('live')}
          className="fab-gym"
          title="Entrenar en Vivo / Gym Mode"
          aria-label="Entrenar en Vivo / Gym Mode"
        >
          <Dumbbell size={24} />
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`nav-item-btn ${activeTab === 'progress' ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <Trophy size={18} />
          </div>
          <span>Progreso</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`nav-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
        >
          <div className="nav-icon-container">
            <User size={18} />
          </div>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
