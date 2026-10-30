import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageCircle, AlertCircle, Heart } from 'lucide-react';
import { generatePartnerAlertMessage } from '../utils/decoderEngine';
import { sounds } from '../utils/soundEffects';

interface SuggestPhraseModalProps {
  phrase: string;
  isOpen: boolean;
  onClose: () => void;
  onGoToDictionaryToDefine?: (phrase: string) => void;
}

export const SuggestPhraseModal: React.FC<SuggestPhraseModalProps> = ({
  phrase,
  isOpen,
  onClose,
  onGoToDictionaryToDefine,
}) => {
  const [copied, setCopied] = useState(false);
  const [customPhrase, setCustomPhrase] = useState(phrase || '');

  if (!isOpen) return null;

  const currentPhrase = customPhrase.trim() || phrase || 'esa frase misteriosa';
  const notificationText = generatePartnerAlertMessage(currentPhrase);

  const handleCopy = async () => {
    sounds.playSuccess();
    try {
      await navigator.clipboard.writeText(notificationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleOpenWhatsApp = () => {
    sounds.playSuccess();
    const encoded = encodeURIComponent(notificationText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <MessageCircle className="w-5 h-5" />
            </span>
            <h3 className="font-serif font-black text-xl text-stone-900">
              Notificar a tu Pareja
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
          Envíale este mensaje con humor a tu pareja para desarmar la tensión y pedirle que entre al Diccionario Privado a explicar qué quiso decir:
        </p>

        {/* Edit phrase input */}
        <div className="mb-4">
          <label className="block text-xs font-mono font-bold uppercase text-stone-500 mb-1">
            Indirecta detectada:
          </label>
          <input
            type="text"
            value={customPhrase}
            onChange={(e) => setCustomPhrase(e.target.value)}
            placeholder="¿Qué te acaba de decir?"
            className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Message preview card */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-5 relative">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Mensaje listo para enviar:</span>
            <span className="text-emerald-700 font-bold">100% Empático</span>
          </div>
          <div className="font-sans text-sm text-stone-800 whitespace-pre-line leading-relaxed bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
            {notificationText}
          </div>
        </div>

        {/* Primary Actions */}
        <div className="space-y-2">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Enviar por WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">¡Texto Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar texto para enviar por otra vía</span>
              </>
            )}
          </button>

          {onGoToDictionaryToDefine && (
            <button
              onClick={() => {
                onGoToDictionaryToDefine(currentPhrase);
                onClose();
              }}
              className="w-full py-2 px-3 text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center justify-center gap-1.5 mt-2"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>O prefiero definirla yo mismo/a en el Diccionario ahora</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
