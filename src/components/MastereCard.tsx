import React from 'react';
import { MastereProgram } from '../types/mastere';
import { Calendar, Users, ArrowUpRight, GraduationCap } from 'lucide-react';

interface MastereCardProps {
  mastere: MastereProgram;
  onSelect: (mastere: MastereProgram) => void;
  onApply: (mastere: MastereProgram) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const MastereCard: React.FC<MastereCardProps> = ({
  mastere,
  onSelect,
  onApply,
  lang,
}) => {
  const isResearch = mastere.type === 'recherche';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header Image */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          <img
            src={mastere.image}
            alt={mastere.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          {/* Top text kicker - no pill, clean typography badge */}
          <div className="absolute top-3 left-3 text-[11px] font-semibold tracking-wide text-white bg-slate-950/60 backdrop-blur-xs px-2.5 py-1 rounded">
            {isResearch ? 'Mastère de Recherche (M.R)' : 'Mastère Professionnel (M.P)'}
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] flex items-center justify-between font-mono">
            <span>{mastere.code}</span>
            <span className="text-amber-300 font-semibold">{mastere.places} places ouvertes</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* University and Faculty clean metadata */}
          <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sky-700">{mastere.faculty}</span>
            <span aria-hidden="true">·</span>
            <span>{mastere.city}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 font-display leading-snug">
            {mastere.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {mastere.description}
          </p>

          {/* Key details */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Délai : <strong className="text-slate-800 font-mono">{mastere.deadline}</strong></span>
            </div>
            <span className="text-sky-800 font-medium text-[11px]">
              {mastere.domain}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelect(mastere)}
          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center whitespace-nowrap"
        >
          {lang === 'tn' ? 'التفاصيل' : 'Critères & Infos'}
        </button>
        <button
          onClick={() => onApply(mastere)}
          className="px-3 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors text-center shadow-2xs whitespace-nowrap"
        >
          {lang === 'tn' ? 'ترشّح توّة' : 'Postuler'}
        </button>
      </div>
    </div>
  );
};
