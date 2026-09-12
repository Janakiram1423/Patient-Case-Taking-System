import { PrescriptionItem, ChiefComplaint, HistoryOfPresentIllness, Diagnosis } from '../types';

export interface ClinicalProtocol {
  id: string;
  name: string;
  category: string;
  icon: string;
  chiefComplaint: Partial<ChiefComplaint>;
  hpi: Partial<HistoryOfPresentIllness>;
  diagnosis: Partial<Diagnosis>;
  prescriptions: Array<Omit<PrescriptionItem, 'id'>>;
  investigations: string[];
  followUpDays: number;
  advice: string;
}

export const STANDARD_CLINICAL_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'STP-01',
    name: 'Acute Upper RTI & Pharyngitis Protocol',
    category: 'Respiratory / Infectious',
    icon: 'Thermometer',
    chiefComplaint: {
      main_complaint: 'Fever with sore throat, runny nose and dry hacking cough',
      duration_value: 3,
      duration_unit: 'Days',
      severity: 'Moderate',
      frequency: 'Continuous',
      associated_symptoms: ['Sore throat', 'Cough', 'Body ache / Myalgia', 'Mild headache']
    },
    hpi: {
      onset: 'Gradual',
      progression: 'Worsening',
      character: 'Scratchy throat discomfort with mild body pain',
      aggravating_factors: ['Cold drinks', 'Dust exposure', 'Swallowing solid food'],
      relieving_factors: ['Warm saline gargles', 'Warm liquids']
    },
    diagnosis: {
      provisional_diagnosis: 'Acute Viral Pharyngitis & Upper Respiratory Tract Infection',
      provisional_icd10: 'J02.9',
      final_diagnosis: 'Acute Nasopharyngitis (Common Cold) & Viral Pharyngitis',
      final_icd10: 'J00 / J02.9',
      differential_diagnoses: ['Streptococcal Pharyngitis', 'Acute Tonsillitis', 'Allergic Rhinitis'],
      clinical_notes: 'Bilateral tonsils mildly congested with no purulent exudate. Posterior pharyngeal wall erythematous. Advised symptomatic therapy, hydration, and warm saline gargles.'
    },
    prescriptions: [
      {
        medicine_name: 'Paracetamol (Dolo 650)',
        generic_name: 'Paracetamol 650mg',
        form: 'Tablet',
        strength: '650 mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-1-1 (Thrice daily)',
        duration_value: 5,
        duration_unit: 'Days',
        instruction: 'After Food',
        notes: 'For fever and body ache.'
      },
      {
        medicine_name: 'Levocetirizine + Montelukast (Monticope)',
        generic_name: 'Levocetirizine 5mg + Montelukast 10mg',
        form: 'Tablet',
        strength: '5mg / 10mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '0-0-1 (Night)',
        duration_value: 7,
        duration_unit: 'Days',
        instruction: 'Bedtime',
        notes: 'For allergic rhinitis, runny nose, and throat tickle.'
      },
      {
        medicine_name: 'Dextromethorphan + Chlorpheniramine Syrup (Ascoril-D)',
        generic_name: 'Dextromethorphan HBr + CPM',
        form: 'Syrup',
        strength: '10mg / 2mg per 5ml',
        dosage: '10 ml',
        route: 'Oral',
        frequency: '1-1-1 (Thrice daily)',
        duration_value: 5,
        duration_unit: 'Days',
        instruction: 'After Food',
        notes: 'Take with warm water for dry cough.'
      },
      {
        medicine_name: 'Multivitamin with B-Complex & Zinc (Becozinc)',
        generic_name: 'Vitamin B-Complex + Zinc',
        form: 'Capsule',
        strength: '1 Cap',
        dosage: '1 Cap',
        route: 'Oral',
        frequency: '1-0-0 (Morning)',
        duration_value: 10,
        duration_unit: 'Days',
        instruction: 'After Food',
        notes: 'Immune support.'
      }
    ],
    investigations: ['Complete Blood Count (CBC) with ESR'],
    followUpDays: 5,
    advice: 'Warm water intake, saline gargles 3 times daily, adequate rest, avoid cold beverages.'
  },
  {
    id: 'STP-02',
    name: 'Acute Gastritis & GERD Protocol',
    category: 'Gastroenterology',
    icon: 'Flame',
    chiefComplaint: {
      main_complaint: 'Burning epigastric pain, acid regurgitation and post-meal nausea',
      duration_value: 4,
      duration_unit: 'Days',
      severity: 'Moderate',
      frequency: 'Intermittent',
      associated_symptoms: ['Nausea & Vomiting', 'Epigastric burning', 'Bloating', 'Loss of appetite']
    },
    hpi: {
      onset: 'Gradual',
      progression: 'Worsening',
      character: 'Severe burning sensation in upper central abdomen radiating retrosternally',
      aggravating_factors: ['Spicy & fried foods', 'Empty stomach', 'Coffee & tea intake'],
      relieving_factors: ['Cold milk', 'Antacid liquids']
    },
    diagnosis: {
      provisional_diagnosis: 'Acute Superficial Gastritis & Gastroesophageal Reflux Disease (GERD)',
      provisional_icd10: 'K29.7 / K21.9',
      final_diagnosis: 'Acute Erosive Gastritis & Dyspepsia',
      final_icd10: 'K29.00',
      differential_diagnoses: ['Peptic Ulcer Disease', 'Biliary Colic / Cholecystitis', 'Non-ulcer Dyspepsia'],
      clinical_notes: 'Mild epigastric tenderness on deep palpation. No guarding or rigidity. Advised dietary modifications, small frequent bland meals, and avoidance of late-night dinners.'
    },
    prescriptions: [
      {
        medicine_name: 'Pantoprazole (Pan 40)',
        generic_name: 'Pantoprazole Sodium 40mg',
        form: 'Tablet',
        strength: '40 mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-0-0 (Morning)',
        duration_value: 14,
        duration_unit: 'Days',
        instruction: 'Before Food',
        notes: 'Take 30 minutes before morning breakfast.'
      },
      {
        medicine_name: 'Ondansetron (Emeset 4)',
        generic_name: 'Ondansetron Hydrochloride 4mg',
        form: 'Tablet',
        strength: '4 mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-0-1 (Twice daily)',
        duration_value: 3,
        duration_unit: 'Days',
        instruction: 'Before Food',
        notes: 'For nausea and vomiting relief.'
      }
    ],
    investigations: ['Ultrasound Whole Abdomen (USG)', 'Serum Amylase & Lipase (if pain radiates to back)'],
    followUpDays: 7,
    advice: 'Avoid spicy, oily foods, citrus juices, caffeine, and tobacco. Eat light meals 2 hours before lying down. Elevate head of bed by 15 cm.'
  },
  {
    id: 'STP-03',
    name: 'Essential Hypertension Maintenance Protocol',
    category: 'Cardiology / Internal Medicine',
    icon: 'Heart',
    chiefComplaint: {
      main_complaint: 'Routine follow-up for elevated blood pressure and mild occipital heaviness',
      duration_value: 2,
      duration_unit: 'Weeks',
      severity: 'Moderate',
      frequency: 'Morning',
      associated_symptoms: ['Occipital headache', 'Mild fatigue', 'No chest pain', 'No shortness of breath']
    },
    hpi: {
      onset: 'Gradual',
      progression: 'Static',
      character: 'Dull morning occipital heaviness that improves by afternoon',
      aggravating_factors: ['Work stress', 'High salt intake', 'Lack of sleep'],
      relieving_factors: ['Rest', 'Stress reduction']
    },
    diagnosis: {
      provisional_diagnosis: 'Primary Essential Hypertension (Stage 1 / Stage 2)',
      provisional_icd10: 'I10',
      final_diagnosis: 'Essential (Primary) Hypertension',
      final_icd10: 'I10',
      differential_diagnoses: ['White-Coat Hypertension', 'Secondary Hypertension (Renovascular)', 'Cushing Syndrome'],
      clinical_notes: 'Cardiovascular examination normal with regular rhythm. Fundoscopy shows Grade 1 hypertensive changes. Advised DASH diet with sodium restriction (< 2g/day).'
    },
    prescriptions: [
      {
        medicine_name: 'Telmisartan (Telma 40)',
        generic_name: 'Telmisartan 40mg',
        form: 'Tablet',
        strength: '40 mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-0-0 (Morning)',
        duration_value: 1,
        duration_unit: 'Months',
        instruction: 'Before Food',
        notes: 'Take daily at the same fixed morning hour.'
      },
      {
        medicine_name: 'Aspirin (Ecosprin 75)',
        generic_name: 'Enteric Coated Aspirin 75mg',
        form: 'Tablet',
        strength: '75 mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-0-0 (Morning)',
        duration_value: 1,
        duration_unit: 'Months',
        instruction: 'After Food',
        notes: 'For cardiovascular risk reduction.'
      }
    ],
    investigations: ['12-Lead ECG', 'Lipid Profile', 'Serum Creatinine & Electrolytes', 'Urine for Microalbuminuria'],
    followUpDays: 30,
    advice: 'DASH low sodium diet (< 2g sodium/day), 30 minutes brisk walking daily, maintain home blood pressure log diary morning and evening.'
  },
  {
    id: 'STP-04',
    name: 'Type 2 Diabetes Glycemic Control Protocol',
    category: 'Endocrinology / Diabetology',
    icon: 'Activity',
    chiefComplaint: {
      main_complaint: 'Generalized weakness, increased thirst (polydipsia) and frequent urination (polyuria)',
      duration_value: 3,
      duration_unit: 'Weeks',
      severity: 'Moderate',
      frequency: 'Continuous',
      associated_symptoms: ['Fatigue', 'Polyuria', 'Polydipsia', 'No weight loss']
    },
    hpi: {
      onset: 'Insidious',
      progression: 'Worsening',
      character: 'Persistent lethargy, particularly post-lunch, with increased nocturnal urination',
      aggravating_factors: ['High carbohydrate diet', 'Sedentary routine'],
      relieving_factors: ['Hydration']
    },
    diagnosis: {
      provisional_diagnosis: 'Type 2 Diabetes Mellitus with Suboptimal Glycemic Control',
      provisional_icd10: 'E11.9',
      final_diagnosis: 'Type 2 Diabetes Mellitus without acute complications',
      final_icd10: 'E11.9',
      differential_diagnoses: ['Impaired Fasting Glucose / Prediabetes', 'Diabetes Insipidus', 'Corticosteroid-induced Hyperglycemia'],
      clinical_notes: 'Peripheral pulses palpable, no diabetic foot ulcer or sensory neuropathy. Advised medical nutrition therapy with complex carbohydrates and regular exercise.'
    },
    prescriptions: [
      {
        medicine_name: 'Metformin (Glycomet 500 SR)',
        generic_name: 'Metformin HCl (Sustained Release) 500mg',
        form: 'Tablet',
        strength: '500 mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-0-1 (Twice daily)',
        duration_value: 1,
        duration_unit: 'Months',
        instruction: 'With Food',
        notes: 'Take with major meals to minimize GI side effects.'
      },
      {
        medicine_name: 'Multivitamin with B-Complex & Zinc (Becozinc)',
        generic_name: 'B-Complex + Zinc',
        form: 'Capsule',
        strength: '1 Cap',
        dosage: '1 Cap',
        route: 'Oral',
        frequency: '1-0-0 (Morning)',
        duration_value: 1,
        duration_unit: 'Months',
        instruction: 'After Food',
        notes: 'For nerve and metabolic support.'
      }
    ],
    investigations: ['Fasting & Postprandial Blood Glucose (FBS / PPBS)', 'HbA1c Glycated Hemoglobin', 'Lipid Profile', 'Serum Creatinine & eGFR', 'Urine Routine & Microalbumin'],
    followUpDays: 30,
    advice: 'Low glycemic index diabetic diet, eliminate refined sugar and sweets, 45 minutes aerobic exercise daily, annual dilated eye fundus exam.'
  }
];
