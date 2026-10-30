import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Medal, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Heart,
  MessageCircle,
  FileCheck
} from 'lucide-react';
import { Achievement, ConflictIncident, CouplePhrase } from '../types';
import { 
  computeAchievements, 
  getRankLevel, 
  generateAchievementShareText, 
  RANK_METADATA 
} from '../utils/achievementsEngine';
import { sounds } from '../utils/soundEffects';

interface AchievementsViewProps {
  incidents: ConflictIncident[];
  dictionary: CouplePhrase[];
  onNavigateToDecoder: () => void;
  onNavigateToDictionary: () => void;
  onResolvePendingIncident?: (id: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  incidents,
  dictionary,
  onNavigateToDecoder,
  onNavigateToDictionary,
  onResolvePendingIncident,
}) => {
  const [filter, setFilter] = useState<'todos' | 'unlocked' | 'locked'>('todos');
  const [selectedAchievementForCert, setSelectedAchievementForCert] = useState<Achievement | null>(null);
  const [copiedCert, setCopiedCert] = useState(false);

  const achievements = computeAchievements(incidents, dictionary);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const overallRank = getRankLevel(unlockedCount, totalCount);

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const handleOpenCert = (ach: Achievement) => {
    sounds.playStamp();
    setSelectedAchievementForCert(ach);
    setCopiedCert(false);
  };

  const handleCopyShare = async (ach: Achievement) => {
    sounds.playSuccess();
    const text = generateAchievementShareText(ach);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleWhatsAppShare = (ach: Achievement) => {
    sounds.playSuccess();
    const text = generateAchievementShareText(ach);
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header Banner - Institutional Honors & Medals Parody */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Tribunal de Honores y Condecoraciones Maritales</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight mb-2">
          Órdenes de Mérito y Medallas de la Paz
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Incentivos oficiales otorgados por evitar dramas innecesarios, desactivar eufemismos peligrosos y anteponer el amor y el buen humor a tener la razón.
        </p>
      </div>

      {/* Grand Honor Badge / Current Rank Summary */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-amber-300">
              🏅
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Rango Conyugal Oficial Otorgado:
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                {overallRank.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  {overallRank.badge}
                </span>
                <span className="text-xs text-amber-300/90 font-mono">
                  {unlockedCount} de {totalCount} condecoraciones desbloqueadas
                </span>
              </div>
            </div>
          </div>

          {/* Quick gauge */}
          <div className="w-full md:w-64 bg-stone-800/80 p-4 rounded-2xl border border-stone-700">
            <div className="flex justify-between items-center text-xs font-mono text-stone-300 mb-1.5">
              <span>Nivel de Desactivación:</span>
              <span className="font-bold text-amber-400">{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2 text-center">
              {unlockedCount === totalCount
                ? '¡Perfección absoluta! Han alcanzado la iluminación marital.'
                : `Faltan ${totalCount - unlockedCount} medallas para el título supremo.`}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and navigation actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playTypewriter();
              setFilter('todos');
            }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'todos' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            onClick={() => {
              sounds.playTypewriter();
              setFilter('unlocked');
            }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              filter === 'unlocked' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Desbloqueadas ({unlockedCount})</span>
          </button>
          <button
            onClick={() => {
              sounds.playTypewriter();
              setFilter('locked');
            }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              filter === 'locked' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Por desbloquear ({totalCount - unlockedCount})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playTypewriter();
              onNavigateToDecoder();
            }}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
          >
            <span>Decodificar nueva indirecta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Medals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filteredAchievements.map((ach) => {
          const rankMeta = RANK_METADATA[ach.rank];
          const progressPercent = Math.min(100, Math.round((ach.currentCount / ach.targetCount) * 100));

          return (
            <div
              key={ach.id}
              className={`rounded-3xl p-6 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                ach.unlocked
                  ? `bg-white border-amber-300 shadow-md hover:shadow-lg`
                  : 'bg-stone-50/80 border-stone-200 opacity-80'
              }`}
            >
              {/* Ribbon Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${rankMeta.badgeColor}`}>
                    {rankMeta.label}
                  </span>

                  {ach.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Desbloqueada</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>{ach.currentCount} / {ach.targetCount}</span>
                    </span>
                  )}
                </div>

                {/* Big Medal Icon & Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform ${
                    ach.unlocked
                      ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 shadow-inner scale-105'
                      : 'bg-stone-200/70 border border-stone-300 grayscale'
                  }`}>
                    {ach.icon}
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">
                      {ach.title}
                    </h3>
                    <p className="text-xs font-semibold text-amber-800 font-sans mt-0.5">
                      {ach.rewardTitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                  {ach.description}
                </p>

                {/* Humorous Quote */}
                <div className="bg-stone-100/70 p-3 rounded-xl border border-stone-200/60 mb-4">
                  <p className="text-[11px] text-stone-700 italic font-medium leading-normal">
                    “{ach.humorousQuote}”
                  </p>
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div>
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-mono text-stone-500 mb-1">
                    <span>Progreso:</span>
                    <span className="font-bold text-stone-800">{ach.currentCount} / {ach.targetCount}</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ach.unlocked ? 'bg-amber-500' : 'bg-stone-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {ach.unlocked ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => handleOpenCert(ach)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Ver Certificado</span>
                    </button>

                    <button
                      onClick={() => handleWhatsAppShare(ach)}
                      title="Presumir medalla por WhatsApp"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500 text-center py-1.5 bg-stone-100 rounded-lg">
                    {ach.metricType === 'nuclear_resolved'
                      ? 'Desactiva incidentes con peligro Crítico/Nuclear'
                      : ach.metricType === 'custom_phrases'
                      ? 'Añade frases en el Diccionario Privado'
                      : 'Resuelve más indirectas registradas en la app'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Diplomatic Certificate Modal */}
      {selectedAchievementForCert && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-50 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-600/40 relative my-8">
            <button
              onClick={() => setSelectedAchievementForCert(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700"
              aria-label="Cerrar certificado"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Parchment */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-dashed border-amber-400/80 text-center relative shadow-inner">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold mb-1">
                ★ INSTITUTO OFICIAL DE LINGÜÍSTICA CONYUGAL • DRAEI ★
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-900 mb-1">
                DIPLOMA OFICIAL DE HONOR
              </h3>
              <p className="text-xs text-stone-500 uppercase tracking-widest font-mono mb-4">
                Orden al Mérito por la Preservación de la Armonía
              </p>

              <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mx-auto mb-4 shadow-md">
                {selectedAchievementForCert.icon}
              </div>

              <span className="text-xs font-mono font-bold text-amber-700 block uppercase">
                Se confiere a la pareja la condecoración:
              </span>
              <h4 className="text-2xl font-serif font-black text-stone-900 my-1">
                “{selectedAchievementForCert.title}”
              </h4>
              <p className="text-sm font-bold text-amber-900 mb-3">
                {selectedAchievementForCert.rewardTitle}
              </p>

              <p className="text-xs sm:text-sm text-stone-600 italic max-w-md mx-auto mb-6 bg-stone-50 p-3 rounded-xl border border-stone-200">
                “{selectedAchievementForCert.humorousQuote}”
              </p>

              <div className="text-[10px] font-mono text-stone-500 pt-3 border-t border-stone-200 flex justify-between items-center">
                <span>Certificado N° {selectedAchievementForCert.id.toUpperCase()}-2026</span>
                <span className="text-amber-800 font-bold">100% Homologado con Amor</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleCopyShare(selectedAchievementForCert)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-white text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCert ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">¡Texto de Medalla Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Condecoración</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleWhatsAppShare(selectedAchievementForCert)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Presumir en WhatsApp con Pareja</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
