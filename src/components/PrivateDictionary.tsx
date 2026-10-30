import React, { useState, useId } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  BookHeart, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  X,
  AlertTriangle,
  Lock,
  Layers,
  Heart
} from 'lucide-react';
import { CouplePhrase, DangerLevel, Category } from '../types';
import { sounds } from '../utils/soundEffects';

interface PrivateDictionaryProps {
  phrases: CouplePhrase[];
  onAddPhrase: (phrase: Omit<CouplePhrase, 'id' | 'createdAt'>) => void;
  onUpdatePhrase: (id: string, phrase: Partial<CouplePhrase>) => void;
  onDeletePhrase: (id: string) => void;
  onResetDefaults: () => void;
  onImportPhrases: (imported: CouplePhrase[]) => void;
  onSelectPhraseToTest: (phrase: CouplePhrase) => void;
}

export const PrivateDictionary: React.FC<PrivateDictionaryProps> = ({
  phrases,
  onAddPhrase,
  onUpdatePhrase,
  onDeletePhrase,
  onResetDefaults,
  onImportPhrases,
  onSelectPhraseToTest,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [onlyCustomFilter, setOnlyCustomFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhraseId, setEditingPhraseId] = useState<string | null>(null);

  // Form states
  const [formPhrase, setFormPhrase] = useState('');
  const [formTone, setFormTone] = useState('');
  const [formLiteral, setFormLiteral] = useState('');
  const [formEmotional, setFormEmotional] = useState('');
  const [formAction, setFormAction] = useState('');
  const [formDanger, setFormDanger] = useState<DangerLevel>('medio');
  const [formCategory, setFormCategory] = useState<Category>('comunicacion');

  const phraseInputId = useId();
  const toneInputId = useId();
  const literalInputId = useId();
  const emotionalInputId = useId();
  const actionInputId = useId();
  const dangerInputId = useId();
  const categoryInputId = useId();

  const openNewModal = () => {
    sounds.playTypewriter();
    setEditingPhraseId(null);
    setFormPhrase('');
    setFormTone('');
    setFormLiteral('');
    setFormEmotional('');
    setFormAction('');
    setFormDanger('medio');
    setFormCategory('comunicacion');
    setIsModalOpen(true);
  };

  const openEditModal = (phrase: CouplePhrase) => {
    sounds.playTypewriter();
    setEditingPhraseId(phrase.id);
    setFormPhrase(phrase.phrase);
    setFormTone(phrase.toneContext || '');
    setFormLiteral(phrase.literalMeaning);
    setFormEmotional(phrase.emotionalMeaning);
    setFormAction(phrase.recommendedAction);
    setFormDanger(phrase.dangerLevel);
    setFormCategory(phrase.category);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPhrase.trim() || !formEmotional.trim() || !formAction.trim()) return;

    if (editingPhraseId) {
      onUpdatePhrase(editingPhraseId, {
        phrase: formPhrase.trim(),
        toneContext: formTone.trim() || undefined,
        literalMeaning: formLiteral.trim() || 'Significado literal aparente.',
        emotionalMeaning: formEmotional.trim(),
        recommendedAction: formAction.trim(),
        dangerLevel: formDanger,
        category: formCategory,
      });
      sounds.playSuccess();
    } else {
      onAddPhrase({
        phrase: formPhrase.trim(),
        toneContext: formTone.trim() || undefined,
        literalMeaning: formLiteral.trim() || 'Significado literal de las palabras.',
        emotionalMeaning: formEmotional.trim(),
        recommendedAction: formAction.trim(),
        dangerLevel: formDanger,
        category: formCategory,
        isCustom: true,
      });
      sounds.playStamp();
    }
    setIsModalOpen(false);
  };

  // Export JSON
  const handleExportJson = () => {
    sounds.playSuccess();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(phrases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'diccionario-pareja-subtitulos.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportPhrases(parsed);
          sounds.playSuccess();
        }
      } catch {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  // Filter list
  const filteredPhrases = phrases.filter((p) => {
    if (onlyCustomFilter && !p.isCustom) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.phrase.toLowerCase().includes(q) ||
      p.emotionalMeaning.toLowerCase().includes(q) ||
      (p.toneContext && p.toneContext.toLowerCase().includes(q))
    );
  });

  const customCount = phrases.filter(p => p.isCustom).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Session of Peace / Couple Secret Deck Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold uppercase tracking-wider mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Zona Segura • Sesión de Paz y Risas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-50 tracking-tight mb-2">
              El Diccionario Privado de la Pareja
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              El rincón donde ambos, en un momento de calma y buen humor, "alimentan" la app.
              Añadan las frases típicas que se dicen y definan con honestidad radical lo que en verdad significan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
            <button
              onClick={openNewModal}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Añadir Frase Nuestra</span>
            </button>
          </div>
        </div>

        {/* Quick statistics */}
        <div className="mt-6 pt-5 border-t border-stone-800/80 flex flex-wrap items-center gap-6 text-xs text-stone-400">
          <div>
            <span className="font-mono font-bold text-amber-400 text-sm mr-1.5">{customCount}</span>
            <span>Frases creadas por ustedes</span>
          </div>
          <div>
            <span className="font-mono font-bold text-stone-300 text-sm mr-1.5">{phrases.length}</span>
            <span>Frases totales en el catálogo</span>
          </div>
        </div>
      </div>

      {/* Control bar: Search, Custom filter, Backup/Export */}
      <div className="bg-white rounded-2xl p-4 border border-stone-300/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar frase, traducción o tono..."
            className="w-full pl-10 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setOnlyCustomFilter(!onlyCustomFilter)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              onlyCustomFilter
                ? 'bg-purple-100 text-purple-900 border-purple-400'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-purple-600" />
            <span>Solo frases nuestras ({customCount})</span>
          </button>

          <button
            onClick={handleExportJson}
            title="Exportar respaldo de frases a archivo JSON"
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 border border-stone-200 text-xs font-medium flex items-center gap-1"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          <label 
            title="Importar archivo JSON"
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 border border-stone-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Importar</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('¿Restablecer el diccionario a las frases de fábrica originales?')) {
                onResetDefaults();
                sounds.playSuccess();
              }
            }}
            title="Restablecer diccionario por defecto"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 text-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phrases Table / Grid */}
      <div className="space-y-3">
        {filteredPhrases.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 p-6">
            <BookHeart className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-stone-800 font-bold text-lg mb-1">No se encontraron frases</h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-4">
              {onlyCustomFilter
                ? 'Aún no han registrado frases privadas juntos. ¡Presiona "Añadir Frase Nuestra" para comenzar!'
                : 'No hay ninguna frase que coincida con tu búsqueda.'}
            </p>
            {onlyCustomFilter && (
              <button
                onClick={openNewModal}
                className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Crear primera frase de pareja
              </button>
            )}
          </div>
        ) : (
          filteredPhrases.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all hover:shadow-md ${
                item.isCustom ? 'border-purple-200 bg-purple-50/20' : 'border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-serif font-black text-lg text-stone-900">
                      “{item.phrase}”
                    </h3>

                    {item.isCustom ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                        NUESTRA FRASE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        ESTÁNDAR
                      </span>
                    )}

                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                      item.dangerLevel === 'nuclear' || item.dangerLevel === 'critico'
                        ? 'bg-rose-100 text-rose-800'
                        : item.dangerLevel === 'alto'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.dangerLevel}
                    </span>
                  </div>

                  {item.toneContext && (
                    <p className="text-xs text-stone-500 italic mb-2">
                      Modulador: {item.toneContext}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      sounds.playTypewriter();
                      onSelectPhraseToTest(item);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Probar en Decodificador</span>
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900"
                    title="Editar frase"
                    aria-label={`Editar frase ${item.phrase}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {item.isCustom && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la frase "${item.phrase}" de su diccionario privado?`)) {
                          onDeletePhrase(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600"
                      title="Eliminar frase"
                      aria-label={`Eliminar frase ${item.phrase}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Meanings preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-800 block mb-1">
                    ❤️ Lo que realmente significa:
                  </span>
                  <p className="text-stone-800 leading-relaxed font-medium">
                    {item.emotionalMeaning}
                  </p>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <span className="font-bold text-amber-900 block mb-1">
                    💡 Plan de acción recomendado:
                  </span>
                  <p className="text-stone-800 leading-relaxed font-medium">
                    {item.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-stone-200 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3 shrink-0">
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-stone-900">
                  {editingPhraseId ? 'Editar Frase del Diccionario' : 'Añadir Nueva Frase Típica'}
                </h3>
                <p className="text-xs text-stone-500">
                  Escriban con total sinceridad y sentido del humor para subtitularla bien.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 overflow-y-auto pr-1">
              <div>
                <label htmlFor={phraseInputId} className="block text-xs font-bold font-mono uppercase text-stone-600 mb-1">
                  1. Frase que se suele decir *
                </label>
                <input
                  id={phraseInputId}
                  type="text"
                  required
                  value={formPhrase}
                  onChange={(e) => setFormPhrase(e.target.value)}
                  placeholder="Ej: 'Tú haz lo que veas', 'Déjalo, no importa'..."
                  className="w-full px-3.5 py-2.5 text-base border border-stone-300 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={toneInputId} className="block text-xs font-bold font-mono uppercase text-stone-600 mb-1">
                  2. Tono o Modulador gestual (Opcional)
                </label>
                <input
                  id={toneInputId}
                  type="text"
                  value={formTone}
                  onChange={(e) => setFormTone(e.target.value)}
                  placeholder="Ej: Con suspiro dramático, mirando a la nada, con sonrisa helada..."
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={dangerInputId} className="block text-xs font-bold font-mono uppercase text-stone-600 mb-1">
                    Nivel de Alerta / Peligro
                  </label>
                  <select
                    id={dangerInputId}
                    value={formDanger}
                    onChange={(e) => setFormDanger(e.target.value as DangerLevel)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="bajo">DEFCON 5 - Leve (Fricción mínima)</option>
                    <option value="medio">DEFCON 3 - Medio (Precaución)</option>
                    <option value="alto">DEFCON 2 - Alto (Alerta naranja)</option>
                    <option value="critico">DEFCON 1 - Crítico (Zona minada)</option>
                    <option value="nuclear">DEFCON 1 - Nuclear (Peligro extremo)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={categoryInputId} className="block text-xs font-bold font-mono uppercase text-stone-600 mb-1">
                    Categoría
                  </label>
                  <select
                    id={categoryInputId}
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="comunicacion">Comunicación & Palabras clave</option>
                    <option value="emociones">Emociones & Estado anímico</option>
                    <option value="planes">Planes & Salidas</option>
                    <option value="hogar">Hogar & Tareas domésticas</option>
                    <option value="ropa">Ropa & Estilo</option>
                    <option value="comida">Comida & Antojos</option>
                    <option value="celos_curiosidad">Curiosidad & Celos sutiles</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={literalInputId} className="block text-xs font-bold font-mono uppercase text-stone-600 mb-1">
                  3. Traducción Literal de superficie (Opcional)
                </label>
                <input
                  id={literalInputId}
                  type="text"
                  value={formLiteral}
                  onChange={(e) => setFormLiteral(e.target.value)}
                  placeholder="Lo que dice literalmente sin leer entre líneas..."
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={emotionalInputId} className="block text-xs font-bold font-mono uppercase text-rose-700 mb-1">
                  4. Traducción Emocional Honesta (Lo que verdaderamente significa) *
                </label>
                <textarea
                  id={emotionalInputId}
                  required
                  rows={3}
                  value={formEmotional}
                  onChange={(e) => setFormEmotional(e.target.value)}
                  placeholder="Ej: Sí me molesta pero no quiero discutir, necesito que tengas la iniciativa de darme un abrazo o cambiar de plan..."
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:border-amber-500 focus:outline-none bg-rose-50/30"
                />
              </div>

              <div>
                <label htmlFor={actionInputId} className="block text-xs font-bold font-mono uppercase text-amber-800 mb-1">
                  5. Plan de Acción Recomendado (Qué hacer para solucionar el momento) *
                </label>
                <textarea
                  id={actionInputId}
                  required
                  rows={2}
                  value={formAction}
                  onChange={(e) => setFormAction(e.target.value)}
                  placeholder="Ej: No insistas en preguntar '¿por qué?'. Prepárale una taza de té y dile que entiendes su cansancio..."
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:border-amber-500 focus:outline-none bg-amber-50/30"
                />
              </div>

              <div className="pt-3 sticky bottom-0 bg-white/95 backdrop-blur-xs pb-1 flex items-center justify-end gap-3 border-t border-stone-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                >
                  {editingPhraseId ? 'Guardar Cambios' : 'Añadir al Diccionario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
