import { PrescriptionItem } from '../types';

export interface DrugCatalogItem {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  form: PrescriptionItem['form'];
  strength: string;
  dosage: string;
  route: PrescriptionItem['route'];
  defaultFrequency: string;
  defaultDurationValue: number;
  defaultDurationUnit: PrescriptionItem['duration_unit'];
  defaultInstruction: PrescriptionItem['instruction'];
  commonIndications: string[];
}

export const DRUG_CATALOG: DrugCatalogItem[] = [
  // Antipyretics & Analgesics
  {
    id: 'DRUG-001',
    name: 'Paracetamol (Dolo 650)',
    generic_name: 'Acetaminophen / Paracetamol',
    category: 'Analgesics & Antipyretics',
    form: 'Tablet',
    strength: '650 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-1-1 (Thrice daily)',
    defaultDurationValue: 5,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Fever', 'Body ache', 'Headache', 'Mild to moderate pain']
  },
  {
    id: 'DRUG-002',
    name: 'Ibuprofen (Brufen 400)',
    generic_name: 'Ibuprofen',
    category: 'NSAIDs & Pain Relief',
    form: 'Tablet',
    strength: '400 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 5,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Inflammation', 'Joint pain', 'Dental pain', 'Fever']
  },
  {
    id: 'DRUG-003',
    name: 'Aceclofenac + Paracetamol (Zerodol-P)',
    generic_name: 'Aceclofenac (100mg) + Paracetamol (325mg)',
    category: 'NSAIDs & Pain Relief',
    form: 'Tablet',
    strength: '100mg / 325mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 5,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Osteoarthritis', 'Back pain', 'Post-traumatic pain']
  },
  {
    id: 'DRUG-004',
    name: 'Tramadol (Tramazac 50)',
    generic_name: 'Tramadol Hydrochloride',
    category: 'Opioid Analgesics',
    form: 'Capsule',
    strength: '50 mg',
    dosage: '1 Cap',
    route: 'Oral',
    defaultFrequency: 'SOS (As needed)',
    defaultDurationValue: 3,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Severe acute pain', 'Post-operative pain']
  },

  // Gastrointestinal & Anti-ulcer
  {
    id: 'DRUG-005',
    name: 'Pantoprazole (Pan 40)',
    generic_name: 'Pantoprazole Sodium',
    category: 'Gastrointestinal & PPI',
    form: 'Tablet',
    strength: '40 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 14,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'Before Food',
    commonIndications: ['GERD', 'Gastritis', 'Peptic ulcer', 'NSAID-induced dyspepsia']
  },
  {
    id: 'DRUG-006',
    name: 'Omeprazole + Domperidone (Omez-D)',
    generic_name: 'Omeprazole (20mg) + Domperidone (10mg)',
    category: 'Gastrointestinal & Prokinetics',
    form: 'Capsule',
    strength: '20mg / 10mg',
    dosage: '1 Cap',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 7,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'Before Food',
    commonIndications: ['Acid reflux', 'Nausea with heartburn', 'Dyspepsia']
  },
  {
    id: 'DRUG-007',
    name: 'Ondansetron (Emeset 4)',
    generic_name: 'Ondansetron Hydrochloride',
    category: 'Antiemetic',
    form: 'Tablet',
    strength: '4 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 3,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'Before Food',
    commonIndications: ['Nausea', 'Vomiting', 'Gastroenteritis']
  },
  {
    id: 'DRUG-008',
    name: 'Oral Rehydration Salts (Electral ORS)',
    generic_name: 'WHO Formula ORS',
    category: 'Electrolytes & Rehydration',
    form: 'Drops',
    strength: '21.8 g sachet in 1L water',
    dosage: 'Frequent sips',
    route: 'Oral',
    defaultFrequency: '1-1-1 (Thrice daily)',
    defaultDurationValue: 3,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'With Food',
    commonIndications: ['Dehydration', 'Acute diarrhea', 'Vomiting']
  },

  // Antibiotics & Antimicrobials
  {
    id: 'DRUG-009',
    name: 'Amoxicillin + Clavulanic Acid (Augmentin 625)',
    generic_name: 'Amoxicillin (500mg) + Potassium Clavulanate (125mg)',
    category: 'Antibiotics - Penicillins',
    form: 'Tablet',
    strength: '625 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 5,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'With Food',
    commonIndications: ['Upper respiratory tract infection', 'Sinusitis', 'Skin & soft tissue infections', 'UTI']
  },
  {
    id: 'DRUG-010',
    name: 'Azithromycin (Azee 500)',
    generic_name: 'Azithromycin Dihydrate',
    category: 'Antibiotics - Macrolides',
    form: 'Tablet',
    strength: '500 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 3,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'Before Food',
    commonIndications: ['Atypical pneumonia', 'Tonsillitis', 'Pharyngitis', 'Bronchitis']
  },
  {
    id: 'DRUG-011',
    name: 'Ciprofloxacin (Cifran 500)',
    generic_name: 'Ciprofloxacin Hydrochloride',
    category: 'Antibiotics - Fluoroquinolones',
    form: 'Tablet',
    strength: '500 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 5,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Urinary tract infection', 'Infectious diarrhea', 'Typhoid fever']
  },
  {
    id: 'DRUG-012',
    name: 'Cefixime (Taxim-O 200)',
    generic_name: 'Cefixime Trihydrate',
    category: 'Antibiotics - Cephalosporins',
    form: 'Tablet',
    strength: '200 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 7,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Otitis media', 'Typhoid', 'Lower respiratory tract infection']
  },
  {
    id: 'DRUG-013',
    name: 'Metronidazole (Flagyl 400)',
    generic_name: 'Metronidazole',
    category: 'Antiprotozoal & Antibacterial',
    form: 'Tablet',
    strength: '400 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-1-1 (Thrice daily)',
    defaultDurationValue: 5,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Amoebiasis', 'Giardiasis', 'Dental infections', 'Anaerobic infections']
  },

  // Antihistamines & Respiratory
  {
    id: 'DRUG-014',
    name: 'Levocetirizine + Montelukast (Monticope)',
    generic_name: 'Levocetirizine (5mg) + Montelukast (10mg)',
    category: 'Antiallergic & Antiasthmatic',
    form: 'Tablet',
    strength: '5mg / 10mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '0-0-1 (Night)',
    defaultDurationValue: 10,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'Bedtime',
    commonIndications: ['Allergic rhinitis', 'Asthma exacerbation', 'Urticaria', 'Hay fever']
  },
  {
    id: 'DRUG-015',
    name: 'Salbutamol + Ipratropium Inhaler (Duolin)',
    generic_name: 'Levosalbutamol (50mcg) + Ipratropium Bromide (20mcg)',
    category: 'Respiratory Bronchodilators',
    form: 'Inhaler',
    strength: '50mcg / 20mcg per puff',
    dosage: '2 Puffs',
    route: 'Inhalation',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'As directed',
    commonIndications: ['Bronchial asthma', 'COPD', 'Acute wheezing']
  },
  {
    id: 'DRUG-016',
    name: 'Dextromethorphan + Chlorpheniramine Syrup (Ascoril-D)',
    generic_name: 'Dextromethorphan HBr + CPM + Phenylephrine',
    category: 'Cough Suppressants',
    form: 'Syrup',
    strength: '10mg / 2mg per 5ml',
    dosage: '10 ml',
    route: 'Oral',
    defaultFrequency: '1-1-1 (Thrice daily)',
    defaultDurationValue: 5,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Dry cough', 'Throat tickle', 'Upper respiratory allergies']
  },

  // Cardiovascular & Hypertension
  {
    id: 'DRUG-017',
    name: 'Telmisartan (Telma 40)',
    generic_name: 'Telmisartan',
    category: 'Antihypertensives - ARB',
    form: 'Tablet',
    strength: '40 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'Before Food',
    commonIndications: ['Essential Hypertension', 'Cardiovascular risk reduction']
  },
  {
    id: 'DRUG-018',
    name: 'Amlodipine (Amlong 5)',
    generic_name: 'Amlodipine Besylate',
    category: 'Antihypertensives - CCB',
    form: 'Tablet',
    strength: '5 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'After Food',
    commonIndications: ['Hypertension', 'Chronic stable angina']
  },
  {
    id: 'DRUG-019',
    name: 'Atorvastatin (Atorva 20)',
    generic_name: 'Atorvastatin Calcium',
    category: 'Lipid Lowering / Statins',
    form: 'Tablet',
    strength: '20 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '0-0-1 (Night)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'Bedtime',
    commonIndications: ['Hypercholesterolemia', 'Coronary artery disease prevention']
  },
  {
    id: 'DRUG-020',
    name: 'Aspirin (Ecosprin 75)',
    generic_name: 'Enteric Coated Aspirin',
    category: 'Antiplatelet',
    form: 'Tablet',
    strength: '75 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'After Food',
    commonIndications: ['Secondary prevention of MI & Stroke', 'Post-PCI stent protection']
  },

  // Diabetes & Endocrine
  {
    id: 'DRUG-021',
    name: 'Metformin (Glycomet 500 SR)',
    generic_name: 'Metformin Hydrochloride (Sustained Release)',
    category: 'Antidiabetic - Biguanide',
    form: 'Tablet',
    strength: '500 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-1 (Twice daily)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'With Food',
    commonIndications: ['Type 2 Diabetes Mellitus', 'Insulin resistance']
  },
  {
    id: 'DRUG-022',
    name: 'Glimepiride (Amaryl 1)',
    generic_name: 'Glimepiride',
    category: 'Antidiabetic - Sulfonylurea',
    form: 'Tablet',
    strength: '1 mg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'Before Food',
    commonIndications: ['Type 2 Diabetes Mellitus']
  },
  {
    id: 'DRUG-023',
    name: 'Thyroxine (Thyronorm 50 mcg)',
    generic_name: 'Levothyroxine Sodium',
    category: 'Thyroid Hormone',
    form: 'Tablet',
    strength: '50 mcg',
    dosage: '1 Tab',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 1,
    defaultDurationUnit: 'Months',
    defaultInstruction: 'Before Food',
    commonIndications: ['Hypothyroidism', 'Goiter']
  },

  // Vitamins & Nutritional Supplements
  {
    id: 'DRUG-024',
    name: 'Vitamin D3 (Calcirol 60K)',
    generic_name: 'Cholecalciferol',
    category: 'Vitamins & Minerals',
    form: 'Capsule',
    strength: '60,000 IU',
    dosage: '1 Cap once weekly',
    route: 'Oral',
    defaultFrequency: 'SOS (As needed)',
    defaultDurationValue: 8,
    defaultDurationUnit: 'Weeks',
    defaultInstruction: 'With Food',
    commonIndications: ['Vitamin D deficiency', 'Osteoporosis', 'Bone weakness']
  },
  {
    id: 'DRUG-025',
    name: 'Multivitamin with B-Complex & Zinc (Becozinc)',
    generic_name: 'Vitamin B-Complex + Vitamin C + Zinc',
    category: 'Vitamins & Minerals',
    form: 'Capsule',
    strength: '1 Cap',
    dosage: '1 Cap',
    route: 'Oral',
    defaultFrequency: '1-0-0 (Morning)',
    defaultDurationValue: 15,
    defaultDurationUnit: 'Days',
    defaultInstruction: 'After Food',
    commonIndications: ['Nutritional deficiency', 'Convalescence', 'Mouth ulcers', 'Fatigue']
  }
];
