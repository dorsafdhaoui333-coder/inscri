import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MastereCatalog } from './components/MastereCatalog';
import { ScoreSimulator } from './components/ScoreSimulator';
import { InscriptionWizard } from './components/InscriptionWizard';
import { SuiviDossier } from './components/SuiviDossier';
import { CommissionAdmin } from './components/CommissionAdmin';
import { FaqSection } from './components/FaqSection';
import { ReceiptModal } from './components/ReceiptModal';
import { UmlConception } from './components/UmlConception';
import { MOCK_MASTERES, INITIAL_APPLICATIONS } from './data/mockMasteres';
import { CandidateApplication, MastereProgram, LicenceInfo, ApplicationStatus } from './types/mastere';
import { GraduationCap, ShieldCheck, FileCheck2, HeartHandshake } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catalogue' | 'simulateur' | 'inscription' | 'suivi' | 'commission' | 'uml'>('home');
  const [lang, setLang] = useState<'fr' | 'ar' | 'tn'>('fr');
  
  // Persistent applications state
  const [applications, setApplications] = useState<CandidateApplication[]>(() => {
    try {
      const stored = localStorage.getItem('mastere_applications');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load stored applications', e);
    }
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mastere_applications', JSON.stringify(applications));
    } catch (e) {
      console.warn('Failed to save applications', e);
    }
  }, [applications]);

  // Selected mastere for direct application
  const [preselectedMastere, setPreselectedMastere] = useState<MastereProgram | null>(null);

  // Prefilled licence from simulator
  const [prefillLicence, setPrefillLicence] = useState<Partial<LicenceInfo> | null>(null);

  // Search query across catalog & hero
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Active receipt modal
  const [activeReceipt, setActiveReceipt] = useState<CandidateApplication | null>(null);

  // Handlers
  const handleApplyToMastere = (mastere: MastereProgram) => {
    setPreselectedMastere(mastere);
    setActiveTab('inscription');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseScoreForApplication = (licenceData: Partial<LicenceInfo>) => {
    setPrefillLicence(licenceData);
    setActiveTab('inscription');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationSuccess = (newApp: CandidateApplication) => {
    setApplications(prev => [newApp, ...prev]);
    setActiveReceipt(newApp);
    setActiveTab('suivi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStatus = (
    appId: string, 
    newStatus: ApplicationStatus, 
    note?: string, 
    interviewDate?: string, 
    interviewRoom?: string
  ) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          statusNote: note !== undefined ? note : app.statusNote,
          dateEntretien: interviewDate !== undefined ? interviewDate : app.dateEntretien,
          salleEntretien: interviewRoom !== undefined ? interviewRoom : app.salleEntretien,
        };
      }
      return app;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        setLang={setLang}
        applicationsCount={applications.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12 pb-16">
            <HeroSection
              onStartApplication={() => {
                setPreselectedMastere(null);
                setActiveTab('inscription');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreCatalog={() => {
                setActiveTab('catalogue');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSimulator={() => {
                setActiveTab('simulateur');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              lang={lang}
            />

            {/* Featured Master's Preview */}
            <div className="space-y-6">
              <MastereCatalog
                masteres={MOCK_MASTERES}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onApplyMastere={handleApplyToMastere}
                lang={lang}
              />
            </div>

            {/* Integrated Score Simulator Section */}
            <div className="bg-slate-100/70 py-6 border-y border-slate-200">
              <ScoreSimulator
                onUseScoreForApplication={handleUseScoreForApplication}
                lang={lang}
              />
            </div>

            {/* Academic UML Conception Banner for University project */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-lg border border-purple-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-semibold uppercase tracking-wider">
                    <span>Projet Académique & PFE</span>
                    <span>·</span>
                    <span>UML 2.5</span>
                  </div>
                  <h3 className="text-lg font-bold font-display">
                    Diagramme de Cas d’Utilisation & Diagramme de Classes complets
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Visualisez les schémas vectoriels SVG, exportez le code source PlantUML / Mermaid pour votre rapport, et consultez les fiches descriptives détaillées exigées par les jurys universitaires.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('uml');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  <span>Ouvrir l’Espace UML</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <FaqSection lang={lang} />
          </div>
        )}

        {activeTab === 'catalogue' && (
          <div className="py-8">
            <MastereCatalog
              masteres={MOCK_MASTERES}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onApplyMastere={handleApplyToMastere}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'simulateur' && (
          <div className="py-8">
            <ScoreSimulator
              onUseScoreForApplication={handleUseScoreForApplication}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'inscription' && (
          <div className="py-8">
            <InscriptionWizard
              masteres={MOCK_MASTERES}
              preselectedMastere={preselectedMastere}
              prefillLicence={prefillLicence}
              onSubmitSuccess={handleApplicationSuccess}
              onCancel={() => setActiveTab('home')}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'suivi' && (
          <div className="py-8">
            <SuiviDossier
              applications={applications}
              onOpenReceipt={(app) => setActiveReceipt(app)}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="py-8">
            <CommissionAdmin
              applications={applications}
              masteres={MOCK_MASTERES}
              onUpdateStatus={handleUpdateStatus}
              onOpenReceipt={(app) => setActiveReceipt(app)}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'uml' && (
          <div className="py-8">
            <UmlConception lang={lang} />
          </div>
        )}
      </main>

      {/* Official Printable Receipt Modal */}
      <ReceiptModal
        application={activeReceipt}
        onClose={() => setActiveReceipt(null)}
        onGoToTracking={() => {
          setActiveReceipt(null);
          setActiveTab('suivi');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Institutional Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Branding Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <div className="w-7 h-7 rounded bg-sky-700 flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-bold text-base font-display">MastereTN</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Portail officiel de candidature dématérialisée aux mastères universitaires en Tunisie. Service conforme aux règlements LMD du Ministère de l’Enseignement Supérieur.
              </p>
            </div>

            {/* University Network */}
            <div className="space-y-2">
              <span className="text-white font-bold text-xs uppercase tracking-wider block">
                Réseau Universitaire
              </span>
              <ul className="space-y-1 text-[11px]">
                <li>Université de Tunis El Manar (UTM)</li>
                <li>Université de Carthage (UCAR)</li>
                <li>Université de Sfax (USF)</li>
                <li>Université de Sousse (US)</li>
                <li>Université de la Manouba (UMA)</li>
              </ul>
            </div>

            {/* Candidate Quick Access */}
            <div className="space-y-2">
              <span className="text-white font-bold text-xs uppercase tracking-wider block">
                Accès Rapide
              </span>
              <ul className="space-y-1 text-[11px]">
                <li>
                  <button onClick={() => { setActiveTab('catalogue'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Catalogue des Mastères 2026/2027
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('simulateur'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Calculateur Officiel du Score
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('inscription'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Dépôt de Dossier en Ligne
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('suivi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    Suivi de Dossier par CIN
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('uml'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                    ★ Conception UML (Use Case & Classes)
                  </button>
                </li>
              </ul>
            </div>

            {/* Support and Security */}
            <div className="space-y-2">
              <span className="text-white font-bold text-xs uppercase tracking-wider block">
                Assistance & Conformité
              </span>
              <p className="text-[11px] leading-relaxed">
                Support technique et réclamations : <br />
                <span className="font-mono text-sky-400">contact@mastere.tn</span>
              </p>
              <div className="pt-2 text-[10px] text-slate-500">
                Données personnelles protégées selon la loi n° 2004-63 relative à la protection des données à caractère personnel en Tunisie.
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 République Tunisienne · Ministère de l’Enseignement Supérieur et de la Recherche Scientifique.
            </div>
            <div className="flex items-center gap-4">
              <span>Portail National Numérique</span>
              <span aria-hidden="true">·</span>
              <span>Session Universitaire 2026/2027</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
