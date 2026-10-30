import { Category, ConflictIncident, CouplePhrase, DangerLevel } from '../types';

export const CATEGORY_LABELS: Record<Category, { label: string; color: string; icon: string }> = {
  comunicacion: { label: 'Comunicación', color: '#3b82f6', icon: '💬' },
  emociones: { label: 'Emociones & Estado', color: '#ec4899', icon: '❤️' },
  planes: { label: 'Planes & Salidas', color: '#8b5cf6', icon: '🗓️' },
  hogar: { label: 'Hogar & Tareas', color: '#f59e0b', icon: '🏠' },
  ropa: { label: 'Ropa & Estilo', color: '#10b981', icon: '👗' },
  comida: { label: 'Comida & Antojos', color: '#06b6d4', icon: '🍟' },
  celos_curiosidad: { label: 'Curiosidad / Celos', color: '#f43f5e', icon: '🔍' },
};

export const DANGER_COLORS: Record<DangerLevel, { label: string; color: string; defcon: string }> = {
  bajo: { label: 'Leve (DEFCON 5)', color: '#10b981', defcon: 'DEFCON 5' },
  medio: { label: 'Medio (DEFCON 3)', color: '#f59e0b', defcon: 'DEFCON 3' },
  alto: { label: 'Alto (DEFCON 2)', color: '#f97316', defcon: 'DEFCON 2' },
  critico: { label: 'Crítico (DEFCON 1)', color: '#ef4444', defcon: 'DEFCON 1' },
  nuclear: { label: 'Nuclear (DEFCON 1+)', color: '#be123c', defcon: 'DEFCON 1+' },
};

export const INITIAL_SEED_INCIDENTS: ConflictIncident[] = [
  {
    id: 'inc-1',
    phrase: 'No me pasa nada',
    category: 'emociones',
    dangerLevel: 'alto',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
    resolved: true,
    note: 'Desactivado con un abrazo y café.'
  },
  {
    id: 'inc-2',
    phrase: 'Como quieras',
    category: 'planes',
    dangerLevel: 'medio',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    resolved: true,
  },
  {
    id: 'inc-3',
    phrase: 'Tú sabrás',
    category: 'comunicacion',
    dangerLevel: 'critico',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    resolved: true,
  },
  {
    id: 'inc-4',
    phrase: 'No te preocupes, yo lo hago',
    category: 'hogar',
    dangerLevel: 'alto',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    resolved: true,
  },
  {
    id: 'inc-5',
    phrase: '¿Te vas a poner eso?',
    category: 'ropa',
    dangerLevel: 'medio',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    resolved: true,
  },
  {
    id: 'inc-6',
    phrase: 'No me pasa nada',
    category: 'emociones',
    dangerLevel: 'alto',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    resolved: true,
  },
  {
    id: 'inc-7',
    phrase: 'No tengo hambre (pero mírame comer de tu plato)',
    category: 'comida',
    dangerLevel: 'bajo',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    resolved: true,
  },
  {
    id: 'inc-8',
    phrase: 'Haz lo que quieras',
    category: 'comunicacion',
    dangerLevel: 'nuclear',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    resolved: true,
  },
  {
    id: 'inc-9',
    phrase: 'Está bien',
    category: 'comunicacion',
    dangerLevel: 'alto',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
    resolved: true,
  },
  {
    id: 'inc-10',
    phrase: 'No me pasa nada',
    category: 'emociones',
    dangerLevel: 'alto',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    resolved: false,
  },
  {
    id: 'inc-11',
    phrase: '¿Quién te estaba escribiendo?',
    category: 'celos_curiosidad',
    dangerLevel: 'medio',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    resolved: true,
  },
];

export interface CategoryStat {
  category: Category;
  name: string;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface DangerStat {
  level: DangerLevel;
  name: string;
  count: number;
  percentage: number;
  color: string;
  defcon: string;
}

export function computeCategoryStats(incidents: ConflictIncident[]): CategoryStat[] {
  const total = incidents.length;
  const counts: Record<Category, number> = {
    comunicacion: 0,
    emociones: 0,
    planes: 0,
    hogar: 0,
    ropa: 0,
    comida: 0,
    celos_curiosidad: 0,
  };

  for (const inc of incidents) {
    if (counts[inc.category] !== undefined) {
      counts[inc.category]++;
    }
  }

  const result: CategoryStat[] = (Object.keys(counts) as Category[]).map((cat) => {
    const meta = CATEGORY_LABELS[cat];
    const count = counts[cat];
    return {
      category: cat,
      name: meta.label,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: meta.color,
      icon: meta.icon,
    };
  });

  return result.sort((a, b) => b.count - a.count);
}

export function computeDangerStats(incidents: ConflictIncident[]): DangerStat[] {
  const total = incidents.length;
  const counts: Record<DangerLevel, number> = {
    bajo: 0,
    medio: 0,
    alto: 0,
    critico: 0,
    nuclear: 0,
  };

  for (const inc of incidents) {
    if (counts[inc.dangerLevel] !== undefined) {
      counts[inc.dangerLevel]++;
    }
  }

  return (Object.keys(counts) as DangerLevel[])
    .map((lvl) => {
      const meta = DANGER_COLORS[lvl];
      const count = counts[lvl];
      return {
        level: lvl,
        name: meta.label,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: meta.color,
        defcon: meta.defcon,
      };
    })
    .filter((s) => s.count > 0);
}

export function getMostFrequentPhrase(incidents: ConflictIncident[]): { phrase: string; count: number } | null {
  if (incidents.length === 0) return null;
  const map: Record<string, number> = {};
  for (const inc of incidents) {
    map[inc.phrase] = (map[inc.phrase] || 0) + 1;
  }
  let topPhrase = '';
  let maxCount = 0;
  for (const [phrase, count] of Object.entries(map)) {
    if (count > maxCount) {
      maxCount = count;
      topPhrase = phrase;
    }
  }
  return { phrase: topPhrase, count: maxCount };
}

export function computeTensionIndex(incidents: ConflictIncident[]): {
  score: number;
  status: string;
  badgeColor: string;
} {
  if (incidents.length === 0) {
    return { score: 10, status: 'Paz Conyugal Total', badgeColor: 'bg-emerald-100 text-emerald-800' };
  }

  const weight: Record<DangerLevel, number> = {
    bajo: 10,
    medio: 30,
    alto: 60,
    critico: 85,
    nuclear: 100,
  };

  const sum = incidents.reduce((acc, curr) => acc + (weight[curr.dangerLevel] || 30), 0);
  const avg = Math.min(100, Math.round(sum / incidents.length));

  if (avg < 35) {
    return { score: avg, status: 'Baja Fricción • Ambiente Estable', badgeColor: 'bg-emerald-100 text-emerald-800' };
  }
  if (avg < 60) {
    return { score: avg, status: 'Tensión Moderada • Se Recomienda Humor', badgeColor: 'bg-amber-100 text-amber-900' };
  }
  return { score: avg, status: 'Alerta Diplomática • Cese al Fuego Urgente', badgeColor: 'bg-rose-100 text-rose-900' };
}
