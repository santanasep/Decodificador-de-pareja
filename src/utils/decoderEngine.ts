import { CouplePhrase, DangerLevel } from '../types';

/**
 * Normalizes text for robust matching by removing diacritics, lowercase,
 * and punctuation marks.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[¿?¡!.,;:_()'"-]/g, '') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates a simple similarity score between two normalized strings.
 */
export function calculateMatchScore(queryNorm: string, targetNorm: string): number {
  if (queryNorm === targetNorm) return 1.0;
  if (!queryNorm || !targetNorm) return 0;

  // Exact substring containment
  if (targetNorm.includes(queryNorm)) {
    return 0.85 + (queryNorm.length / targetNorm.length) * 0.14;
  }
  if (queryNorm.includes(targetNorm)) {
    return 0.80 + (targetNorm.length / queryNorm.length) * 0.15;
  }

  // Token overlap (Jaccard-like)
  const queryTokens = new Set(queryNorm.split(' ').filter(w => w.length > 2));
  const targetTokens = new Set(targetNorm.split(' ').filter(w => w.length > 2));

  if (queryTokens.size === 0 || targetTokens.size === 0) {
    return 0;
  }

  let intersectionCount = 0;
  for (const token of queryTokens) {
    if (targetTokens.has(token)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...queryTokens, ...targetTokens]).size;
  return intersectionCount / unionSize;
}

/**
 * Search the dictionary for the best match and related suggestions.
 */
export function searchDictionary(
  query: string,
  dictionary: CouplePhrase[],
  threshold = 0.35
): {
  bestMatch: CouplePhrase | null;
  score: number;
  suggestions: CouplePhrase[];
} {
  const normQuery = normalizeText(query);
  if (!normQuery) {
    return {
      bestMatch: null,
      score: 0,
      suggestions: dictionary.slice(0, 5),
    };
  }

  let highestScore = 0;
  let bestMatch: CouplePhrase | null = null;
  const scoredItems: { phrase: CouplePhrase; score: number }[] = [];

  for (const item of dictionary) {
    const normPhrase = normalizeText(item.phrase);
    const score = calculateMatchScore(normQuery, normPhrase);

    if (score > 0.1) {
      scoredItems.push({ phrase: item, score });
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  scoredItems.sort((a, b) => b.score - a.score);

  const matched = highestScore >= threshold ? bestMatch : null;
  const suggestions = scoredItems
    .filter(i => i.phrase.id !== matched?.id)
    .slice(0, 4)
    .map(i => i.phrase);

  return {
    bestMatch: matched,
    score: highestScore,
    suggestions: suggestions.length > 0 ? suggestions : dictionary.slice(0, 4),
  };
}

/**
 * Generates an analytical fallback when a phrase is not registered in the dictionary yet.
 */
export function generateFallbackAnalysis(rawPhrase: string): CouplePhrase {
  const clean = rawPhrase.trim();
  const lower = clean.toLowerCase();

  let dangerLevel: DangerLevel = 'medio';
  let emotionalTone = 'Hay una emoción implícita en espera de validación.';

  if (lower.includes('nada') || lower.includes('sabras') || lower.includes('quieras') || lower.includes('deja')) {
    dangerLevel = 'alto';
    emotionalTone = 'Esta frase contiene alta carga de resignación defensiva o prueba encubierta.';
  } else if (lower.includes('quien') || lower.includes('celos') || lower.includes('movil') || lower.includes('telefono')) {
    dangerLevel = 'critico';
    emotionalTone = 'Se activó una alarma de necesidad de seguridad y transparencia.';
  }

  return {
    id: `auto-${Date.now()}`,
    phrase: clean,
    toneContext: 'Dicho con mirada sutil, brazos cruzados o micro-pausa previa',
    literalMeaning: `Declaración aparente expresada de forma resumida o cotidiana.`,
    emotionalMeaning: `En el 93% de las parejas observadas por el Instituto, "${clean}" oculta un deseo no verbalizado: "${emotionalTone}". Tu pareja no quiere pelear, pero necesita sentirse escuchada, querida y comprendida sin tener que pedirlo por escrito.`,
    recommendedAction: `No respondas con lógica fría ni discutas la semántica de la frase. Pregunta con ternura: "¿Sientes que no te estoy entendiendo bien? Quiero que estemos a gusto, cuéntame qué necesitas". Si puedes, acompáñalo de un café o snack.`,
    dangerLevel,
    category: 'comunicacion',
    isCustom: true,
  };
}

/**
 * Standard Partner Alert text ready to send via WhatsApp or copy.
 */
export function generatePartnerAlertMessage(phrase: string): string {
  return `🚨 Alerta del Decodificador de Pareja:
Me acabas de lanzar una indirecta nueva ("${phrase.trim()}").
Ve al diccionario a ponerle subtítulos cuando puedas, por favor... ¡Te quiero! 😂❤️`;
}

/**
 * Returns UI metadata (badges, tones, colors) according to danger level.
 */
export function getDangerLevelDetails(level: DangerLevel) {
  switch (level) {
    case 'bajo':
      return {
        code: 'DEFCON 5',
        label: 'Riesgo Leve - Fase Amistosa',
        bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-400',
        screenTint: 'from-emerald-50/70 to-slate-50',
        accentRing: 'ring-emerald-400',
        indicatorColor: '#10b981',
        description: 'Fricción mínima. Generalmente solucionable compartiendo comida o con una pequeña muestra de cariño.'
      };
    case 'medio':
      return {
        code: 'DEFCON 3',
        label: 'Precaución Diplomática - Subtexto Detectado',
        bgColor: 'bg-amber-50 text-amber-950 border-amber-300',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-400',
        screenTint: 'from-amber-50/80 via-yellow-50/40 to-slate-50',
        accentRing: 'ring-amber-400',
        indicatorColor: '#f59e0b',
        description: 'La frase no dice lo que parece. Se requiere tacto, atención plena y evitar el exceso de autosuficiencia.'
      };
    case 'alto':
      return {
        code: 'DEFCON 2',
        label: 'Alerta Naranja - Eufemismo Crítico',
        bgColor: 'bg-orange-50 text-orange-950 border-orange-300',
        badgeBg: 'bg-orange-100 text-orange-900 border-orange-400',
        screenTint: 'from-amber-100/70 via-orange-50/50 to-slate-50',
        accentRing: 'ring-orange-400',
        indicatorColor: '#f97316',
        description: 'Zona de alto riesgo de malentendido o frustración acumulada. Requiere desactivación inmediata con empatía.'
      };
    case 'critico':
    case 'nuclear':
      return {
        code: 'DEFCON 1',
        label: 'PELIGRO MÁXIMO - Zona Minada',
        bgColor: 'bg-rose-50 text-rose-950 border-rose-300',
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-400',
        screenTint: 'from-rose-100/60 via-amber-50/40 to-slate-50',
        accentRing: 'ring-rose-500',
        indicatorColor: '#ef4444',
        description: 'Cese al fuego inmediato. Queda estrictamente prohibido responder con ironía, monosílabos o darse la vuelta.'
      };
  }
}
