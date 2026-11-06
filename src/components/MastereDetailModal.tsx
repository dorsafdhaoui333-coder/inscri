import React from 'react';
import { X, Calendar, MapPin, Users, BookOpen, CheckCircle, Mail, UserCheck, ArrowRight, Award } from 'lucide-react';
import { MastereProgram } from '../types/mastere';

interface MastereDetailModalProps {
  mastere: MastereProgram | null;
  onClose: () => void;
  onApply: (mastere: MastereProgram) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const MastereDetailModal: React.FC<MastereDetailModalProps> = ({
  mastere,
  onClose,
  onApply,
  lang,
}) => {
  if (!mastere) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header with Master photo and title */}
        <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden rounded-t-2xl">
          <img
            src={mastere.image}
            alt={mastere.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <span className="uppercase tracking-wider">
                {mastere.type === 'recherche' ? 'Mastère de Recherche' : 'Mastère Professionnel'}
              </span>
              <span>·</span>
              <span>{mastere.code}</span>
              <span>·</span>
              <span>{mastere.domain}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display leading-snug">
              {mastere.title}
            </h2>
            <p className="text-xs text-slate-300">
              {mastere.faculty} — {mastere.university}
            </p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick info row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 block">Capacité d’accueil</span>
              <span className="font-bold text-slate-900 text-sm font-mono tabular-nums">{mastere.places} places</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date Limite</span>
              <span className="font-bold text-rose-700 text-sm font-mono">{mastere.deadline}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Localisation</span>
              <span className="font-bold text-slate-900 text-sm">{mastere.city}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Durée</span>
              <span className="font-bold text-slate-900 text-sm">2 Ans (M1 + M2)</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
              Objectifs & Présentation de la formation
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {mastere.description}
            </p>
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
              Diplômes & Prérequis Requis
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {mastere.prerequisites.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scoring formula note */}
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider">
              <Award className="w-4 h-4 text-sky-700" />
              <span>Critère & Formule de calcul du Score</span>
            </div>
            <p className="text-xs text-sky-800 font-mono leading-relaxed">
              {mastere.formulaDescription}
            </p>
          </div>

          {/* Career opportunities */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
              Débouchés Professionnels & Académiques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
              {mastere.careerOpportunities.map((op, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                  <span className="text-xs font-medium">{op}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact and Coordinator */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block">Responsable de Mastère</span>
              <span className="font-semibold text-slate-900">{mastere.coordinator}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact commission</span>
              <a href={`mailto:${mastere.contactEmail}`} className="font-mono text-sky-700 hover:underline">
                {mastere.contactEmail}
              </a>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onApply(mastere);
                onClose();
              }}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <span>{lang === 'tn' ? 'اخترت هذا الماستير' : 'Postuler à ce mastère'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
