export type MasterType = 'recherche' | 'professionnel';

export type MasterDomain = 
  | 'Informatique & IA'
  | 'Gestion & Finance'
  | 'Ingénierie & Technologie'
  | 'Sciences Fondamentales'
  | 'Droit & Sciences Politiques'
  | 'Design & Multimédia';

export interface MastereProgram {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  type: MasterType;
  domain: MasterDomain;
  university: string;
  faculty: string;
  city: string;
  places: number;
  deadline: string;
  description: string;
  prerequisites: string[];
  careerOpportunities: string[];
  coordinator: string;
  contactEmail: string;
  formulaDescription: string;
  image: string;
}

export type BacSection = 
  | 'Mathématiques'
  | 'Sciences Expérimentales'
  | 'Sciences de l’Informatique'
  | 'Économie et Gestion'
  | 'Sciences Techniques'
  | 'Lettres'
  | 'Sport';

export interface BacInfo {
  annee: number;
  section: BacSection;
  session: 'principale' | 'controle';
  moyenne: number;
  mention: 'Passable' | 'Assez Bien' | 'Bien' | 'Très Bien';
}

export interface LicenceYearData {
  yearName: 'L1' | 'L2' | 'L3';
  moyenne: number;
  session: 'principale' | 'controle';
  mention: 'Passable' | 'Assez Bien' | 'Bien' | 'Très Bien';
  credits: number;
  redouble: boolean;
}

export interface LicenceInfo {
  etablissement: string;
  diplomeType: 'Licence Nationale LMD' | 'Licence Fondamentale' | 'Licence Appliquée' | 'Diplôme Équivalent';
  specialite: string;
  anneeObtention: number;
  annees: [LicenceYearData, LicenceYearData, LicenceYearData];
}

export interface CandidateInfo {
  cin: string; // 8 digits in Tunisia
  nom: string;
  prenom: string;
  nomAr: string;
  prenomAr: string;
  dateNaissance: string;
  lieuNaissance: string;
  gouvernorat: string;
  email: string;
  telephone: string;
  adresse: string;
}

export interface ApplicationWish {
  priority: 1 | 2 | 3;
  mastereId: string;
  mastereTitle: string;
  faculty: string;
  university: string;
}

export interface UploadedFileDoc {
  id: string;
  type: 'cin' | 'releve_l1' | 'releve_l2' | 'releve_l3' | 'diplome_bac' | 'attestation_licence' | 'cv' | 'lettre_motivation';
  label: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  required: boolean;
}

export type ApplicationStatus = 
  | 'soumis'
  | 'en_examen'
  | 'preselectionne'
  | 'entretien'
  | 'admis'
  | 'liste_attente'
  | 'rejete';

export interface ScoreBreakdown {
  baseAverage: number;
  bonusCursusSansRedoublement: number;
  bonusSessionsPrincipales: number;
  bonusMentionLicence: number;
  penaliteRedoublement: number;
  totalScore: number;
}

export interface CandidateApplication {
  id: string; // e.g. MST-2026-TUN-89214
  dateSoumission: string;
  candidate: CandidateInfo;
  bac: BacInfo;
  licence: LicenceInfo;
  score: ScoreBreakdown;
  wishes: ApplicationWish[];
  documents: UploadedFileDoc[];
  status: ApplicationStatus;
  statusNote?: string;
  dateEntretien?: string;
  salleEntretien?: string;
}

export interface SimulatedEmail {
  id: string;
  applicationId: string;
  recipientName: string;
  recipientEmail: string;
  sender: string;
  subject: string;
  sentAt: string;
  candidateCin: string;
  scoreTotal: number;
  wishes: ApplicationWish[];
  isRead: boolean;
}
