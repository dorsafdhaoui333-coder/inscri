import React, { useState } from 'react';
import { 
  Mail, 
  X, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Printer, 
  ShieldCheck, 
  GraduationCap, 
  Calendar, 
  ChevronRight, 
  Inbox,
  Send,
  AlertCircle
} from 'lucide-react';
import { SimulatedEmail, CandidateApplication } from '../types/mastere';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: SimulatedEmail[];
  selectedEmailId?: string | null;
  onViewReceipt: (applicationId: string) => void;
  onGoToTracking: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  isOpen,
  onClose,
  emails,
  selectedEmailId,
  onViewReceipt,
  onGoToTracking,
}) => {
  const [activeEmailId, setActiveEmailId] = useState<string>(
    selectedEmailId || (emails[0]?.id ?? '')
  );

  // Sync if selectedEmailId changes
  React.useEffect(() => {
    if (selectedEmailId) {
      setActiveEmailId(selectedEmailId);
    } else if (emails.length > 0 && !activeEmailId) {
      setActiveEmailId(emails[0].id);
    }
  }, [selectedEmailId, emails]);

  if (!isOpen) return null;

  const currentEmail = emails.find(e => e.id === activeEmailId) || emails[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Webmail Client Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-display text-white">
                  Simulateur de Messagerie Étudiante
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.2 rounded font-mono">
                  Notifications Fictives
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Visualisez les courriels électroniques envoyés automatiquement lors du dépôt de dossier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Webmail Layout: Sidebar list + Email Body Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
          
          {/* Email Inbox Sidebar */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0 flex flex-col">
            <div className="p-3 border-b border-slate-200 bg-slate-100/60 flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-sky-700" />
                <span>Boîte de Réception</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {emails.length} message{emails.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucun courriel envoyé pour le moment. Déposez une candidature pour générer une notification.
                </div>
              ) : (
                emails.map((em) => {
                  const isSelected = em.id === currentEmail?.id;
                  return (
                    <button
                      key={em.id}
                      onClick={() => setActiveEmailId(em.id)}
                      className={`w-full p-3 text-left transition-colors flex flex-col gap-1 focus:outline-none ${
                        isSelected
                          ? 'bg-sky-50/90 border-l-3 border-sky-700'
                          : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 truncate max-w-[150px]">
                          MastereTN · MESRS
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {em.sentAt.split(' ')[1] || 'Récent'}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {em.subject}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Pour: {em.recipientName} ({em.recipientEmail})
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Email Body Preview Zone */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white space-y-6">
            {currentEmail ? (
              <div className="space-y-6">
                {/* Email Metadata Header */}
                <div className="border-b border-slate-200 pb-4 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                      {currentEmail.subject}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                      Reçu le {currentEmail.sentAt}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div>
                      <strong className="text-slate-800">De :</strong>{' '}
                      <span className="font-mono text-sky-800">{currentEmail.sender}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">À :</strong>{' '}
                      <span>{currentEmail.recipientName} &lt;<span className="font-mono text-sky-700">{currentEmail.recipientEmail}</span>&gt;</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Objet :</strong>{' '}
                      <span className="font-medium text-slate-900">{currentEmail.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Email Body Presentation Container */}
                <div className="border border-slate-200 rounded-2xl p-6 sm:p-7 bg-white space-y-5 shadow-2xs">
                  
                  {/* Institutional Header Banner inside email */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-sky-700 flex items-center justify-center text-white">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 font-display text-sm">
                        Mastere<span className="text-sky-700">TN</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Notification Officielle
                    </span>
                  </div>

                  {/* Greeting & Introductory Prose */}
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 text-sm">
                      Bonjour {currentEmail.recipientName},
                    </p>
                    <p>
                      Nous vous confirmons par le présent courriel la validation et le dépôt avec succès de votre dossier de candidature sur le <strong>Portail National des Mastères</strong> pour l’année universitaire 2026/2027.
                    </p>
                  </div>

                  {/* Application Summary Box */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Récapitulatif de votre Dossier
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block uppercase">N° Dossier Unique</span>
                        <strong className="text-sky-800 text-xs sm:text-sm font-bold block mt-0.5">
                          {currentEmail.applicationId}
                        </strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block uppercase">N° Carte d’Identité</span>
                        <strong className="text-slate-800 text-xs sm:text-sm font-bold block mt-0.5">
                          {currentEmail.candidateCin}
                        </strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block uppercase">Score LMD Calculé</span>
                        <strong className="text-emerald-700 text-xs sm:text-sm font-bold block mt-0.5">
                          {currentEmail.scoreTotal} / 20
                        </strong>
                      </div>
                    </div>

                    {/* Wishes recorded */}
                    <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Vœux de formations formulés :
                      </span>
                      {currentEmail.wishes.map((w) => (
                        <div key={w.priority} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-[9px] shrink-0 font-mono">
                            {w.priority}
                          </span>
                          <span className="font-semibold text-slate-900">{w.mastereTitle}</span>
                          <span className="text-slate-500">({w.faculty})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Next Steps Guidance */}
                  <div className="p-3.5 bg-sky-50/80 rounded-xl border border-sky-100 text-xs text-sky-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                      <span>Prochaines étapes de votre admission :</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-sky-900/90 pl-1">
                      <li>Votre dossier numérique est désormais accessible aux membres des jurys pour délibération.</li>
                      <li>Conservez précieusement votre numéro <strong>{currentEmail.applicationId}</strong> pour le suivi.</li>
                      <li>En cas de présélection, vous devrez imprimer votre récépissé avec code QR et fournir les originaux papier.</li>
                    </ul>
                  </div>

                  {/* Call to Action Buttons inside the email */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        onClose();
                        onViewReceipt(currentEmail.applicationId);
                      }}
                      className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Consulter / Télécharger mon Récépissé Officiel</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onGoToTracking();
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Aller au Suivi en Ligne</span>
                    </button>
                  </div>

                  {/* Sign-off */}
                  <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <p>Cordialement,</p>
                    <p className="font-semibold text-slate-700">
                      L’équipe d’Admission aux Mastères Universitaires
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Ministère de l’Enseignement Supérieur et de la Recherche Scientifique — République Tunisienne
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Serveur de messagerie SMTP simulé : <strong>smtp.mastere.mesrs.tn (Actif)</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            Fermer la boîte
          </button>
        </div>
      </div>
    </div>
  );
};
