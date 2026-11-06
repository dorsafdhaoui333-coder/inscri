import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Calendar, Award, BookOpen, ChevronRight, CheckCircle2, Building2 } from 'lucide-react';

interface HeroSectionProps {
  onStartApplication: () => void;
  onExploreCatalog: () => void;
  onOpenSimulator: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartApplication,
  onExploreCatalog,
  onOpenSimulator,
  searchTerm,
  setSearchTerm,
  lang,
}) => {
  // Countdown to July 15, 2026
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 14, mins: 36, secs: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const t = {
    fr: {
      kicker: 'Session Universitaire 2026 / 2027 · Candidatures Ouvertes',
      title: 'Portail National d’Inscription aux Mastères en Tunisie',
      subtitle: 'Postulez aux mastères de recherche et professionnels des universités tunisiennes. Calculez votre score officiel, déposez vos pièces et suivez l’examen de votre dossier en temps réel.',
      ctaApply: 'Déposer ma candidature',
      ctaSimulate: 'Simuler mon score LMD',
      ctaExplore: 'Explorer les 48 mastères',
      searchPlaceholder: 'Rechercher un mastère (ex: Data Science, Finance, Cyber, FST, ISG)...',
      deadlineLabel: 'Clôture des candidatures nationales :',
      days: 'jours',
      hours: 'heures',
      mins: 'min',
      secs: 'sec',
      kpi1: '48 Mastères Accrédités',
      kpi1Sub: 'Recherche & Professionnels',
      kpi2: '12 Universités & Écoles',
      kpi2Sub: 'Tunis, Carthage, Sfax, Sousse...',
      kpi3: '100% Démarche Numérique',
      kpi3Sub: 'Fiche avec code de vérification',
      kpi4: 'Calcul Transparent du Score',
      kpi4Sub: 'Barème officiel ministériel',
    },
    tn: {
      kicker: 'العام الجامعي 2026 / 2027 · التسجيل محلول توة',
      title: 'المنصة الوطنية للترشح للماستير في تونس',
      subtitle: 'قدّم دوسيك في ماستير بحث ولا بروفيسيونال في الجامعات التونسية بكل شفافية. احسب السكور متاعك في دقيقة، صب أوراقك، وتبّع قبولك من دارك.',
      ctaApply: 'عمّر المطلب توّة',
      ctaSimulate: 'احسب سكورك',
      ctaExplore: 'شوف المستيرات الكل',
      searchPlaceholder: 'لوّج على ماستير (مثال: ذكاء اصطناعي، مالية، إعلامية، FST, ISG)...',
      deadlineLabel: 'آخر أجل لتقديم المطالب :',
      days: 'يوم',
      hours: 'ساعة',
      mins: 'دقيقة',
      secs: 'ثانية',
      kpi1: '48 ماستير معتمد',
      kpi1Sub: 'بحث ومهني',
      kpi2: '12 جامعة ومؤسسة',
      kpi2Sub: 'تونس، قرطاج، صفاقس، سوسة...',
      kpi3: '100% ترسيم أونلاين',
      kpi3Sub: 'وصل تسجيل برقم سري وكود QR',
      kpi4: 'حساب سكور أوتوماتيكي',
      kpi4Sub: 'مطابق لقانون وزارة التعليم العالي',
    },
    ar: {
      kicker: 'السنة الجامعية 2026 / 2027 · الترشحات مفتوحة رسمياً',
      title: 'البوابة الوطنية الموحدة للتسجيل في الماجستير بتونس',
      subtitle: 'ترشح لماجستير البحث والماجستير المهني بمختلف الجامعات التونسية. احسب معدل السكور الأكاديمي، حمّل الوثائق المطلوبة وتابع حالة ملفك مباشرة.',
      ctaApply: 'تقديم الترشح الآن',
      ctaSimulate: 'محاكي السكور الرسمي',
      ctaExplore: 'دليل مسالك الماجستير',
      searchPlaceholder: 'ابحث عن اختصاص ماجستير أو مؤسسة جامعية...',
      deadlineLabel: 'الموعد النهائي لغلق باب الترشحات :',
      days: 'أيام',
      hours: 'ساعات',
      mins: 'دقائق',
      secs: 'ثواني',
      kpi1: '48 مسلك ماجستير معتمد',
      kpi1Sub: 'ماجستير بحث وماجستير مهني',
      kpi2: '12 جامعة ومعهد عالي',
      kpi2Sub: 'تونس المنار، قرطاج، صفاقس، سوسة...',
      kpi3: 'ملف ترشح رقمي بالكامل',
      kpi3Sub: 'توليد وصل إيداع رسمي',
      kpi4: 'احتساب دقيق ومطابق للسكور',
      kpi4Sub: 'سلم التنقيط المعتمد رسمياً',
    },
  }[lang];

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Background Campus Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/campus_university_amphi_1793992031496.jpg"
          alt="Campus Universitaire Tunisien"
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Editorial Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Academic Kicker - clean unboxed typography */}
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-wide">
              <span>{t.kicker}</span>
              <span aria-hidden="true">·</span>
              <span>R.O. 2026/2027</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15] text-balance">
              {t.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>

            {/* Quick Master Search Bar */}
            <div className="max-w-2xl pt-2">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-12 pr-28 py-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-inner"
                />
                <button
                  onClick={onExploreCatalog}
                  className="absolute right-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  {lang === 'tn' ? 'لوّج' : lang === 'ar' ? 'بحث' : 'Filtrer'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartApplication}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>{t.ctaApply}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenSimulator}
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-medium text-sm rounded-xl transition-colors"
              >
                {t.ctaSimulate}
              </button>
              <button
                onClick={onExploreCatalog}
                className="px-5 py-3 text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                {t.ctaExplore} →
              </button>
            </div>
          </div>

          {/* Right Column: Official Deadline Countdown & Key Trust Card */}
          <div className="lg:col-span-4">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>{t.deadlineLabel}</span>
              </div>
              <div className="text-xl font-bold text-white font-display">
                15 Juillet 2026 à 23h59
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="bg-slate-900/90 border border-slate-700/60 rounded-lg p-2.5">
                  <span className="block text-xl font-bold font-mono text-sky-400 tabular-nums">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{t.days}</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-700/60 rounded-lg p-2.5">
                  <span className="block text-xl font-bold font-mono text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{t.hours}</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-700/60 rounded-lg p-2.5">
                  <span className="block text-xl font-bold font-mono text-white tabular-nums">
                    {String(timeLeft.mins).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{t.mins}</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-700/60 rounded-lg p-2.5">
                  <span className="block text-xl font-bold font-mono text-amber-400 tabular-nums">
                    {String(timeLeft.secs).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{t.secs}</span>
                </div>
              </div>

              <div className="border-t border-slate-700/80 pt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Validation instantanée du CIN tunisien</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jusqu’à 3 vœux de mastères par candidat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Récépissé officiel téléchargeable avec QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Operational Strip (Full width row below split, matching design skill) */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-xl font-bold font-display text-white block">{t.kpi1}</span>
            <span className="text-xs text-slate-400 block">{t.kpi1Sub}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold font-display text-white block">{t.kpi2}</span>
            <span className="text-xs text-slate-400 block">{t.kpi2Sub}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold font-display text-white block">{t.kpi3}</span>
            <span className="text-xs text-slate-400 block">{t.kpi3Sub}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold font-display text-white block">{t.kpi4}</span>
            <span className="text-xs text-slate-400 block">{t.kpi4Sub}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
