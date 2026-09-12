import { PrescriptionItem, AllergyItem } from '../types';

export interface DrugInteractionAlert {
  severity: 'Severe' | 'Moderate' | 'Mild';
  drugA: string;
  drugB: string;
  description: string;
  clinicalRecommendation: string;
}

export const KNOWN_DRUG_INTERACTIONS = [
  {
    keywordsA: ['aspirin', 'ecosprin'],
    keywordsB: ['ibuprofen', 'brufen', 'aceclofenac', 'zerodol'],
    severity: 'Moderate' as const,
    description: 'Concurrent NSAID and Aspirin increases risk of gastrointestinal ulceration and reduces aspirin cardioprotection.',
    clinicalRecommendation: 'Add Pantoprazole (PPI) for gastric protection and space dosing.'
  },
  {
    keywordsA: ['telmisartan', 'telma'],
    keywordsB: ['spironolactone', 'potassium'],
    severity: 'Severe' as const,
    description: 'Concurrent ARB and Potassium-sparing agents increases risk of life-threatening Hyperkalemia.',
    clinicalRecommendation: 'Monitor serum potassium and renal function closely.'
  },
  {
    keywordsA: ['tramadol', 'tramazac'],
    keywordsB: ['ondansetron', 'emeset'],
    severity: 'Moderate' as const,
    description: 'Ondansetron can diminish the analgesic efficacy of Tramadol through 5-HT3 antagonism.',
    clinicalRecommendation: 'Monitor pain control or adjust analgesic dose if needed.'
  },
  {
    keywordsA: ['ciprofloxacin', 'cifran'],
    keywordsB: ['pantoprazole', 'antacid', 'calcium', 'calcirol'],
    severity: 'Moderate' as const,
    description: 'Antacids and polyvalent cations bind Ciprofloxacin, significantly reducing oral antibiotic absorption.',
    clinicalRecommendation: 'Administer Ciprofloxacin at least 2 hours before or 4 hours after antacids/calcium.'
  }
];

export function checkDrugInteractions(prescriptions: PrescriptionItem[]): DrugInteractionAlert[] {
  const alerts: DrugInteractionAlert[] = [];

  for (let i = 0; i < prescriptions.length; i++) {
    for (let j = i + 1; j < prescriptions.length; j++) {
      const rxA = prescriptions[i];
      const rxB = prescriptions[j];
      const textA = `${rxA.medicine_name} ${rxA.generic_name || ''}`.toLowerCase();
      const textB = `${rxB.medicine_name} ${rxB.generic_name || ''}`.toLowerCase();

      for (const rule of KNOWN_DRUG_INTERACTIONS) {
        const matchA_to_ruleA = rule.keywordsA.some(k => textA.includes(k));
        const matchB_to_ruleB = rule.keywordsB.some(k => textB.includes(k));

        const matchA_to_ruleB = rule.keywordsB.some(k => textA.includes(k));
        const matchB_to_ruleA = rule.keywordsA.some(k => textB.includes(k));

        if ((matchA_to_ruleA && matchB_to_ruleB) || (matchA_to_ruleB && matchB_to_ruleA)) {
          alerts.push({
            severity: rule.severity,
            drugA: rxA.medicine_name,
            drugB: rxB.medicine_name,
            description: rule.description,
            clinicalRecommendation: rule.clinicalRecommendation
          });
        }
      }
    }
  }

  return alerts;
}

export function checkAllergyConflict(prescriptions: PrescriptionItem[], allergies: AllergyItem[]): string[] {
  const warnings: string[] = [];

  prescriptions.forEach(rx => {
    const rxText = `${rx.medicine_name} ${rx.generic_name || ''}`.toLowerCase();
    allergies.forEach(all => {
      if (all.type === 'Drug' && rxText.includes(all.allergen.toLowerCase())) {
        warnings.push(`CRITICAL ALLERGY: Patient is allergic to ${all.allergen} (Reaction: ${all.reaction}, Severity: ${all.severity}). Prescribed: ${rx.medicine_name}`);
      }
    });
  });

  return warnings;
}
