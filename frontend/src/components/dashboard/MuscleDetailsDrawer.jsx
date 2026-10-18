import React from 'react';
import { X, Zap, Clock, Dumbbell, Activity, Play, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getFatigueColor } from '../../data/muscleData';

export default function MuscleDetailsDrawer({ muscle, onClose, onStartWorkout }) {
  if (!muscle) return null;

  const colorInfo = getFatigueColor(muscle.fatigue);
  const volumePercentage = Math.min(100, Math.round((muscle.weeklySets / muscle.targetSets) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Drawer Container */}
      <div className="relative w-full md:max-w-md bg-[var(--bg-surface)] border-t md:border border-[var(--border-subtle)] rounded-t-[28px] md:rounded-[24px] shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col animate-slideUp">
        {/* Mobile Pull Handle indicator */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 md:hidden" />

        {/* Header */}
        <div className="p-5 pb-4 border-b border-[var(--border-subtle)] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="badge-neon text-[10px]"
                style={{
                  backgroundColor: `${colorInfo.css}22`,
                  color: colorInfo.css,
                  borderColor: `${colorInfo.css}66`
                }}
              >
                {colorInfo.label} • {muscle.fatigue}% Fatiga
              </span>
              <span className="text-xs text-[var(--text-dim)] font-mono">{muscle.category}</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap size={20} style={{ color: colorInfo.css }} />
              {muscle.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Status Message */}
          <div
            className="p-3.5 rounded-xl border text-xs leading-relaxed font-medium"
            style={{
              backgroundColor: `${colorInfo.css}10`,
              borderColor: `${colorInfo.css}33`,
              color: 'var(--text-main)'
            }}
          >
            <strong className="block mb-0.5" style={{ color: colorInfo.css }}>Diagnóstico Muscular:</strong>
            {muscle.statusText}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel p-3.5">
              <div className="flex items-center gap-2 text-xs text-[var(--text-dim)] mb-1 font-mono">
                <Clock size={14} className="text-[var(--electric-cyan)]" />
                Recuperación
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {muscle.recoveryHours === 0 ? (
                  <span className="text-[var(--volt-lime)] flex items-center gap-1 text-sm">
                    <CheckCircle2 size={16} /> 100% Listo
                  </span>
                ) : (
                  <span>~{muscle.recoveryHours} horas</span>
                )}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Último estímulo: {muscle.lastTrained}
              </div>
            </div>

            <div className="glass-panel p-3.5">
              <div className="flex items-center gap-2 text-xs text-[var(--text-dim)] mb-1 font-mono">
                <Activity size={14} className="text-[var(--volt-lime)]" />
                Volumen Semanal
              </div>
              <div className="text-lg font-bold font-mono text-white flex items-baseline gap-1">
                {muscle.weeklySets} <span className="text-xs text-[var(--text-dim)] font-normal">/ {muscle.targetSets} series</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${volumePercentage}%`,
                    backgroundColor: volumePercentage >= 100 ? 'var(--volt-lime)' : 'var(--electric-cyan)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recommended Exercises for this Muscle */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[var(--text-dim)] flex items-center gap-1.5 font-mono">
                <Dumbbell size={14} className="text-[var(--volt-lime)]" />
                Ejercicios Clave Recomendados
              </h4>
            </div>

            <div className="space-y-2">
              {muscle.recommendedExercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-[var(--volt-lime)] transition-colors">
                      {exercise.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                      Meta sugerida: <span className="text-white">{exercise.sets}</span>
                      {exercise.rpe && <span className="text-[var(--text-dim)] ml-2">• RPE {exercise.rpe}</span>}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-dim)] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-deep)] flex items-center gap-3">
          <button
            onClick={() => {
              if (onStartWorkout) onStartWorkout(muscle);
              onClose();
            }}
            className="btn-primary w-full shadow-lg"
          >
            <Play size={18} fill="currentColor" />
            Entrenar {muscle.name.split(' ')[0]} Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
