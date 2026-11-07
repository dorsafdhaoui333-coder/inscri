import React from 'react';
import { Mail, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { SimulatedEmail } from '../types/mastere';

interface EmailToastNotificationProps {
  email: SimulatedEmail | null;
  onOpenEmail: (emailId: string) => void;
  onClose: () => void;
}

export const EmailToastNotification: React.FC<EmailToastNotificationProps> = ({
  email,
  onOpenEmail,
  onClose,
}) => {
  if (!email) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3.5">
      <div className="w-9 h-9 rounded-xl bg-sky-600/30 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
        <Mail className="w-5 h-5" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Email de confirmation envoyé !</span>
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-0.5"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          Un courriel officiel a été expédié à <strong className="text-white font-mono">{email.recipientEmail}</strong> pour le dossier <strong className="text-sky-300 font-mono">{email.applicationId}</strong>.
        </p>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => {
              onOpenEmail(email.id);
              onClose();
            }}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Lire l’email de confirmation</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Ignorer
          </button>
        </div>
      </div>
    </div>
  );
};
