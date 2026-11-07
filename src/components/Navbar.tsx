import React from 'react';
import { GraduationCap, ShieldCheck, FileText, Calculator, Compass, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'catalogue' | 'simulateur' | 'inscription' | 'suivi' | 'commission';
  setActiveTab: (tab: 'home' | 'catalogue' | 'simulateur' | 'inscription' | 'suivi' | 'commission') => void;
  lang: 'fr' | 'ar' | 'tn';
  setLang: (lang: 'fr' | 'ar' | 'tn') => void;
  applicationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  applicationsCount,
}) => {
  const getNavLabel = (key: string) => {
    switch (lang) {
      case 'tn':
        switch (key) {
          case 'home': return 'الرئيسية';
          case 'catalogue': return 'المستيرات';
          case 'simulateur': return 'حساب السكور';
          case 'inscription': return 'الترشح';
          case 'suivi': return 'تبع دوسيك';
          case 'commission': return 'اللجنة';
          default: return '';
        }
      case 'ar':
        switch (key) {
          case 'home': return 'الرئيسية';
          case 'catalogue': return 'دليل الماجستير';
          case 'simulateur': return 'حساب السكور';
          case 'inscription': return 'التسجيل والترشح';
          case 'suivi': return 'متابعة الملف';
          case 'commission': return 'لجنة الانتقاء';
          default: return '';
        }
      default:
        switch (key) {
          case 'home': return 'Accueil';
          case 'catalogue': return 'Mastères';
          case 'simulateur': return 'Simulateur Score';
          case 'inscription': return 'Postuler';
          case 'suivi': return 'Suivi Dossier';
          case 'commission': return 'Espace Jury';
          default: return '';
        }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-800 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight font-display">
                Mastere<span className="text-sky-700">TN</span>
              </span>
              <span className="text-[10px] text-slate-500 block font-medium leading-none">
                Portail National des Mastères
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('catalogue')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'catalogue' ? 'text-sky-700 font-semibold border-b-2 border-sky-700' : ''
              }`}
            >
              {getNavLabel('catalogue')}
            </button>
            <button
              onClick={() => setActiveTab('simulateur')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'simulateur' ? 'text-sky-700 font-semibold border-b-2 border-sky-700' : ''
              }`}
            >
              {getNavLabel('simulateur')}
            </button>
            <button
              onClick={() => setActiveTab('inscription')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'inscription' ? 'text-sky-700 font-semibold border-b-2 border-sky-700' : ''
              }`}
            >
              {getNavLabel('inscription')}
            </button>
            <button
              onClick={() => setActiveTab('suivi')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'suivi' ? 'text-sky-700 font-semibold border-b-2 border-sky-700' : ''
              }`}
            >
              {getNavLabel('suivi')}
            </button>
            <button
              onClick={() => setActiveTab('commission')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activeTab === 'commission' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' : 'text-slate-500'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{getNavLabel('commission')}</span>
              <span className="text-[11px] tabular-nums font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                {applicationsCount}
              </span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action + Language switch */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language segmented toggle */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  lang === 'fr' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('tn')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  lang === 'tn' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
                title="تونسي (Tunisien)"
              >
                TN
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  lang === 'ar' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
                title="العربية الفصحى"
              >
                عربي
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setActiveTab('inscription')}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              {lang === 'tn' ? 'قدّم دوسيك' : lang === 'ar' ? 'سجّل ترشحك' : 'Déposer un Dossier'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
