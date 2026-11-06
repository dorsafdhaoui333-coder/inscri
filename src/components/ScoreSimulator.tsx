import React, { useState, useMemo } from 'react';
import { Calculator, Award, AlertCircle, CheckCircle2, TrendingUp, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import { calculateMastereScore } from '../utils/scoreCalculator';
import { LicenceInfo, ScoreBreakdown } from '../types/mastere';

interface ScoreSimulatorProps {
  onUseScoreForApplication: (prefillLicence: Partial<LicenceInfo>) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const ScoreSimulator: React.FC<ScoreSimulatorProps> = ({
  onUseScoreForApplication,
  lang,
}) => {
  const [l1Moyenne, setL1Moyenne] = useState<number>(13.5);
  const [l1Session, setL1Session] = useState<'principale' | 'controle'>('principale');
  const [l1Redouble, setL1Redouble] = useState<boolean>(false);

  const [l2Moyenne, setL2Moyenne] = useState<number>(14.2);
  const [l2Session, setL2Session] = useState<'principale' | 'controle'>('principale');
  const [l2Redouble, setL2Redouble] = useState<boolean>(false);

  const [l3Moyenne, setL3Moyenne] = useState<number>(15.0);
  const [l3Session, setL3Session] = useState<'principale' | 'controle'>('principale');
  const [l3Redouble, setL3Redouble] = useState<boolean>(false);
  const [l3Mention, setL3Mention] = useState<'Passable' | 'Assez Bien' | 'Bien' | 'Très Bien'>('Bien');

  const calculated: ScoreBreakdown = useMemo(() => {
    const dummyLicence: LicenceInfo = {
      etablissement: '',
      diplomeType: 'Licence Nationale LMD',
      specialite: '',
      anneeObtention: 2026,
      annees: [
        { yearName: 'L1', moyenne: Number(l1Moyenne) || 0, session: l1Session, mention: 'Passable', credits: 60, redouble: l1Redouble },
        { yearName: 'L2', moyenne: Number(l2Moyenne) || 0, session: l2Session, mention: 'Passable', credits: 60, redouble: l2Redouble },
        { yearName: 'L3', moyenne: Number(l3Moyenne) || 0, session: l3Session, mention: l3Mention, credits: 60, redouble: l3Redouble },
      ],
    };
    return calculateMastereScore(dummyLicence);
  }, [l1Moyenne, l1Session, l1Redouble, l2Moyenne, l2Session, l2Redouble, l3Moyenne, l3Session, l3Redouble, l3Mention]);

  const getVerdict = (score: number) => {
    if (score >= 17) return { text: 'Excellente Chance d’Admission (Rang de tête)', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
    if (score >= 15) return { text: 'Très Favorable (Admission sur Liste Principale probable)', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' };
    if (score >= 13) return { text: 'Favorable (Admissibilité en liste principale ou attente)', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
    return { text: 'Compétitif / Éligible sous réserve d’entretien ou liste d’attente', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' };
  };

  const verdict = getVerdict(calculated.totalScore);

  const handleApplyWithScore = () => {
    onUseScoreForApplication({
      diplomeType: 'Licence Nationale LMD',
      annees: [
        { yearName: 'L1', moyenne: Number(l1Moyenne), session: l1Session, mention: 'Passable', credits: 60, redouble: l1Redouble },
        { yearName: 'L2', moyenne: Number(l2Moyenne), session: l2Session, mention: 'Passable', credits: 60, redouble: l2Redouble },
        { yearName: 'L3', moyenne: Number(l3Moyenne), session: l3Session, mention: l3Mention, credits: 60, redouble: l3Redouble },
      ],
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
          Outil d’Évaluation des Candidatures LMD
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
          Simulateur Officiel du Score de Mastère
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Le calcul du score se base sur les moyennes des trois années de licence avec pondération de la 3ème année (L3), les bonifications sans redoublement, les sessions principales et la mention finale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs for L1, L2, L3 */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-700" />
            <span>Saisie des notes de Licence (L1, L2, L3)</span>
          </h3>

          {/* L1 Year Block */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">1ère Année (L1)</span>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={l1Redouble}
                  onChange={(e) => setL1Redouble(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>Redoublement en L1</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Moyenne générale L1 (/20)</label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max="20"
                  value={l1Moyenne}
                  onChange={(e) => setL1Moyenne(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Session de réussite</label>
                <select
                  value={l1Session}
                  onChange={(e) => setL1Session(e.target.value as 'principale' | 'controle')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="principale">Session Principale (+)</option>
                  <option value="controle">Session de Contrôle</option>
                </select>
              </div>
            </div>
          </div>

          {/* L2 Year Block */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">2ème Année (L2)</span>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={l2Redouble}
                  onChange={(e) => setL2Redouble(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>Redoublement en L2</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Moyenne générale L2 (/20)</label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max="20"
                  value={l2Moyenne}
                  onChange={(e) => setL2Moyenne(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Session de réussite</label>
                <select
                  value={l2Session}
                  onChange={(e) => setL2Session(e.target.value as 'principale' | 'controle')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="principale">Session Principale (+)</option>
                  <option value="controle">Session de Contrôle</option>
                </select>
              </div>
            </div>
          </div>

          {/* L3 Year Block (with Graduation Mention) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">3ème Année (L3 - PFE & Diplôme)</span>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={l3Redouble}
                  onChange={(e) => setL3Redouble(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>Redoublement en L3</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Moyenne L3 (/20)</label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max="20"
                  value={l3Moyenne}
                  onChange={(e) => setL3Moyenne(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Session</label>
                <select
                  value={l3Session}
                  onChange={(e) => setL3Session(e.target.value as 'principale' | 'controle')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="principale">Session Principale</option>
                  <option value="controle">Session Contrôle</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Mention Licence</label>
                <select
                  value={l3Mention}
                  onChange={(e) => setL3Mention(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Passable">Passable (10 - 11.99)</option>
                  <option value="Assez Bien">Assez Bien (+0.5 pt)</option>
                  <option value="Bien">Bien (+1.0 pt)</option>
                  <option value="Très Bien">Très Bien (+1.5 pt)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Card: Live Score Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Score Global Prévisionnel
              </span>
              <span className="text-xs text-slate-400 font-mono">Barème /20</span>
            </div>

            {/* Big Display Score */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-sky-400 tabular-nums">
                {calculated.totalScore}
              </span>
              <span className="text-xl text-slate-400 font-display">/ 20</span>
            </div>

            {/* Score Breakdown Table */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Moyenne pondérée LMD (L1 + L2 + 1.2*L3)/3.2</span>
                <span className="font-mono tabular-nums text-white font-semibold">{calculated.baseAverage}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Bonus Cursus sans retard (0 redoublement)</span>
                <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                  +{calculated.bonusCursusSansRedoublement.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Bonus 3 Années Session Principale</span>
                <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                  +{calculated.bonusSessionsPrincipales.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Bonus Mention ({l3Mention})</span>
                <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                  +{calculated.bonusMentionLicence.toFixed(2)}
                </span>
              </div>
              {calculated.penaliteRedoublement > 0 && (
                <div className="flex items-center justify-between text-rose-300">
                  <span>Pénalité pour redoublement</span>
                  <span className="font-mono tabular-nums text-rose-400 font-semibold">
                    -{calculated.penaliteRedoublement.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Verdict Box */}
            <div className={`p-4 rounded-xl border ${verdict.bg} ${verdict.color} text-xs font-medium space-y-1`}>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Diagnostic de Sélection</span>
              </div>
              <p className="leading-relaxed">
                {verdict.text}
              </p>
            </div>

            {/* Transfer to Application Button */}
            <button
              onClick={handleApplyWithScore}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Transférer ces notes vers mon dossier de candidature</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Criteria info box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-700" />
              <span>Remarque de la Commission Nationale</span>
            </div>
            <p className="leading-relaxed">
              Certains mastères de recherche peuvent appliquer un coefficient supplémentaire sur les matières fondamentales (ex: Mathématiques en IA, Comptabilité en CCA). Ce simulateur calcule le score de base officiel requis pour le classement préliminaire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
