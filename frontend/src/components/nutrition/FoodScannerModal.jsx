import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Barcode,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Flame,
  Scale,
  RefreshCw,
  Plus,
  AlertCircle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  nutritionService,
  CERTIFIED_BARCODES,
  POPULAR_FOOD_TEMPLATES
} from '../../services/nutritionService';

export default function FoodScannerModal({ isOpen, onClose, onMealAdded }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'barcode'

  // Image Upload / Camera State
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);
  const [portionGrams, setPortionGrams] = useState(400);

  // Barcode State
  const [barcodeInput, setBarcodeInput] = useState('5060469988220'); // Optimum Nutrition default
  const [isSearchingBarcode, setIsSearchingBarcode] = useState(false);
  const [barcodeProduct, setBarcodeProduct] = useState(null);
  const [barcodeServingGrams, setBarcodeServingGrams] = useState(30);

  // Success Feedback
  const [addedSuccess, setAddedSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Reset states when opened
  useEffect(() => {
    if (isOpen && !scannedFood && !barcodeProduct) {
      // Pre-load chicken & rice template as initial demonstration
      loadFoodTemplate(POPULAR_FOOD_TEMPLATES[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Image Handling ---
  const handleImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setSelectedImage(dataUrl);
      runImageAnalysis(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const loadFoodTemplate = (template) => {
    setSelectedImage(template.imageUrl);
    setIsScanning(true);
    setAddedSuccess(false);

    setTimeout(() => {
      setScannedFood(template);
      setPortionGrams(template.baseGrams);
      setIsScanning(false);
    }, 700);
  };

  const runImageAnalysis = async (imgSrc, hint = '') => {
    setIsScanning(true);
    setAddedSuccess(false);
    setScannedFood(null);

    try {
      const result = await nutritionService.analyzeFoodImage(imgSrc, hint);
      setScannedFood(result);
      setPortionGrams(result.baseGrams);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  // --- Barcode Handling ---
  const handleBarcodeSearch = async (codeToSearch) => {
    const code = codeToSearch || barcodeInput;
    if (!code) return;

    setIsSearchingBarcode(true);
    setAddedSuccess(false);
    try {
      const product = await nutritionService.lookupBarcode(code);
      setBarcodeProduct(product);
      // If serving size mentions grams, parse it
      const match = product.servingSize.match(/(\d+)\s*g/i);
      setBarcodeServingGrams(match ? parseInt(match[1], 10) : 100);
    } catch (err) {
      alert('No se pudo encontrar información para este código de barras.');
    } finally {
      setIsSearchingBarcode(false);
    }
  };

  // Calculate scaled macros for photo plate
  const scaleFactorPlate = scannedFood ? portionGrams / scannedFood.baseGrams : 1;
  const currentPlateCals = scannedFood ? Math.round(scannedFood.calories * scaleFactorPlate) : 0;
  const currentPlateProt = scannedFood ? Math.round(scannedFood.protein * scaleFactorPlate) : 0;
  const currentPlateCarbs = scannedFood ? Math.round(scannedFood.carbs * scaleFactorPlate) : 0;
  const currentPlateFats = scannedFood ? Math.round(scannedFood.fats * scaleFactorPlate) : 0;

  // Calculate scaled macros for barcode product
  const scaleFactorBarcode = barcodeProduct ? barcodeServingGrams / 100 : 1;
  const currentBarcodeCals = barcodeProduct ? Math.round(barcodeProduct.calories100g * scaleFactorBarcode) : 0;
  const currentBarcodeProt = barcodeProduct ? Math.round(barcodeProduct.protein100g * scaleFactorBarcode) : 0;
  const currentBarcodeCarbs = barcodeProduct ? Math.round(barcodeProduct.carbs100g * scaleFactorBarcode) : 0;
  const currentBarcodeFats = barcodeProduct ? Math.round(barcodeProduct.fat100g * scaleFactorBarcode) : 0;

  // Save to Nutrition Log
  const handleSaveMeal = () => {
    let mealToAdd = null;

    if (activeTab === 'camera' && scannedFood) {
      mealToAdd = {
        name: scannedFood.name,
        items: `${portionGrams}g analizado: ${scannedFood.itemsText}`,
        calories: currentPlateCals,
        protein: currentPlateProt,
        carbs: currentPlateCarbs,
        fats: currentPlateFats,
        grams: portionGrams
      };
    } else if (activeTab === 'barcode' && barcodeProduct) {
      mealToAdd = {
        name: `${barcodeProduct.name} (${barcodeProduct.brand})`,
        items: `${barcodeServingGrams}g (EAN: ${barcodeProduct.barcode})`,
        calories: currentBarcodeCals,
        protein: currentBarcodeProt,
        carbs: currentBarcodeCarbs,
        fats: currentBarcodeFats,
        grams: barcodeServingGrams
      };
    }

    if (mealToAdd) {
      nutritionService.addMeal(mealToAdd);
      setAddedSuccess(true);
      if (onMealAdded) onMealAdded(mealToAdd);

      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl glass-panel p-5 sm:p-6 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10 animate-scaleUp my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--cyber-cyan)] to-[var(--cyber-purple)] p-0.5 flex items-center justify-center shadow-[0_0_15px_var(--cyber-cyan-glow)]">
              <div className="w-full h-full bg-[#050818] rounded-xl flex items-center justify-center text-[var(--cyber-cyan)]">
                <Camera size={18} />
              </div>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                Nutri-Scan AI <span className="text-[10px] font-mono text-[var(--cyber-cyan)] font-bold px-2 py-0.5 rounded-full bg-[var(--cyber-cyan-subtle)] border border-[var(--cyber-cyan)]/30">v2.4</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Reconocimiento Visual & Código de Barras
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

        {/* Mode Selector Tabs (Photo AI vs Barcode Scanner) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#060a1c] rounded-xl border border-white/10 mb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              activeTab === 'camera'
                ? 'bg-[var(--cyber-cyan)] text-[#050818] shadow-[0_0_15px_var(--cyber-cyan-glow)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera size={15} /> 1. Foto / Subir Imagen
          </button>

          <button
            onClick={() => {
              setActiveTab('barcode');
              if (!barcodeProduct) handleBarcodeSearch('5060469988220');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              activeTab === 'barcode'
                ? 'bg-[var(--cyber-purple)] text-white shadow-[0_0_15px_var(--cyber-purple-glow)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Barcode size={15} /> 2. Código de Barras
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">

          {/* =========================================================================
              TAB 1: CAMERA & PHOTO UPLOAD VISUAL RECOGNITION
              ========================================================================= */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {/* Image Preview & Scanner Frame */}
              <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#070b20] border border-white/10 flex items-center justify-center group shadow-inner">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Plato a analizar"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                    <Camera size={36} className="text-[var(--cyber-cyan)] mb-2 animate-bounce" />
                    <span className="text-xs font-mono font-medium">Sube una foto o toma una captura de tu comida</span>
                  </div>
                )}

                {/* Laser Scanline Animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--cyber-cyan)]/25 to-transparent flex flex-col items-center justify-center animate-pulse pointer-events-none">
                    <div className="w-full h-1 bg-[var(--cyber-cyan)] shadow-[0_0_15px_var(--cyber-cyan)] animate-bounce" />
                    <div className="absolute px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-[var(--cyber-cyan)] border border-[var(--cyber-cyan)]/40 flex items-center gap-1.5">
                      <Cpu size={12} className="animate-spin" /> Analizando macronutrientes...
                    </div>
                  </div>
                )}

                {/* Floating Corner HUD Brackets */}
                <div className="hud-bracket hud-bracket-tl" />
                <div className="hud-bracket-tr" />
                <div className="hud-bracket-bl" />
                <div className="hud-bracket-br" />
              </div>

              {/* Upload Controls Buttons */}
              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files[0])}
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files[0])}
                />

                <button
                  onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--cyber-cyan-subtle)] border border-[var(--cyber-cyan)]/40 text-[var(--cyber-cyan)] text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-[var(--cyber-cyan)]/20 transition-all"
                >
                  <Camera size={16} /> Tomar Foto con Cámara
                </button>

                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                >
                  <Upload size={16} /> Subir de Galería
                </button>
              </div>

              {/* Quick Preset Demonstrations (1-Click Test Plates) */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-2">
                  O prueba platos típicos de hipertrofia pre-configurados:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {POPULAR_FOOD_TEMPLATES.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFoodTemplate(item)}
                      className="p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--cyber-cyan)]/40 transition-all text-left flex flex-col justify-between"
                    >
                      <span className="text-[11px] font-bold text-white line-clamp-1">{item.name}</span>
                      <span className="text-[10px] font-mono text-[var(--cyber-cyan)] mt-1">{item.calories} kcal • {item.protein}g P</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Detection Breakdown */}
              {scannedFood && (
                <div className="p-4 rounded-2xl bg-[#070d24] border border-[var(--cyber-cyan)]/30 space-y-3.5 shadow-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge-neon badge-cyan text-[9px]">
                          {scannedFood.confidence}% Precisión Visual
                        </span>
                        <span className="badge-neon badge-lime text-[9px]">
                          {scannedFood.anabolicScore}/100 Anabolic Index
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                        {scannedFood.name}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                        {scannedFood.itemsText}
                      </p>
                    </div>
                  </div>

                  {/* Grams / Portion Slider */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Scale size={14} className="text-[var(--cyber-cyan)]" /> Peso de la Ración:
                      </span>
                      <strong className="text-[var(--cyber-cyan)] text-sm">{portionGrams} g</strong>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="750"
                      step="10"
                      value={portionGrams}
                      onChange={(e) => setPortionGrams(parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--cyber-cyan)] cursor-pointer"
                    />
                  </div>

                  {/* Live Recalculated Macros Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase">Calorías</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentPlateCals}</div>
                      <div className="text-[9px] text-slate-400">kcal</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--volt-lime-subtle)] border border-[var(--volt-lime)]/30">
                      <div className="text-[10px] text-[var(--volt-lime)] uppercase font-bold">Proteína</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentPlateProt}</div>
                      <div className="text-[9px] text-[var(--volt-lime)]">gramos</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--cyber-cyan-subtle)] border border-[var(--cyber-cyan)]/30">
                      <div className="text-[10px] text-[var(--cyber-cyan)] uppercase font-bold">Carbos</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentPlateCarbs}</div>
                      <div className="text-[9px] text-[var(--cyber-cyan)]">gramos</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--crimson-subtle)] border border-[var(--crimson-pulse)]/30">
                      <div className="text-[10px] text-[var(--crimson-pulse)] uppercase font-bold">Grasas</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentPlateFats}</div>
                      <div className="text-[9px] text-[var(--crimson-pulse)]">gramos</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: BARCODE SCANNER & OPENFOODFACTS
              ========================================================================= */}
          {activeTab === 'barcode' && (
            <div className="space-y-4">
              {/* Barcode Input & Action Bar */}
              <div className="p-4 rounded-2xl bg-[#070d24] border border-[var(--cyber-purple)]/30 space-y-3">
                <label className="text-xs font-mono text-slate-300 block">
                  Ingresa o escanea el Código EAN-13 del envase:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Barcode size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Ej: 5060469988220"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-sm focus:border-[var(--cyber-purple)] focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleBarcodeSearch(barcodeInput)}
                    disabled={isSearchingBarcode}
                    className="btn-primary py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    {isSearchingBarcode ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Search size={14} />
                    )}
                    Consultar
                  </button>
                </div>

                {/* Pre-Loaded Fitness Barcodes Chips */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                    Códigos certificados rápidos para probar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(CERTIFIED_BARCODES).slice(0, 4).map(([code, p]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setBarcodeInput(code);
                          handleBarcodeSearch(code);
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[var(--cyber-purple)]/40 transition-all"
                      >
                        {p.name.split(' ')[0]} ({p.brand.split(' ')[0]})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barcode Search Result */}
              {barcodeProduct && (
                <div className="p-4 rounded-2xl bg-[#070d24] border border-[var(--cyber-purple)]/30 space-y-3.5 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="badge-neon badge-lime text-[9px] mb-1">
                        {barcodeProduct.source}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        {barcodeProduct.name}
                      </h4>
                      <p className="text-xs text-[var(--cyber-purple)] font-mono">
                        Marca: {barcodeProduct.brand} • Ración de fábrica: {barcodeProduct.servingSize}
                      </p>
                    </div>
                  </div>

                  {/* Serving Grams Slider */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Scale size={14} className="text-[var(--cyber-purple)]" /> Cantidad a consumir:
                      </span>
                      <strong className="text-[var(--cyber-purple)] text-sm">{barcodeServingGrams} g/ml</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={barcodeServingGrams}
                      onChange={(e) => setBarcodeServingGrams(parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--cyber-purple)] cursor-pointer"
                    />
                  </div>

                  {/* Live Recalculated Macros for Barcode */}
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase">Calorías</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentBarcodeCals}</div>
                      <div className="text-[9px] text-slate-400">kcal</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--volt-lime-subtle)] border border-[var(--volt-lime)]/30">
                      <div className="text-[10px] text-[var(--volt-lime)] uppercase font-bold">Proteína</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentBarcodeProt}</div>
                      <div className="text-[9px] text-[var(--volt-lime)]">gramos</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--cyber-cyan-subtle)] border border-[var(--cyber-cyan)]/30">
                      <div className="text-[10px] text-[var(--cyber-cyan)] uppercase font-bold">Carbos</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentBarcodeCarbs}</div>
                      <div className="text-[9px] text-[var(--cyber-cyan)]">gramos</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--crimson-subtle)] border border-[var(--crimson-pulse)]/30">
                      <div className="text-[10px] text-[var(--crimson-pulse)] uppercase font-bold">Grasas</div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5">{currentBarcodeFats}</div>
                      <div className="text-[9px] text-[var(--crimson-pulse)]">gramos</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3.5 border-t border-white/10 mt-3 flex-shrink-0 flex items-center gap-3">
          {addedSuccess ? (
            <div className="w-full py-3 rounded-xl bg-[var(--volt-lime-subtle)] border border-[var(--volt-lime)] text-[var(--volt-lime)] font-mono text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
              <CheckCircle2 size={18} /> ¡Alimento Registrado en tu Diario de Nutrición!
            </div>
          ) : (
            <>
              <button
                onClick={onClose}
                className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-mono"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMeal}
                disabled={activeTab === 'camera' ? !scannedFood : !barcodeProduct}
                className="flex-1 btn-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_var(--volt-lime-glow)]"
              >
                <Zap size={16} /> Registrar en mi Diario de Macros
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
