import React from 'react';
import { DangerLevel } from '../types';

interface InstitutionalStampProps {
  level: DangerLevel;
  code: string;
}

export const InstitutionalStamp: React.FC<InstitutionalStampProps> = ({ level, code }) => {
  const isHighDanger = level === 'alto' || level === 'critico' || level === 'nuclear';

  return (
    <div className="relative inline-block select-none opacity-90 transform -rotate-3 hover:rotate-0 transition-transform">
      <div 
        className={`border-2 border-dashed rounded-lg p-2.5 font-mono text-center uppercase tracking-widest ${
          isHighDanger ? 'border-rose-700/80 text-rose-800 bg-rose-50/50' : 'border-amber-700/80 text-amber-800 bg-amber-50/50'
        }`}
      >
        <div className="text-[9px] font-bold border-b border-current pb-0.5 mb-1 tracking-wider">
          ★ CERTIFICADO OFICIAL DE PAREJA ★
        </div>
        <div className="text-sm font-extrabold flex items-center justify-center gap-1.5">
          <span>{code}</span>
          <span>•</span>
          <span className="text-[10px]">DICTAMEN RAE-P</span>
        </div>
        <div className="text-[8px] tracking-tight mt-0.5">
          DESACTIVACIÓN RECOMENDADA INMEDIATA
        </div>
      </div>
    </div>
  );
};
