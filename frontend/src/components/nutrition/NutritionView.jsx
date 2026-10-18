import React, { useState, useEffect } from 'react';
import {
  Flame,
  PieChart,
  Plus,
  Utensils,
  Droplets,
  CheckCircle,
  Apple,
  AlertCircle,
  Camera,
  Barcode,
  Sparkles
} from 'lucide-react';
import { nutritionService } from '../../services/nutritionService';
import FoodScannerModal from './FoodScannerModal';

export default function NutritionView() {
  const [nutritionState, setNutritionState] = useState(nutritionService.getState());
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const [newMealName, setNewMealName] = useState('');
  const [newMealCals, setNewMealCals] = useState('');
  const [newMealProt, setNewMealProt] = useState('');

  // Subscribe to nutritionService updates
  useEffect(() => {
    const unsubscribe = nutritionService.subscribe((newState) => {
      setNutritionState(newState);
    });
    return unsubscribe;
  }, []);

  const { targetCalories, consumedCalories, meals, macros } = nutritionState;

  const handleManualAddMeal = (e) => {
    e.preventDefault();
    if (!newMealName || !newMealCals) return;

    const cals = parseInt(newMealCals, 10);
    const prot = parseInt(newMealProt || '0', 10);

    nutritionService.addMeal({
      name: newMealName,
      items: 'Registro manual de comida',
      calories: cals,
      protein: prot,
      carbs: Math.round((cals * 0.4) / 4),
      fats: Math.round((cals * 0.25) / 9)
    });

    setNewMealName('');
    setNewMealCals('');
    setNewMealProt('');
    setShowAddMealModal(false);
  };

  const calPercentage = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-28 pt-4 select-none">
      {/* Header with AI Scanner Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="badge-neon badge-cyan text-[11px] mb-1">
            Motor Metabólico Adaptativo
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nutrición & Macros</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Prominent AI Photo & Barcode Scanner Button */}
          <button
            onClick={() => setShowScannerModal(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-[0_0_20px_var(--cyber-cyan-glow)] flex items-center gap-2"
          >
            <Camera size={16} />
            <span>Escanear Comida / Código</span>
          </button>

          <button
            onClick={() => setShowAddMealModal(true)}
            className="btn-secondary text-xs py-2 px-3"
            title="Añadir manualmente"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Manual</span>
          </button>
        </div>
      </div>

      {/* Main Calories & TDEE Ring Card */}
      <div className="glass-panel p-5 mb-5 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Circular Calorie Gauge */}
          <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[var(--volt-lime)] transition-all duration-1000 ease-out"
                strokeDasharray={`${calPercentage}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{ filter: 'drop-shadow(0 0 6px var(--volt-lime-glow))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-2xl font-black font-mono text-white leading-none">
                {Math.max(0, targetCalories - consumedCalories)}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                Kcal Restantes
              </span>
            </div>
          </div>

          {/* Stats details */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Consumidas hoy:</span>
              <strong className="text-white text-sm">{consumedCalories} kcal</strong>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Gasto TDEE objetivo:</span>
              <strong className="text-[var(--volt-lime)] text-sm">{targetCalories} kcal</strong>
            </div>

            {/* Hydration bar */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white font-medium">
                <Droplets size={16} className="text-[var(--cyber-cyan)]" />
                <span>Hidratación ({waterGlasses * 250} ml)</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  -
                </button>
                <span className="font-mono text-xs px-2 text-[var(--cyber-cyan)] font-bold">
                  {waterGlasses} / 10
                </span>
                <button
                  onClick={() => setWaterGlasses(waterGlasses + 1)}
                  className="w-7 h-7 rounded-lg bg-[var(--cyber-cyan)] text-[#050818] font-bold text-xs flex items-center justify-center hover:opacity-90 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Macro Progress Bars */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
          {Object.entries(macros).map(([key, m]) => {
            const pct = Math.min(100, Math.round((m.consumed / m.target) * 100));
            const labels = {
              protein: 'Proteínas',
              carbs: 'Carbohidratos',
              fats: 'Grasas'
            };

            return (
              <div key={key} className="glass-panel p-3 bg-white/[0.02]">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{labels[key]}</span>
                  <span style={{ color: m.color }} className="font-bold">{pct}%</span>
                </div>
                <div className="text-sm font-bold font-mono text-white flex items-baseline gap-1">
                  {m.consumed}
                  <span className="text-[10px] text-slate-400 font-normal">/ {m.target} {m.unit}</span>
                </div>
                {/* Progress track */}
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meals History */}
      <div className="glass-panel p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <Utensils size={14} className="text-[var(--volt-lime)]" />
            Comidas Registradas Hoy ({meals.length})
          </h3>
          <button
            onClick={() => setShowScannerModal(true)}
            className="text-xs font-mono text-[var(--cyber-cyan)] hover:underline flex items-center gap-1"
          >
            <Camera size={13} /> Escanear otro plato
          </button>
        </div>

        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <h4 className="text-sm font-bold text-white">{meal.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{meal.items}</p>
                </div>
                <span className="font-mono text-xs font-bold text-[var(--volt-lime)] bg-[var(--volt-lime-subtle)] px-2.5 py-1 rounded-lg border border-[var(--volt-lime)]/30">
                  {meal.calories} kcal
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                <span>Hora: <strong className="text-white">{meal.time}</strong></span>
                <span>P: <strong className="text-white">{meal.protein}g</strong></span>
                <span>C: <strong className="text-white">{meal.carbs}g</strong></span>
                <span>G: <strong className="text-white">{meal.fats}g</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 w-full max-w-md bg-[#0c122c] border border-white/15 rounded-2xl shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Utensils size={18} className="text-[var(--volt-lime)]" />
              Registrar Comida Manual
            </h3>

            <form onSubmit={handleManualAddMeal} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Nombre del Plato</label>
                <input
                  type="text"
                  placeholder="Ej. Salmón con quinoa y aguacate"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="w-full bg-[#070b1e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--volt-lime)] font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Calorías (kcal)</label>
                  <input
                    type="number"
                    placeholder="650"
                    value={newMealCals}
                    onChange={(e) => setNewMealCals(e.target.value)}
                    className="w-full bg-[#070b1e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--volt-lime)] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Proteínas (g)</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={newMealProt}
                    onChange={(e) => setNewMealProt(e.target.value)}
                    className="w-full bg-[#070b1e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--volt-lime)] font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMealModal(false)}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 text-xs font-bold"
                >
                  Guardar Plato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Camera & Barcode Scanner Modal */}
      <FoodScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
      />
    </div>
  );
}
