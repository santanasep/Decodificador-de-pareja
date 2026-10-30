import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  ShieldAlert, 
  Sparkles, 
  Heart, 
  Lightbulb, 
  BookOpen, 
  MessageCircle,
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { CouplePhrase } from '../types';
import { getDangerLevelDetails, generatePartnerAlertMessage } from '../utils/decoderEngine';
import { getTensionDetails } from '../utils/tensionEngine';
import { InstitutionalStamp } from './InstitutionalStamp';
import { sounds } from '../utils/soundEffects';

interface TranslationResultProps {
  phrase: CouplePhrase;
  userToneOverride?: string;
  userTensionLevel?: number;
  onBackToSearch: () => void;
  onOpenSuggestModal: (phrase: string) => void;
  onAddToPrivateDictionary?: (phrase: CouplePhrase) => void;
}

type TabType = 'emocional' | 'literal' | 'accion' | 'todos';

export const TranslationResult: React.FC<TranslationResultProps> = ({
  phrase,
  userToneOverride,
  userTensionLevel,
  onBackToSearch,
  onOpenSuggestModal,
  onAddToPrivateDictionary,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('emocional');
  const [copiedAction, setCopiedAction] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const dangerDetails = getDangerLevelDetails(phrase.dangerLevel);
  const effectiveTone = userToneOverride || phrase.toneContext;
  const tensionInfo = userTensionLevel ? getTensionDetails(userTensionLevel) : null;

  const handleCopyAction = async () => {
    sounds.playSuccess();
    try {
      await navigator.clipboard.writeText(
        `💡 Plan de Acción para "${phrase.phrase}":\n${phrase.recommendedAction}`
      );
      setCopiedAction(true);
      setTimeout(() => setCopiedAction(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopyFullDiagnosis = async () => {
    sounds.playSuccess();
    const text = `📋 DICTAMEN OFICIAL: "${phrase.phrase}"\n` +
      `🚨 Nivel: ${dangerDetails.code} (${dangerDetails.label})\n\n` +
      `🎭 Traducción Literal:\n${phrase.literalMeaning}\n\n` +
      `❤️ Lo que REALMENTE significa:\n${phrase.emotionalMeaning}\n\n` +
      `🛠️ Plan de Acción Recomendado:\n${phrase.recommendedAction}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShareWhatsAppAlert = () => {
    sounds.playTypewriter();
    onOpenSuggestModal(phrase.phrase);
  };

  return (
    <div className={`min-h-[calc(100vh-120px)] bg-gradient-to-b ${dangerDetails.screenTint} transition-colors duration-500 py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar / Action strip */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <button
            onClick={() => {
              sounds.playTypewriter();
              onBackToSearch();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-800 text-xs sm:text-sm font-semibold border border-stone-300 shadow-xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600" />
            <span>Consultar otra frase</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsAppAlert}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
              title="Notificar a pareja con humor"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Avisar a mi Pareja</span>
              <span className="sm:hidden">Avisar</span>
            </button>

            <button
              onClick={handleCopyFullDiagnosis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-700 text-xs sm:text-sm font-medium border border-stone-300 shadow-xs"
              title="Copiar informe completo"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copiar Dictamen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warning Banner Header (Tiñe de color de advertencia con humor) */}
        <div className={`rounded-2xl p-5 sm:p-7 border-2 ${dangerDetails.bgColor} shadow-lg mb-8 relative overflow-hidden`}>
          {/* Subtle institutional watermarks */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              {/* Official Alert Tag */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-black uppercase tracking-wider border ${dangerDetails.badgeBg}`}>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap font-extrabold">{dangerDetails.code}</span>
                  <span className="text-current/60">|</span>
                  <span className="leading-tight">{dangerDetails.label}</span>
                </div>

                {phrase.isCustom && (
                  <span className="px-2.5 py-0.5 rounded-md font-sans text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 whitespace-nowrap">
                    ★ De su Diccionario Privado
                  </span>
                )}
              </div>

              {/* The Input Phrase (Highlight) */}
              <div className="mt-2">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">
                  Frase Ingresada para Análisis:
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                  “{phrase.phrase}”
                </h1>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {effectiveTone && (
                  <div className="inline-flex items-center gap-2 text-xs text-stone-600 bg-white/70 px-3 py-1.5 rounded-lg border border-stone-200/80">
                    <span className="font-semibold text-stone-800">Modulador gestual:</span>
                    <span className="italic">{effectiveTone}</span>
                  </div>
                )}

                {tensionInfo && (
                  <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-mono ${tensionInfo.badgeBg}`}>
                    <span>{tensionInfo.emoji}</span>
                    <span className="font-bold">Tensión Ambiental: {tensionInfo.level}/10</span>
                    <span className="text-current/60">|</span>
                    <span className="font-sans font-medium">{tensionInfo.label.split('•')[0].trim()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Stamp */}
            <div className="self-end md:self-start">
              <InstitutionalStamp level={phrase.dangerLevel} code={dangerDetails.code} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-current/10 text-xs font-medium text-stone-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-stone-600 shrink-0" />
            <span>{dangerDetails.description}</span>
          </div>
        </div>

        {/* Subtext Navigation Tabs (Literal vs Emocional vs Plan de Acción) */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-stone-200/80 rounded-2xl mb-6 max-w-lg mx-auto border border-stone-300 shadow-inner">
          <button
            onClick={() => {
              sounds.playTypewriter();
              setActiveTab('emocional');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'emocional'
                ? 'bg-white text-stone-900 shadow-md ring-1 ring-stone-900/10'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
            <span>Traducción Emocional</span>
          </button>

          <button
            onClick={() => {
              sounds.playTypewriter();
              setActiveTab('literal');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'literal'
                ? 'bg-white text-stone-900 shadow-md ring-1 ring-stone-900/10'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Traducción Literal</span>
          </button>

          <button
            onClick={() => {
              sounds.playTypewriter();
              setActiveTab('accion');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'accion'
                ? 'bg-white text-stone-900 shadow-md ring-1 ring-stone-900/10'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Plan de Acción</span>
          </button>
        </div>

        {/* The 3 Cards of Subtext */}
        <div className="grid grid-cols-1 gap-6">
          {/* Card 1: Emocional (Lo que realmente significa) */}
          {(activeTab === 'emocional' || activeTab === 'todos') && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-stone-200 shadow-xl shadow-stone-200/50 relative overflow-hidden transition-all animate-fadeIn">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-rose-200" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
                    Traducción Emocional Oficial
                  </h3>
                  <h4 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                    Lo que realmente está pasando por su mente
                  </h4>
                </div>
              </div>

              <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100 mb-4">
                <p className="text-base sm:text-lg md:text-xl font-medium text-stone-900 leading-relaxed font-sans">
                  “{phrase.emotionalMeaning}”
                </p>
              </div>

              <p className="text-xs text-stone-500 italic">
                *Nota clínica del Instituto: Esta frase no es un ataque hacia tu persona, sino una señal encubierta de necesidad de afecto, alivio o validación sin confrontación.
              </p>
            </div>
          )}

          {/* Card 2: Literal (Lo que dicen las palabras) */}
          {(activeTab === 'literal' || activeTab === 'todos') && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-stone-200 shadow-lg relative overflow-hidden transition-all animate-fadeIn">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                    Traducción Literal de Superficie
                  </h3>
                  <h4 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                    El significado según el diccionario formal
                  </h4>
                </div>
              </div>

              <div className="bg-blue-50/40 rounded-xl p-5 border border-blue-100 mb-3">
                <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed">
                  “{phrase.literalMeaning}”
                </p>
              </div>

              <p className="text-xs text-stone-500">
                Si respondes basándote en esta traducción literal, el riesgo de agravar el conflicto aumenta en un 87%. No caigas en la trampa gramatical.
              </p>
            </div>
          )}

          {/* Card 3: Plan de Acción Recomendado */}
          {(activeTab === 'accion' || activeTab === 'todos') && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-stone-200 shadow-xl shadow-amber-200/30 relative overflow-hidden transition-all animate-fadeIn">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 fill-amber-200" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700">
                      Protocolo de Desactivación Inmediata
                    </h3>
                    <h4 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                      Acción recomendada por la app
                    </h4>
                  </div>
                </div>

                <button
                  onClick={handleCopyAction}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-colors"
                >
                  {copiedAction ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Acción</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-200/80 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <p className="text-base sm:text-lg font-semibold text-stone-900 leading-relaxed">
                    {phrase.recommendedAction}
                  </p>
                </div>
              </div>

              {tensionInfo && (
                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 mb-4 flex items-start gap-2.5 text-xs text-stone-700">
                  <span className="text-base shrink-0">{tensionInfo.emoji}</span>
                  <div>
                    <span className="font-bold text-stone-900 block font-mono uppercase text-[11px]">
                      Ajuste por Escala de Tensión ({tensionInfo.level}/10):
                    </span>
                    <p className="mt-0.5 text-stone-600 font-medium">{tensionInfo.emergencyTip}</p>
                  </div>
                </div>
              )}

              {/* Botón de Sugerir Frase a tu Pareja */}
              <div className="mt-6 pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl">
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">
                    ¿Esta traducción no encaja del todo con ustedes?
                  </h5>
                  <p className="text-xs text-stone-600">
                    Pídele a tu pareja que le ponga subtítulos propios en su Diccionario Privado.
                  </p>
                </div>

                <button
                  onClick={handleShareWhatsAppAlert}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Enviar WhatsApp a Pareja</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View all cards toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sounds.playTypewriter();
              setActiveTab(activeTab === 'todos' ? 'emocional' : 'todos');
            }}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
          >
            {activeTab === 'todos' ? '← Volver a vista de pestañas individuales' : 'Ver las 3 tarjetas desplegadas simultáneamente ↓'}
          </button>
        </div>
      </div>
    </div>
  );
};
