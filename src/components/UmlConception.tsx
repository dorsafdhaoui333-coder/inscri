import React, { useState } from 'react';
import { 
  FileCode, 
  GitFork, 
  Copy, 
  Check, 
  Layers, 
  FileText, 
  Printer, 
  Download, 
  BookOpen, 
  Boxes, 
  UserCheck, 
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface UmlConceptionProps {
  lang: 'fr' | 'ar' | 'tn';
}

export const UmlConception: React.FC<UmlConceptionProps> = ({ lang }) => {
  const [activeDiagram, setActiveDiagram] = useState<'usecase' | 'classes'>('usecase');
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'fiche' | 'dictionnaire'>('visual');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // PlantUML Use Case
  const plantUmlUseCase = `@startuml Diagramme_Cas_Utilisation_Mastere
left to right direction
skinparam packageStyle rectangle
skinparam roundcorner 10
skinparam actorStyle awesome

actor "Candidat (Étudiant)" as Candidat
actor "Membre Commission / Jury" as Jury
actor "Administrateur Système" as Admin

rectangle "Portail National d'Inscription aux Mastères" {
  ' Cas d'utilisation Candidat
  usecase "Consulter catalogue des mastères" as UC_Consulter
  usecase "Simuler le score LMD" as UC_Simuler
  usecase "Déposer candidature" as UC_Deposer
  usecase "Renseigner cursus & notes" as UC_Notes
  usecase "Téléverser pièces justificatives" as UC_Pieces
  usecase "Hiérarchiser les vœux (1 à 3)" as UC_Voeux
  usecase "Imprimer récépissé d'inscription" as UC_Recepisse
  usecase "Suivre état du dossier" as UC_Suivre
  usecase "Confirmer admission définitive" as UC_Confirmer

  ' Relations Candidat
  Candidat --> UC_Consulter
  Candidat --> UC_Simuler
  Candidat --> UC_Deposer
  Candidat --> UC_Suivre
  Candidat --> UC_Confirmer

  UC_Deposer ..> UC_Notes : <<include>>
  UC_Deposer ..> UC_Pieces : <<include>>
  UC_Deposer ..> UC_Voeux : <<include>>
  UC_Recepisse ..> UC_Deposer : <<extend>>

  ' Cas d'utilisation Jury
  usecase "Consulter & classer candidatures" as UC_Classer
  usecase "Calculer automatiquement le score" as UC_CalculScore
  usecase "Vérifier conformité des pièces" as UC_VerifPieces
  usecase "Planifier entretiens oraux" as UC_Entretien
  usecase "Délibérer & publier résultats" as UC_Deliberer
  usecase "Exporter délibérations (CSV/PDF)" as UC_Export

  Jury --> UC_Classer
  Jury --> UC_VerifPieces
  Jury --> UC_Entretien
  Jury --> UC_Deliberer
  Jury --> UC_Export

  UC_Classer ..> UC_CalculScore : <<include>>

  ' Cas d'utilisation Admin
  usecase "Gérer les mastères & quotas" as UC_ParamMastere
  usecase "Gérer comptes & commissions" as UC_GestionComptes
  usecase "Clôturer session de candidature" as UC_Cloturer

  Admin --> UC_ParamMastere
  Admin --> UC_GestionComptes
  Admin --> UC_Cloturer
}
@enduml`;

  // Mermaid Use Case
  const mermaidUseCase = `flowchart LR
    subgraph Acteurs
        C[Candidat / Étudiant]
        J[Membre Jury / Commission]
        A[Administrateur Système]
    end

    subgraph Portail_Mastere ["Portail National des Mastères"]
        UC1([Consulter Catalogue des Mastères])
        UC2([Simuler Score LMD])
        UC3([Déposer Candidature])
        UC3_1([Renseigner Cursus & Notes])
        UC3_2([Téléverser Justificatifs])
        UC3_3([Choisir Vœux 1..3])
        UC4([Imprimer Récépissé Officiel])
        UC5([Suivre État du Dossier])
        UC6([Consulter & Classer Candidats])
        UC7([Vérifier Pièces])
        UC8([Délibérer & Publier Listes])
        UC9([Gérer Mastères & Quotas])
    end

    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC5
    UC3 -.->|<<include>>| UC3_1
    UC3 -.->|<<include>>| UC3_2
    UC3 -.->|<<include>>| UC3_3
    UC4 -.->|<<extend>>| UC3

    J --> UC6
    J --> UC7
    J --> UC8

    A --> UC9`;

  // PlantUML Class Diagram
  const plantUmlClass = `@startuml Diagramme_Classes_Mastere
skinparam classAttributeIconSize 0
skinparam roundcorner 5

abstract class Utilisateur {
  # id : String
  # nom : String
  # prenom : String
  # email : String
  # motDePasse : String
  # dateCreation : DateTime
  + seConnecter() : Boolean
  + seDeconnecter() : Void
  + modifierProfil() : Void
}

class Candidat {
  - cin : String {8 chiffres}
  - nomAr : String
  - prenomAr : String
  - dateNaissance : Date
  - lieuNaissance : String
  - gouvernorat : String
  - telephone : String
  - adresse : String
  + calculerScore() : Float
  + deposerDossier() : DossierCandidature
  + telechargerRecepisse() : Document
}

class MembreCommission {
  - matricule : String
  - grade : String
  - departement : String
  + validerDossier(idDossier) : Void
  + noterEntretien(note: Float) : Void
  + delibererResultats() : Void
}

class Administrateur {
  - privilege : Int
  + creerMastere(m: Mastere) : Void
  + modifierQuota(m: Mastere, nb: Int) : Void
  + cloturerSession() : Void
}

class Etablissement {
  - id : String
  - nom : String
  - code : String
  - universite : String
  - ville : String
}

class Mastere {
  - id : String
  - code : String
  - intitule : String
  - intituleAr : String
  - type : TypeMastere
  - domaine : DomaineMastere
  - places : Int
  - dateLimite : Date
  - description : String
  - formuleScore : String
  + verifierEligibilite(c: Candidat) : Boolean
}

class DossierCandidature {
  - numeroDossier : String {PK}
  - dateDepot : Date
  - statut : StatutCandidature
  - scoreTotal : Float
  - declarationHonneur : Boolean
  - observationsJury : String
  + soumettre() : Void
  + genererFichePDF() : Byte[]
}

class CursusBac {
  - annee : Int
  - section : SectionBac
  - session : SessionExamen
  - moyenne : Float
  - mention : MentionDiplome
}

class CursusLicence {
  - etablissementOrigine : String
  - typeDiplome : String
  - specialite : String
  - anneeObtention : Int
  + calculerMoyenneLMD() : Float
}

class AnneeLicence {
  - annee : AnneeLMD {L1, L2, L3}
  - moyenne : Float
  - session : SessionExamen
  - mention : MentionDiplome
  - credits : Int
  - estRedouble : Boolean
}

class Voeu {
  - priorite : Int {1..3}
  - dateChoix : DateTime
}

class PieceJointe {
  - id : String
  - typePiece : TypePiece
  - nomFichier : String
  - taille : String
  - dateUpload : DateTime
  - estValide : Boolean
  + verifierDocument() : Boolean
}

class Deliberation {
  - dateDeliberation : DateTime
  - decision : StatutCandidature
  - rang : Int
  - dateEntretien : DateTime
  - salleEntretien : String
  - commentaire : String
}

enum TypeMastere {
  RECHERCHE
  PROFESSIONNEL
}

enum StatutCandidature {
  SOUMIS
  EN_EXAMEN
  PRESELECTIONNE
  CONVOQUE_ENTRETIEN
  ADMIS_LISTE_PRINCIPALE
  LISTE_ATTENTE
  REJETE
}

enum SessionExamen {
  PRINCIPALE
  CONTROLE
}

' Relations d'Héritage
Utilisateur <|-- Candidat
Utilisateur <|-- MembreCommission
Utilisateur <|-- Administrateur

' Relations Métier
Candidat "1" -- "0..1" DossierCandidature : dépose >
DossierCandidature "1" *-- "1" CursusBac : contient >
DossierCandidature "1" *-- "1" CursusLicence : contient >
CursusLicence "1" *-- "3" AnneeLicence : comprend >

DossierCandidature "1" *-- "1..3" Voeu : formule >
Voeu "*" -- "1" Mastere : concerne >

DossierCandidature "1" *-- "1..*" PieceJointe : justifié par >

Mastere "*" -- "1" Etablissement : rattaché à >
MembreCommission "*" -- "1..*" Mastere : évalue >

DossierCandidature "1" -- "0..1" Deliberation : fait l'objet de >
MembreCommission "1..*" -- "*" Deliberation : statue sur >
@enduml`;

  // Mermaid Class Diagram
  const mermaidClass = `classDiagram
    class Utilisateur {
        <<Abstract>>
        #String id
        #String nom
        #String prenom
        #String email
        #String motDePasse
        +seConnecter() Boolean
        +seDeconnecter() Void
    }

    class Candidat {
        -String cin
        -String nomAr
        -String prenomAr
        -Date dateNaissance
        -String gouvernorat
        -String telephone
        +calculerScore() Float
        +deposerDossier() Dossier
        +telechargerRecepisse() File
    }

    class MembreCommission {
        -String matricule
        -String grade
        -String departement
        +validerDossier() Void
        +noterEntretien() Void
    }

    class Administrateur {
        -Int privilege
        +creerMastere() Void
        +cloturerSession() Void
    }

    class Mastere {
        -String code
        -String intitule
        -String type
        -Int places
        -Date dateLimite
        +verifierEligibilite() Boolean
    }

    class DossierCandidature {
        -String numeroDossier
        -Date dateDepot
        -String statut
        -Float scoreTotal
        +soumettre() Void
        +genererFichePDF() File
    }

    class Voeu {
        -Int priorite
        -Date dateChoix
    }

    class PieceJointe {
        -String typePiece
        -String nomFichier
        -Boolean estValide
    }

    Utilisateur <|-- Candidat
    Utilisateur <|-- MembreCommission
    Utilisateur <|-- Administrateur

    Candidat "1" --> "0..1" DossierCandidature : depose
    DossierCandidature "1" *-- "1..3" Voeu : contient
    Voeu "*" --> "1" Mastere : vise
    DossierCandidature "1" *-- "1..*" PieceJointe : inclut`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>Génie Logiciel & Conception UML 2.5</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Modélisation UML : Cas d’Utilisation & Diagramme de Classes
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Conception complète demandée pour les projets universitaires et PFE : diagrammes vectoriels, fiches descriptives détaillées, code PlantUML/Mermaid prêt à l’export.
          </p>
        </div>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs flex items-center gap-2 self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Imprimer le Dossier UML</span>
        </button>
      </div>

      {/* Selector: Use Case vs Class Diagram */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveDiagram('usecase')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeDiagram === 'usecase'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-4 h-4 text-sky-600" />
            <span>1. Diagramme de Cas d’Utilisation (Use Case)</span>
          </button>
          <button
            onClick={() => setActiveDiagram('classes')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeDiagram === 'classes'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4 text-emerald-600" />
            <span>2. Diagramme de Classes (Class Diagram)</span>
          </button>
        </div>

        {/* View Sub-Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs font-medium text-slate-700">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'visual' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Vue Graphique Vectorielle (SVG)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'code' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Code PlantUML & Mermaid
          </button>
          <button
            onClick={() => setActiveTab(activeDiagram === 'usecase' ? 'fiche' : 'dictionnaire')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'fiche' || activeTab === 'dictionnaire' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            {activeDiagram === 'usecase' ? 'Fiches Descriptives Académiques' : 'Dictionnaire des Classes & Règles'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. USE CASE SECTION                                                       */}
      {/* ========================================================================= */}
      {activeDiagram === 'usecase' && (
        <div className="space-y-6">
          {activeTab === 'visual' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Diagramme des Cas d’Utilisation UML 2.5
                  </h3>
                  <span className="text-xs text-slate-500">
                    Système : Plateforme Nationale d’Inscription aux Mastères Universitaires
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Acteurs : <strong className="text-slate-800">3</strong></span>
                  <span>·</span>
                  <span>Cas : <strong className="text-slate-800">14</strong></span>
                  <span>·</span>
                  <span>Packages : <strong className="text-slate-800">3</strong></span>
                </div>
              </div>

              {/* Clean Vector SVG Use Case Diagram */}
              <div className="overflow-x-auto bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <svg viewBox="0 0 1000 680" className="w-full min-w-[850px] h-auto select-none font-sans">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
                    </marker>
                    <marker id="dashedArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#0284c7" />
                    </marker>
                  </defs>

                  {/* System Boundary Rectangle */}
                  <rect x="230" y="20" width="550" height="640" rx="16" fill="#ffffff" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
                  <rect x="230" y="20" width="550" height="34" rx="16" fill="#f0f9ff" />
                  <text x="250" y="42" fill="#0369a1" fontSize="13" fontWeight="bold">
                    Système : Portail National d'Inscription aux Mastères Universitaires
                  </text>

                  {/* ================= ACTORS ================= */}
                  {/* Actor 1: Candidat */}
                  <g transform="translate(60, 200)">
                    <circle cx="35" cy="20" r="14" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
                    <line x1="35" y1="34" x2="35" y2="70" stroke="#1e293b" strokeWidth="2" />
                    <line x1="10" y1="48" x2="60" y2="48" stroke="#1e293b" strokeWidth="2" />
                    <line x1="35" y1="70" x2="15" y2="105" stroke="#1e293b" strokeWidth="2" />
                    <line x1="35" y1="70" x2="55" y2="105" stroke="#1e293b" strokeWidth="2" />
                    <text x="35" y="125" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Candidat</text>
                    <text x="35" y="140" textAnchor="middle" fill="#64748b" fontSize="10">(Étudiant LMD)</text>
                  </g>

                  {/* Actor 2: Membre Commission */}
                  <g transform="translate(860, 220)">
                    <circle cx="35" cy="20" r="14" fill="#f8fafc" stroke="#047857" strokeWidth="2" />
                    <line x1="35" y1="34" x2="35" y2="70" stroke="#047857" strokeWidth="2" />
                    <line x1="10" y1="48" x2="60" y2="48" stroke="#047857" strokeWidth="2" />
                    <line x1="35" y1="70" x2="15" y2="105" stroke="#047857" strokeWidth="2" />
                    <line x1="35" y1="70" x2="55" y2="105" stroke="#047857" strokeWidth="2" />
                    <text x="35" y="125" textAnchor="middle" fill="#065f46" fontSize="12" fontWeight="bold">Commission</text>
                    <text x="35" y="140" textAnchor="middle" fill="#64748b" fontSize="10">(Jury / Enseignant)</text>
                  </g>

                  {/* Actor 3: Administrateur */}
                  <g transform="translate(860, 480)">
                    <circle cx="35" cy="20" r="14" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
                    <line x1="35" y1="34" x2="35" y2="70" stroke="#475569" strokeWidth="2" />
                    <line x1="10" y1="48" x2="60" y2="48" stroke="#475569" strokeWidth="2" />
                    <line x1="35" y1="70" x2="15" y2="105" stroke="#475569" strokeWidth="2" />
                    <line x1="35" y1="70" x2="55" y2="105" stroke="#475569" strokeWidth="2" />
                    <text x="35" y="125" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Administrateur</text>
                    <text x="35" y="140" textAnchor="middle" fill="#64748b" fontSize="10">(Scolarité)</text>
                  </g>

                  {/* ================= USE CASES ================= */}
                  {/* UC: Consulter Catalogue */}
                  <g transform="translate(260, 70)">
                    <ellipse cx="95" cy="22" rx="90" ry="20" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="95" y="26" textAnchor="middle" fill="#0f172a" fontSize="11">Consulter les mastères</text>
                  </g>

                  {/* UC: Simuler Score */}
                  <g transform="translate(260, 125)">
                    <ellipse cx="95" cy="22" rx="90" ry="20" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="95" y="26" textAnchor="middle" fill="#0f172a" fontSize="11">Simuler le score LMD</text>
                  </g>

                  {/* UC: Déposer Candidature (Main Hub) */}
                  <g transform="translate(260, 190)">
                    <ellipse cx="105" cy="24" rx="100" ry="23" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2" />
                    <text x="105" y="28" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">Déposer candidature</text>
                  </g>

                  {/* Included UCs */}
                  <g transform="translate(540, 140)">
                    <ellipse cx="105" cy="20" rx="100" ry="18" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2" />
                    <text x="105" y="24" textAnchor="middle" fill="#334155" fontSize="10.5">Renseigner cursus & notes</text>
                  </g>

                  <g transform="translate(540, 195)">
                    <ellipse cx="105" cy="20" rx="100" ry="18" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2" />
                    <text x="105" y="24" textAnchor="middle" fill="#334155" fontSize="10.5">Téléverser justificatifs</text>
                  </g>

                  <g transform="translate(540, 250)">
                    <ellipse cx="105" cy="20" rx="100" ry="18" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2" />
                    <text x="105" y="24" textAnchor="middle" fill="#334155" fontSize="10.5">Hiérarchiser vœux (1..3)</text>
                  </g>

                  {/* Extended UC: Imprimer Récépissé */}
                  <g transform="translate(260, 260)">
                    <ellipse cx="95" cy="22" rx="90" ry="20" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                    <text x="95" y="26" textAnchor="middle" fill="#92400e" fontSize="10.5">Imprimer récépissé PDF</text>
                  </g>

                  {/* UC: Suivre Dossier */}
                  <g transform="translate(260, 320)">
                    <ellipse cx="95" cy="22" rx="90" ry="20" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="95" y="26" textAnchor="middle" fill="#0f172a" fontSize="11">Suivre état du dossier</text>
                  </g>

                  {/* Commission UCs */}
                  <g transform="translate(540, 330)">
                    <ellipse cx="105" cy="22" rx="100" ry="20" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
                    <text x="105" y="26" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="bold">Classer candidats / score</text>
                  </g>

                  <g transform="translate(540, 385)">
                    <ellipse cx="105" cy="22" rx="100" ry="20" fill="#f8fafc" stroke="#059669" strokeWidth="1.5" />
                    <text x="105" y="26" textAnchor="middle" fill="#065f46" fontSize="11">Vérifier conformité pièces</text>
                  </g>

                  <g transform="translate(540, 440)">
                    <ellipse cx="105" cy="22" rx="100" ry="20" fill="#f8fafc" stroke="#059669" strokeWidth="1.5" />
                    <text x="105" y="26" textAnchor="middle" fill="#065f46" fontSize="11">Convoquer aux entretiens</text>
                  </g>

                  <g transform="translate(540, 495)">
                    <ellipse cx="105" cy="22" rx="100" ry="20" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
                    <text x="105" y="26" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="bold">Publier listes admis</text>
                  </g>

                  {/* Admin UCs */}
                  <g transform="translate(540, 560)">
                    <ellipse cx="105" cy="22" rx="100" ry="20" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                    <text x="105" y="26" textAnchor="middle" fill="#1e293b" fontSize="11">Gérer mastères & quotas</text>
                  </g>

                  <g transform="translate(540, 615)">
                    <ellipse cx="105" cy="22" rx="100" ry="20" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                    <text x="105" y="26" textAnchor="middle" fill="#1e293b" fontSize="11">Clôturer la session</text>
                  </g>

                  {/* ================= CONNECTING LINES ================= */}
                  {/* Candidat Connections */}
                  <line x1="120" y1="240" x2="260" y2="92" stroke="#475569" strokeWidth="1.2" />
                  <line x1="120" y1="250" x2="260" y2="147" stroke="#475569" strokeWidth="1.2" />
                  <line x1="120" y1="260" x2="260" y2="213" stroke="#0369a1" strokeWidth="1.8" />
                  <line x1="120" y1="270" x2="260" y2="342" stroke="#475569" strokeWidth="1.2" />

                  {/* Includes Dashed Arrows */}
                  <path d="M 470 205 L 535 165" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#dashedArrow)" />
                  <text x="495" y="175" fill="#0284c7" fontSize="9" fontWeight="bold">«include»</text>

                  <path d="M 470 215 L 535 215" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#dashedArrow)" />
                  <text x="480" y="210" fill="#0284c7" fontSize="9" fontWeight="bold">«include»</text>

                  <path d="M 470 225 L 535 265" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#dashedArrow)" />
                  <text x="495" y="255" fill="#0284c7" fontSize="9" fontWeight="bold">«include»</text>

                  {/* Extend Arrow from Imprimer to Deposer */}
                  <path d="M 355 260 L 355 240" stroke="#d97706" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#dashedArrow)" />
                  <text x="365" y="252" fill="#d97706" fontSize="9" fontWeight="bold">«extend»</text>

                  {/* Commission Connections */}
                  <line x1="860" y1="280" x2="745" y2="352" stroke="#059669" strokeWidth="1.4" />
                  <line x1="860" y1="285" x2="745" y2="407" stroke="#059669" strokeWidth="1.2" />
                  <line x1="860" y1="290" x2="745" y2="462" stroke="#059669" strokeWidth="1.2" />
                  <line x1="860" y1="295" x2="745" y2="517" stroke="#059669" strokeWidth="1.4" />

                  {/* Admin Connections */}
                  <line x1="860" y1="540" x2="745" y2="582" stroke="#475569" strokeWidth="1.2" />
                  <line x1="860" y1="550" x2="745" y2="637" stroke="#475569" strokeWidth="1.2" />
                </svg>
              </div>

              {/* Legend Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-600 shrink-0" />
                  <span><strong>Espace Candidat :</strong> Dépôt, calcul du score, suivi par CIN</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                  <span><strong>Espace Jury :</strong> Classement automatique, conformité, délibération</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-600 shrink-0" />
                  <span><strong>Relations UML :</strong> «include» obligatoire, «extend» conditionnelle</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Code Source PlantUML (Use Case)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(plantUmlUseCase, 'plantuml-uc')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copiedType === 'plantuml-uc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'plantuml-uc' ? 'Copié !' : 'Copier PlantUML'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-2 leading-relaxed max-h-[380px]">
                  {plantUmlUseCase}
                </pre>
              </div>

              {/* Mermaid Block */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Code Source Mermaid.js (Use Case)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(mermaidUseCase, 'mermaid-uc')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copiedType === 'mermaid-uc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'mermaid-uc' ? 'Copié !' : 'Copier Mermaid'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-2 leading-relaxed max-h-[260px]">
                  {mermaidUseCase}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'fiche' && (
            <div className="space-y-6">
              {/* Fiche 1: Déposer Candidature */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-sky-700 uppercase tracking-wider block">
                      Fiche Descriptive CU-01
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      Cas d'Utilisation : Déposer un dossier de candidature au mastère
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Priorité : Critique
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <strong className="text-slate-900 block font-semibold">Acteur Principal :</strong>
                    <span className="text-slate-600">Candidat (Étudiant diplômé ou en cours de validation de Licence LMD).</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <strong className="text-slate-900 block font-semibold">Acteur Secondaire :</strong>
                    <span className="text-slate-600">Système National de Calcul des Scores Universitaires.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <strong className="text-slate-900 block font-semibold">Préconditions :</strong>
                    <span className="text-slate-600">La session de candidature aux mastères doit être ouverte (avant date limite). Le candidat dispose de son CIN et de ses relevés de notes.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <strong className="text-slate-900 block font-semibold">Postconditions :</strong>
                    <span className="text-slate-600">Un numéro de dossier unique (MST-2026-TUN-XXXXX) est alloué, le score est calculé, et la fiche de candidature avec QR Code est disponible au téléchargement.</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <strong className="text-slate-900 block font-semibold">Scénario Nominal (Étapes de succès) :</strong>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <li>Le candidat accède à l'espace de candidature et renseigne son CIN tunisien valide à 8 chiffres.</li>
                    <li>Le candidat saisit ses coordonnées d'état civil (nom, prénom en français et arabe, téléphone, gouvernorat).</li>
                    <li>Le candidat saisit les données du Baccalauréat et le détail de ses 3 années de Licence LMD (L1, L2, L3, sessions, redoublements éventuels).</li>
                    <li>Le système calcule en temps réel le Score Global officiel selon le barème ministériel.</li>
                    <li>Le candidat sélectionne et ordonne ses vœux de mastères (de 1 à 3 choix prioritaires).</li>
                    <li>Le candidat téléverse les copies numériques certifiées (CIN, relevés L1/L2/L3, attestation).</li>
                    <li>Le candidat valide la déclaration sur l'honneur d'exactitude des informations.</li>
                    <li>Le système enregistre la candidature, génère le Récépissé Officiel PDF horodaté et notifie le candidat.</li>
                  </ol>
                </div>

                <div className="space-y-2 text-xs">
                  <strong className="text-slate-900 block font-semibold">Scénarios Alternatifs & Exceptions :</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                    <li><strong>E1 - Format CIN invalide :</strong> Le système bloque le passage à l'étape suivante et exige 8 chiffres.</li>
                    <li><strong>E2 - Plus de 2 redoublements constatés :</strong> Le système applique la pénalité prévue par les règlements universitaires.</li>
                    <li><strong>E3 - Fichier joint corrompu ou trop lourd :</strong> Le système refuse l'upload et demande un PDF conforme &le; 5 Mo.</li>
                  </ul>
                </div>
              </div>

              {/* Fiche 2: Délibération de la Commission */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-wider block">
                      Fiche Descriptive CU-02
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      Cas d'Utilisation : Délibérer et publier les résultats d'admission
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                    Priorité : Haute
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <strong className="text-slate-900 block font-semibold">Acteur Principal :</strong>
                    <span className="text-slate-600">Président / Membres de la Commission du Mastère.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <strong className="text-slate-900 block font-semibold">Préconditions :</strong>
                    <span className="text-slate-600">Clôture des candidatures et vérification administrative des pièces.</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <strong className="text-slate-900 block font-semibold">Scénario Nominal :</strong>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <li>Le membre de la commission se connecte à l'espace Jury.</li>
                    <li>Il sélectionne le mastère concerné (ex: Mastère IA à la FST).</li>
                    <li>Le système affiche la liste des postulants classés automatiquement par score décroissant.</li>
                    <li>Le jury examine les pièces jointes et valide les critères d'éligibilité.</li>
                    <li>Le jury attribue le statut aux candidats (Liste Principale selon le quota, Liste d'Attente, ou Convoqué à l'entretien).</li>
                    <li>Le jury valide le PV de délibération et publie les listes officielles.</li>
                    <li>Le système met à jour l'espace de suivi pour tous les candidats concernés et permet l'export CSV.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CLASS DIAGRAM SECTION                                                  */}
      {/* ========================================================================= */}
      {activeDiagram === 'classes' && (
        <div className="space-y-6">
          {activeTab === 'visual' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Diagramme de Classes UML 2.5 (Conception Orientée Objet)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Modèle du Domaine & Architecture Métier avec Héritage, Compositions et Cardinalités
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Classes : <strong className="text-slate-800">11</strong></span>
                  <span>·</span>
                  <span>Héritage : <strong className="text-slate-800">3</strong></span>
                  <span>·</span>
                  <span>Compositions : <strong className="text-slate-800">4</strong></span>
                </div>
              </div>

              {/* Clean Vector SVG Class Diagram */}
              <div className="overflow-x-auto bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <svg viewBox="0 0 1100 760" className="w-full min-w-[950px] h-auto select-none font-sans">
                  <defs>
                    {/* Generalization Triangle Arrow */}
                    <marker id="inheritance" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto">
                      <polygon points="0 0, 10 6, 0 12" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    </marker>
                    {/* Composition Diamond */}
                    <marker id="composition" viewBox="0 0 16 16" refX="14" refY="8" markerWidth="12" markerHeight="12" orient="auto">
                      <polygon points="0 8, 7 2, 14 8, 7 14" fill="#0f172a" stroke="#0f172a" strokeWidth="1.5" />
                    </marker>
                    {/* Aggregation Diamond */}
                    <marker id="aggregation" viewBox="0 0 16 16" refX="14" refY="8" markerWidth="12" markerHeight="12" orient="auto">
                      <polygon points="0 8, 7 2, 14 8, 7 14" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                    </marker>
                  </defs>

                  {/* ================= 1. ABSTRACT CLASS UTILISATEUR ================= */}
                  <g transform="translate(420, 20)">
                    <rect x="0" y="0" width="260" height="120" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    <rect x="0" y="0" width="260" height="30" fill="#f1f5f9" />
                    <text x="130" y="16" textAnchor="middle" fill="#475569" fontSize="10" fontStyle="italic">&lt;&lt;Abstract&gt;&gt;</text>
                    <text x="130" y="27" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Utilisateur</text>
                    <line x1="0" y1="30" x2="260" y2="30" stroke="#cbd5e1" />
                    <text x="10" y="45" fill="#334155" fontSize="10.5"># id : String</text>
                    <text x="10" y="58" fill="#334155" fontSize="10.5"># nom : String</text>
                    <text x="10" y="71" fill="#334155" fontSize="10.5"># prenom : String</text>
                    <text x="10" y="84" fill="#334155" fontSize="10.5"># email : String</text>
                    <line x1="0" y1="92" x2="260" y2="92" stroke="#cbd5e1" />
                    <text x="10" y="106" fill="#0284c7" fontSize="10.5">+ seConnecter() : Boolean</text>
                  </g>

                  {/* ================= 2. CLASS CANDIDAT (INHERITS UTILISATEUR) ================= */}
                  <g transform="translate(50, 180)">
                    <rect x="0" y="0" width="280" height="175" rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="1.8" />
                    <rect x="0" y="0" width="280" height="26" fill="#e0f2fe" />
                    <text x="140" y="18" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">Candidat</text>
                    <line x1="0" y1="26" x2="280" y2="26" stroke="#93c5fd" />
                    <text x="10" y="40" fill="#334155" fontSize="10.5">- cin : String [8 chiffres]</text>
                    <text x="10" y="53" fill="#334155" fontSize="10.5">- nomAr : String</text>
                    <text x="10" y="66" fill="#334155" fontSize="10.5">- prenomAr : String</text>
                    <text x="10" y="79" fill="#334155" fontSize="10.5">- dateNaissance : Date</text>
                    <text x="10" y="92" fill="#334155" fontSize="10.5">- gouvernorat : String</text>
                    <text x="10" y="105" fill="#334155" fontSize="10.5">- telephone : String</text>
                    <line x1="0" y1="115" x2="280" y2="115" stroke="#93c5fd" />
                    <text x="10" y="130" fill="#0369a1" fontSize="10.5">+ calculerScore() : Float</text>
                    <text x="10" y="145" fill="#0369a1" fontSize="10.5">+ deposerDossier() : Dossier</text>
                    <text x="10" y="160" fill="#0369a1" fontSize="10.5">+ telechargerRecepisse() : Document</text>
                  </g>

                  {/* ================= 3. CLASS MEMBRE COMMISSION ================= */}
                  <g transform="translate(420, 180)">
                    <rect x="0" y="0" width="260" height="130" rx="4" fill="#ffffff" stroke="#059669" strokeWidth="1.5" />
                    <rect x="0" y="0" width="260" height="26" fill="#ecfdf5" />
                    <text x="130" y="18" textAnchor="middle" fill="#065f46" fontSize="12" fontWeight="bold">MembreCommission</text>
                    <line x1="0" y1="26" x2="260" y2="26" stroke="#a7f3d0" />
                    <text x="10" y="42" fill="#334155" fontSize="10.5">- matricule : String</text>
                    <text x="10" y="56" fill="#334155" fontSize="10.5">- grade : String</text>
                    <text x="10" y="70" fill="#334155" fontSize="10.5">- departement : String</text>
                    <line x1="0" y1="80" x2="260" y2="80" stroke="#a7f3d0" />
                    <text x="10" y="96" fill="#059669" fontSize="10.5">+ validerDossier(idDossier) : Void</text>
                    <text x="10" y="112" fill="#059669" fontSize="10.5">+ delibererResultats() : Void</text>
                  </g>

                  {/* ================= 4. CLASS ADMINISTRATEUR ================= */}
                  <g transform="translate(760, 180)">
                    <rect x="0" y="0" width="240" height="110" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
                    <rect x="0" y="0" width="240" height="26" fill="#f8fafc" />
                    <text x="120" y="18" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Administrateur</text>
                    <line x1="0" y1="26" x2="240" y2="26" stroke="#cbd5e1" />
                    <text x="10" y="42" fill="#334155" fontSize="10.5">- privilege : Int</text>
                    <line x1="0" y1="52" x2="240" y2="52" stroke="#cbd5e1" />
                    <text x="10" y="70" fill="#334155" fontSize="10.5">+ creerMastere(m) : Void</text>
                    <text x="10" y="86" fill="#334155" fontSize="10.5">+ cloturerSession() : Void</text>
                  </g>

                  {/* Inheritance Lines from Children to Utilisateur */}
                  {/* Candidat -> Utilisateur */}
                  <path d="M 190 180 L 190 150 L 510 150 L 510 140" fill="none" stroke="#1e293b" strokeWidth="1.5" markerEnd="url(#inheritance)" />
                  {/* MembreCommission -> Utilisateur */}
                  <line x1="550" y1="180" x2="550" y2="140" stroke="#1e293b" strokeWidth="1.5" markerEnd="url(#inheritance)" />
                  {/* Administrateur -> Utilisateur */}
                  <path d="M 880 180 L 880 150 L 590 150 L 590 140" fill="none" stroke="#1e293b" strokeWidth="1.5" markerEnd="url(#inheritance)" />

                  {/* ================= 5. CLASS DOSSIER CANDIDATURE ================= */}
                  <g transform="translate(50, 420)">
                    <rect x="0" y="0" width="280" height="170" rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                    <rect x="0" y="0" width="280" height="26" fill="#e0f2fe" />
                    <text x="140" y="18" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">DossierCandidature</text>
                    <line x1="0" y1="26" x2="280" y2="26" stroke="#93c5fd" />
                    <text x="10" y="42" fill="#334155" fontSize="10.5">- numeroDossier : String [PK]</text>
                    <text x="10" y="56" fill="#334155" fontSize="10.5">- dateDepot : Date</text>
                    <text x="10" y="70" fill="#334155" fontSize="10.5">- statut : StatutCandidature</text>
                    <text x="10" y="84" fill="#334155" fontSize="10.5">- scoreTotal : Float</text>
                    <text x="10" y="98" fill="#334155" fontSize="10.5">- declarationHonneur : Boolean</text>
                    <text x="10" y="112" fill="#334155" fontSize="10.5">- observationsJury : String</text>
                    <line x1="0" y1="122" x2="280" y2="122" stroke="#93c5fd" />
                    <text x="10" y="138" fill="#0369a1" fontSize="10.5">+ soumettre() : Void</text>
                    <text x="10" y="154" fill="#0369a1" fontSize="10.5">+ genererFichePDF() : Byte[]</text>
                  </g>

                  {/* Association Candidat (1) -- (0..1) Dossier */}
                  <line x1="190" y1="355" x2="190" y2="420" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="200" y="375" fill="#0369a1" fontSize="11" fontWeight="bold">1</text>
                  <text x="200" y="410" fill="#0369a1" fontSize="11" fontWeight="bold">0..1</text>
                  <text x="120" y="392" fill="#64748b" fontSize="10" fontStyle="italic">dépose &gt;</text>

                  {/* ================= 6. CLASS VOEU ================= */}
                  <g transform="translate(420, 420)">
                    <rect x="0" y="0" width="220" height="95" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    <rect x="0" y="0" width="220" height="24" fill="#f8fafc" />
                    <text x="110" y="17" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Voeu</text>
                    <line x1="0" y1="24" x2="220" y2="24" stroke="#cbd5e1" />
                    <text x="10" y="40" fill="#334155" fontSize="10.5">- priorite : Int [1..3]</text>
                    <text x="10" y="56" fill="#334155" fontSize="10.5">- dateChoix : DateTime</text>
                    <line x1="0" y1="66" x2="220" y2="66" stroke="#cbd5e1" />
                    <text x="10" y="82" fill="#0284c7" fontSize="10.5">+ modifierPriorite(p) : Void</text>
                  </g>

                  {/* Composition Dossier (1) *-- (1..3) Voeu */}
                  <line x1="330" y1="465" x2="420" y2="465" stroke="#0f172a" strokeWidth="1.5" markerStart="url(#composition)" />
                  <text x="345" y="458" fill="#0f172a" fontSize="11" fontWeight="bold">1</text>
                  <text x="390" y="458" fill="#0f172a" fontSize="11" fontWeight="bold">1..3</text>

                  {/* ================= 7. CLASS MASTERE ================= */}
                  <g transform="translate(740, 420)">
                    <rect x="0" y="0" width="280" height="160" rx="4" fill="#ffffff" stroke="#059669" strokeWidth="1.8" />
                    <rect x="0" y="0" width="280" height="26" fill="#ecfdf5" />
                    <text x="140" y="18" textAnchor="middle" fill="#065f46" fontSize="12" fontWeight="bold">Mastere</text>
                    <line x1="0" y1="26" x2="280" y2="26" stroke="#a7f3d0" />
                    <text x="10" y="42" fill="#334155" fontSize="10.5">- code : String</text>
                    <text x="10" y="56" fill="#334155" fontSize="10.5">- intitule : String</text>
                    <text x="10" y="70" fill="#334155" fontSize="10.5">- type : TypeMastere [MR, MP]</text>
                    <text x="10" y="84" fill="#334155" fontSize="10.5">- places : Int</text>
                    <text x="10" y="98" fill="#334155" fontSize="10.5">- dateLimite : Date</text>
                    <text x="10" y="112" fill="#334155" fontSize="10.5">- formuleScore : String</text>
                    <line x1="0" y1="120" x2="280" y2="120" stroke="#a7f3d0" />
                    <text x="10" y="136" fill="#059669" fontSize="10.5">+ verifierEligibilite(c) : Boolean</text>
                  </g>

                  {/* Association Voeu (*) -- (1) Mastere */}
                  <line x1="640" y1="465" x2="740" y2="465" stroke="#1e293b" strokeWidth="1.5" />
                  <text x="655" y="458" fill="#1e293b" fontSize="11" fontWeight="bold">*</text>
                  <text x="720" y="458" fill="#1e293b" fontSize="11" fontWeight="bold">1</text>
                  <text x="668" y="482" fill="#64748b" fontSize="10" fontStyle="italic">vise &gt;</text>

                  {/* ================= 8. CLASS PIECE JOINTE ================= */}
                  <g transform="translate(50, 640)">
                    <rect x="0" y="0" width="240" height="95" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    <rect x="0" y="0" width="240" height="24" fill="#f8fafc" />
                    <text x="120" y="17" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">PieceJointe</text>
                    <line x1="0" y1="24" x2="240" y2="24" stroke="#cbd5e1" />
                    <text x="10" y="40" fill="#334155" fontSize="10.5">- typePiece : TypePiece</text>
                    <text x="10" y="54" fill="#334155" fontSize="10.5">- nomFichier : String</text>
                    <text x="10" y="68" fill="#334155" fontSize="10.5">- estValide : Boolean</text>
                  </g>

                  {/* Composition Dossier (1) *-- (1..*) PieceJointe */}
                  <line x1="170" y1="590" x2="170" y2="640" stroke="#0f172a" strokeWidth="1.5" markerStart="url(#composition)" />
                  <text x="180" y="610" fill="#0f172a" fontSize="11" fontWeight="bold">1</text>
                  <text x="180" y="632" fill="#0f172a" fontSize="11" fontWeight="bold">1..*</text>

                  {/* ================= 9. CLASS CURSUS LICENCE ================= */}
                  <g transform="translate(360, 560)">
                    <rect x="0" y="0" width="220" height="110" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    <rect x="0" y="0" width="220" height="24" fill="#f8fafc" />
                    <text x="110" y="17" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">CursusLicence</text>
                    <line x1="0" y1="24" x2="220" y2="24" stroke="#cbd5e1" />
                    <text x="10" y="40" fill="#334155" fontSize="10.5">- etablissement : String</text>
                    <text x="10" y="54" fill="#334155" fontSize="10.5">- specialite : String</text>
                    <text x="10" y="68" fill="#334155" fontSize="10.5">- anneeObtention : Int</text>
                    <line x1="0" y1="78" x2="220" y2="78" stroke="#cbd5e1" />
                    <text x="10" y="95" fill="#0284c7" fontSize="10.5">+ calculerMoyenneLMD() : Float</text>
                  </g>

                  {/* Composition Dossier (1) *-- (1) CursusLicence */}
                  <path d="M 330 530 L 360 580" fill="none" stroke="#0f172a" strokeWidth="1.5" markerStart="url(#composition)" />

                  {/* ================= 10. CLASS ETABLISSEMENT ================= */}
                  <g transform="translate(740, 630)">
                    <rect x="0" y="0" width="240" height="90" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    <rect x="0" y="0" width="240" height="24" fill="#f8fafc" />
                    <text x="120" y="17" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Etablissement</text>
                    <line x1="0" y1="24" x2="240" y2="24" stroke="#cbd5e1" />
                    <text x="10" y="40" fill="#334155" fontSize="10.5">- nom : String</text>
                    <text x="10" y="54" fill="#334155" fontSize="10.5">- universite : String</text>
                    <text x="10" y="68" fill="#334155" fontSize="10.5">- ville : String</text>
                  </g>

                  {/* Association Mastere (*) -- (1) Etablissement */}
                  <line x1="860" y1="580" x2="860" y2="630" stroke="#1e293b" strokeWidth="1.5" />
                  <text x="870" y="598" fill="#1e293b" fontSize="11" fontWeight="bold">*</text>
                  <text x="870" y="622" fill="#1e293b" fontSize="11" fontWeight="bold">1</text>

                  {/* Association MembreCommission (*) -- (1..*) Mastere */}
                  <line x1="680" y1="245" x2="740" y2="440" stroke="#059669" strokeWidth="1.3" />
                  <text x="690" y="270" fill="#059669" fontSize="10.5" fontWeight="bold">*</text>
                  <text x="735" y="415" fill="#059669" fontSize="10.5" fontWeight="bold">1..*</text>
                  <text x="715" y="330" fill="#059669" fontSize="9.5" fontStyle="italic">évalue</text>
                </svg>
              </div>

              {/* Legend of UML Connectors */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-800">───▷</span>
                  <span><strong>Héritage :</strong> Candidat & Jury héritent d'Utilisateur</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-800">◆───</span>
                  <span><strong>Composition :</strong> Vœux et Pièces liés au Dossier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-sky-700">1..3</span>
                  <span><strong>Multiplicité :</strong> 1 à 3 choix de mastères</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-emerald-700"># / - / +</span>
                  <span><strong>Visibilité :</strong> Protégé (#), Privé (-), Public (+)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Code Source PlantUML (Class Diagram)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(plantUmlClass, 'plantuml-class')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copiedType === 'plantuml-class' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'plantuml-class' ? 'Copié !' : 'Copier PlantUML'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-2 leading-relaxed max-h-[380px]">
                  {plantUmlClass}
                </pre>
              </div>

              {/* Mermaid Class Block */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Code Source Mermaid.js (Class Diagram)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(mermaidClass, 'mermaid-class')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copiedType === 'mermaid-class' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'mermaid-class' ? 'Copié !' : 'Copier Mermaid'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono overflow-x-auto text-slate-300 p-2 leading-relaxed max-h-[260px]">
                  {mermaidClass}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'dictionnaire' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Dictionnaire des Données & Justification des Choix de Conception
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explications détaillées des classes et relations pour le rapport académique.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. Utilisateur & Héritage */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <strong className="text-sm font-bold text-slate-900 block font-display">
                    1. Patron d'Héritage : Classe Abstraite Utilisateur
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    Les entités <code>Candidat</code>, <code>MembreCommission</code> et <code>Administrateur</code> partagent les attributs d'identité (nom, prénom, email, mot de passe) et les méthodes d'authentification. L'héritage permet de factoriser le code et d'appliquer le principe de réutilisabilité (DRY).
                  </p>
                </div>

                {/* 2. Composition Dossier */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <strong className="text-sm font-bold text-slate-900 block font-display">
                    2. Relation de Composition Forte : DossierCandidature et Vœux
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    Un <code>DossierCandidature</code> contient entre <strong>1 et 3 Vœux</strong>. La relation est une <strong>composition</strong> (losange noir plein) car les vœux n'ont pas d'existence propre en dehors du dossier de candidature : si le dossier est supprimé ou annulé, ses vœux disparaissent avec lui.
                  </p>
                </div>

                {/* 3. Cursus LMD */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <strong className="text-sm font-bold text-slate-900 block font-display">
                    3. Modélisation du Cursus LMD et Calcul du Score
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    La classe <code>CursusLicence</code> est composée de 3 instances d'<code>AnneeLicence</code> (L1, L2, L3). Cette décomposition permet de stocker individuellement la moyenne, la session (principale vs contrôle) et le booléen de redoublement afin d'exécuter la formule officielle :
                    <br />
                    <code className="text-sky-800 font-mono font-bold block pt-1">
                      Score = (M_L1 + M_L2 + 1.2 * M_L3) / 3.2 + Bonifs - Pénalités
                    </code>
                  </p>
                </div>

                {/* 4. Cardinalité Candidat et Dossier */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <strong className="text-sm font-bold text-slate-900 block font-display">
                    4. Règle Métier d'Unicité : Candidat (1) -- (0..1) Dossier
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    Chaque candidat tunisien identifié par son <strong>CIN unique (8 chiffres)</strong> ne peut déposer qu'<strong>un seul dossier national</strong> par session universitaire (multiplicité 0..1), regroupant l'ensemble de ses vœux hiérarchisés.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
