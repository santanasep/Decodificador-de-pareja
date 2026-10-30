import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchDecoder } from './components/SearchDecoder';
import { TranslationResult } from './components/TranslationResult';
import { PrivateDictionary } from './components/PrivateDictionary';
import { ConflictStats } from './components/ConflictStats';
import { AchievementsView } from './components/AchievementsView';
import { SuggestPhraseModal } from './components/SuggestPhraseModal';
import { CouplePhrase, ActiveScreen, ConflictIncident } from './types';
import { DEFAULT_DICTIONARY } from './data/defaultDictionary';
import { searchDictionary, generateFallbackAnalysis } from './utils/decoderEngine';
import { INITIAL_SEED_INCIDENTS } from './utils/statsEngine';
import { computeAchievements } from './utils/achievementsEngine';
import { sounds } from './utils/soundEffects';

const STORAGE_KEY = 'decodificador_pareja_dict_v1';
const INCIDENTS_KEY = 'decodificador_incidents_v1';
const SOUND_KEY = 'decodificador_pareja_sound_v1';

export default function App() {
  const [dictionary, setDictionary] = useState<CouplePhrase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_DICTIONARY;
  });

  const [incidents, setIncidents] = useState<ConflictIncident[]>(() => {
    try {
      const saved = localStorage.getItem(INCIDENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_SEED_INCIDENTS;
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('search');
  const [currentResult, setCurrentResult] = useState<CouplePhrase | null>(null);
  const [userTone, setUserTone] = useState<string>('');
  const [userTensionLevel, setUserTensionLevel] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  // Suggest modal state
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestPrefillPhrase, setSuggestPrefillPhrase] = useState('');

  // Persist dictionary changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dictionary));
    } catch {
      // ignore
    }
  }, [dictionary]);

  // Persist conflict incidents
  useEffect(() => {
    try {
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    } catch {
      // ignore
    }
  }, [incidents]);

  // Handle URL parameters if any (for instant testing or sharing)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const phraseParam = urlParams.get('q') || urlParams.get('phrase');
    if (phraseParam) {
      handleDecode(phraseParam);
    }
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    try {
      localStorage.setItem(SOUND_KEY, String(next));
    } catch {
      // ignore
    }
  };

  const handleDecode = (phraseText: string, tone?: string, tension?: number) => {
    setUserTone(tone || '');
    if (tension !== undefined) {
      setUserTensionLevel(tension);
    }
    const { bestMatch } = searchDictionary(phraseText, dictionary);

    const resolvedPhrase = bestMatch || generateFallbackAnalysis(phraseText);
    setCurrentResult(resolvedPhrase);
    sounds.playAlert(resolvedPhrase.dangerLevel);

    // Record incident in conflict statistics
    const newIncident: ConflictIncident = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      phrase: resolvedPhrase.phrase,
      category: resolvedPhrase.category,
      dangerLevel: resolvedPhrase.dangerLevel,
      timestamp: Date.now(),
      resolved: false,
    };
    setIncidents((prev) => [newIncident, ...prev]);

    setActiveScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dictionary management handlers
  const handleAddPhrase = (newPhrase: Omit<CouplePhrase, 'id' | 'createdAt'>) => {
    const phraseWithId: CouplePhrase = {
      ...newPhrase,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      isCustom: true,
    };
    setDictionary((prev) => [phraseWithId, ...prev]);
  };

  const handleUpdatePhrase = (id: string, updatedFields: Partial<CouplePhrase>) => {
    setDictionary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const handleDeletePhrase = (id: string) => {
    setDictionary((prev) => prev.filter((item) => item.id !== id));
    sounds.playStamp();
  };

  const handleResetDefaults = () => {
    setDictionary(DEFAULT_DICTIONARY);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleImportPhrases = (imported: CouplePhrase[]) => {
    setDictionary(imported);
  };

  const handleOpenSuggestModal = (prefill: string) => {
    setSuggestPrefillPhrase(prefill);
    setIsSuggestModalOpen(true);
  };

  const handleGoToDictionaryToDefine = (phrase: string) => {
    setActiveScreen('dictionary');
    // Scroll or trigger
  };

  const handleAddIncident = (phraseText: string) => {
    const { bestMatch } = searchDictionary(phraseText, dictionary);
    const resolvedPhrase = bestMatch || generateFallbackAnalysis(phraseText);
    const newInc: ConflictIncident = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      phrase: resolvedPhrase.phrase,
      category: resolvedPhrase.category,
      dangerLevel: resolvedPhrase.dangerLevel,
      timestamp: Date.now(),
      resolved: false,
    };
    setIncidents((prev) => [newInc, ...prev]);
  };

  const handleToggleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, resolved: !i.resolved } : i))
    );
  };

  const handleResetIncidents = () => {
    setIncidents(INITIAL_SEED_INCIDENTS);
    localStorage.removeItem(INCIDENTS_KEY);
  };

  const customPhrasesCount = dictionary.filter((p) => p.isCustom).length;
  const achievements = computeAchievements(incidents, dictionary);
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans antialiased flex flex-col selection:bg-amber-200 selection:text-stone-900">
      <Header
        currentScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        customPhrasesCount={customPhrasesCount}
        unlockedAchievementsCount={unlockedAchievementsCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1">
        {activeScreen === 'search' && (
          <SearchDecoder
            dictionary={dictionary}
            onDecode={handleDecode}
            onOpenSuggestModal={handleOpenSuggestModal}
          />
        )}

        {activeScreen === 'result' && currentResult && (
          <TranslationResult
            phrase={currentResult}
            userToneOverride={userTone}
            userTensionLevel={userTensionLevel}
            onBackToSearch={() => setActiveScreen('search')}
            onOpenSuggestModal={handleOpenSuggestModal}
          />
        )}

        {activeScreen === 'dictionary' && (
          <PrivateDictionary
            phrases={dictionary}
            onAddPhrase={handleAddPhrase}
            onUpdatePhrase={handleUpdatePhrase}
            onDeletePhrase={handleDeletePhrase}
            onResetDefaults={handleResetDefaults}
            onImportPhrases={handleImportPhrases}
            onSelectPhraseToTest={(selected) => {
              setCurrentResult(selected);
              setUserTone(selected.toneContext || '');
              sounds.playAlert(selected.dangerLevel);
              setActiveScreen('result');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeScreen === 'stats' && (
          <ConflictStats
            incidents={incidents}
            dictionary={dictionary}
            onAddIncident={handleAddIncident}
            onToggleResolveIncident={handleToggleResolveIncident}
            onResetIncidents={handleResetIncidents}
          />
        )}

        {activeScreen === 'achievements' && (
          <AchievementsView
            incidents={incidents}
            dictionary={dictionary}
            onNavigateToDecoder={() => setActiveScreen('search')}
            onNavigateToDictionary={() => setActiveScreen('dictionary')}
            onResolvePendingIncident={handleToggleResolveIncident}
          />
        )}
      </main>

      <SuggestPhraseModal
        isOpen={isSuggestModalOpen}
        phrase={suggestPrefillPhrase}
        onClose={() => setIsSuggestModalOpen(false)}
        onGoToDictionaryToDefine={handleGoToDictionaryToDefine}
      />

      {/* Official Footer with comedic institutional footer credentials */}
      <footer className="border-t border-stone-200 bg-white py-6 px-4 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <div>
            <p className="font-serif font-bold text-stone-800">
              Decodificador Oficial de Pareja • DRAEI
            </p>
            <p className="text-[11px] text-stone-500">
              Diseñado para desactivar discusiones con honestidad, risas y empatía.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => {
                sounds.playTypewriter();
                setActiveScreen('search');
              }}
              className="hover:text-stone-900 underline"
            >
              Buscador
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playTypewriter();
                setActiveScreen('dictionary');
              }}
              className="hover:text-stone-900 underline"
            >
              Diccionario Privado
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playTypewriter();
                setActiveScreen('stats');
              }}
              className="hover:text-stone-900 underline font-semibold text-amber-700"
            >
              Estadísticas
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playTypewriter();
                setActiveScreen('achievements');
              }}
              className="hover:text-stone-900 underline font-semibold text-amber-700"
            >
              Logros & Medallas
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenSuggestModal('nueva frase')}
              className="hover:text-stone-900 underline"
            >
              Avisar a Pareja
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
