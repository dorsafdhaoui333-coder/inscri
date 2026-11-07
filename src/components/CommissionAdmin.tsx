import React, { useState, useMemo } from 'react';
import { CandidateApplication, MastereProgram, ApplicationStatus } from '../types/mastere';
import { ShieldCheck, Download, Search, Filter, CheckCircle2, Clock, Users, Award, ExternalLink, Calendar, MapPin, TrendingUp, ChevronDown, ChevronUp, GitCompare, CheckSquare, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { CommissionAnalytics } from './CommissionAnalytics';
import { DossierComparisonModal } from './DossierComparisonModal';

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
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);

  // Dynamic sorting by total score
  const [scoreSortOrder, setScoreSortOrder] = useState<'desc' | 'asc'>('desc');

  const toggleScoreSort = () => {
    setScoreSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  // Status edit modal state
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('en_examen');
  const [editNote, setEditNote] = useState<string>('');
  const [editInterviewDate, setEditInterviewDate] = useState<string>('');
  const [editInterviewRoom, setEditInterviewRoom] = useState<string>('');

  // Dossier Comparison state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareAppA, setCompareAppA] = useState<CandidateApplication | null>(null);
  const [compareAppB, setCompareAppB] = useState<CandidateApplication | null>(null);
  const [selectedForCompareIds, setSelectedForCompareIds] = useState<string[]>([]);

  const handleToggleSelectForCompare = (appId: string) => {
    setSelectedForCompareIds(prev => {
      if (prev.includes(appId)) {
        return prev.filter(id => id !== appId);
      }
      if (prev.length >= 2) {
        return [prev[1], appId];
      }
      return [...prev, appId];
    });
  };

  const handleLaunchComparison = (app1?: CandidateApplication, app2?: CandidateApplication) => {
    const first = app1 || applications.find(a => a.id === selectedForCompareIds[0]) || applications[0] || null;
    const second = app2 || applications.find(a => a.id === selectedForCompareIds[1]) || (first && applications.find(a => a.id !== first.id)) || applications[1] || applications[0] || null;
    setCompareAppA(first);
    setCompareAppB(second);
    setIsCompareModalOpen(true);
  };

  // Official merit rank (always based on descending total score as per Ministry rules)
  const officialRankMap = useMemo(() => {
    const sorted = [...applications].sort((a, b) => b.score.totalScore - a.score.totalScore);
    const map = new Map<string, number>();
    sorted.forEach((app, idx) => map.set(app.id, idx + 1));
    return map;
  }, [applications]);

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
      .sort((a, b) => {
        if (scoreSortOrder === 'desc') {
          return b.score.totalScore - a.score.totalScore;
        } else {
          return a.score.totalScore - b.score.totalScore;
        }
      });
  }, [applications, selectedMastereId, statusFilter, search, scoreSortOrder]);

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
    const headers = ['Ordre Trié', 'Rang Mérite Officiel', 'ID Dossier', 'CIN', 'Nom', 'Prenom', 'Etablissement', 'Licence', 'Score Total', 'Statut', 'Voeu 1'];
    const rows = filteredApps.map((app, index) => [
      index + 1,
      officialRankMap.get(app.id) || index + 1,
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

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => handleLaunchComparison()}
            className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors shadow-2xs flex items-center gap-2"
            title="Comparer deux candidatures côte-à-côte"
          >
            <GitCompare className="w-4 h-4 text-purple-700" />
            <span>
              {selectedForCompareIds.length === 2
                ? 'Comparer les 2 sélectionnés'
                : selectedForCompareIds.length === 1
                ? 'Comparer (1 sélectionné)'
                : 'Comparer 2 Dossiers'}
            </span>
            {selectedForCompareIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {selectedForCompareIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            title="Afficher ou masquer les graphiques Recharts"
          >
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span>{showAnalytics ? 'Masquer Statistiques' : 'Afficher Statistiques'}</span>
            {showAnalytics ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exporter le Classement (CSV)</span>
          </button>
        </div>
      </div>

      {/* Recharts Analytics Visualization: Distribution Recherche vs Professionnel */}
      {showAnalytics && (
        <CommissionAnalytics
          applications={applications}
          masteres={masteres}
          lang={lang}
        />
      )}

      {/* Filter and Master Program Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

          {/* Dynamic Score Sorting Control */}
          <div>
            <label className="text-xs text-slate-600 block mb-1 font-semibold flex items-center justify-between">
              <span>Tri par Score Total</span>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                scoreSortOrder === 'desc' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {scoreSortOrder === 'desc' ? '20 → 0' : '0 → 20'}
              </span>
            </label>
            <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setScoreSortOrder('desc')}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  scoreSortOrder === 'desc'
                    ? 'bg-white text-sky-800 shadow-2xs font-bold border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Classer par score décroissant (les plus hauts scores en premier)"
              >
                <ArrowDown className="w-3.5 h-3.5 text-sky-600" />
                <span>Décroissant</span>
              </button>
              <button
                type="button"
                onClick={() => setScoreSortOrder('asc')}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  scoreSortOrder === 'asc'
                    ? 'bg-white text-amber-800 shadow-2xs font-bold border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Classer par score croissant (les plus bas scores en premier)"
              >
                <ArrowUp className="w-3.5 h-3.5 text-amber-600" />
                <span>Croissant</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sorting & Filter Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">
            {filteredApps.length} candidature{filteredApps.length > 1 ? 's' : ''} affichée{filteredApps.length > 1 ? 's' : ''}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            Classement actuel :
            <strong className={`inline-flex items-center gap-0.5 font-bold ${
              scoreSortOrder === 'desc' ? 'text-sky-700' : 'text-amber-700'
            }`}>
              {scoreSortOrder === 'desc' ? (
                <>
                  <ArrowDown className="w-3.5 h-3.5 text-sky-600" />
                  Score Décroissant (Max → Min)
                </>
              ) : (
                <>
                  <ArrowUp className="w-3.5 h-3.5 text-amber-600" />
                  Score Croissant (Min → Max)
                </>
              )}
            </strong>
          </span>
        </div>

        <button
          type="button"
          onClick={toggleScoreSort}
          className="text-xs text-sky-700 hover:text-sky-800 hover:underline font-semibold inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          title="Inverser le sens du tri par score"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" />
          <span>Inverser le sens du tri ({scoreSortOrder === 'desc' ? 'passer en Croissant' : 'passer en Décroissant'})</span>
        </button>
      </div>

      {/* Candidate Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3 px-3 text-center w-12" title="Sélectionner pour comparaison (max 2)">Comp.</th>
                <th className="py-3 px-4 text-center">Rang Trié</th>
                <th className="py-3 px-4">Candidat & CIN</th>
                <th className="py-3 px-4">Cursus LMD d’Origine</th>
                <th className="py-3 px-4">Vœu n°1 Choisi</th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer select-none group hover:bg-slate-100 transition-colors"
                  onClick={toggleScoreSort}
                  title={`Cliquer pour trier par score (${scoreSortOrder === 'desc' ? 'Actuellement Décroissant ↓' : 'Actuellement Croissant ↑'})`}
                  aria-sort={scoreSortOrder === 'desc' ? 'descending' : 'ascending'}
                >
                  <div className="inline-flex items-center justify-end gap-1.5 font-bold text-slate-800 group-hover:text-sky-700">
                    <span>Score Calculé</span>
                    <span className={`p-1 rounded-md transition-all ${
                      scoreSortOrder === 'desc' 
                        ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-300' 
                        : 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                    }`}>
                      {scoreSortOrder === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-normal text-right">
                    {scoreSortOrder === 'desc' ? 'Max → Min (cliquer pour inverser)' : 'Min → Max (cliquer pour inverser)'}
                  </span>
                </th>
                <th className="py-3 px-4 text-center">Statut Jury</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app, index) => {
                const statusMeta = getStatusLabel(app.status);
                const officialRank = officialRankMap.get(app.id) || index + 1;
                const isTopScore = scoreSortOrder === 'desc' ? index === 0 : index === filteredApps.length - 1;
                const isSelectedForCompare = selectedForCompareIds.includes(app.id);

                return (
                  <tr 
                    key={app.id} 
                    className={`transition-colors ${
                      isSelectedForCompare 
                        ? 'bg-purple-50/70 hover:bg-purple-50' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Compare Selection Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectForCompare(app.id)}
                        className={`w-7 h-7 rounded-lg border transition-all inline-flex items-center justify-center ${
                          isSelectedForCompare
                            ? 'bg-purple-600 text-white border-purple-600 shadow-2xs ring-2 ring-purple-300'
                            : 'bg-white text-slate-300 border-slate-300 hover:border-purple-400 hover:text-purple-600'
                        }`}
                        title={
                          isSelectedForCompare
                            ? 'Désélectionner de la comparaison'
                            : 'Sélectionner pour comparer (max 2)'
                        }
                        aria-label={`Sélectionner ${app.candidate.prenom} ${app.candidate.nom} pour comparaison`}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className="flex flex-col items-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          isTopScore ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300' : 'text-slate-700 bg-slate-100'
                        }`}>
                          {index + 1}
                        </span>
                        {scoreSortOrder === 'asc' && (
                          <span className="text-[9px] text-slate-400 font-mono mt-0.5" title="Rang officiel selon le score de mérite">
                            Mérite #{officialRank}
                          </span>
                        )}
                      </div>
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

                    {/* Total Score with dynamic sort styling */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-bold font-mono text-sm tabular-nums ${
                        isTopScore ? 'text-amber-700 font-extrabold' : 'text-slate-900'
                      }`}>
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
                    <td className="py-3.5 px-4 text-center space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleLaunchComparison(app)}
                        className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors inline-flex items-center gap-1"
                        title="Comparer ce dossier côte-à-côte avec un autre"
                      >
                        <GitCompare className="w-3 h-3" />
                        <span>Comparer</span>
                      </button>
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

      {/* Side-by-Side Dossier Comparison Modal */}
      <DossierComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        applications={applications}
        initialAppA={compareAppA}
        initialAppB={compareAppB}
        onUpdateStatus={onUpdateStatus}
        onOpenReceipt={onOpenReceipt}
        lang={lang}
      />
    </section>
  );
};
