import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, Award } from 'lucide-react';

interface FaqSectionProps {
  lang: 'fr' | 'ar' | 'tn';
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quelle est la différence entre un Mastère de Recherche (M.R) et un Mastère Professionnel (M.P) ?',
      qTn: 'شنوة الفرق بين ماستير بحث (MR) وماستير بروفيسيونال (MP) ؟',
      a: 'Le Mastère de Recherche (MR) est principalement destiné à la recherche académique et ouvre directement l’accès à la thèse de Doctorat et aux carrières universitaires. Le Mastère Professionnel (MP) vise une insertion professionnelle immédiate en entreprise avec des stages d’immersion et des certifications industrielles.',
      aTn: 'ماستير البحث يوجّهك للأكاديميا وتكميل الدكتوراه والبحث العلمي، أما الماستير المهني فهو موجّه لسوق الشغل والشركات وفيه برشة ستاجات وتطبيق.',
    },
    {
      q: 'Comment est calculé le Score officiel d’admission ?',
      qTn: 'كيفاش يتحسب السكور الرسمي للماستير في تونس ؟',
      a: 'Le score officiel repose sur la moyenne pondérée des trois années de Licence (L1, L2 et L3 avec coefficient majoré pour la 3ème année), complétée par des bonifications pour cursus sans redoublement (+1.5 pt), réussite en session principale (+1.0 pt), et mention au diplôme (+0.5 à +1.5 pt). Les redoublements au-delà de 0 subissent une pénalité.',
      aTn: 'السكور يحسب معدلات الـ L1 و L2 و L3 (الـ L3 بضارب أكبر)، مع بونيس إذا ما عاودتش حتى عام (+1.5)، وبونيس إذا نجحت في الدورة الرئيسية (+1.0)، وبونيس المونسيون. كل عام دوبلاج ينقّص من السكور.',
    },
    {
      q: 'Combien de vœux puis-je formuler sur la plateforme ?',
      qTn: 'قداش نجم نحط من اختيار (Vœux) ؟',
      a: 'Chaque candidat peut formuler jusqu’à 3 vœux hiérarchisés par ordre de préférence. Le vœu n°1 est traité en priorité absolue lors de la première phase de délibération des jurys.',
      aTn: 'تنجم تختار حتى 3 اختيارات مرتبين حسب أولويتك. الاختيار لول هو ديما الأهم عند اللجان.',
    },
    {
      q: 'Que dois-je faire après la confirmation de ma présélection ?',
      qTn: 'كي نتقبل في البريسلكسيون، شنوة نعمل ؟',
      a: 'Dès l’affichage du statut "Présélectionné", vous devez imprimer la Fiche de Candidature (Récépissé officiel généré sur ce portail) et la joindre avec les copies certifiées conformes de vos relevés de notes et diplôme au secrétariat de l’établissement universitaire avant la date limite indiquée.',
      aTn: 'تخرج وصل التسجيل (Fiche de candidature) من الموقع وتطبعو، وتلصق معاه نسخ مطابقة للأصل من كشوفات الأعداد والدبلوم وتهزو لفاكولتك قبل الأجل المحدد.',
    },
    {
      q: 'Mon N° de CIN est-il confidentiel et sécurisé ?',
      qTn: 'النومرو متاع ب.ت.و (CIN) محمي ولا ؟',
      a: 'Oui, l’identifiant national CIN est protégé conformément aux standards de l’INPDP (Instance Nationale de Protection des Données Personnelles) et n’est utilisé que pour authentifier et certifier votre dossier académique unique.',
      aTn: 'إيه أكيد، المعطيات الشخصية مؤمنة ومطابقة لقانون حماية المعطيات الشخصية في تونس.',
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
          Guide & Foire Aux Questions
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          Tout savoir sur les candidatures aux mastères
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Les réponses officielles aux questions fréquentes des étudiants tunisiens préparant leur entrée en Mastère.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const questionText = lang === 'tn' ? faq.qTn : faq.q;
          const answerText = lang === 'tn' ? faq.aTn : faq.a;

          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm font-bold text-slate-900 font-display">
                  {questionText}
                </span>
                <span className="p-1 rounded-md bg-slate-50 text-slate-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {answerText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
