import React, { useState } from 'react';
import { 
  CandidateApplication, 
  ApplicationStatus 
} from '../types/mastere';
import { 
  X, 
  GitCompare, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Calendar, 
  GraduationCap, 
  User, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Building2,
  Printer
} from 'lucide-react';

interface DossierComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: CandidateApplication[];
  initialAppA: CandidateApplication | null;
  initialAppB: CandidateApplication | null;
  onUpdateStatus: (appId: string, newStatus: ApplicationStatus, note?: string) => void;
  onOpenReceipt: (application: CandidateApplication) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const DossierComparisonModal: React.FC<DossierComparisonModalProps> = ({
  isOpen,
  onClose,
  applications,
  initialAppA,
  initialAppB,
  onUpdateStatus,
  onOpenReceipt,
  lang,
}) => {
  const [appAId, setAppAId] = useState<string>(
    initialAppA?.id || applications[0]?.id || ''
  );
  const [appBId, setAppBId] = useState<string>(
    initialAppB?.id || applications[1]?.id || applications[0]?.id || ''
  );

  React.useEffect(() => {
    if (initialAppA) setAppAId(initialAppA.id);
    if (initialAppB) setAppBId(initialAppB.id);
  }, [initialAppA, initialAppB]);

  if (!isOpen) return null;

  const appA = applications.find(a => a.id === appAId) || applications[0];
  const appB = applications.find(a => a.id === appBId) || applications[1] || applications[0];

  if (!appA || !appB) return null;

  const scoreDiff = Number((appA.score.totalScore - appB.score.totalScore).toFixed(2));
  const isASuperior = scoreDiff > 0;
  const isBSuperior = scoreDiff < 0;
  const isTied = scoreDiff === 0;

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case 'admis': return 'Admis(e) Liste Principale';
      case 'preselectionne': return 'Présélectionné';
      case 'en_examen': return 'En examen';
      case 'liste_attente': return 'Liste d’attente';
      case 'rejete': return 'Non retenu';
      default: return 'Soumis';
    }
  };

  const getStatusClass = (status: ApplicationStatus) => {
    switch (status) {
      case 'admis': return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'preselectionne': return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'en_examen': return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'liste_attente': return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'rejete': return 'bg-rose-50 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="no-print p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-display text-white">
                Comparateur de Candidatures Côte-à-Côte
              </h2>
              <p className="text-[11px] text-slate-400">
                Aide à la délibération et arbitrage du jury pour départager deux dossiers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
              title="Imprimer la fiche comparative"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Candidate Selector Toolbar */}
        <div className="no-print p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Candidate A Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-sky-900 block flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-mono">A</span>
              <span>Candidature A :</span>
            </label>
            <select
              value={appAId}
              onChange={(e) => setAppAId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id} disabled={app.id === appBId}>
                  {app.candidate.prenom} {app.candidate.nom} (CIN: {app.candidate.cin}) — Score: {app.score.totalScore}/20 [{app.id}]
                </option>
              ))}
            </select>
          </div>

          {/* Candidate B Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-900 block flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">B</span>
              <span>Candidature B :</span>
            </label>
            <select
              value={appBId}
              onChange={(e) => setAppBId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id} disabled={app.id === appAId}>
                  {app.candidate.prenom} {app.candidate.nom} (CIN: {app.candidate.cin}) — Score: {app.score.totalScore}/20 [{app.id}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Delta Score Banner */}
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="font-bold text-white text-sm block font-display">
                Écart de Score Global : {Math.abs(scoreDiff)} point{Math.abs(scoreDiff) > 1 ? 's' : ''}
              </span>
              <span className="text-slate-400 text-[11px]">
                {isTied 
                  ? 'Égalité parfaite sur le score total. Examen des notes de 3ème année (L3) et du parcours requis.' 
                  : isASuperior 
                  ? `Avantage à ${appA.candidate.prenom} ${appA.candidate.nom} (+${scoreDiff} pts)`
                  : `Avantage à ${appB.candidate.prenom} ${appB.candidate.nom} (+${Math.abs(scoreDiff)} pts)`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="text-center px-3 py-1 bg-sky-950/60 border border-sky-800 rounded-lg">
              <span className="text-sky-300 text-[10px] block uppercase">Candidat A</span>
              <strong className="text-white text-sm">{appA.score.totalScore} / 20</strong>
            </div>
            <span className="text-slate-500 font-bold">VS</span>
            <div className="text-center px-3 py-1 bg-emerald-950/60 border border-emerald-800 rounded-lg">
              <span className="text-emerald-300 text-[10px] block uppercase">Candidat B</span>
              <strong className="text-white text-sm">{appB.score.totalScore} / 20</strong>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Main 2-Column Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* CANDIDATE A CARD */}
            <div className={`p-5 rounded-2xl border transition-all space-y-5 ${
              isASuperior ? 'bg-sky-50/40 border-sky-300 shadow-sm' : 'bg-slate-50/60 border-slate-200'
            }`}>
              {/* Header Profile A */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-mono">A</span>
                    <span>Dossier : {appA.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {appA.candidate.prenom} {appA.candidate.nom}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    {appA.candidate.prenomAr} {appA.candidate.nomAr} · CIN : <strong className="font-mono">{appA.candidate.cin}</strong>
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold border ${getStatusClass(appA.status)}`}>
                    {getStatusText(appA.status)}
                  </span>
                  <div className="text-xl font-black font-mono text-sky-800">
                    {appA.score.totalScore} <span className="text-xs font-normal text-slate-500">/20</span>
                  </div>
                </div>
              </div>

              {/* Identity & Origin details */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Origine & Contact</div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
                  <div><span className="text-slate-500">Gouvernorat :</span> <strong>{appA.candidate.gouvernorat}</strong></div>
                  <div><span className="text-slate-500">Email :</span> <span className="font-mono text-sky-700">{appA.candidate.email}</span></div>
                  <div><span className="text-slate-500">Téléphone :</span> <span className="font-mono">+216 {appA.candidate.telephone}</span></div>
                  <div><span className="text-slate-500">Établissement :</span> <strong className="truncate block">{appA.licence.etablissement}</strong></div>
                  <div><span className="text-slate-500">Spécialité :</span> <strong className="truncate block">{appA.licence.specialite}</strong></div>
                </div>
              </div>

              {/* Detailed Score Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Détail du Score LMD</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Moyenne LMD base :</span>
                    <strong className="text-slate-900">{appA.score.baseAverage}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sans Redoublement :</span>
                    <strong className="text-emerald-700">+{appA.score.bonusCursusSansRedoublement}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sessions Principales :</span>
                    <strong className="text-emerald-700">+{appA.score.bonusSessionsPrincipales}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mention Diplôme :</span>
                    <strong className="text-emerald-700">+{appA.score.bonusMentionLicence}</strong>
                  </div>
                  {appA.score.penaliteRedoublement > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Pénalité Redoublement :</span>
                      <strong>-{appA.score.penaliteRedoublement}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Licence Years Comparison */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Notes Annuelles de Licence</div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">L1</span>
                    <strong className="text-slate-900 text-xs">{appA.licence.annees[0]?.moyenne}</strong>
                    <span className="text-[9px] text-slate-500 block">{appA.licence.annees[0]?.session === 'principale' ? 'Princ.' : 'Contr.'}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">L2</span>
                    <strong className="text-slate-900 text-xs">{appA.licence.annees[1]?.moyenne}</strong>
                    <span className="text-[9px] text-slate-500 block">{appA.licence.annees[1]?.session === 'principale' ? 'Princ.' : 'Contr.'}</span>
                  </div>
                  <div className={`p-2 bg-white rounded border ${appA.licence.annees[2]?.moyenne > appB.licence.annees[2]?.moyenne ? 'border-sky-400 bg-sky-50/50' : 'border-slate-200'}`}>
                    <span className="text-[10px] text-sky-700 font-bold block">L3 (PFE)</span>
                    <strong className="text-slate-900 text-xs">{appA.licence.annees[2]?.moyenne}</strong>
                    <span className="text-[9px] text-sky-700 font-semibold block">{appA.licence.annees[2]?.mention}</span>
                  </div>
                </div>
              </div>

              {/* Baccalauréat */}
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex justify-between items-center">
                <span className="text-slate-500">Baccalauréat :</span>
                <strong className="text-slate-900">{appA.bac.section} ({appA.bac.moyenne}/20)</strong>
              </div>

              {/* Vœux */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Vœu Principal n°1</div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <strong className="text-sky-800 block">{appA.wishes[0]?.mastereTitle}</strong>
                  <span className="text-[11px] text-slate-500">{appA.wishes[0]?.faculty}</span>
                </div>
              </div>

              {/* Quick Actions for A */}
              <div className="no-print pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onUpdateStatus(appA.id, 'admis', 'Retenu(e) sur Liste Principale suite à délibération comparative.')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Admettre A
                </button>
                <button
                  onClick={() => onUpdateStatus(appA.id, 'liste_attente', 'Placé(e) sur Liste d’Attente suite à arbitrage de score.')}
                  className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Liste d’Attente A
                </button>
                <button
                  onClick={() => onOpenReceipt(appA)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                >
                  Fiche
                </button>
              </div>
            </div>

            {/* CANDIDATE B CARD */}
            <div className={`p-5 rounded-2xl border transition-all space-y-5 ${
              isBSuperior ? 'bg-emerald-50/40 border-emerald-300 shadow-sm' : 'bg-slate-50/60 border-slate-200'
            }`}>
              {/* Header Profile B */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">B</span>
                    <span>Dossier : {appB.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {appB.candidate.prenom} {appB.candidate.nom}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    {appB.candidate.prenomAr} {appB.candidate.nomAr} · CIN : <strong className="font-mono">{appB.candidate.cin}</strong>
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold border ${getStatusClass(appB.status)}`}>
                    {getStatusText(appB.status)}
                  </span>
                  <div className="text-xl font-black font-mono text-emerald-800">
                    {appB.score.totalScore} <span className="text-xs font-normal text-slate-500">/20</span>
                  </div>
                </div>
              </div>

              {/* Identity & Origin details */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Origine & Contact</div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
                  <div><span className="text-slate-500">Gouvernorat :</span> <strong>{appB.candidate.gouvernorat}</strong></div>
                  <div><span className="text-slate-500">Email :</span> <span className="font-mono text-sky-700">{appB.candidate.email}</span></div>
                  <div><span className="text-slate-500">Téléphone :</span> <span className="font-mono">+216 {appB.candidate.telephone}</span></div>
                  <div><span className="text-slate-500">Établissement :</span> <strong className="truncate block">{appB.licence.etablissement}</strong></div>
                  <div><span className="text-slate-500">Spécialité :</span> <strong className="truncate block">{appB.licence.specialite}</strong></div>
                </div>
              </div>

              {/* Detailed Score Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Détail du Score LMD</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Moyenne LMD base :</span>
                    <strong className="text-slate-900">{appB.score.baseAverage}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sans Redoublement :</span>
                    <strong className="text-emerald-700">+{appB.score.bonusCursusSansRedoublement}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sessions Principales :</span>
                    <strong className="text-emerald-700">+{appB.score.bonusSessionsPrincipales}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mention Diplôme :</span>
                    <strong className="text-emerald-700">+{appB.score.bonusMentionLicence}</strong>
                  </div>
                  {appB.score.penaliteRedoublement > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Pénalité Redoublement :</span>
                      <strong>-{appB.score.penaliteRedoublement}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Licence Years Comparison */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Notes Annuelles de Licence</div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">L1</span>
                    <strong className="text-slate-900 text-xs">{appB.licence.annees[0]?.moyenne}</strong>
                    <span className="text-[9px] text-slate-500 block">{appB.licence.annees[0]?.session === 'principale' ? 'Princ.' : 'Contr.'}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">L2</span>
                    <strong className="text-slate-900 text-xs">{appB.licence.annees[1]?.moyenne}</strong>
                    <span className="text-[9px] text-slate-500 block">{appB.licence.annees[1]?.session === 'principale' ? 'Princ.' : 'Contr.'}</span>
                  </div>
                  <div className={`p-2 bg-white rounded border ${appB.licence.annees[2]?.moyenne > appA.licence.annees[2]?.moyenne ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200'}`}>
                    <span className="text-[10px] text-emerald-700 font-bold block">L3 (PFE)</span>
                    <strong className="text-slate-900 text-xs">{appB.licence.annees[2]?.moyenne}</strong>
                    <span className="text-[9px] text-emerald-700 font-semibold block">{appB.licence.annees[2]?.mention}</span>
                  </div>
                </div>
              </div>

              {/* Baccalauréat */}
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs flex justify-between items-center">
                <span className="text-slate-500">Baccalauréat :</span>
                <strong className="text-slate-900">{appB.bac.section} ({appB.bac.moyenne}/20)</strong>
              </div>

              {/* Vœux */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Vœu Principal n°1</div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <strong className="text-emerald-800 block">{appB.wishes[0]?.mastereTitle}</strong>
                  <span className="text-[11px] text-slate-500">{appB.wishes[0]?.faculty}</span>
                </div>
              </div>

              {/* Quick Actions for B */}
              <div className="no-print pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onUpdateStatus(appB.id, 'admis', 'Retenu(e) sur Liste Principale suite à délibération comparative.')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Admettre B
                </button>
                <button
                  onClick={() => onUpdateStatus(appB.id, 'liste_attente', 'Placé(e) sur Liste d’Attente suite à arbitrage de score.')}
                  className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Liste d’Attente B
                </button>
                <button
                  onClick={() => onOpenReceipt(appB)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                >
                  Fiche
                </button>
              </div>
            </div>

          </div>

          {/* Academic Tie-breaking Guide for the Commission */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Award className="w-4 h-4 text-sky-700" />
              <span>Règles Officielles de Départage en Cas d'Égalité (Circulaire MESRS) :</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
              <li>Priorité au candidat ayant obtenu la plus forte moyenne en <strong>3ème année de Licence (L3)</strong>.</li>
              <li>En cas de nouvelle égalité, priorité au candidat ayant validé l'ensemble de son cursus en <strong>Session Principale</strong> sans redoublement.</li>
              <li>En cas d'égalité persistante, examen de la <strong>moyenne du Baccalauréat</strong> et de la mention obtenue.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Délibération collégiale de la commission de mastère</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            Fermer la Comparaison
          </button>
        </div>
      </div>
    </div>
  );
};
