import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  HeartPulse,
  TrendingUp,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { ConflictIncident, CouplePhrase } from '../types';
import {
  computeCategoryStats,
  computeDangerStats,
  computeTensionIndex,
  getMostFrequentPhrase,
  CATEGORY_LABELS,
  DANGER_COLORS
} from '../utils/statsEngine';
import { sounds } from '../utils/soundEffects';

interface ConflictStatsProps {
  incidents: ConflictIncident[];
  dictionary: CouplePhrase[];
  onAddIncident: (phrase: string) => void;
  onToggleResolveIncident: (id: string) => void;
  onResetIncidents: () => void;
}

export const ConflictStats: React.FC<ConflictStatsProps> = ({
  incidents,
  dictionary,
  onAddIncident,
  onToggleResolveIncident,
  onResetIncidents,
}) => {
  const [chartView, setChartView] = useState<'both' | 'bar' | 'pie'>('both');
  const [quickPhraseInput, setQuickPhraseInput] = useState('');

  const categoryStats = computeCategoryStats(incidents);
  const dangerStats = computeDangerStats(incidents);
  const tension = computeTensionIndex(incidents);
  const topPhrase = getMostFrequentPhrase(incidents);
  const resolvedCount = incidents.filter(i => i.resolved).length;
  const resolutionRate = incidents.length > 0 ? Math.round((resolvedCount / incidents.length) * 100) : 100;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhraseInput.trim()) return;
    onAddIncident(quickPhraseInput.trim());
    setQuickPhraseInput('');
    sounds.playStamp();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Institutional Observatory Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
          <span>Observatorio Estadístico de Fricciones Conyugales</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight mb-2">
          Estadísticas del Conflicto
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Métricas y análisis de frecuencia de las indirectas emitidas en el hogar. Un registro gráfico para reírse juntos de los patrones habituales y desactivarlos a tiempo.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Tension Index */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold">Índice de Tensión</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-black font-serif text-stone-900">{tension.score}</span>
              <span className="text-xs text-stone-500 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${tension.score}%` }}
              />
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md inline-block w-fit ${tension.badgeColor}`}>
            {tension.status}
          </span>
        </div>

        {/* Metric 2: Top Recurring Phrase */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold">Indirecta Campeona</span>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-base font-serif font-bold text-stone-900 line-clamp-2 leading-snug">
              {topPhrase ? `“${topPhrase.phrase}”` : 'Sin registros'}
            </p>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Registrada <strong className="text-stone-800">{topPhrase?.count || 0} veces</strong> en el historial.
          </p>
        </div>

        {/* Metric 3: Total Incidents */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold">Total Indirectas</span>
              <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-serif text-stone-900">{incidents.length}</span>
              <span className="text-xs text-stone-500 font-mono">interacciones</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            En el catálogo general de la relación.
          </p>
        </div>

        {/* Metric 4: Resolution Rate */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold">Tasa de Desactivación</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-serif text-emerald-700">{resolutionRate}%</span>
              <span className="text-xs text-stone-500 font-mono">resueltas con éxito</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            {resolvedCount} de {incidents.length} solucionadas con diplomacia.
          </p>
        </div>
      </div>

      {/* Chart View Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700 mr-1">Visualización de Gráficos:</span>
          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            <button
              onClick={() => {
                sounds.playTypewriter();
                setChartView('both');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                chartView === 'both' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Ambos Gráficos
            </button>
            <button
              onClick={() => {
                sounds.playTypewriter();
                setChartView('bar');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                chartView === 'bar' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Solo Barras</span>
            </button>
            <button
              onClick={() => {
                sounds.playTypewriter();
                setChartView('pie');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                chartView === 'pie' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Solo Pastel</span>
            </button>
          </div>
        </div>

        {/* Quick Log Form */}
        <form onSubmit={handleQuickAdd} className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={quickPhraseInput}
            onChange={(e) => setQuickPhraseInput(e.target.value)}
            className="text-xs border border-stone-300 rounded-xl px-2.5 py-1.5 bg-stone-50 text-stone-800 focus:outline-none focus:border-amber-500 flex-1 sm:w-60"
          >
            <option value="">+ Registrar incidencia rápida...</option>
            {dictionary.map(d => (
              <option key={d.id} value={d.phrase}>
                “{d.phrase}” ({d.category})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!quickPhraseInput}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Anotar</span>
          </button>
        </form>
      </div>

      {/* Main Charts Area */}
      <div className={`grid gap-6 mb-8 ${chartView === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Chart 1: Bar Chart by Category */}
        {(chartView === 'both' || chartView === 'bar') && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-black text-lg text-stone-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span>Frecuencia por Tipo de Indirecta</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Cantidad de incidentes categorizados por ámbito conyugal
                </p>
              </div>
              <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded uppercase font-bold">
                Gráfico de Barras
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    interval={0} 
                    angle={-25} 
                    textAnchor="end" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white text-xs rounded-xl p-2.5 shadow-lg border border-stone-700">
                            <p className="font-bold flex items-center gap-1.5">
                              <span>{data.icon}</span>
                              <span>{data.name}</span>
                            </p>
                            <p className="text-amber-300 font-mono text-sm mt-0.5">
                              {data.count} {data.count === 1 ? 'incidencia' : 'incidencias'} ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Micro legend */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-600">
              {categoryStats.map((item) => (
                <div key={item.category} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}: <strong>{item.count}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart 2: Pie / Pastel Chart */}
        {(chartView === 'both' || chartView === 'pie') && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-black text-lg text-stone-900 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-rose-500" />
                  <span>Distribución Porcentual del Conflicto</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Proporción de cada categoría en el pastel de malentendidos
                </p>
              </div>
              <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded uppercase font-bold">
                Gráfico de Pastel
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats.filter(c => c.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    label={(entry) => `${entry.name || ''} (${Math.round((entry.percent || 0) * 100)}%)`}
                    labelLine={false}
                  >
                    {categoryStats.filter(c => c.count > 0).map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white text-xs rounded-xl p-2.5 shadow-lg border border-stone-700">
                            <p className="font-bold flex items-center gap-1.5">
                              <span>{data.icon}</span>
                              <span>{data.name}</span>
                            </p>
                            <p className="text-amber-300 font-mono text-sm mt-0.5">
                              {data.count} incidencias ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-stone-700 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Danger Level Distribution (DEFCON Breakdown) */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-7 mb-8 border border-stone-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-800">
          <div>
            <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-widest block mb-1">
              Desglose de Gravedad
            </span>
            <h3 className="text-xl font-serif font-black text-stone-100">
              Distribución por Nivel de Alerta DEFCON
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            Basado en las directrices de mediación institucional
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {dangerStats.map((item) => (
            <div key={item.level} className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-black uppercase" style={{ color: item.color }}>
                    {item.defcon}
                  </span>
                  <span className="text-xs text-stone-400">{item.percentage}%</span>
                </div>
                <div className="text-2xl font-black font-serif text-white">
                  {item.count}
                </div>
              </div>
              <div className="w-full bg-stone-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Log and Reset Controls */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-stone-600" />
            <h3 className="font-serif font-black text-lg text-stone-900">
              Bitácora de Incidentes Recientes
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('¿Restablecer el historial de estadísticas a las incidencias iniciales de prueba?')) {
                  onResetIncidents();
                  sounds.playSuccess();
                }
              }}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-100 border border-stone-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Historial</span>
            </button>
          </div>
        </div>

        {incidents.length === 0 ? (
          <p className="text-sm text-stone-500 italic py-6 text-center">
            No hay incidentes registrados aún. Las búsquedas en el decodificador o el botón de registro rápido nutrirán esta bitácora.
          </p>
        ) : (
          <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
            {incidents.slice(0, 10).map((inc) => {
              const catMeta = CATEGORY_LABELS[inc.category];
              return (
                <div key={inc.id} className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        sounds.playTypewriter();
                        onToggleResolveIncident(inc.id);
                      }}
                      title={inc.resolved ? 'Marcar como pendiente' : 'Marcar como resuelta con diplomacia'}
                      className={`p-1.5 rounded-full transition-colors ${
                        inc.resolved ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-stone-400 bg-stone-100 hover:bg-amber-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <span className={`font-semibold text-sm ${inc.resolved ? 'text-stone-900' : 'text-stone-700'}`}>
                        “{inc.phrase}”
                      </span>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <span>{catMeta?.icon}</span>
                          <span>{catMeta?.label}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px] uppercase font-bold" style={{ color: DANGER_COLORS[inc.dangerLevel]?.color }}>
                          {inc.dangerLevel}
                        </span>
                        <span>•</span>
                        <span>{new Date(inc.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inc.resolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {inc.resolved ? 'Resuelta con amor' : 'En proceso'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
