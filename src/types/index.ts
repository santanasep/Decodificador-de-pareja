export type DangerLevel = 'bajo' | 'medio' | 'alto' | 'critico' | 'nuclear';

export type Category = 'hogar' | 'planes' | 'emociones' | 'ropa' | 'celos_curiosidad' | 'comida' | 'comunicacion';

export interface CouplePhrase {
  id: string;
  phrase: string;
  toneContext?: string; // e.g. "Dicho con un suspiro", "Dicho con tono cortante", "Mirando al vacío"
  literalMeaning: string; // Traducción literal
  emotionalMeaning: string; // Traducción emocional / Lo que realmente significa
  recommendedAction: string; // Plan de acción recomendado
  dangerLevel: DangerLevel;
  category: Category;
  isCustom?: boolean;
  createdAt?: number;
}

export type ActiveScreen = 'search' | 'result' | 'dictionary' | 'stats' | 'achievements';

export interface ConflictIncident {
  id: string;
  phraseId?: string;
  phrase: string;
  category: Category;
  dangerLevel: DangerLevel;
  timestamp: number;
  resolved: boolean;
  note?: string;
}

export type AchievementRank = 'bronce' | 'plata' | 'oro' | 'platino' | 'diamante';

export interface Achievement {
  id: string;
  title: string;
  category: 'resolucion' | 'desactivacion_extrema' | 'complicidad' | 'diplomacia';
  description: string;
  humorousQuote: string;
  icon: string;
  rank: AchievementRank;
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  unlockedAt?: number;
  metricType: 'resolutions_total' | 'nuclear_resolved' | 'custom_phrases' | 'consecutive_peace' | 'actions_copied';
  rewardTitle: string;
}
