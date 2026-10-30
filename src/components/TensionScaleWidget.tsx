import React from 'react';
import { Flame, Gauge, AlertCircle, Sparkles } from 'lucide-react';
import { getTensionDetails, TENSION_PRESETS } from '../utils/tensionEngine';
import { sounds } from '../utils/soundEffects';

interface TensionScaleWidgetProps {
  value: number;
  onChange: (value: number) => void;
}

export const TensionScaleWidget: React.FC<TensionScaleWidgetProps> = ({
  value,
  onChange,
}) => {
  const details = getTensionDetails(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange(val);
    sounds.playTypewriter();
  };

  const handlePresetClick = (presetVal: number) => {
    onChange(presetVal);
    sounds.playStamp();
  };

  return (
    <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 mt-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <label htmlFor="tension-range-slider" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 block">
              Escala de Tensión del Momento:
            </label>
            <span className="text-[11px] text-stone-500">
              ¿Qué tan intenso o cargado se siente el ambiente ahora mismo?
            </span>
          </div>
        </div>

        {/* Dynamic Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono border ${details.badgeBg}`}>
            <span>{details.emoji}</span>
            <span>Nivel {details.level}/10</span>
            <span>•</span>
            <span className="truncate max-w-[140px] sm:max-w-none">{details.label.split('•')[0].trim()}</span>
          </span>
        </div>
      </div>

      {/* The Slider Input */}
      <div className="relative py-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mb-1 px-1">
          <span>1 (Paz total)</span>
          <span className="hidden sm:inline">5 (Tensa)</span>
          <span>10 (Nuclear)</span>
        </div>

        <input
          id="tension-range-slider"
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={handleSliderChange}
          aria-label="Escala de tensión del momento del 1 al 10"
          className="w-full h-3 bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-rose-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
        />

        {/* Numbers scale ticks */}
        <div className="flex justify-between items-center text-[11px] font-mono font-bold text-stone-500 mt-1 px-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handlePresetClick(num)}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                value === num
                  ? 'bg-stone-900 text-white font-black scale-110 shadow-xs'
                  : 'hover:text-stone-900 text-stone-400'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Status Quote and Emergency Precaution */}
      <div className="mt-3 pt-3 border-t border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <p className="text-stone-600 italic">
          <strong className="text-stone-800 not-italic font-semibold mr-1">Diagnóstico ambiental:</strong>
          {details.statusQuote}
        </p>

        {/* Fast presets buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono uppercase text-stone-400 mr-0.5 hidden xs:inline">Accesos:</span>
          {TENSION_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => handlePresetClick(p.value)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all ${
                value === p.value
                  ? 'bg-stone-800 text-white border-stone-800 font-bold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
