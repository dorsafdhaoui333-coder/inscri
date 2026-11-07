import React, { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { CandidateApplication, MastereProgram } from '../types/mastere';
import { PieChart as PieIcon, BarChart3, TrendingUp, Users, GraduationCap, Award } from 'lucide-react';

interface CommissionAnalyticsProps {
  applications: CandidateApplication[];
  masteres: MastereProgram[];
  lang: 'fr' | 'ar' | 'tn';
}

export const CommissionAnalytics: React.FC<CommissionAnalyticsProps> = ({
  applications,
  masteres,
  lang,
}) => {
  // Master type mapping helper
  const mastereTypeMap = useMemo(() => {
    const map = new Map<string, { type: 'recherche' | 'professionnel'; title: string; places: number }>();
    masteres.forEach((m) => {
      map.set(m.id, { type: m.type, title: m.title, places: m.places });
    });
    return map;
  }, [masteres]);

  // Compute distribution by Master Type based on primary wish (Vœu 1)
  const analyticsData = useMemo(() => {
    let rechercheCount = 0;
    let professionnelCount = 0;
    let rechercheScoresSum = 0;
    let professionnelScoresSum = 0;

    // Per master program stats
    const programStatsMap: Record<string, { name: string; type: 'recherche' | 'professionnel'; count: number; places: number }> = {};
    masteres.forEach(m => {
      programStatsMap[m.id] = {
        name: m.code,
        type: m.type,
        count: 0,
        places: m.places,
      };
    });

    applications.forEach((app) => {
      const primaryWish = app.wishes[0];
      if (primaryWish) {
        const masterInfo = mastereTypeMap.get(primaryWish.mastereId);
        const type = masterInfo?.type || 'professionnel';

        if (type === 'recherche') {
          rechercheCount += 1;
          rechercheScoresSum += app.score.totalScore;
        } else {
          professionnelCount += 1;
          professionnelScoresSum += app.score.totalScore;
        }

        if (programStatsMap[primaryWish.mastereId]) {
          programStatsMap[primaryWish.mastereId].count += 1;
        }
      }
    });

    const total = applications.length;
    const recherchePct = total > 0 ? Math.round((rechercheCount / total) * 100) : 0;
    const professionnelPct = total > 0 ? Math.round((professionnelCount / total) * 100) : 0;

    const avgScoreRecherche = rechercheCount > 0 ? Number((rechercheScoresSum / rechercheCount).toFixed(2)) : 0;
    const avgScorePro = professionnelCount > 0 ? Number((professionnelScoresSum / professionnelCount).toFixed(2)) : 0;

    // Pie chart distribution
    const pieData = [
      {
        name: 'Mastères de Recherche (M.R)',
        nameShort: 'Recherche',
        value: rechercheCount,
        percentage: recherchePct,
        color: '#0284c7', // Sky-600
        avgScore: avgScoreRecherche,
      },
      {
        name: 'Mastères Professionnels (M.P)',
        nameShort: 'Professionnel',
        value: professionnelCount,
        percentage: professionnelPct,
        color: '#059669', // Emerald-600
        avgScore: avgScorePro,
      },
    ];

    // Bar chart comparison by master program
    const barData = Object.values(programStatsMap).map((p) => ({
      code: p.name,
      candidatures: p.count,
      places: p.places,
      type: p.type === 'recherche' ? 'Recherche' : 'Professionnel',
      fillColor: p.type === 'recherche' ? '#0284c7' : '#059669',
    }));

    return {
      total,
      rechercheCount,
      professionnelCount,
      recherchePct,
      professionnelPct,
      avgScoreRecherche,
      avgScorePro,
      pieData,
      barData,
    };
  }, [applications, masteres, mastereTypeMap]);

  // Custom Tooltip for Recharts Pie
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-slate-300 font-mono">
            Candidatures : <strong className="text-white">{data.value}</strong> ({data.percentage}%)
          </div>
          <div className="text-slate-300 font-mono">
            Score moyen : <strong className="text-sky-300">{data.avgScore} / 20</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Recharts Bar
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
          <div className="font-bold text-sky-300">{label} ({item.type})</div>
          <div className="text-slate-300 font-mono">
            Candidatures reçues : <strong className="text-white">{item.candidatures}</strong>
          </div>
          <div className="text-slate-300 font-mono">
            Capacité d’accueil : <strong className="text-amber-300">{item.places} places</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Statistiques & Répartition des Candidatures</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
            Répartition par Type de Mastère : Recherche vs Professionnel
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyse quantitative des choix prioritaires (Vœu n°1) des candidats pour orienter les quotas d'admission
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>Total Dossiers : <strong className="text-slate-900 font-bold">{analyticsData.total}</strong></span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche Card */}
        <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-100 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900">
              Mastères de Recherche
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold font-mono text-sky-900 tabular-nums">
              {analyticsData.rechercheCount}
            </span>
            <span className="text-xs font-mono text-sky-700">
              ({analyticsData.recherchePct}% du total)
            </span>
          </div>
          <div className="text-[11px] text-sky-800 pt-1">
            Score moyen : <strong className="font-mono">{analyticsData.avgScoreRecherche} / 20</strong>
          </div>
        </div>

        {/* Professionnel Card */}
        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
              Mastères Professionnels
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
              {analyticsData.professionnelCount}
            </span>
            <span className="text-xs font-mono text-emerald-700">
              ({analyticsData.professionnelPct}% du total)
            </span>
          </div>
          <div className="text-[11px] text-emerald-800 pt-1">
            Score moyen : <strong className="font-mono">{analyticsData.avgScorePro} / 20</strong>
          </div>
        </div>

        {/* Dominance Ratio Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Orientation Préférentielle
          </div>
          <div className="text-sm font-bold text-slate-900 font-display pt-1">
            {analyticsData.professionnelCount >= analyticsData.rechercheCount
              ? 'Forte Attractivité Pro'
              : 'Prédominance Recherche'}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            {analyticsData.professionnelPct}% s'orientent vers l'insertion pro immédiate en entreprise.
          </p>
        </div>

        {/* Selectivity Indicator */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Taux de Pression Global
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {applications.length > 0 ? (applications.length / (masteres.length * 28)).toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-slate-500 font-mono">candidats / place</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Ratio de sélectivité moyen sur les formations universitaires
          </p>
        </div>
      </div>

      {/* Visual Charts Grid with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
        {/* Donut Chart: Recherche vs Professionnel */}
        <div className="lg:col-span-5 bg-slate-50/70 rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-sky-700" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Répartition Globale (Donut)
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Vœu n°1</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {analyticsData.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Aucune candidature enregistrée</div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 bg-sky-50 rounded-lg">
              <span className="block text-[10px] text-sky-700 font-semibold uppercase">Recherche</span>
              <strong className="text-sky-900 font-mono">{analyticsData.recherchePct}%</strong>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <span className="block text-[10px] text-emerald-700 font-semibold uppercase">Professionnel</span>
              <strong className="text-emerald-900 font-mono">{analyticsData.professionnelPct}%</strong>
            </div>
          </div>
        </div>

        {/* Bar Chart: Candidatures reçues par Formation */}
        <div className="lg:col-span-7 bg-slate-50/70 rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Volume de Candidatures par Code de Mastère
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0284c7]" /> Recherche
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" /> Professionnel
              </span>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center pt-2">
            {analyticsData.barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="code" 
                    tick={{ fontSize: 10, fill: '#475569' }} 
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#475569' }} 
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="candidatures" radius={[4, 4, 0, 0]}>
                    {analyticsData.barData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fillColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Aucune donnée de formation</div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
            Survolez chaque barre pour inspecter le volume de demandes par rapport à la capacité d'accueil fixée par le conseil scientifique.
          </p>
        </div>
      </div>
    </div>
  );
};
