import { Investigation } from '../types';

export interface LabTestDefinition {
  id: string;
  name: string;
  shortName: string;
  category: 'Blood / Hematology' | 'Biochemistry' | 'Urine' | 'Imaging (X-Ray/CT/MRI)' | 'Cardiology (ECG/Echo)' | 'Microbiology / Other';
  standardUnit: string;
  maleRange: { min: number; max: number };
  femaleRange: { min: number; max: number };
  criticalLow?: number;
  criticalHigh?: number;
  clinicalSignificanceHigh: string;
  clinicalSignificanceLow: string;
  aliasRegex: RegExp[];
}

export const LAB_TEST_CATALOG: LabTestDefinition[] = [
  // 1. Hematology
  {
    id: 'lab-hb',
    name: 'Hemoglobin (Hb)',
    shortName: 'Hb',
    category: 'Blood / Hematology',
    standardUnit: 'g/dL',
    maleRange: { min: 13.0, max: 17.0 },
    femaleRange: { min: 12.0, max: 15.5 },
    criticalLow: 7.0,
    criticalHigh: 20.0,
    clinicalSignificanceHigh: 'Polycythemia, severe chronic hypoxia, dehydration',
    clinicalSignificanceLow: 'Anemia, acute blood loss, nutritional deficiency',
    aliasRegex: [/hemo|haemo|hemoglobin|haemoglobin|hb/i]
  },
  {
    id: 'lab-wbc',
    name: 'Total Leukocyte Count (TLC / WBC)',
    shortName: 'TLC',
    category: 'Blood / Hematology',
    standardUnit: '/cu.mm',
    maleRange: { min: 4000, max: 11000 },
    femaleRange: { min: 4000, max: 11000 },
    criticalLow: 2000,
    criticalHigh: 30000,
    clinicalSignificanceHigh: 'Bacterial infection, sepsis, leukemoid reaction',
    clinicalSignificanceLow: 'Viral infection (Dengue, Typhoid), bone marrow suppression',
    aliasRegex: [/total count|tlc|wbc|total leukocyte count|white blood cell/i]
  },
  {
    id: 'lab-plt',
    name: 'Platelet Count',
    shortName: 'Platelets',
    category: 'Blood / Hematology',
    standardUnit: 'lakh/cu.mm',
    maleRange: { min: 1.5, max: 4.5 },
    femaleRange: { min: 1.5, max: 4.5 },
    criticalLow: 0.5, // 50,000
    criticalHigh: 10.0,
    clinicalSignificanceHigh: 'Thrombocytosis, reactive inflammation, myeloproliferative disorder',
    clinicalSignificanceLow: 'Thrombocytopenia (Dengue, ITP, sepsis, DIC bleeding risk)',
    aliasRegex: [/platelet|plt|thrombocyte/i]
  },
  {
    id: 'lab-esr',
    name: 'Erythrocyte Sedimentation Rate (ESR)',
    shortName: 'ESR',
    category: 'Blood / Hematology',
    standardUnit: 'mm/1st hr',
    maleRange: { min: 0, max: 15 },
    femaleRange: { min: 0, max: 20 },
    criticalHigh: 100,
    clinicalSignificanceHigh: 'Systemic inflammation, tuberculosis, autoimmune illness',
    clinicalSignificanceLow: 'Polycythemia',
    aliasRegex: [/esr|erythrocyte sedimentation/i]
  },

  // 2. Biochemistry - Liver (LFT)
  {
    id: 'lab-t-bili',
    name: 'Total Serum Bilirubin',
    shortName: 'T. Bilirubin',
    category: 'Biochemistry',
    standardUnit: 'mg/dL',
    maleRange: { min: 0.2, max: 1.2 },
    femaleRange: { min: 0.2, max: 1.2 },
    criticalHigh: 15.0,
    clinicalSignificanceHigh: 'Jaundice, acute viral hepatitis, biliary obstruction, hemolysis',
    clinicalSignificanceLow: 'Normal physiological baseline',
    aliasRegex: [/total bilirubin|t\. bili|s\. bilirubin/i]
  },
  {
    id: 'lab-sgpt',
    name: 'Alanine Aminotransferase (ALT / SGPT)',
    shortName: 'SGPT / ALT',
    category: 'Biochemistry',
    standardUnit: 'U/L',
    maleRange: { min: 10, max: 45 },
    femaleRange: { min: 7, max: 35 },
    criticalHigh: 500,
    clinicalSignificanceHigh: 'Acute hepatocellular injury, viral hepatitis, drug toxicity (PCM)',
    clinicalSignificanceLow: 'Normal physiological baseline',
    aliasRegex: [/sgpt|alt|alanine aminotransferase/i]
  },
  {
    id: 'lab-sgot',
    name: 'Aspartate Aminotransferase (AST / SGOT)',
    shortName: 'SGOT / AST',
    category: 'Biochemistry',
    standardUnit: 'U/L',
    maleRange: { min: 10, max: 40 },
    femaleRange: { min: 9, max: 32 },
    criticalHigh: 500,
    clinicalSignificanceHigh: 'Hepatocellular damage, myocardial injury, skeletal muscle trauma',
    clinicalSignificanceLow: 'Normal physiological baseline',
    aliasRegex: [/sgot|ast|aspartate aminotransferase/i]
  },

  // 3. Biochemistry - Kidney (KFT / RFT)
  {
    id: 'lab-creat',
    name: 'Serum Creatinine',
    shortName: 'Creatinine',
    category: 'Biochemistry',
    standardUnit: 'mg/dL',
    maleRange: { min: 0.7, max: 1.3 },
    femaleRange: { min: 0.5, max: 1.1 },
    criticalHigh: 4.0,
    clinicalSignificanceHigh: 'Acute Kidney Injury (AKI), Chronic Kidney Disease (CKD), uremia',
    clinicalSignificanceLow: 'Low muscle mass, severe malnutrition',
    aliasRegex: [/creatinine|s\. creat|serum creatinine/i]
  },
  {
    id: 'lab-urea',
    name: 'Blood Urea',
    shortName: 'Blood Urea',
    category: 'Biochemistry',
    standardUnit: 'mg/dL',
    maleRange: { min: 15, max: 40 },
    femaleRange: { min: 15, max: 40 },
    criticalHigh: 150,
    clinicalSignificanceHigh: 'Renal impairment, prerenal azotemia, GI bleeding, dehydration',
    clinicalSignificanceLow: 'Severe liver disease',
    aliasRegex: [/blood urea|urea|bun/i]
  },
  {
    id: 'lab-potassium',
    name: 'Serum Potassium (K+)',
    shortName: 'Potassium',
    category: 'Biochemistry',
    standardUnit: 'mEq/L',
    maleRange: { min: 3.5, max: 5.1 },
    femaleRange: { min: 3.5, max: 5.1 },
    criticalLow: 2.8,
    criticalHigh: 6.2,
    clinicalSignificanceHigh: 'Hyperkalemia, cardiac arrhythmia danger, renal failure',
    clinicalSignificanceLow: 'Hypokalemia, muscle weakness, paralytic ileus, diuretic use',
    aliasRegex: [/potassium|k\+|serum k/i]
  },
  {
    id: 'lab-sodium',
    name: 'Serum Sodium (Na+)',
    shortName: 'Sodium',
    category: 'Biochemistry',
    standardUnit: 'mEq/L',
    maleRange: { min: 135, max: 145 },
    femaleRange: { min: 135, max: 145 },
    criticalLow: 120,
    criticalHigh: 160,
    clinicalSignificanceHigh: 'Hypernatremia, severe dehydration, diabetes insipidus',
    clinicalSignificanceLow: 'Hyponatremia, confusion, seizures, SIADH, fluid overload',
    aliasRegex: [/sodium|na\+|serum na/i]
  },

  // 4. Cardiac Biomarkers & Lipids
  {
    id: 'lab-trop-i',
    name: 'Troponin I (High-Sensitivity)',
    shortName: 'Troponin I',
    category: 'Cardiology (ECG/Echo)',
    standardUnit: 'ng/mL',
    maleRange: { min: 0.0, max: 0.04 },
    femaleRange: { min: 0.0, max: 0.04 },
    criticalHigh: 0.5,
    clinicalSignificanceHigh: 'Acute Myocardial Infarction (STEMI / NSTEMI), myocarditis',
    clinicalSignificanceLow: 'Normal cardiac muscle integrity',
    aliasRegex: [/troponin|trop i|hs-trop|cardiac troponin/i]
  },
  {
    id: 'lab-cholesterol',
    name: 'Total Cholesterol',
    shortName: 'Cholesterol',
    category: 'Biochemistry',
    standardUnit: 'mg/dL',
    maleRange: { min: 120, max: 200 },
    femaleRange: { min: 120, max: 200 },
    criticalHigh: 300,
    clinicalSignificanceHigh: 'Hypercholesterolemia, CAD cardiovascular risk',
    clinicalSignificanceLow: 'Severe malabsorption',
    aliasRegex: [/cholesterol|total cholesterol/i]
  },

  // 5. Glycemic Markers
  {
    id: 'lab-rbs',
    name: 'Random Blood Sugar (RBS)',
    shortName: 'RBS',
    category: 'Biochemistry',
    standardUnit: 'mg/dL',
    maleRange: { min: 70, max: 140 },
    femaleRange: { min: 70, max: 140 },
    criticalLow: 50,
    criticalHigh: 350,
    clinicalSignificanceHigh: 'Hyperglycemia, Diabetes Mellitus, DKA/HHS risk',
    clinicalSignificanceLow: 'Hypoglycemia, syncope risk, insulin overdose',
    aliasRegex: [/rbs|random blood sugar|random glucose|glucose/i]
  },
  {
    id: 'lab-hba1c',
    name: 'Glycated Hemoglobin (HbA1c)',
    shortName: 'HbA1c',
    category: 'Biochemistry',
    standardUnit: '%',
    maleRange: { min: 4.0, max: 5.6 },
    femaleRange: { min: 4.0, max: 5.6 },
    criticalHigh: 11.0,
    clinicalSignificanceHigh: 'Uncontrolled Diabetes (>6.5% Diagnostic, >8% Poor Control)',
    clinicalSignificanceLow: 'Recurrent hypoglycemia, hemolytic anemia',
    aliasRegex: [/hba1c|glycated hb|a1c/i]
  }
];

export interface AnalyteReportItem {
  definitionId: string;
  testName: string;
  category: Investigation['category'];
  measuredValue: number;
  measuredUnit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical High' | 'Critical Low';
  clinicalInterpretation: string;
  isPanicAlert: boolean;
}

export interface InterpretedLabReport {
  id: string;
  reportTitle: string;
  patientName: string;
  sampleDate: string;
  analytes: AnalyteReportItem[];
  panicAlertCount: number;
  abnormalCount: number;
  aiClinicalImpression: string;
  suggestedAction: string;
  differentialsUpdated: string[];
}

export const SAMPLE_LAB_REPORTS_DATABASE: InterpretedLabReport[] = [
  // 1. Severe Dengue with Thrombocytopenia
  {
    id: 'rep-dengue-1',
    reportTitle: 'Complete Hemogram (CBC) & Dengue Serology',
    patientName: 'Ramesh Kumar (PAT-2026-0042)',
    sampleDate: '2026-08-25',
    analytes: [
      {
        definitionId: 'lab-hb',
        testName: 'Hemoglobin (Hb)',
        category: 'Blood / Hematology',
        measuredValue: 16.4,
        measuredUnit: 'g/dL',
        referenceRange: '13.0 - 17.0 g/dL',
        status: 'Normal',
        clinicalInterpretation: 'Hemoconcentration tendency noted due to capillary plasma leakage',
        isPanicAlert: false
      },
      {
        definitionId: 'lab-wbc',
        testName: 'Total Leukocyte Count (TLC)',
        category: 'Blood / Hematology',
        measuredValue: 2800,
        measuredUnit: '/cu.mm',
        referenceRange: '4000 - 11000 /cu.mm',
        status: 'Low',
        clinicalInterpretation: 'Leukopenia indicative of acute viral marrow suppression',
        isPanicAlert: false
      },
      {
        definitionId: 'lab-plt',
        testName: 'Platelet Count',
        category: 'Blood / Hematology',
        measuredValue: 0.38, // 38,000
        measuredUnit: 'lakh/cu.mm',
        referenceRange: '1.5 - 4.5 lakh/cu.mm',
        status: 'Critical Low',
        clinicalInterpretation: 'CRITICAL THROMBOCYTOPENIA (<50,000/cu.mm) with high spontaneous bleeding risk',
        isPanicAlert: true
      },
      {
        definitionId: 'lab-sgpt',
        testName: 'SGPT / ALT',
        category: 'Biochemistry',
        measuredValue: 124,
        measuredUnit: 'U/L',
        referenceRange: '10 - 45 U/L',
        status: 'High',
        clinicalInterpretation: 'Moderate transaminitis consistent with Dengue viral hepatitis',
        isPanicAlert: false
      }
    ],
    panicAlertCount: 1,
    abnormalCount: 3,
    aiClinicalImpression: 'Classic clinical picture of Dengue Fever with Warning Signs: Critical Thrombocytopenia (38,000/cu.mm), Leukopenia, and mild hepatic involvement.',
    suggestedAction: 'Immediate admission for close monitoring. Strict isotonic fluid replacement. Avoid NSAIDs/Aspirin. Daily platelet count monitoring.',
    differentialsUpdated: ['Dengue Fever with Warning Signs (A97.1)', 'Viral Hemorrhagic Fever', 'Acute Immune Thrombocytopenia']
  },

  // 2. Acute Coronary Syndrome (STEMI / NSTEMI)
  {
    id: 'rep-acs-1',
    reportTitle: 'Cardiac Enzymes & Emergency Metabolic Panel',
    patientName: 'Rajesh Malhotra (PAT-2026-0043)',
    sampleDate: '2026-08-25',
    analytes: [
      {
        definitionId: 'lab-trop-i',
        testName: 'Troponin I (High-Sensitivity)',
        category: 'Cardiology (ECG/Echo)',
        measuredValue: 1.84,
        measuredUnit: 'ng/mL',
        referenceRange: '0.0 - 0.04 ng/mL',
        status: 'Critical High',
        clinicalInterpretation: 'SIGNIFICANTLY ELEVATED CARDIAC TROPONIN I indicating acute myocardial necrosis',
        isPanicAlert: true
      },
      {
        definitionId: 'lab-rbs',
        testName: 'Random Blood Sugar',
        category: 'Biochemistry',
        measuredValue: 218,
        measuredUnit: 'mg/dL',
        referenceRange: '70 - 140 mg/dL',
        status: 'High',
        clinicalInterpretation: 'Stress-induced hyperglycemia / uncontrolled glycaemic status',
        isPanicAlert: false
      },
      {
        definitionId: 'lab-cholesterol',
        testName: 'Total Cholesterol',
        category: 'Biochemistry',
        measuredValue: 264,
        measuredUnit: 'mg/dL',
        referenceRange: '120 - 200 mg/dL',
        status: 'High',
        clinicalInterpretation: 'Significant hypercholesterolemia as underlying atherosclerotic driver',
        isPanicAlert: false
      },
      {
        definitionId: 'lab-potassium',
        testName: 'Serum Potassium (K+)',
        category: 'Biochemistry',
        measuredValue: 4.4,
        measuredUnit: 'mEq/L',
        referenceRange: '3.5 - 5.1 mEq/L',
        status: 'Normal',
        clinicalInterpretation: 'Normal electrolyte balance',
        isPanicAlert: false
      }
    ],
    panicAlertCount: 1,
    abnormalCount: 3,
    aiClinicalImpression: 'CRITICAL: Marked Elevation of Cardiac Troponin I (1.84 ng/mL) confirms Acute Coronary Syndrome (Non-ST / ST-Elevation Myocardial Infarction).',
    suggestedAction: 'Immediate 12-lead ECG, cardiology consult, dual antiplatelet therapy (Aspirin + Clopidogrel), statin loading dose, and urgent angiography readiness.',
    differentialsUpdated: ['Acute Myocardial Infarction (I21.9)', 'Acute Coronary Syndrome (I24.9)', 'Acute Myocarditis']
  },

  // 3. Acute Kidney Injury & Hyperkalemia
  {
    id: 'rep-aki-1',
    reportTitle: 'Renal Function Panel (KFT) & Electrolytes',
    patientName: 'Sunita Devi (PAT-2026-0044)',
    sampleDate: '2026-08-25',
    analytes: [
      {
        definitionId: 'lab-creat',
        testName: 'Serum Creatinine',
        category: 'Biochemistry',
        measuredValue: 3.4,
        measuredUnit: 'mg/dL',
        referenceRange: '0.5 - 1.1 mg/dL',
        status: 'Critical High',
        clinicalInterpretation: 'SEVERE RENAL DYSFUNCTION - 3x baseline indicating Acute Kidney Injury on CKD',
        isPanicAlert: true
      },
      {
        definitionId: 'lab-urea',
        testName: 'Blood Urea',
        category: 'Biochemistry',
        measuredValue: 112,
        measuredUnit: 'mg/dL',
        referenceRange: '15 - 40 mg/dL',
        status: 'High',
        clinicalInterpretation: 'Uremic retention with severe azotemia',
        isPanicAlert: false
      },
      {
        definitionId: 'lab-potassium',
        testName: 'Serum Potassium (K+)',
        category: 'Biochemistry',
        measuredValue: 5.9,
        measuredUnit: 'mEq/L',
        referenceRange: '3.5 - 5.1 mEq/L',
        status: 'High',
        clinicalInterpretation: 'Hyperkalemia with potential ECG changes (tall peaked T waves)',
        isPanicAlert: true
      },
      {
        definitionId: 'lab-sodium',
        testName: 'Serum Sodium (Na+)',
        category: 'Biochemistry',
        measuredValue: 132,
        measuredUnit: 'mEq/L',
        referenceRange: '135 - 145 mEq/L',
        status: 'Low',
        clinicalInterpretation: 'Mild dilutional hyponatremia',
        isPanicAlert: false
      }
    ],
    panicAlertCount: 2,
    abnormalCount: 4,
    aiClinicalImpression: 'Acute Kidney Injury (Creatinine 3.4 mg/dL) with Azotemia and Impending Life-Threatening Hyperkalemia (K+ 5.9 mEq/L).',
    suggestedAction: 'Immediate ECG to evaluate for hyperkalemic arrhythmias. Calcium Gluconate 10%, Insulin-Dextrose infusion, stop nephrotoxic drugs/ACE-inhibitors, nephrology consult for hemodialysis evaluation.',
    differentialsUpdated: ['Acute Kidney Injury Stage 3 (N17.9)', 'Hyperkalemia (E87.5)', 'Prerenal Uremia']
  }
];
