import React, { useState } from 'react';
import { Search, CheckCircle, Clock, AlertTriangle, FileText, Printer, Building2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { CandidateApplication, ApplicationStatus } from '../types/mastere';
import { formatCIN } from '../utils/scoreCalculator';

interface SuiviDossierProps {
  applications: CandidateApplication[];
  onOpenReceipt: (application: CandidateApplication) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const SuiviDossier: React.FC<SuiviDossierProps> = ({
  applications,
  onOpenReceipt,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(applications[0] || null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const clean = searchQuery.trim().toLowerCase();
    if (!clean) return;

    const found = applications.find(
      app => app.candidate.cin.toLowerCase() === clean || app.id.toLowerCase() === clean
    );
    setSelectedApp(found || null);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'admis':
        return { label: 'Admis(e) sur Liste Principale', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' };
      case 'preselectionne':
        return { label: 'Présélectionné(e) (Dossier Papier Convoqué)', color: 'text-sky-800 bg-sky-50 border-sky-300' };
      case 'en_examen':
        return { label: 'En cours d’évaluation par le Jury', color: 'text-amber-800 bg-amber-50 border-amber-300' };
      case 'liste_attente':
        return { label: 'Inscrit(e) sur Liste d’Attente', color: 'text-orange-800 bg-orange-50 border-orange-300' };
      case 'rejete':
        return { label: 'Dossier Non Retenu', color: 'text-rose-800 bg-rose-50 border-rose-300' };
      default:
        return { label: 'Dossier Déposé (En attente)', color: 'text-slate-800 bg-slate-100 border-slate-300' };
    }
  };

  // Pipeline step order
  const steps: { key: string; label: string }[] = [
    { key: 'soumis', label: '1. Dépôt Numérique' },
    { key: 'en_examen', label: '2. Examen Jurys' },
    { key: 'preselectionne', label: '3. Présélection' },
    { key: 'decision', label: '4. Résultat Final' },
  ];

  const getStepState = (currentStatus: ApplicationStatus, stepKey: string) => {
    if (currentStatus === 'rejete') return 'rejected';
    if (stepKey === 'soumis') return 'completed';
    if (stepKey === 'en_examen') {
      return ['en_examen', 'preselectionne', 'entretien', 'admis', 'liste_attente'].includes(currentStatus)
        ? 'completed'
        : 'pending';
    }
    if (stepKey === 'preselectionne') {
      return ['preselectionne', 'entretien', 'admis', 'liste_attente'].includes(currentStatus)
        ? 'completed'
        : 'pending';
    }
    if (stepKey === 'decision') {
      return ['admis', 'liste_attente'].includes(currentStatus) ? 'completed' : 'pending';
    }
    return 'pending';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
          Espace Candidat · Suivi National
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
          Suivi de Dossier & Résultats des Mastères
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-xl">
          Consultez l’état d’avancement de votre candidature, les convocations aux entretiens et téléchargez vos attestations d’admission.
        </p>
      </div>

      {/* Search Bar & Quick Demo Candidates */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Saisissez votre N° CIN (8 chiffres) ou N° de Dossier (ex: MST-2026-TUN-08421)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs whitespace-nowrap"
          >
            Rechercher mon Dossier
          </button>
        </form>

        {/* Quick Demo Candidates Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Dossiers exemples pour tester :</span>
          {applications.slice(0, 3).map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setSelectedApp(app);
                setSearchQuery(app.candidate.cin);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-mono text-[11px]"
            >
              CIN: {app.candidate.cin} ({app.candidate.prenom} {app.candidate.nom})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Dossier Detail View */}
      {selectedApp ? (
        <div className="space-y-6">
          {/* Top Status Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>Dossier : <strong className="text-slate-900">{selectedApp.id}</strong></span>
                  <span>·</span>
                  <span>Déposé le : {selectedApp.dateSoumission}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display mt-1">
                  Candidat : {selectedApp.candidate.prenom} {selectedApp.candidate.nom} ({selectedApp.candidate.prenomAr} {selectedApp.candidate.nomAr})
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  CIN : <strong className="font-mono">{selectedApp.candidate.cin}</strong> · Score officiel : <strong className="font-mono text-sky-800 font-bold">{selectedApp.score.totalScore}/20</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenReceipt(selectedApp)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Imprimer le Récépissé</span>
                </button>
              </div>
            </div>

            {/* Stepper Pipeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {steps.map((st) => {
                const state = getStepState(selectedApp.status, st.key);
                return (
                  <div
                    key={st.key}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      state === 'completed'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {state === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <span className="text-xs font-bold font-display block leading-tight">
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Commission Note / Directive */}
            <div className={`p-5 rounded-xl border ${getStatusBadge(selectedApp.status).color} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Décision Actuelle de la Commission : {getStatusBadge(selectedApp.status).label}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {selectedApp.statusNote || 'Votre dossier est sous examen par les jurys universitaires.'}
              </p>

              {selectedApp.dateEntretien && (
                <div className="mt-3 pt-3 border-t border-sky-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>Date & Heure : <strong>{selectedApp.dateEntretien}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>Lieu : <strong>{selectedApp.salleEntretien || 'Département Universitaire'}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Wishes and Ranked Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-display">
                Vœux de Mastères Déposés
              </h4>
              <div className="space-y-2">
                {selectedApp.wishes.map((w) => (
                  <div
                    key={w.priority}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold font-mono text-xs shrink-0">
                        {w.priority}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{w.mastereTitle}</div>
                        <div className="text-slate-500 text-[11px]">{w.faculty} — {w.university}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      Score : {selectedApp.score.totalScore}/20
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents checklist */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-display">
                Pièces Justificatives Déposées ({selectedApp.documents.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedApp.documents.map((doc) => (
                  <div key={doc.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{doc.label}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                      Vérifié
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 font-display">
            {hasSearched ? 'Aucun dossier trouvé pour cette recherche' : 'Recherchez votre dossier de candidature'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Veuillez entrer les 8 chiffres de votre CIN ou votre numéro de dossier (ex: MST-2026-TUN-08421).
          </p>
        </div>
      )}
    </section>
  );
};
