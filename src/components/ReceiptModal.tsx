import React from 'react';
import { CandidateApplication } from '../types/mastere';
import { Printer, Download, CheckCircle, X, Shield, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  application: CandidateApplication | null;
  onClose: () => void;
  onGoToTracking: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  application,
  onClose,
  onGoToTracking,
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Top Action Bar (no-print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold font-display">
              Candidature Enregistrée avec Succès !
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Slip (Fiche d'Inscription Officielle) */}
        <div className="p-8 sm:p-10 space-y-6 print-card text-slate-900 bg-white">
          {/* Official Republic of Tunisia Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
            <div className="space-y-0.5 text-xs text-slate-800">
              <div className="font-bold text-[13px] tracking-wider uppercase">
                République Tunisienne
              </div>
              <div className="text-slate-600">
                Ministère de l’Enseignement Supérieur et de la Recherche Scientifique
              </div>
              <div className="text-slate-600 font-medium">
                Commission Nationale d’Admission aux Mastères
              </div>
            </div>

            <div className="text-right space-y-0.5 text-xs font-mono">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Récépissé N°</div>
              <div className="font-bold text-sm text-sky-800 tracking-wider">
                {application.id}
              </div>
              <div className="text-[11px] text-slate-500">
                Date : {application.dateSoumission}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-2 bg-slate-100 rounded-lg border border-slate-200">
            <h2 className="text-base font-extrabold font-display uppercase tracking-wider text-slate-900">
              Fiche de Candidature au Mastère — Session 2026/2027
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Document officiel valant accusé de réception du dossier numérique
            </div>
          </div>

          {/* Candidate Info & Verification Barcode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 text-xs">
            <div className="sm:col-span-2 space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                1. Renseignements du Candidat
              </div>
              <div>
                <span className="text-slate-500">N° CIN :</span>{' '}
                <strong className="font-mono text-slate-900 text-sm tracking-wider">
                  {application.candidate.cin}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Nom & Prénom :</span>{' '}
                <strong className="text-slate-900 text-sm">
                  {application.candidate.prenom} {application.candidate.nom}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">الاسم واللقب :</span>{' '}
                <strong className="text-slate-900 font-sans">
                  {application.candidate.prenomAr} {application.candidate.nomAr}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Gouvernorat :</span>{' '}
                <strong>{application.candidate.gouvernorat}</strong> · Tél :{' '}
                <strong className="font-mono">+216 {application.candidate.telephone}</strong>
              </div>
              <div>
                <span className="text-slate-500">Email :</span>{' '}
                <strong className="font-mono text-slate-800">{application.candidate.email}</strong>
              </div>
            </div>

            {/* Simulated QR Code / Official Stamp Box */}
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
              <div className="w-20 h-20 bg-white border border-slate-300 p-1 flex items-center justify-center shadow-2xs">
                {/* SVG QR Code Simulation */}
                <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2zm2 2v4h4V4zm-2 10h8v8H2zm2 2v4h4v-4zm10-14h8v8h-8zm2 2v4h4V4zm-1 9h2v2h-2zm3 0h2v2h-2zm-3 3h2v2h-2zm3 0h2v2h-2zm2-3h2v5h-2zm-8 5h2v2h-2zm3 0h5v2h-5zM5 5h2v2H5zm0 12h2v2H5zm12-12h2v2h-2z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-tighter">
                SCAN_VERIF_MINISTERE
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold uppercase">
                Cachet Électronique
              </span>
            </div>
          </div>

          {/* Academic Background & Score */}
          <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-3">
            <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              2. Cursus Universitaire & Score Officiel
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Baccalauréat</span>
                <span className="font-semibold">{application.bac.section} ({application.bac.moyenne}/20)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Établissement</span>
                <span className="font-semibold truncate block">{application.licence.etablissement}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Spécialité</span>
                <span className="font-semibold truncate block">{application.licence.specialite}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Score Calculé</span>
                <span className="font-bold text-sky-800 text-sm font-mono">{application.score.totalScore} / 20</span>
              </div>
            </div>

            {/* Note breakdown strip */}
            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] grid grid-cols-3 gap-2 border border-slate-200 font-mono">
              <div>
                <span className="text-slate-500">Moyenne L1 :</span>{' '}
                <strong>{application.licence.annees[0]?.moyenne}/20</strong>
              </div>
              <div>
                <span className="text-slate-500">Moyenne L2 :</span>{' '}
                <strong>{application.licence.annees[1]?.moyenne}/20</strong>
              </div>
              <div>
                <span className="text-slate-500">Moyenne L3 :</span>{' '}
                <strong>{application.licence.annees[2]?.moyenne}/20</strong>
              </div>
            </div>
          </div>

          {/* Wishes List */}
          <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              3. Vœux Hiérarchisés de Mastères
            </div>
            <div className="space-y-1.5">
              {application.wishes.map((w) => (
                <div key={w.priority} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                    {w.priority}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">{w.mastereTitle}</span>
                    <span className="text-slate-500 text-[11px]"> — {w.faculty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions for paper dossier */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1 leading-relaxed">
            <div className="font-bold">Instructions Importantes pour le Candidat :</div>
            <p>
              1. Veuillez conserver précieusement ce récépissé avec votre N° de dossier <strong>{application.id}</strong>.
            </p>
            <p>
              2. En cas de présélection, ce récépissé doit obligatoirement être imprimé et agrafé sur la pochette du dossier papier à déposer au secrétariat de l’établissement universitaire concerné.
            </p>
          </div>

          {/* Signature and Stamp Zone */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <span className="text-slate-500 block mb-8">Signature du Candidat :</span>
              <div className="font-serif italic text-slate-400 text-sm">{application.candidate.prenom} {application.candidate.nom}</div>
            </div>
            <div>
              <span className="text-slate-500 block mb-6">Visa de la Commission de Sélection :</span>
              <div className="inline-block border border-dashed border-slate-400 rounded-lg px-4 py-2 text-[10px] text-slate-400 font-mono">
                [ Cachet Officiel Universitaire ]
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (no-print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              onClose();
              onGoToTracking();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-xl transition-colors shadow-xs"
          >
            Aller au Suivi de mon Dossier →
          </button>
        </div>
      </div>
    </div>
  );
};
