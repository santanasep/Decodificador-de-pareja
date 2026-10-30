import { Achievement, AchievementRank, ConflictIncident, CouplePhrase } from '../types';

export const RANK_METADATA: Record<AchievementRank, { label: string; badgeColor: string; ribbonColor: string; bgGradient: string }> = {
  bronce: {
    label: 'Orden de Bronce',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    ribbonColor: 'bg-amber-700',
    bgGradient: 'from-amber-50 to-stone-50',
  },
  plata: {
    label: 'Orden de Plata',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    ribbonColor: 'bg-slate-400',
    bgGradient: 'from-slate-50 to-stone-50',
  },
  oro: {
    label: 'Orden de Oro Marital',
    badgeColor: 'bg-yellow-100 text-yellow-950 border-yellow-400',
    ribbonColor: 'bg-yellow-500',
    bgGradient: 'from-amber-100/60 via-yellow-50/40 to-stone-50',
  },
  platino: {
    label: 'Gran Cruz de Platino',
    badgeColor: 'bg-cyan-100 text-cyan-950 border-cyan-400',
    ribbonColor: 'bg-cyan-500',
    bgGradient: 'from-cyan-50 via-blue-50/30 to-stone-50',
  },
  diamante: {
    label: 'Laurel Diamante Supremo',
    badgeColor: 'bg-purple-100 text-purple-950 border-purple-400',
    ribbonColor: 'bg-purple-600',
    bgGradient: 'from-purple-100/60 via-rose-50/30 to-stone-50',
  },
};

export const BASE_ACHIEVEMENTS: Omit<Achievement, 'currentCount' | 'unlocked'>[] = [
  {
    id: 'ach-first-peace',
    title: 'Primer Tratado de Paz',
    category: 'resolucion',
    description: 'Resolver tu primer conflicto o indirecta con diplomacia.',
    humorousQuote: 'Un pequeño paso para el ser humano, un salto gigante para la convivencia en el sofá.',
    icon: '🕊️',
    rank: 'bronce',
    targetCount: 1,
    metricType: 'resolutions_total',
    rewardTitle: 'Mediador/a en Prácticas',
  },
  {
    id: 'ach-bomb-expert',
    title: 'Experto en Desactivar Bombas',
    category: 'desactivacion_extrema',
    description: 'Desactivar con éxito 3 indirectas de nivel Crítico o Nuclear (como "Tú sabrás" o "Haz lo que quieras").',
    humorousQuote: 'Cortaste el cable rojo del sarcasmo sin que la casa entera volara por los aires.',
    icon: '💣',
    rank: 'oro',
    targetCount: 3,
    metricType: 'nuclear_resolved',
    rewardTitle: 'Técnico Especialista en Explosivos Emocionales',
  },
  {
    id: 'ach-diplomat-year',
    title: 'Diplomático del Año',
    category: 'diplomacia',
    description: 'Acumular 10 resoluciones de conflictos con empatía y sin responder a la defensiva.',
    humorousQuote: 'La embajada conyugal te condecora formalmente. La ONU debería pedirte asesoría.',
    icon: '🏅',
    rank: 'platino',
    targetCount: 10,
    metricType: 'resolutions_total',
    rewardTitle: 'Embajador Plenipotenciario de la Paz Doméstica',
  },
  {
    id: 'ach-hug-master',
    title: 'Maestro del Abrazo Oportuno',
    category: 'resolucion',
    description: 'Resolver 4 indirectas relacionadas con emociones o el clásico "No me pasa nada".',
    humorousQuote: 'Entendiste que un abrazo oportuno vale más que 40 argumentos lógicos impecables.',
    icon: '🫂',
    rank: 'plata',
    targetCount: 4,
    metricType: 'resolutions_total',
    rewardTitle: 'Doctor Honoris Causa en Contención Emocional',
  },
  {
    id: 'ach-snack-master',
    title: 'Abastecedor Oficial de Botanas',
    category: 'diplomacia',
    description: 'Resolver indirectas de comida compartiendo tus papas fritas o preparando un café sin quejarte.',
    humorousQuote: 'Cediste el 40% de tu comida con una sonrisa. El verdadero amor se mide en carbohidratos.',
    icon: '🍟',
    rank: 'bronce',
    targetCount: 2,
    metricType: 'resolutions_total',
    rewardTitle: 'Ministro de Alimentación Estratégica',
  },
  {
    id: 'ach-dictionary-architect',
    title: 'Alquimista del Diccionario Privado',
    category: 'complicidad',
    description: 'Alimentar la app juntos añadiendo al menos 3 frases personalizadas de la pareja.',
    humorousQuote: 'Reírse de las propias indirectas mientras se anotan es la cúspide de la madurez marital.',
    icon: '📖',
    rank: 'oro',
    targetCount: 3,
    metricType: 'custom_phrases',
    rewardTitle: 'Codirector de la Real Academia del Eufemismo Propio',
  },
  {
    id: 'ach-defcon-miracle',
    title: 'El Milagro de DEFCON 1',
    category: 'desactivacion_extrema',
    description: 'Desactivar con éxito la frase más peligrosa del universo conocido: "Haz lo que quieras".',
    humorousQuote: '¡No caíste en la trampa! Viste venir la emboscada y propusiste helado y diálogo.',
    icon: '🚨',
    rank: 'diamante',
    targetCount: 1,
    metricType: 'nuclear_resolved',
    rewardTitle: 'Héroe Nacional de la Desescalada Marital',
  },
  {
    id: 'ach-peace-grandmaster',
    title: 'Gran Canciller de la Concordia',
    category: 'diplomacia',
    description: 'Alcanzar 20 resoluciones de conflictos registradas en el historial.',
    humorousQuote: 'El amor maduro no es no tener roces, sino saber reírse, perdonar rápido y seguir caminando.',
    icon: '👑',
    rank: 'diamante',
    targetCount: 20,
    metricType: 'resolutions_total',
    rewardTitle: 'Comendador Supremo del Amor Incondicional',
  },
];

export function computeAchievements(
  incidents: ConflictIncident[],
  dictionary: CouplePhrase[]
): Achievement[] {
  const totalResolved = incidents.filter((i) => i.resolved).length;
  const customPhrasesCount = dictionary.filter((p) => p.isCustom).length;
  const nuclearResolvedCount = incidents.filter(
    (i) => i.resolved && (i.dangerLevel === 'critico' || i.dangerLevel === 'nuclear')
  ).length;

  return BASE_ACHIEVEMENTS.map((base) => {
    let currentCount = 0;

    switch (base.metricType) {
      case 'resolutions_total':
        currentCount = totalResolved;
        break;
      case 'nuclear_resolved':
        currentCount = nuclearResolvedCount;
        break;
      case 'custom_phrases':
        currentCount = customPhrasesCount;
        break;
      default:
        currentCount = totalResolved;
    }

    const unlocked = currentCount >= base.targetCount;

    return {
      ...base,
      currentCount,
      unlocked,
      unlockedAt: unlocked ? Date.now() : undefined,
    };
  });
}

export function getRankLevel(unlockedCount: number, totalCount: number) {
  const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  if (percentage >= 80) {
    return {
      title: 'Canciller Mayor de la Paz Conyugal',
      badge: '👑 Rango Diamante Supremo',
      color: 'text-purple-600 bg-purple-50 border-purple-300',
    };
  }
  if (percentage >= 50) {
    return {
      title: 'Diplomático/a de Alto Rango',
      badge: '🏅 Rango Oro Marital',
      color: 'text-amber-700 bg-amber-50 border-amber-300',
    };
  }
  if (percentage >= 25) {
    return {
      title: 'Negociador/a Oficial en Ascenso',
      badge: '🥈 Rango Plata',
      color: 'text-slate-700 bg-slate-50 border-slate-300',
    };
  }
  return {
    title: 'Cadete del Entendimiento',
    badge: '🥉 Rango Bronce Inicial',
    color: 'text-amber-800 bg-amber-50 border-amber-200',
  };
}

export function generateAchievementShareText(ach: Achievement): string {
  return `🏅 ¡He sido condecorado/a en el Decodificador de Pareja!
Título obtenido: "${ach.title}" (${ach.rewardTitle})
"${ach.humorousQuote}"
Resolviendo nuestras indirectas con humor y amor... 😂❤️`;
}
