import React, { useState, useId } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight, CornerDownRight, History, Zap, MessageSquareQuote } from 'lucide-react';
import { CouplePhrase } from '../types';
import { TensionScaleWidget } from './TensionScaleWidget';
import { sounds } from '../utils/soundEffects';

interface SearchDecoderProps {
  dictionary: CouplePhrase[];
  onDecode: (phrase: string, customTone?: string, tensionLevel?: number) => void;
  onOpenSuggestModal: (prefillPhrase: string) => void;
}

const COMMON_TONES = [
  'Con un suspiro profundo',
  'Con una sonrisa helada',
  'Tono cortante y monosilábico',
  'Mirando la pantalla del móvil',
  'Cruzando los brazos lentamente',
  'Tono falsamente alegre',
  'Mirando hacia el horizonte'
];

export const SearchDecoder: React.FC<SearchDecoderProps> = ({
  dictionary,
  onDecode,
  onOpenSuggestModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [tensionLevel, setTensionLevel] = useState<number>(5);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const inputId = useId();

  // Filter dictionary based on query for live matching suggestions
  const normalizedQuery = query.toLowerCase().trim();
  const filteredSuggestions = normalizedQuery.length >= 2
    ? dictionary.filter(p => p.phrase.toLowerCase().includes(normalizedQuery)).slice(0, 5)
    : [];

  const handleSelectPhrase = (phraseText: string, tone?: string) => {
    sounds.playTypewriter();
    setQuery(phraseText);
    if (tone) setSelectedTone(tone);
    onDecode(phraseText, tone || selectedTone, tensionLevel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    sounds.playStamp();
    onDecode(query.trim(), selectedTone, tensionLevel);
  };

  const quickFilterPhrases = activeCategory === 'todos' 
    ? dictionary.slice(0, 8) 
    : dictionary.filter(p => p.category === activeCategory).slice(0, 8);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Institutional Mission Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600" />
          <span>Servicio Nacional de Mediación y Hermenéutica Marital</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tight mb-3">
          ¿Qué te acaban de decir?
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Escribe la frase exacta o selecciona una de las indirectas habituales para revelar el verdadero subtexto emocional y desactivar la crisis con humor y amor.
        </p>
      </div>

      {/* Main Search Box - Clean, Academic & Official Style */}
      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 border-2 border-stone-300 overflow-hidden mb-8 transition-all focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="relative">
            <label htmlFor={inputId} className="block text-xs font-mono uppercase tracking-wider font-bold text-stone-500 mb-2">
              Ingreso de Declaración Verbal / Mensaje Recibido
            </label>
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-stone-400 pointer-events-none" />
              <input
                id={inputId}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  sounds.playTypewriter();
                }}
                placeholder="Ej: 'No me pasa nada', 'Como quieras', 'Tú sabrás'..."
                className="w-full pl-12 pr-4 py-4 text-base sm:text-lg md:text-xl font-medium text-stone-900 placeholder:text-stone-400 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                autoComplete="off"
              />
            </div>

            {/* Live Autocomplete suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="mt-2 bg-stone-50 border border-stone-200 rounded-xl p-2 shadow-sm divide-y divide-stone-200/60">
                <div className="px-2 py-1 text-[11px] font-mono uppercase text-stone-500 flex items-center justify-between">
                  <span>Coincidencias en el Diccionario Oficial:</span>
                  <span className="text-amber-700 font-bold">{filteredSuggestions.length} encontradas</span>
                </div>
                {filteredSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPhrase(item.phrase, item.toneContext)}
                    className="w-full text-left px-3 py-2 hover:bg-amber-100/70 rounded-lg flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-stone-900 group-hover:text-amber-950">
                        "{item.phrase}"
                      </span>
                      {item.toneContext && (
                        <span className="text-xs text-stone-500 block truncate max-w-md">
                          ({item.toneContext})
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 group-hover:bg-amber-200">
                      Decodificar →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Context / Tone modifier (The how it was said) */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1.5">
                <span>Modulador gestual: ¿Con qué tono fue emitida? (Opcional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_TONES.map(tone => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => {
                      sounds.playTypewriter();
                      setSelectedTone(selectedTone === tone ? '' : tone);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      selectedTone === tone
                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold shadow-xs'
                        : 'bg-stone-100/80 border-stone-200 text-stone-600 hover:bg-stone-200/80'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Widget de Escala de Tensión (1 al 10) */}
          <TensionScaleWidget
            value={tensionLevel}
            onChange={(val) => setTensionLevel(val)}
          />

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onOpenSuggestModal(query)}
              className="text-xs text-stone-600 hover:text-amber-700 font-medium flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>¿Es una indirecta nueva? Avisar a mi pareja</span>
            </button>

            <button
              type="submit"
              disabled={!query.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Decodificar Indirecta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Quick Select Panel: Top Classic Indirectas */}
      <div className="bg-stone-100/70 rounded-2xl p-5 border border-stone-300/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
              Botiquín Rápido de Emergencias Conyugales
            </h3>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'todos', label: 'Todas' },
              { id: 'comunicacion', label: 'Comunicación' },
              { id: 'emociones', label: 'Emociones' },
              { id: 'planes', label: 'Planes' },
              { id: 'hogar', label: 'Hogar' },
              { id: 'ropa', label: 'Ropa' },
              { id: 'comida', label: 'Comida' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  sounds.playTypewriter();
                  setActiveCategory(cat.id);
                }}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-stone-800 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phrases grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {quickFilterPhrases.map((phraseItem) => (
            <button
              key={phraseItem.id}
              type="button"
              onClick={() => handleSelectPhrase(phraseItem.phrase, phraseItem.toneContext)}
              className="text-left p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-stone-900 text-sm group-hover:text-amber-950">
                    "{phraseItem.phrase}"
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                    phraseItem.dangerLevel === 'nuclear' || phraseItem.dangerLevel === 'critico'
                      ? 'bg-rose-100 text-rose-800'
                      : phraseItem.dangerLevel === 'alto'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {phraseItem.dangerLevel}
                  </span>
                </div>
                {phraseItem.toneContext && (
                  <p className="text-xs text-stone-500 italic line-clamp-1 mb-2">
                    {phraseItem.toneContext}
                  </p>
                )}
              </div>

              <div className="text-[11px] font-medium text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Ver traducción honesta</span>
                <CornerDownRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
