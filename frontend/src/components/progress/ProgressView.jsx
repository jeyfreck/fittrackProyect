import React, { useState } from 'react';
import { Trophy, TrendingUp, Sparkles, Share2, Award, Calendar, Zap, ArrowUpRight, Scale } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProgressView() {
  const [prs, setPrs] = useState([
    { exercise: 'Press de Banca Plano', weight: 105, reps: 3, date: '12 Oct', change: '+5 kg' },
    { exercise: 'Sentadilla Trasera (Squat)', weight: 140, reps: 5, date: '08 Oct', change: '+10 kg' },
    { exercise: 'Peso Muerto Convencional', weight: 180, reps: 2, date: '28 Sep', change: '+7.5 kg' },
    { exercise: 'Press Militar con Mancuernas', weight: 32, reps: 8, date: '14 Oct', change: '+2 kg' },
  ]);

  const [weightHistory] = useState([
    { date: '10 Sep', weight: 74.2 },
    { date: '17 Sep', weight: 73.8 },
    { date: '24 Sep', weight: 73.5 },
    { date: '01 Oct', weight: 73.1 },
    { date: '08 Oct', weight: 72.8 },
    { date: '15 Oct', weight: 72.4 },
  ]);

  const [showShareModal, setShowShareModal] = useState(false);

  const handleShareClick = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ccff00', '#00f0ff', '#ff2a5f']
    });
    setShowShareModal(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 pt-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="badge-neon badge-lime text-[11px] mb-1">
            Récords & Analíticas Biomecánicas
          </span>
          <h2 className="text-2xl font-bold text-white">Progreso & PRs</h2>
        </div>

        <button
          onClick={handleShareClick}
          className="btn-primary text-xs py-2 px-3 shadow-lg flex items-center gap-1.5"
        >
          <Sparkles size={16} />
          Tarjeta Mensual
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-panel p-3.5 text-center">
          <div className="text-[11px] font-mono text-[var(--text-dim)] uppercase">Carga Total</div>
          <div className="text-lg font-extrabold font-mono text-[var(--volt-lime)] mt-1">42.5 T</div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">Este mes</div>
        </div>

        <div className="glass-panel p-3.5 text-center">
          <div className="text-[11px] font-mono text-[var(--text-dim)] uppercase">Sesiones</div>
          <div className="text-lg font-extrabold font-mono text-[var(--electric-cyan)] mt-1">18 / 20</div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">Consistencia 90%</div>
        </div>

        <div className="glass-panel p-3.5 text-center">
          <div className="text-[11px] font-mono text-[var(--text-dim)] uppercase">Peso Actual</div>
          <div className="text-lg font-extrabold font-mono text-white mt-1">72.4 kg</div>
          <div className="text-[10px] text-[var(--volt-lime)] font-mono">-1.8 kg (Definición)</div>
        </div>
      </div>

      {/* Personal Records (PRs) */}
      <div className="glass-panel p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] font-bold flex items-center gap-2">
            <Trophy size={14} className="text-[var(--volt-lime)]" />
            Récords Personales Vigentes (PRs)
          </h3>
        </div>

        <div className="space-y-2.5">
          {prs.map((pr, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--volt-lime)]/40 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--volt-lime-subtle)] border border-[var(--volt-lime)]/30 flex items-center justify-center text-[var(--volt-lime)] font-mono font-bold text-xs">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{pr.exercise}</h4>
                  <div className="text-xs text-[var(--text-muted)] font-mono">
                    {pr.date} • {pr.reps} repeticiones
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold font-mono text-white">
                  {pr.weight} kg
                </div>
                <div className="text-[11px] font-mono font-bold text-[var(--volt-lime)] flex items-center justify-end gap-0.5">
                  <ArrowUpRight size={12} /> {pr.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Trend Chart Visualizer */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] font-bold flex items-center gap-2">
            <Scale size={14} className="text-[var(--electric-cyan)]" />
            Evolución de Peso Corporal
          </h3>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Últimas 6 semanas</span>
        </div>

        <div className="h-32 flex items-end justify-between gap-2 pt-6 px-2">
          {weightHistory.map((item, idx) => {
            const minW = 72;
            const maxW = 75;
            const heightPercent = Math.max(15, Math.min(100, ((item.weight - minW) / (maxW - minW)) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.weight}
                </span>
                <div
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[var(--electric-cyan)]/20 to-[var(--electric-cyan)] transition-all duration-700 group-hover:to-[var(--volt-lime)]"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-[var(--text-dim)] truncate">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shareable Achievement Card Modal (Spotify Wrapped Style) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-[24px] overflow-hidden p-6 bg-gradient-to-b from-[#141b2b] via-[#0c101a] to-[#07090e] border border-[var(--volt-lime)]/40 shadow-[0_0_50px_rgba(204,255,0,0.25)] animate-scaleUp">
            {/* Card Watermark */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--volt-lime)] shadow-[0_0_8px_var(--volt-lime)]" />
                <span className="font-extrabold font-display tracking-wider text-sm text-white">
                  FITTRACK <span className="text-[var(--volt-lime)]">3D</span>
                </span>
              </div>
              <span className="badge-neon badge-lime text-[10px]">Octubre 2026</span>
            </div>

            {/* Big Headline */}
            <div className="mb-6">
              <span className="text-xs uppercase font-mono text-[var(--text-dim)]">Resumen Atlético</span>
              <h3 className="text-2xl font-black text-white mt-1 leading-tight">
                MODO BESTIA: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--volt-lime)] to-[var(--electric-cyan)]">
                  Top 5% Atletas
                </span>
              </h3>
            </div>

            {/* Metric Highlights */}
            <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/10 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Kilos Levantados:</span>
                <strong className="text-[var(--volt-lime)]">42,500 kg</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Series Efectivas:</span>
                <strong className="text-white">164 series</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Músculo Dominante:</span>
                <strong className="text-[var(--electric-cyan)]">Pectoral & Cuádriceps</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Récord Estrella:</span>
                <strong className="text-[var(--volt-lime)]">Banca 105kg (+5kg)</strong>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-dim)] text-center font-mono mb-4">
              "La disciplina vence a la motivación cada día."
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="btn-secondary flex-1 text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert('¡Tarjeta de atleta copiada al portapapeles!');
                  setShowShareModal(false);
                }}
                className="btn-primary flex-1 text-xs shadow-lg"
              >
                <Share2 size={16} /> Compartir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
