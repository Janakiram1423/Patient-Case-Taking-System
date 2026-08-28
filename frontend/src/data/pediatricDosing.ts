export interface PediatricDoseRule {
  drugName: string;
  indication: string;
  recommendedMgPerKgPerDose: number;
  frequency: string;
  maxSingleDoseMg: number;
  maxDailyDoseMg: number;
  standardSyrupConcentration: string; // e.g. "120 mg / 5 ml" or "250 mg / 5 ml"
  concentrationMgPerMl: number;
  instructions: string;
}

export const PEDIATRIC_DOSE_RULES: PediatricDoseRule[] = [
  {
    drugName: 'Paracetamol (Syrup Crocin / Calpol)',
    indication: 'Pediatric Fever & Pain Relief',
    recommendedMgPerKgPerDose: 15,
    frequency: 'Every 4 to 6 hours as needed (Max 4 times/day)',
    maxSingleDoseMg: 1000,
    maxDailyDoseMg: 3000,
    standardSyrupConcentration: '120 mg / 5 ml (24 mg/ml)',
    concentrationMgPerMl: 24,
    instructions: 'Administer using calibrated oral syringe. Maximum 4 doses in 24 hours.'
  },
  {
    drugName: 'Ibuprofen (Syrup Ibugesic / Brufen)',
    indication: 'Inflammation, High Fever, Dental Pain (Age > 6 months)',
    recommendedMgPerKgPerDose: 10,
    frequency: 'Every 6 to 8 hours with milk/food',
    maxSingleDoseMg: 400,
    maxDailyDoseMg: 1200,
    standardSyrupConcentration: '100 mg / 5 ml (20 mg/ml)',
    concentrationMgPerMl: 20,
    instructions: 'Give with or after food. Contraindicated in suspected dengue or dehydration.'
  },
  {
    drugName: 'Amoxicillin + Clavulanic Acid (Syrup Augmentin Duo)',
    indication: 'Acute Otitis Media, Sinusitis, LRTI',
    recommendedMgPerKgPerDose: 15, // 45mg/kg/day divided TDS
    frequency: 'Three times daily (TDS)',
    maxSingleDoseMg: 500,
    maxDailyDoseMg: 1500,
    standardSyrupConcentration: '228.5 mg / 5 ml (45.7 mg/ml)',
    concentrationMgPerMl: 45.7,
    instructions: 'Reconstitute with boiled and cooled water up to mark. Store in refrigerator, use within 7 days.'
  },
  {
    drugName: 'Ondansetron (Syrup Emeset)',
    indication: 'Acute Gastroenteritis Induced Vomiting (Age > 6 months)',
    recommendedMgPerKgPerDose: 0.15,
    frequency: 'Every 8 hours (TDS)',
    maxSingleDoseMg: 4,
    maxDailyDoseMg: 12,
    standardSyrupConcentration: '2 mg / 5 ml (0.4 mg/ml)',
    concentrationMgPerMl: 0.4,
    instructions: 'Administer 15-30 minutes before initiating oral rehydration sips (ORS).'
  },
  {
    drugName: 'Levocetirizine (Syrup 1-AL / Teczine)',
    indication: 'Allergic Rhinitis, Urticaria, Atopic Dermatitis (Age > 2 yrs)',
    recommendedMgPerKgPerDose: 0.125,
    frequency: 'Once daily at bedtime',
    maxSingleDoseMg: 5,
    maxDailyDoseMg: 5,
    standardSyrupConcentration: '2.5 mg / 5 ml (0.5 mg/ml)',
    concentrationMgPerMl: 0.5,
    instructions: 'Administer once daily at bedtime.'
  }
];

export function calculatePediatricDose(rule: PediatricDoseRule, weightKg: number) {
  const calculatedMg = parseFloat((weightKg * rule.recommendedMgPerKgPerDose).toFixed(1));
  const finalMg = Math.min(calculatedMg, rule.maxSingleDoseMg);
  const volumeMl = parseFloat((finalMg / rule.concentrationMgPerMl).toFixed(1));

  return {
    calculatedMg: finalMg,
    volumeMl,
    frequency: rule.frequency,
    concentration: rule.standardSyrupConcentration,
    instructions: rule.instructions
  };
}
