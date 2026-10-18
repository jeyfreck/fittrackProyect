import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isLogin) {
        await api.login(email, password);
      } else {
        await api.register({
          name,
          email,
          password,
          age: parseInt(age || '25', 10),
          weight: parseFloat(weight || '70'),
          height: parseFloat(height || '175'),
          gender: 'M',
        });
      }

      if (onAuthSuccess) {
        onAuthSuccess(api.getCurrentUser());
      }
      onClose();
    } catch (err) {
      setErrorMessage(
        err.message.includes('Failed to fetch')
          ? 'El servidor Spring Boot no está respondiendo en localhost:8080. Modo demo activo.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-white/10 rounded-[24px] shadow-2xl p-6 overflow-hidden animate-scaleUp">
        {/* Background glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[var(--volt-lime-glow)] rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--volt-lime-subtle)] border border-[var(--volt-lime)]/30 flex items-center justify-center text-[var(--volt-lime)]">
              <Lock size={16} />
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              {isLogin ? 'Acceder a FitTrack 3D' : 'Crear Cuenta Atleta'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-all"
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          {!isLogin && (
            <div>
              <label className="text-xs font-mono text-[var(--text-muted)] block mb-1">Nombre Completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-[var(--text-dim)]" />
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--bg-deep)] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--volt-lime)]"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-[var(--text-muted)] block mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-[var(--text-dim)]" />
              <input
                type="email"
                placeholder="atleta@fittrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-deep)] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--volt-lime)] font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-[var(--text-muted)] block mb-1">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-[var(--text-dim)]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-deep)] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--volt-lime)]"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Edad</label>
                <input
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[var(--bg-deep)] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[var(--volt-lime)]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  placeholder="75"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[var(--bg-deep)] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[var(--volt-lime)]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Altura (cm)</label>
                <input
                  type="number"
                  placeholder="178"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-[var(--bg-deep)] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[var(--volt-lime)]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin text-sm">⟳</span>
            ) : (
              <>
                <span>{isLogin ? 'Ingresar al Sistema' : 'Registrar Cuenta'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-5 text-center text-xs text-[var(--text-muted)]">
          {isLogin ? '¿No tienes una cuenta aún?' : '¿Ya tienes una cuenta registrada?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
            }}
            className="text-[var(--volt-lime)] font-bold hover:underline ml-1"
          >
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
