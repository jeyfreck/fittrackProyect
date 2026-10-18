import React, { useState } from 'react';
import { User as UserIcon, Target, Shield, Heart, Activity, Check, Plus, RefreshCw, Flame } from 'lucide-react';

export default function ProfileView({ onOpenAuth, currentUser, onLogout }) {
  const [user, setUser] = useState(
    currentUser || {
      name: 'Keyron Fernández',
      email: 'keyron@fittrack.com',
      age: 24,
      weight: 72.4,
      height: 178, // cm
      gender: 'M',
      role: 'USER',
    }
  );

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Hipertrofia Limpia',
      description: 'Alcanzar 75kg manteniendo un porcentaje graso < 12%',
      type: 'MUSCLE_GAIN',
      targetValue: 75.0,
      deadline: '31 Dic 2026',
      progress: 65
    },
    {
      id: 2,
      title: 'Club de los 100kg en Banca',
      description: 'Superar 1 repetición máxima en Press de Banca con 110kg',
      type: 'STRENGTH',
      targetValue: 110.0,
      deadline: '15 Nov 2026',
      progress: 90
    }
  ]);

  // BMI calculation (weight / height in meters squared)
  const heightInMeters = user.height / 100;
  const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 pt-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="badge-neon badge-lime text-[11px] mb-1">
            Perfil de Atleta & Metas
          </span>
          <h2 className="text-2xl font-bold text-white">Mi Cuenta</h2>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={onLogout}
              className="btn-secondary text-xs py-1.5 px-3 text-red-400 border-red-500/30"
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary text-xs py-1.5 px-3 shadow-md"
            >
              Iniciar Sesión (JWT)
            </button>
          )}
        </div>
      </div>

      {/* User Bio Card */}
      <div className="glass-panel p-5 mb-4 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--volt-lime)] to-[var(--electric-cyan)] flex items-center justify-center text-black font-extrabold text-2xl shadow-[0_0_20px_var(--volt-lime-glow)]">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-xs text-[var(--text-muted)] font-mono">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                Rol: {user.role}
              </span>
              <span className="text-[10px] font-mono text-[var(--volt-lime)]">
                ● Atleta Premium
              </span>
            </div>
          </div>
        </div>

        {/* Biometric Stats */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[var(--border-subtle)] text-center font-mono">
          <div className="p-2 rounded-xl bg-white/[0.02]">
            <div className="text-[10px] text-[var(--text-dim)] uppercase">Edad</div>
            <div className="text-sm font-bold text-white mt-0.5">{user.age} años</div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.02]">
            <div className="text-[10px] text-[var(--text-dim)] uppercase">Peso</div>
            <div className="text-sm font-bold text-[var(--volt-lime)] mt-0.5">{user.weight} kg</div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.02]">
            <div className="text-[10px] text-[var(--text-dim)] uppercase">Altura</div>
            <div className="text-sm font-bold text-white mt-0.5">{user.height} cm</div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.02]">
            <div className="text-[10px] text-[var(--text-dim)] uppercase">IMC</div>
            <div className="text-sm font-bold text-[var(--electric-cyan)] mt-0.5">{bmi}</div>
          </div>
        </div>
      </div>

      {/* Active Goals (Metas) */}
      <div className="glass-panel p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] font-bold flex items-center gap-2">
            <Target size={14} className="text-[var(--volt-lime)]" />
            Objetivos Activos (Spring Boot Goals)
          </h3>
          <span className="text-xs text-[var(--volt-lime)] font-mono">{goals.length} metas</span>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{goal.description}</p>
                </div>
                <span className="badge-neon badge-lime text-[10px]">
                  {goal.type}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-dim)] mb-1">
                  <span>Plazo: <strong className="text-white">{goal.deadline}</strong></span>
                  <span>Progreso: <strong className="text-[var(--volt-lime)]">{goal.progress}%</strong></span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--volt-lime)] to-[var(--electric-cyan)] rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
