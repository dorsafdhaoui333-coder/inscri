import { BacInfo, LicenceInfo, ScoreBreakdown } from '../types/mastere';

/**
 * Calcul officiel standard du score pour les mastères en Tunisie :
 * 
 * Formule type adoptée par les universités tunisiennes (ex: Univ. Tunis El Manar, Carthage, Sfax, Sousse) :
 * - Moyenne de base (M_base) = (Moyenne_L1 + Moyenne_L2 + 1.2 * Moyenne_L3) / 3.2
 * - Bonification sans redoublement (+1.5 pt si aucun redoublement dans tout le cursus)
 * - Bonification sessions principales (+1.0 pt si les 3 années ont été validées en session principale)
 * - Bonification mention de la licence (+0.5 pt pour Assez Bien, +1.0 pt pour Bien, +1.5 pt pour Très Bien)
 * - Pénalité redoublement (-1.0 pt par redoublement au-delà de 0)
 */
export function calculateMastereScore(licence: LicenceInfo, bac?: BacInfo): ScoreBreakdown {
  const l1 = licence.annees[0]?.moyenne || 0;
  const l2 = licence.annees[1]?.moyenne || 0;
  const l3 = licence.annees[2]?.moyenne || 0;

  // Calcul moyenne pondérée LMD (la 3ème année a souvent un coefficient majoré)
  const baseAverage = l1 > 0 && l2 > 0 && l3 > 0
    ? (l1 + l2 + (1.2 * l3)) / 3.2
    : (l1 + l2 + l3) / 3 || 0;

  // Compter le nombre de redoublements
  const countRedouble = licence.annees.filter(y => y.redouble).length;

  // Bonification sans redoublement
  const bonusCursusSansRedoublement = countRedouble === 0 ? 1.5 : 0;
  
  // Pénalité redoublement
  const penaliteRedoublement = countRedouble > 0 ? countRedouble * 1.0 : 0;

  // Bonification sessions principales
  const allPrincipale = licence.annees.every(y => y.session === 'principale');
  const bonusSessionsPrincipales = allPrincipale ? 1.0 : 0;

  // Bonification mention de la dernière année (L3)
  const l3Mention = licence.annees[2]?.mention;
  let bonusMentionLicence = 0;
  if (l3Mention === 'Très Bien') bonusMentionLicence = 1.5;
  else if (l3Mention === 'Bien') bonusMentionLicence = 1.0;
  else if (l3Mention === 'Assez Bien') bonusMentionLicence = 0.5;

  const total = Math.max(0, baseAverage + bonusCursusSansRedoublement + bonusSessionsPrincipales + bonusMentionLicence - penaliteRedoublement);

  return {
    baseAverage: Number(baseAverage.toFixed(2)),
    bonusCursusSansRedoublement,
    bonusSessionsPrincipales,
    bonusMentionLicence,
    penaliteRedoublement,
    totalScore: Number(total.toFixed(2)),
  };
}

export function validateTunisianCIN(cin: string): boolean {
  // Le CIN tunisien est strictement composé de 8 chiffres
  return /^[0-9]{8}$/.test(cin.trim());
}

export function formatCIN(cin: string): string {
  const clean = cin.replace(/\D/g, '').slice(0, 8);
  return clean;
}
