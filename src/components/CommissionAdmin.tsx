import React, { useState, useMemo } from 'react';
import { CandidateApplication, MastereProgram, ApplicationStatus } from '../types/mastere';
import { ShieldCheck, Download, Search, Filter, CheckCircle2, Clock, Users, Award, ExternalLink, Calendar, MapPin } from 'lucide-react';

interface CommissionAdminProps {
  applications: CandidateApplication[];
  masteres: MastereProgram[];
  onUpdateStatus: (appId: string, newStatus: ApplicationStatus, note?: string, interviewDate?: string, interviewRoom?: string) => void;
  onOpenReceipt: (application: CandidateApplication) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const CommissionAdmin: React.FC<CommissionAdminProps> = ({
  applications,
  masteres,
  onUpdateStatus,
  onOpenReceipt,
  lang,
}) => {
  const [selectedMastereId, setSelectedMastereId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activeApp, setActiveApp] = useState<CandidateApplication | null>(null);

  // Status edit modal state
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('en_examen');
  const [editNote, setEditNote] = useState<string>('');
  const [editInterviewDate, setEditInterviewDate] = useState<string>('');
  const [editInterviewRoom, setEditInterviewRoom] = useState<string>('');

  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        const matchMastere =
          selectedMastereId === 'all' ||
          app.wishes.some((w) => w.mastereId === selectedMastereId);

        const matchStatus = statusFilter === 'all' || app.status === statusFilter;

        const matchSearch =
          search === '' ||
          app.candidate.cin.includes(search) ||
          app.candidate.nom.toLowerCase().includes(search.toLowerCase()) ||
          app.candidate.prenom.toLowerCase().includes(search.toLowerCase()) ||
          app.id.toLowerCase().includes(search.toLowerCase());

        return matchMastere && matchStatus && matchSearch;
      })
      .sort((a, b) => b.score.totalScore - a.score.totalScore); // Sort by highest score first!
  }, [applications, selectedMastereId, statusFilter, search]);

  const handleOpenEdit = (app: CandidateApplication) => {
    setActiveApp(app);
    setEditStatus(app.status);
    setEditNote(app.statusNote || '');
    setEditInterviewDate(app.dateEntretien || '2026-07-25 à 10:00');
    setEditInterviewRoom(app.salleEntretien || 'Salle des Réunions 1er Étage');
  };

  const handleSaveStatus = () => {
    if (!activeApp) return;
    onUpdateStatus(activeApp.id, editStatus, editNote, editInterviewDate, editInterviewRoom);
    setActiveApp(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Rang', 'ID Dossier', 'CIN', 'Nom', 'Prenom', 'Etablissement', 'Licence', 'Score Total', 'Statut', 'Voeu 1'];
    const rows = filteredApps.map((app, index) => [
      index + 1,
      app.id,
      app.candidate.cin,
      app.candidate.nom,
      app.candidate.prenom,
      `"${app.licence.etablissement}"`,
      `"${app.licence.specialite}"`,
      app.score.totalScore,
      app.status,
      `"${app.wishes[0]?.mastereTitle || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Classement_Mastere_Commission_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusLabel = (s: ApplicationStatus) => {
    switch (s) {
      case 'admis': return { text: 'Admis(e)', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'preselectionne': return { text: 'Présélectionné', cls: 'text-sky-700 bg-sky-50 border-sky-200' };
      case 'en_examen': return { text: 'En examen', cls: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'liste_attente': return { text: 'Liste d’attente', cls: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 'rejete': return { text: 'Non retenu', cls: 'text-rose-700 bg-rose-50 border-rose-200' };
      default: return { text: 'Soumis', cls: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Commission Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Portail Sécurisé · Commission Nationale & Jurys de Mastères</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Délibération & Classement des Candidatures
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Classement automatique des candidats par score décroissant, validation des pièces d’état civil et publication des listes principales et d’attente.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Exporter le Classement (CSV)</span>
        </button>
      </div>

      {/* Filter and Master Program Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Master Program Dropdown */}
          <div>
            <label className="text-xs text-slate-600 block mb-1 font-semibold">
              Filtrer par Formation de Mastère
            </label>
            <select
              value={selectedMastereId}
              onChange={(e) => setSelectedMastereId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="all">Tous les mastères confondus</option>
              {masteres.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.code}] {m.title} ({m.faculty})
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="text-xs text-slate-600 block mb-1 font-semibold">
              Filtrer par Décision
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="soumis">Dossiers Soumis</option>
              <option value="en_examen">En cours d’examen</option>
              <option value="preselectionne">Présélectionnés</option>
              <option value="admis">Admis Liste Principale</option>
              <option value="liste_attente">Liste d’Attente</option>
              <option value="rejete">Rejetés</option>
            </select>
          </div>

          {/* Search by CIN / Name */}
          <div>
            <label className="text-xs text-slate-600 block mb-1 font-semibold">
              Rechercher Candidat (CIN, Nom)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex: 09876543, Ben Salem..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3 px-4 text-center">Rang</th>
                <th className="py-3 px-4">Candidat & CIN</th>
                <th className="py-3 px-4">Cursus LMD d’Origine</th>
                <th className="py-3 px-4">Vœu n°1 Choisi</th>
                <th className="py-3 px-4 text-right">Score Calculé</th>
                <th className="py-3 px-4 text-center">Statut Jury</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app, index) => {
                const statusMeta = getStatusLabel(app.status);
                const isFirstRank = index === 0;

                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        isFirstRank ? 'bg-amber-100 text-amber-800' : 'text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                    </td>

                    {/* Candidate */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {app.candidate.prenom} {app.candidate.nom}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        CIN : {app.candidate.cin} · {app.candidate.gouvernorat}
                      </div>
                    </td>

                    {/* Origin Institution */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 truncate max-w-[200px]">
                        {app.licence.etablissement}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {app.licence.specialite}
                      </div>
                    </td>

                    {/* Wish 1 */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-sky-800 truncate max-w-[240px]">
                        {app.wishes[0]?.mastereTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                        {app.wishes[0]?.faculty}
                      </div>
                    </td>

                    {/* Total Score */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold font-mono text-sm text-slate-900 tabular-nums">
                        {app.score.totalScore.toFixed(2)}
                      </span>
                      <span className="text-slate-400 text-[10px] block font-mono">/ 20</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold border ${statusMeta.cls}`}>
                        {statusMeta.text}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(app)}
                        className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors"
                      >
                        Délibérer
                      </button>
                      <button
                        onClick={() => onOpenReceipt(app)}
                        className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-md"
                        title="Voir fiche officielle"
                      >
                        Fiche
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApps.length === 0 && (
          <div className="p-10 text-center text-slate-500 text-xs">
            Aucune candidature ne correspond aux critères de sélection sélectionnés.
          </div>
        )}
      </div>

      {/* Jury Decision Modal */}
      {activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Délibération de la Commission
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                Candidat : {activeApp.candidate.prenom} {activeApp.candidate.nom}
              </h3>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                CIN : {activeApp.candidate.cin} · Score : {activeApp.score.totalScore}/20
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Nouvelle Décision / Statut
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="en_examen">En cours d’examen (Dossier conforme)</option>
                  <option value="preselectionne">Présélectionné (Convoquer pour dépôt papier)</option>
                  <option value="entretien">Convoqué(e) à l’entretien oral</option>
                  <option value="admis">Admis(e) sur Liste Principale</option>
                  <option value="liste_attente">Inscrit(e) sur Liste d’Attente</option>
                  <option value="rejete">Dossier Rejeté</option>
                </select>
              </div>

              {(editStatus === 'preselectionne' || editStatus === 'entretien') && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Date & Heure</label>
                    <input
                      type="text"
                      value={editInterviewDate}
                      onChange={(e) => setEditInterviewDate(e.target.value)}
                      placeholder="Ex: 2026-07-25 à 09:30"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Salle / Département</label>
                    <input
                      type="text"
                      value={editInterviewRoom}
                      onChange={(e) => setEditInterviewRoom(e.target.value)}
                      placeholder="Ex: Salle des Thèses FST"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Motif / Notification destinée au Candidat
                </label>
                <textarea
                  rows={3}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Ex: Félicitations, vous êtes retenu(e) sur la liste principale..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-xs"
              >
                Enregistrer la Délibération
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
