// Data model representing anatomical muscle states, fatigue calculation and Écorché palette
export const initialMuscleData = {
  chest: {
    id: 'chest',
    name: 'Pectoral Mayor & Menor',
    category: 'Torso / Empuje',
    fatigue: 82,
    recoveryHours: 18,
    weeklySets: 14,
    targetSets: 16,
    lastTrained: 'Ayer (Jueves)',
    ecorcheColor: '#659a7c',
    ecorcheHex: 0x659a7c,
    recommendedExercises: [
      { name: 'Press de Banca Plano con Barra', sets: '4x8 @ 80kg', rpe: 8.5 },
      { name: 'Press Inclinado con Mancuernas', sets: '3x10 @ 28kg', rpe: 8 },
      { name: 'Cruces en Polea Media', sets: '3x15 @ 15kg', rpe: 9 },
    ],
    statusText: 'Fatiga Elevada - En fase de supercompensación'
  },
  shoulders: {
    id: 'shoulders',
    name: 'Deltoides (Anterior, Lateral, Posterior)',
    category: 'Hombros / Empuje',
    fatigue: 45,
    recoveryHours: 8,
    weeklySets: 12,
    targetSets: 14,
    lastTrained: 'Hace 2 días',
    ecorcheColor: '#baa779',
    ecorcheHex: 0xbaa779,
    recommendedExercises: [
      { name: 'Press Militar con Mancuernas', sets: '4x10 @ 22kg', rpe: 8 },
      { name: 'Elevaciones Laterales en Polea', sets: '4x15 @ 8kg', rpe: 9.5 }
    ],
    statusText: 'Recuperación Media - Óptimo para volumen accesorio'
  },
  lats: {
    id: 'lats',
    name: 'Dorsal Ancho & Espalda Alta',
    category: 'Espalda / Tracción',
    fatigue: 15,
    recoveryHours: 0,
    weeklySets: 10,
    targetSets: 16,
    lastTrained: 'Hace 4 días',
    ecorcheColor: '#659a7c',
    ecorcheHex: 0x659a7c,
    recommendedExercises: [
      { name: 'Jalón al Pecho Agarre Neutro', sets: '4x10 @ 65kg', rpe: 8 },
      { name: 'Remo con Barra 45°', sets: '4x8 @ 75kg', rpe: 8.5 },
      { name: 'Remo Gironda Unilateral', sets: '3x12 @ 35kg', rpe: 9 }
    ],
    statusText: '¡Totalmente Recuperado! Zona recomendada para hoy'
  },
  biceps: {
    id: 'biceps',
    name: 'Bíceps Braquial & Braquial',
    category: 'Brazos / Tracción',
    fatigue: 20,
    recoveryHours: 0,
    weeklySets: 8,
    targetSets: 12,
    lastTrained: 'Hace 4 días',
    ecorcheColor: '#659a7c',
    ecorcheHex: 0x659a7c,
    recommendedExercises: [
      { name: 'Curl con Barra Z de Pie', sets: '3x10 @ 32kg', rpe: 8.5 },
      { name: 'Curl Martillo en Banco Inclinado', sets: '3x12 @ 14kg', rpe: 9 }
    ],
    statusText: 'Recuperado al 100% - Listo para estímulo'
  },
  triceps: {
    id: 'triceps',
    name: 'Tríceps (Cabeza Larga, Medial y Lateral)',
    category: 'Brazos / Empuje',
    fatigue: 70,
    recoveryHours: 14,
    weeklySets: 11,
    targetSets: 14,
    lastTrained: 'Ayer',
    ecorcheColor: '#748394',
    ecorcheHex: 0x748394,
    recommendedExercises: [
      { name: 'Fondos en Paralelas Lastrados', sets: '3x8 @ +15kg', rpe: 8.5 },
      { name: 'Extensión de Tríceps en Polea Alta', sets: '3x12 @ 25kg', rpe: 9 }
    ],
    statusText: 'Fatiga Moderada-Alta - Esperar descanso'
  },
  abs: {
    id: 'abs',
    name: 'Recto Abdominal & Core Central',
    category: 'Tronco / Estabilidad',
    fatigue: 30,
    recoveryHours: 4,
    weeklySets: 6,
    targetSets: 10,
    lastTrained: 'Hace 3 días',
    ecorcheColor: '#c4b197',
    ecorcheHex: 0xc4b197,
    recommendedExercises: [
      { name: 'Elevaciones de Piernas Colgado', sets: '3x15', rpe: 8.5 },
      { name: 'Rueda Abdominal (Ab Wheel)', sets: '3x12', rpe: 9 }
    ],
    statusText: 'Excelente condición - Listo para estabilidad'
  },
  obliques: {
    id: 'obliques',
    name: 'Oblicuos Externos & Serratos',
    category: 'Tronco / Rotación',
    fatigue: 40,
    recoveryHours: 6,
    weeklySets: 8,
    targetSets: 12,
    lastTrained: 'Hace 2 días',
    ecorcheColor: '#be6c75',
    ecorcheHex: 0xbe6c75,
    recommendedExercises: [
      { name: 'Press Pallof en Polea', sets: '3x12 por lado', rpe: 8 },
      { name: 'Russian Twists con Disco', sets: '3x20', rpe: 8.5 }
    ],
    statusText: 'Recuperación adecuada'
  },
  traps: {
    id: 'traps',
    name: 'Trapecio Superior y Romboides',
    category: 'Espalda / Cuello',
    fatigue: 35,
    recoveryHours: 5,
    weeklySets: 9,
    targetSets: 12,
    lastTrained: 'Hace 3 días',
    ecorcheColor: '#c4b197',
    ecorcheHex: 0xc4b197,
    recommendedExercises: [
      { name: 'Encogimientos con Barra', sets: '4x12 @ 90kg', rpe: 8.5 },
      { name: 'Paseo del Granjero (Farmer Walk)', sets: '3x40m @ 32kg', rpe: 9 }
    ],
    statusText: 'Tono óptimo para tracción'
  },
  quads: {
    id: 'quads',
    name: 'Cuádriceps (Recto Femoris & Vasto Medial/Lateral)',
    category: 'Pierna / Dominante de Rodilla',
    fatigue: 88,
    recoveryHours: 28,
    weeklySets: 16,
    targetSets: 16,
    lastTrained: 'Hace 18 horas',
    ecorcheColor: '#659a7c',
    ecorcheHex: 0x659a7c,
    recommendedExercises: [
      { name: 'Sentadilla Trasera con Barra (Squat)', sets: '4x6 @ 110kg', rpe: 9 },
      { name: 'Prensa Inclinada 45°', sets: '3x12 @ 220kg', rpe: 8.5 },
      { name: 'Extensiones de Cuádriceps', sets: '3x15 @ 55kg', rpe: 9.5 }
    ],
    statusText: 'Máxima Fatiga (Leg Day) - En reparación muscular'
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Isquiosurales (Bíceps Femoral & Semitendinoso)',
    category: 'Pierna / Dominante de Cadera',
    fatigue: 25,
    recoveryHours: 0,
    weeklySets: 10,
    targetSets: 14,
    lastTrained: 'Hace 3 días',
    ecorcheColor: '#748394',
    ecorcheHex: 0x748394,
    recommendedExercises: [
      { name: 'Peso Muerto Rumano con Barra', sets: '4x8 @ 95kg', rpe: 8.5 },
      { name: 'Curl Femoral Tumbado en Máquina', sets: '3x12 @ 45kg', rpe: 9 }
    ],
    statusText: 'Recuperado - Listo para bisagra de cadera'
  },
  calves: {
    id: 'calves',
    name: 'Gemelos (Gastrocnemio & Sóleo)',
    category: 'Pierna / Pantorrilla',
    fatigue: 50,
    recoveryHours: 10,
    weeklySets: 8,
    targetSets: 14,
    lastTrained: 'Hace 2 días',
    ecorcheColor: '#baa779',
    ecorcheHex: 0xbaa779,
    recommendedExercises: [
      { name: 'Elevación de Talones de Pie', sets: '4x15 @ 70kg', rpe: 9.5 },
      { name: 'Elevación de Talones Sentado', sets: '3x12 @ 40kg', rpe: 9 }
    ],
    statusText: 'Tono adecuado - Puede recibir volumen accesorio'
  },
  glutes: {
    id: 'glutes',
    name: 'Glúteo Mayor & Medio',
    category: 'Cadera / Extensión',
    fatigue: 35,
    recoveryHours: 6,
    weeklySets: 12,
    targetSets: 14,
    lastTrained: 'Hace 3 días',
    ecorcheColor: '#a66085',
    ecorcheHex: 0xa66085,
    recommendedExercises: [
      { name: 'Hip Thrust con Barra', sets: '4x8 @ 130kg', rpe: 8.5 },
      { name: 'Abducciones en Polea', sets: '3x15 @ 18kg', rpe: 9 }
    ],
    statusText: 'Buena recuperación - Preparado para empuje'
  },
  forearms: {
    id: 'forearms',
    name: 'Antebrazos (Braquiorradial & Flexores)',
    category: 'Brazos / Agarre',
    fatigue: 30,
    recoveryHours: 4,
    weeklySets: 8,
    targetSets: 12,
    lastTrained: 'Hace 3 días',
    ecorcheColor: '#baa779',
    ecorcheHex: 0xbaa779,
    recommendedExercises: [
      { name: 'Curl Inverso con Barra', sets: '3x12 @ 25kg', rpe: 8 },
      { name: 'Colgado en Barra (Dead Hang)', sets: '3x60s', rpe: 9 }
    ],
    statusText: 'Fuerza de agarre lista'
  }
};

export const getFatigueColor = (fatigue) => {
  if (fatigue >= 75) return { hex: 0xff2a5f, css: '#ff2a5f', label: 'Fatiga Alta', glow: 'rgba(255, 42, 95, 0.4)' };
  if (fatigue >= 40) return { hex: 0xffb703, css: '#ffb703', label: 'Fatiga Media', glow: 'rgba(255, 183, 3, 0.4)' };
  return { hex: 0xccff00, css: '#ccff00', label: 'Óptimo / Descansado', glow: 'rgba(204, 255, 0, 0.4)' };
};
