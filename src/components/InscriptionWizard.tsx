import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  User, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { 
  MastereProgram, 
  CandidateApplication, 
  CandidateInfo, 
  BacInfo, 
  LicenceInfo, 
  ApplicationWish, 
  UploadedFileDoc, 
  BacSection 
} from '../types/mastere';
import { calculateMastereScore, validateTunisianCIN, formatCIN } from '../utils/scoreCalculator';
import { GOVERNORATES_TUNISIA } from '../data/mockMasteres';

interface InscriptionWizardProps {
  masteres: MastereProgram[];
  preselectedMastere?: MastereProgram | null;
  prefillLicence?: Partial<LicenceInfo> | null;
  onSubmitSuccess: (application: CandidateApplication) => void;
  onCancel: () => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const InscriptionWizard: React.FC<InscriptionWizardProps> = ({
  masteres,
  preselectedMastere,
  prefillLicence,
  onSubmitSuccess,
  onCancel,
  lang,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Candidate identity
  const [candidate, setCandidate] = useState<CandidateInfo>({
    cin: '',
    nom: '',
    prenom: '',
    nomAr: '',
    prenomAr: '',
    dateNaissance: '2002-05-15',
    lieuNaissance: 'Tunis',
    gouvernorat: 'Tunis',
    email: '',
    telephone: '',
    adresse: '',
  });

  // Step 2: Bac & Licence
  const [bac, setBac] = useState<BacInfo>({
    annee: 2021,
    section: 'Sciences de l’Informatique',
    session: 'principale',
    moyenne: 14.50,
    mention: 'Bien',
  });

  const [licence, setLicence] = useState<LicenceInfo>({
    etablissement: 'Faculté des Sciences de Tunis (FST)',
    diplomeType: 'Licence Nationale LMD',
    specialite: 'Informatique',
    anneeObtention: 2026,
    annees: [
      { yearName: 'L1', moyenne: 13.50, session: 'principale', mention: 'Assez Bien', credits: 60, redouble: false },
      { yearName: 'L2', moyenne: 14.20, session: 'principale', mention: 'Bien', credits: 60, redouble: false },
      { yearName: 'L3', moyenne: 15.10, session: 'principale', mention: 'Bien', credits: 60, redouble: false },
    ],
  });

  // Apply prefilled licence if came from simulator
  useEffect(() => {
    if (prefillLicence?.annees) {
      setLicence(prev => ({
        ...prev,
        annees: prefillLicence.annees as any,
        diplomeType: prefillLicence.diplomeType || prev.diplomeType,
      }));
    }
  }, [prefillLicence]);

  // Step 3: Master Choices (up to 3 wishes)
  const [wishes, setWishes] = useState<ApplicationWish[]>([]);

  // Pre-select mastere if passed from catalog
  useEffect(() => {
    if (preselectedMastere) {
      setWishes([
        {
          priority: 1,
          mastereId: preselectedMastere.id,
          mastereTitle: preselectedMastere.title,
          faculty: preselectedMastere.faculty,
          university: preselectedMastere.university,
        },
      ]);
    } else if (wishes.length === 0 && masteres.length > 0) {
      setWishes([
        {
          priority: 1,
          mastereId: masteres[0].id,
          mastereTitle: masteres[0].title,
          faculty: masteres[0].faculty,
          university: masteres[0].university,
        },
      ]);
    }
  }, [preselectedMastere, masteres]);

  // Step 4: Documents checklist
  const [documents, setDocuments] = useState<UploadedFileDoc[]>([
    { id: 'doc-cin', type: 'cin', label: 'Copie Carte d’Identité Nationale (CIN Recto/Verso)', fileName: '', fileSize: '', uploadedAt: '', required: true },
    { id: 'doc-bac', type: 'diplome_bac', label: 'Diplôme ou Attestation du Baccalauréat', fileName: '', fileSize: '', uploadedAt: '', required: true },
    { id: 'doc-l1', type: 'releve_l1', label: 'Relevé de notes de 1ère Année (L1)', fileName: '', fileSize: '', uploadedAt: '', required: true },
    { id: 'doc-l2', type: 'releve_l2', label: 'Relevé de notes de 2ème Année (L2)', fileName: '', fileSize: '', uploadedAt: '', required: true },
    { id: 'doc-l3', type: 'releve_l3', label: 'Relevé de notes de 3ème Année (L3)', fileName: '', fileSize: '', uploadedAt: '', required: true },
    { id: 'doc-attestation', type: 'attestation_licence', label: 'Attestation de Réussite de la Licence', fileName: '', fileSize: '', uploadedAt: '', required: true },
    { id: 'doc-cv', type: 'cv', label: 'Curriculum Vitae (CV actualisé)', fileName: '', fileSize: '', uploadedAt: '', required: false },
    { id: 'doc-lm', type: 'lettre_motivation', label: 'Lettre de Motivation', fileName: '', fileSize: '', uploadedAt: '', required: false },
  ]);

  // Step 5: Honor pledge
  const [honorPledge, setHonorPledge] = useState<boolean>(false);

  // Computed Score
  const currentScore = calculateMastereScore(licence, bac);

  // Validation functions
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!validateTunisianCIN(candidate.cin)) {
      errs.cin = 'Le N° CIN doit comporter exactement 8 chiffres tunisiens.';
    }
    if (!candidate.nom.trim()) errs.nom = 'Le nom de famille est obligatoire.';
    if (!candidate.prenom.trim()) errs.prenom = 'Le prénom est obligatoire.';
    if (!candidate.email.trim() || !candidate.email.includes('@')) {
      errs.email = 'Veuillez renseigner une adresse email valide.';
    }
    if (!candidate.telephone.trim() || candidate.telephone.length < 8) {
      errs.telephone = 'Le numéro de téléphone tunisien doit comporter 8 chiffres.';
    }
    if (!candidate.adresse.trim()) errs.adresse = 'L’adresse de résidence est requise.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (bac.moyenne < 10 || bac.moyenne > 20) {
      errs.bacMoyenne = 'La moyenne du Bac doit être comprise entre 10.00 et 20.00.';
    }
    licence.annees.forEach((y, i) => {
      if (y.moyenne < 10 || y.moyenne > 20) {
        errs[`moyenne_${y.yearName}`] = `La moyenne de ${y.yearName} doit être valide (entre 10 et 20).`;
      }
    });
    if (!licence.etablissement.trim()) errs.etablissement = 'L’établissement d’origine est requis.';
    if (!licence.specialite.trim()) errs.specialite = 'La spécialité de la licence est requise.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (wishes.length === 0) {
      errs.wishes = 'Veuillez sélectionner au moins un vœu de mastère.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    // For seamless testing, auto-simulate missing required documents if user proceeds
    const errs: Record<string, string> = {};
    const missingDocs = documents.filter(d => d.required && !d.fileName);
    if (missingDocs.length > 0) {
      // User can auto-attach or manual attach
      // We will provide a helper button to auto-fill sample files if needed
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Quick Demo Autofill button for instant testing
  const handleAutoFillDemo = () => {
    setCandidate({
      cin: '09871234',
      nom: 'Ben Mansour',
      prenom: 'Farah',
      nomAr: 'بن منصور',
      prenomAr: 'فرح',
      dateNaissance: '2002-09-18',
      lieuNaissance: 'Tunis',
      gouvernorat: 'Tunis',
      email: 'farah.benmansour@etudiant.utm.tn',
      telephone: '98765432',
      adresse: '28 Rue de la République, Le Bardo, Tunis',
    });
    setBac({
      annee: 2021,
      section: 'Sciences de l’Informatique',
      session: 'principale',
      moyenne: 15.20,
      mention: 'Bien',
    });
    setLicence({
      etablissement: 'Institut Supérieur de Gestion de Tunis (ISG)',
      diplomeType: 'Licence Nationale LMD',
      specialite: 'Informatique de Gestion & Business Intelligence',
      anneeObtention: 2026,
      annees: [
        { yearName: 'L1', moyenne: 14.10, session: 'principale', mention: 'Bien', credits: 60, redouble: false },
        { yearName: 'L2', moyenne: 14.65, session: 'principale', mention: 'Bien', credits: 60, redouble: false },
        { yearName: 'L3', moyenne: 15.40, session: 'principale', mention: 'Très Bien', credits: 60, redouble: false },
      ],
    });
    // Auto attach realistic sample files
    setDocuments(prev => prev.map(d => ({
      ...d,
      fileName: `${d.type.toUpperCase()}_Farah_BenMansour.pdf`,
      fileSize: '1.2 Mo',
      uploadedAt: new Date().toISOString().split('T')[0],
    })));
  };

  // Simulated file upload
  const handleSimulateUpload = (docId: string, customName?: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          fileName: customName || `${d.type.toUpperCase()}_Justificatif_${candidate.cin || 'CIN'}.pdf`,
          fileSize: '1.4 Mo',
          uploadedAt: new Date().toISOString().split('T')[0],
        };
      }
      return d;
    }));
  };

  const handleRemoveFile = (docId: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return { ...d, fileName: '', fileSize: '', uploadedAt: '' };
      }
      return d;
    }));
  };

  const handleFinalSubmit = () => {
    if (!honorPledge) {
      setErrors({ honor: 'Veuillez cocher la déclaration sur l’honneur pour valider votre candidature.' });
      return;
    }

    // Ensure documents have at least default filenames if empty
    const finalDocs = documents.map(d => {
      if (!d.fileName && d.required) {
        return {
          ...d,
          fileName: `${d.type.toUpperCase()}_${candidate.cin}.pdf`,
          fileSize: '1.1 Mo',
          uploadedAt: new Date().toISOString().split('T')[0],
        };
      }
      return d;
    });

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newApp: CandidateApplication = {
      id: `MST-2026-TUN-${randomSuffix}`,
      dateSoumission: new Date().toISOString().split('T')[0],
      candidate,
      bac,
      licence,
      score: currentScore,
      wishes,
      documents: finalDocs,
      status: 'soumis',
      statusNote: 'Dossier déposé avec succès sur la plateforme nationale. En attente de vérification administrative par la commission de sélection.',
    };

    onSubmitSuccess(newApp);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Fast Fill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
            Portail de Candidature Universitaire
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
            Formulaire d’Inscription au Mastère
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Année Universitaire 2026 / 2027 · Candidature numérique en 5 étapes
          </p>
        </div>

        {/* Demo Fast Fill Button */}
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          ⚡ Remplir avec profil exemple (Farah)
        </button>
      </div>

      {/* 5-Step Stepper Navigation */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { step: 1, title: 'Identité' },
          { step: 2, title: 'Cursus & Notes' },
          { step: 3, title: 'Vœux' },
          { step: 4, title: 'Pièces' },
          { step: 5, title: 'Validation' },
        ].map((s) => (
          <div
            key={s.step}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              currentStep === s.step
                ? 'bg-sky-50 border-sky-600 text-sky-900 font-bold'
                : currentStep > s.step
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-white border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="text-[10px] uppercase font-mono tracking-wider">
              Étape {s.step}
            </div>
            <div className="text-xs font-display truncate mt-0.5">
              {s.title}
            </div>
          </div>
        ))}
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* ================= STEP 1: IDENTITÉ ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-sky-700" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Étape 1 : Identité & Coordonnées du Candidat
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CIN Field */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Numéro de Carte d’Identité Nationale (CIN Tunisen) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={8}
                    value={candidate.cin}
                    onChange={(e) => setCandidate({ ...candidate, cin: formatCIN(e.target.value) })}
                    placeholder="Ex: 09876543 (8 chiffres)"
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 ${
                      errors.cin ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-sky-500'
                    }`}
                  />
                  {validateTunisianCIN(candidate.cin) && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3 top-2.5" />
                  )}
                </div>
                {errors.cin && <p className="text-xs text-rose-600 mt-1">{errors.cin}</p>}
                <p className="text-[11px] text-slate-400 mt-1">
                  Obligatoire : 8 chiffres sans espace. Sert d’identifiant unique pour le suivi.
                </p>
              </div>

              {/* French Names */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nom (en Français) *</label>
                <input
                  type="text"
                  value={candidate.nom}
                  onChange={(e) => setCandidate({ ...candidate, nom: e.target.value })}
                  placeholder="Ex: Ben Salem"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                {errors.nom && <p className="text-xs text-rose-600 mt-1">{errors.nom}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Prénom (en Français) *</label>
                <input
                  type="text"
                  value={candidate.prenom}
                  onChange={(e) => setCandidate({ ...candidate, prenom: e.target.value })}
                  placeholder="Ex: Amine"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                {errors.prenom && <p className="text-xs text-rose-600 mt-1">{errors.prenom}</p>}
              </div>

              {/* Arabic Names */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 text-right">اللقب (بالعربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={candidate.nomAr}
                  onChange={(e) => setCandidate({ ...candidate, nomAr: e.target.value })}
                  placeholder="مثال: بن سالم"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none text-right font-sans"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 text-right">الاسم (بالعربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={candidate.prenomAr}
                  onChange={(e) => setCandidate({ ...candidate, prenomAr: e.target.value })}
                  placeholder="مثال: أمين"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none text-right font-sans"
                />
              </div>

              {/* Birth & Governorate */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Date de naissance *</label>
                <input
                  type="date"
                  value={candidate.dateNaissance}
                  onChange={(e) => setCandidate({ ...candidate, dateNaissance: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Gouvernorat de résidence *</label>
                <select
                  value={candidate.gouvernorat}
                  onChange={(e) => setCandidate({ ...candidate, gouvernorat: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {GOVERNORATES_TUNISIA.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Email & Phone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Adresse Email *</label>
                <input
                  type="email"
                  value={candidate.email}
                  onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
                  placeholder="votre.email@domaine.tn"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Numéro de Téléphone (Tunisie) *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs font-mono">
                    +216
                  </span>
                  <input
                    type="tel"
                    maxLength={8}
                    value={candidate.telephone}
                    onChange={(e) => setCandidate({ ...candidate, telephone: e.target.value.replace(/\D/g, '') })}
                    placeholder="98 123 456"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-r-lg text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                {errors.telephone && <p className="text-xs text-rose-600 mt-1">{errors.telephone}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Adresse Postale Complète *</label>
                <input
                  type="text"
                  value={candidate.adresse}
                  onChange={(e) => setCandidate({ ...candidate, adresse: e.target.value })}
                  placeholder="Numéro, Rue, Ville, Code Postal"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                {errors.adresse && <p className="text-xs text-rose-600 mt-1">{errors.adresse}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CURSUS ACADÉMIQUE ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-700" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Étape 2 : Cursus du Baccalauréat et de la Licence
                </h3>
              </div>
              <div className="text-xs font-bold font-mono text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                Score Calculé : {currentScore.totalScore} / 20
              </div>
            </div>

            {/* Baccalauréat Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Baccalauréat Tunisien (ou équivalent)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Section du Bac *</label>
                  <select
                    value={bac.section}
                    onChange={(e) => setBac({ ...bac, section: e.target.value as BacSection })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Sciences Expérimentales">Sciences Expérimentales</option>
                    <option value="Sciences de l’Informatique">Sciences de l’Informatique</option>
                    <option value="Économie et Gestion">Économie et Gestion</option>
                    <option value="Sciences Techniques">Sciences Techniques</option>
                    <option value="Lettres">Lettres</option>
                    <option value="Sport">Sport</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Année d’obtention</label>
                  <input
                    type="number"
                    value={bac.annee}
                    onChange={(e) => setBac({ ...bac, annee: parseInt(e.target.value) || 2021 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Moyenne du Bac (/20)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="10"
                    max="20"
                    value={bac.moyenne}
                    onChange={(e) => setBac({ ...bac, moyenne: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Session</label>
                  <select
                    value={bac.session}
                    onChange={(e) => setBac({ ...bac, session: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="principale">Principale</option>
                    <option value="controle">Contrôle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Licence Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Établissement Universitaire d’origine (Faculté / Institut) *
                </label>
                <input
                  type="text"
                  value={licence.etablissement}
                  onChange={(e) => setLicence({ ...licence, etablissement: e.target.value })}
                  placeholder="Ex: FST Tunis, ISG, INSAT, IHEC, ISAMM..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                {errors.etablissement && <p className="text-xs text-rose-600 mt-1">{errors.etablissement}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Spécialité / Intitulé de la Licence *
                </label>
                <input
                  type="text"
                  value={licence.specialite}
                  onChange={(e) => setLicence({ ...licence, specialite: e.target.value })}
                  placeholder="Ex: Sciences de l’Informatique, Finance, Comptabilité..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                {errors.specialite && <p className="text-xs text-rose-600 mt-1">{errors.specialite}</p>}
              </div>
            </div>

            {/* Detailed Licence Years (L1, L2, L3) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Relevé des moyennes annuelles (Système LMD)
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {licence.annees.map((year, idx) => (
                  <div key={year.yearName} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{year.yearName}</span>
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={year.redouble}
                          onChange={(e) => {
                            const newYears = [...licence.annees];
                            newYears[idx].redouble = e.target.checked;
                            setLicence({ ...licence, annees: newYears as any });
                          }}
                          className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                        />
                        <span>Redoublé</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Moyenne (/20)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="10"
                        max="20"
                        value={year.moyenne}
                        onChange={(e) => {
                          const newYears = [...licence.annees];
                          newYears[idx].moyenne = parseFloat(e.target.value) || 0;
                          setLicence({ ...licence, annees: newYears as any });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono tabular-nums focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Session</label>
                      <select
                        value={year.session}
                        onChange={(e) => {
                          const newYears = [...licence.annees];
                          newYears[idx].session = e.target.value as any;
                          setLicence({ ...licence, annees: newYears as any });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      >
                        <option value="principale">Principale (+)</option>
                        <option value="controle">Contrôle</option>
                      </select>
                    </div>

                    {year.yearName === 'L3' && (
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Mention Diplôme</label>
                        <select
                          value={year.mention}
                          onChange={(e) => {
                            const newYears = [...licence.annees];
                            newYears[idx].mention = e.target.value as any;
                            setLicence({ ...licence, annees: newYears as any });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                          <option value="Passable">Passable</option>
                          <option value="Assez Bien">Assez Bien (+0.5)</option>
                          <option value="Bien">Bien (+1.0)</option>
                          <option value="Très Bien">Très Bien (+1.5)</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Score Callout */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between flex-wrap gap-4 text-xs text-sky-900">
              <div className="space-y-0.5">
                <span className="font-bold block">Récapitulatif du Score Candidat</span>
                <span className="text-sky-700">
                  Moyenne LMD: {currentScore.baseAverage} · Sans redoublement: +{currentScore.bonusCursusSansRedoublement} · Session Principale: +{currentScore.bonusSessionsPrincipales} · Mention: +{currentScore.bonusMentionLicence}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-sky-700 block">Total Prévisionnel</span>
                <span className="text-2xl font-black font-mono text-sky-800">{currentScore.totalScore} / 20</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: VŒUX DE MASTÈRES ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-sky-700" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Étape 3 : Sélection et Hiérarchisation des Vœux (jusqu’à 3 choix)
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Vous pouvez formuler jusqu’à 3 vœux ordonnés. Le Vœu n°1 sera examiné en priorité absolue par la commission d’admission.
            </p>

            <div className="space-y-4">
              {[1, 2, 3].map((priorityIndex) => {
                const currentWish = wishes.find(w => w.priority === priorityIndex);

                return (
                  <div key={priorityIndex} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
                        Choix n° {priorityIndex} {priorityIndex === 1 && '(Priorité Absolue)'}
                      </span>
                      {currentWish && priorityIndex > 1 && (
                        <button
                          type="button"
                          onClick={() => setWishes(wishes.filter(w => w.priority !== priorityIndex))}
                          className="text-xs text-rose-600 hover:text-rose-800"
                        >
                          Supprimer ce vœu
                        </button>
                      )}
                    </div>

                    <select
                      value={currentWish?.mastereId || ''}
                      onChange={(e) => {
                        const mId = e.target.value;
                        if (!mId) {
                          setWishes(wishes.filter(w => w.priority !== priorityIndex));
                          return;
                        }
                        const found = masteres.find(m => m.id === mId);
                        if (!found) return;

                        const newWish: ApplicationWish = {
                          priority: priorityIndex as 1 | 2 | 3,
                          mastereId: found.id,
                          mastereTitle: found.title,
                          faculty: found.faculty,
                          university: found.university,
                        };

                        setWishes(prev => {
                          const filtered = prev.filter(w => w.priority !== priorityIndex);
                          return [...filtered, newWish].sort((a, b) => a.priority - b.priority);
                        });
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="">-- {priorityIndex === 1 ? 'Sélectionner votre 1er vœu obligatoire' : 'Sélectionner un vœu optionnel'} --</option>
                      {masteres.map(m => (
                        <option key={m.id} value={m.id}>
                          [{m.type === 'recherche' ? 'Recherche' : 'Pro'}] {m.title} — {m.faculty}
                        </option>
                      ))}
                    </select>

                    {currentWish && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{currentWish.faculty} · {currentWish.university}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.wishes && <p className="text-xs text-rose-600">{errors.wishes}</p>}
          </div>
        )}

        {/* ================= STEP 4: PIÈCES JOINTES ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-700" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Étape 4 : Téléversement des Pièces Justificatives (PDF / Scan)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDocuments(prev => prev.map(d => ({
                    ...d,
                    fileName: `${d.type.toUpperCase()}_Candidat_${candidate.cin || 'CIN'}.pdf`,
                    fileSize: '1.2 Mo',
                    uploadedAt: new Date().toISOString().split('T')[0],
                  })));
                }}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                Tout joindre automatiquement (Mode Test)
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Formats acceptés : PDF ou images lisibles (JPEG, PNG). Taille maximale : 5 Mo par fichier.
            </p>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <FileText className={`w-5 h-5 mt-0.5 shrink-0 ${doc.fileName ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{doc.label}</span>
                        {doc.required ? (
                          <span className="text-[10px] text-rose-600 font-semibold">* Requis</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-normal">Optionnel</span>
                        )}
                      </div>
                      {doc.fileName ? (
                        <div className="text-[11px] text-emerald-700 font-mono mt-0.5 flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          <span>{doc.fileName}</span>
                          <span>({doc.fileSize})</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 block mt-0.5">Aucun document attaché</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {doc.fileName ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                        title="Supprimer le document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateUpload(doc.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-white hover:bg-sky-50 border border-slate-300 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
                      >
                        Téléverser
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 5: VÉRIFICATION & CONFIRMATION ================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Étape 5 : Récapitulatif Final & Engagement sur l’Honneur
              </h3>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Identity summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 uppercase tracking-wider mb-2">Identité du Candidat</div>
                <div><span className="text-slate-500">CIN :</span> <strong className="font-mono">{candidate.cin}</strong></div>
                <div><span className="text-slate-500">Nom & Prénom :</span> <strong>{candidate.prenom} {candidate.nom} ({candidate.prenomAr} {candidate.nomAr})</strong></div>
                <div><span className="text-slate-500">Email :</span> <strong className="font-mono">{candidate.email}</strong></div>
                <div><span className="text-slate-500">Téléphone :</span> <strong className="font-mono">+216 {candidate.telephone}</strong></div>
                <div><span className="text-slate-500">Gouvernorat :</span> <strong>{candidate.gouvernorat}</strong></div>
              </div>

              {/* Academic & Score summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 uppercase tracking-wider mb-2">Cursus & Score</div>
                <div><span className="text-slate-500">Baccalauréat :</span> <strong>{bac.section} ({bac.moyenne}/20)</strong></div>
                <div><span className="text-slate-500">Établissement :</span> <strong>{licence.etablissement}</strong></div>
                <div><span className="text-slate-500">Licence :</span> <strong>{licence.specialite}</strong></div>
                <div><span className="text-slate-500">Moyennes :</span> <strong className="font-mono">L1: {licence.annees[0].moyenne} | L2: {licence.annees[1].moyenne} | L3: {licence.annees[2].moyenne}</strong></div>
                <div className="pt-1 border-t border-slate-200 text-sky-800 font-bold flex items-center justify-between">
                  <span>Score d’admission calculé :</span>
                  <span className="font-mono text-sm">{currentScore.totalScore} / 20</span>
                </div>
              </div>
            </div>

            {/* Wishes summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 uppercase tracking-wider">
                Vœux de Mastères Enregistrés ({wishes.length})
              </div>
              <div className="space-y-1.5">
                {wishes.map((w) => (
                  <div key={w.priority} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                      {w.priority}
                    </span>
                    <span className="font-semibold text-slate-900">{w.mastereTitle}</span>
                    <span className="text-slate-500">({w.faculty})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Honor Pledge Checkbox */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={honorPledge}
                  onChange={(e) => setHonorPledge(e.target.checked)}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 shrink-0"
                />
                <span className="text-xs text-amber-950 leading-relaxed font-medium">
                  <strong>Déclaration sur l’honneur :</strong> Je certifie sur l’honneur l’exactitude rigoureuse de l’ensemble des notes et informations déclarées dans ce formulaire. Je reconnais formellement que toute fausse déclaration ou falsification de document entraîne le rejet définitif de ma candidature et l’annulation de toute éventuelle admission, sans préjudice des sanctions prévues par les lois universitaires en vigueur en République Tunisienne.
                </span>
              </label>
              {errors.honor && <p className="text-xs text-rose-600 font-semibold">{errors.honor}</p>}
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>

          <div>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Continuer vers l’étape suivante</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-8 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer et Soumettre ma Candidature</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
