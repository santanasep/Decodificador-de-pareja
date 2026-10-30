export interface TensionLevelInfo {
  level: number;
  label: string;
  emoji: string;
  colorClass: string;
  sliderBg: string;
  badgeBg: string;
  statusQuote: string;
  emergencyTip: string;
}

export const TENSION_PRESETS = [
  { value: 2, label: '2 • Leve' },
  { value: 5, label: '5 • Tensa' },
  { value: 8, label: '8 • Crítica' },
  { value: 10, label: '10 • Nuclear' },
];

export function getTensionDetails(level: number): TensionLevelInfo {
  const clamped = Math.max(1, Math.min(10, Math.round(level)));

  if (clamped <= 2) {
    return {
      level: clamped,
      label: 'Brisa Pacífica • Curiosidad Pura',
      emoji: '🕊️',
      colorClass: 'text-emerald-700',
      sliderBg: 'accent-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      statusQuote: 'No hay peligro visible. Conversación casual con leve subtexto.',
      emergencyTip: 'Aprovecha este momento relajado para escuchar con una sonrisa y buen humor.',
    };
  }

  if (clamped <= 4) {
    return {
      level: clamped,
      label: 'Ligera Fricción • Ceja Arqueada',
      emoji: '🌤️',
      colorClass: 'text-lime-700',
      sliderBg: 'accent-lime-600',
      badgeBg: 'bg-lime-100 text-lime-900 border-lime-300',
      statusQuote: 'Algo no terminó de encajar en el ambiente, pero aún se puede bromear.',
      emergencyTip: 'Valida su opinión antes de defender la tuya. Haz una pregunta abierta.',
    };
  }

  if (clamped <= 6) {
    return {
      level: clamped,
      label: 'Tensión Palpable • Respuestas Monosílabas',
      emoji: '🤨',
      colorClass: 'text-amber-700',
      sliderBg: 'accent-amber-500',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      statusQuote: 'El aire se siente denso. Se detectaron miradas fugaces a la pantalla.',
      emergencyTip: 'Prohibido usar ironía o decir "¿qué te pasa?". Ofrece un vaso de agua o café.',
    };
  }

  if (clamped <= 8) {
    return {
      level: clamped,
      label: 'Alerta Crítica • Punto Final en WhatsApp',
      emoji: '⚡',
      colorClass: 'text-orange-700',
      sliderBg: 'accent-orange-500',
      badgeBg: 'bg-orange-100 text-orange-950 border-orange-400',
      statusQuote: 'Peligro inminente de discusión formal. Toda palabra puede ser usada en tu contra.',
      emergencyTip: 'Silencio estratégico. Un abrazo suave o decir "Sé que estás molesto/a, estoy aquí" desactiva el 80% de la carga.',
    };
  }

  return {
    level: clamped,
    label: 'DEFCON 10 • Inminente Explosión Nuclear',
    emoji: '💥',
    colorClass: 'text-rose-700',
    sliderBg: 'accent-rose-600',
    badgeBg: 'bg-rose-100 text-rose-950 border-rose-400',
    statusQuote: 'Código Rojo. Se escuchó un portazo o un "Haz lo que quieras" con sonrisa gélida.',
    emergencyTip: 'Cese al fuego inmediato. No intentes tener la razón hoy. Prioriza la calma y el cariño incondicional.',
  };
}
