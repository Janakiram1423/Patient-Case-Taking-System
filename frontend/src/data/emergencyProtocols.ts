export interface EmergencyProtocol {
  id: string;
  title: string;
  category: 'Cardiology' | 'Neurology' | 'Allergy / Emergency' | 'Respiratory' | 'Trauma';
  icon: string;
  severity: 'Critical Emergency (STAT)' | 'High Priority';
  immediateActions: string[];
  investigationsSTAT: string[];
  firstLineMedications: string[];
  contraindications: string[];
  clinicalPearl: string;
}

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'ER-01',
    title: 'Acute Coronary Syndrome (STEMI) Pathway',
    category: 'Cardiology',
    icon: 'Heart',
    severity: 'Critical Emergency (STAT)',
    immediateActions: [
      'Perform 12-Lead ECG within 10 minutes of arrival',
      'Attach continuous cardiac telemetry & pulse oximetry monitoring',
      'Establish 2 large-bore IV access lines (18G)',
      'Supplemental Oxygen ONLY if SpO2 < 90%'
    ],
    investigationsSTAT: [
      '12-Lead ECG (look for ST elevation in contiguous leads or new LBBB)',
      'Cardiac Troponin-I / Troponin-T (STAT)',
      'CK-MB, CBC, Serum Electrolytes, Serum Creatinine',
      'Portable Chest X-Ray'
    ],
    firstLineMedications: [
      'Aspirin (Dispersible/Chewable) 300 mg STAT orally',
      'Clopidogrel 300-600 mg loading dose STAT (or Ticagrelor 180 mg)',
      'Sublingual Nitroglycerin 0.4 mg (caution if SBP < 90 or inferior MI)',
      'Unfractionated Heparin (UFH) / Enoxaparin bolus',
      'Atorvastatin 80 mg STAT'
    ],
    contraindications: [
      'Do NOT give Nitrates if SBP < 90 mmHg, marked bradycardia, or recent PDE-5 inhibitor (Viagra) use',
      'Avoid NSAIDs (other than Aspirin)'
    ],
    clinicalPearl: 'Time is Myocardium: Door-to-balloon time goal < 90 mins for Primary PCI, or Door-to-needle < 30 mins for Thrombolysis.'
  },
  {
    id: 'ER-02',
    title: 'Acute Ischemic Stroke (Thrombolysis Window)',
    category: 'Neurology',
    icon: 'Brain',
    severity: 'Critical Emergency (STAT)',
    immediateActions: [
      'Check Point-of-Care Capillary Blood Glucose STAT (rule out hypoglycemia)',
      'Assess FAST / NIHSS Stroke Scale score',
      'Non-Contrast CT Brain (NCCT Brain) STAT (Door-to-CT < 20 mins)',
      'Establish exact "Time of Last Known Well"'
    ],
    investigationsSTAT: [
      'NCCT Brain STAT (to rule out Intracranial Hemorrhage)',
      'Random Blood Glucose (RBS)',
      'Coagulation Profile: PT/INR, aPTT, Platelet Count',
      '12-Lead ECG'
    ],
    firstLineMedications: [
      'IV rtPA (Alteplase) 0.9 mg/kg (max 90mg) if within 4.5-hour window and no exclusion criteria',
      'Blood Pressure management: IV Labetalol or Nicardipine (maintain SBP < 185, DBP < 110 before thrombolysis)',
      'Antipyretic for fever (maintain normothermia)'
    ],
    contraindications: [
      'Absolute contraindications to IV rtPA: Evidence of intracranial hemorrhage on CT, active internal bleeding, recent head trauma/surgery within 3 months, INR > 1.7'
    ],
    clinicalPearl: 'Time is Brain: 1.9 million neurons lost every minute in untreated acute ischemic stroke.'
  },
  {
    id: 'ER-03',
    title: 'Acute Anaphylaxis & Severe Allergic Collapse',
    category: 'Allergy / Emergency',
    icon: 'AlertTriangle',
    severity: 'Critical Emergency (STAT)',
    immediateActions: [
      'Inject Intramuscular (IM) Epinephrine/Adrenaline STAT (Anterolateral mid-thigh)',
      'Place patient supine with legs elevated (unless airway compromised)',
      'High-flow 100% Oxygen (10-15 L/min via non-rebreather mask)',
      'Rapid IV Fluid Resuscitation (Normal Saline 1-2 Litres rapid bolus)'
    ],
    investigationsSTAT: [
      'Pulse Oximetry, Continuous BP & ECG monitoring',
      'Serum Tryptase (collected 1-2 hours post-event for confirmation)'
    ],
    firstLineMedications: [
      'Adrenaline (1:1000 / 1 mg/ml) 0.5 mg IM into mid-outer thigh (repeat every 5-15 mins if poor response)',
      'IV Hydrocortisone 100-200 mg STAT (prevents biphasic reaction)',
      'IV Avil (Pheniramine) 22.75 mg or Cetirizine 10 mg',
      'Nebulized Salbutamol 5 mg if bronchospasm/wheeze present'
    ],
    contraindications: [
      'Do NOT delay IM Epinephrine! Antihistamines and steroids are second-line and do NOT save lives in acute laryngeal edema.'
    ],
    clinicalPearl: 'Epinephrine given IM in the anterolateral thigh achieves peak blood levels in 8 minutes compared to 34 minutes for SQ route.'
  },
  {
    id: 'ER-04',
    title: 'Severe Acute Asthma Exacerbation / Status Asthmaticus',
    category: 'Respiratory',
    icon: 'Wind',
    severity: 'Critical Emergency (STAT)',
    immediateActions: [
      'Continuous High-Flow Oxygen to maintain SpO2 93-95%',
      'Continuous / Back-to-back Nebulization with beta-agonists + ipratropium',
      'Early systemic corticosteroids administration',
      'Assess for "Silent Chest" (ominous sign of impending respiratory arrest)'
    ],
    investigationsSTAT: [
      'Peak Expiratory Flow (PEFR) if feasible',
      'Arterial Blood Gas (ABG): Normal or elevated PaCO2 indicates muscle exhaustion / impending arrest',
      'Chest X-Ray (to rule out pneumothorax)'
    ],
    firstLineMedications: [
      'Nebulized Salbutamol 5mg + Ipratropium 0.5mg every 20 mins x 3 doses',
      'IV Hydrocortisone 100mg or Oral Prednisolone 40-50mg STAT',
      'IV Magnesium Sulfate 2g in 100ml Normal Saline over 20 mins (for severe refractory asthma)'
    ],
    contraindications: [
      'Do NOT give sedatives or anxiolytics (depresses respiratory drive)',
      'Avoid beta-blockers'
    ],
    clinicalPearl: 'A "normal" PaCO2 in a severely tachypneic asthmatic is an ominous sign indicating imminent respiratory muscle fatigue.'
  }
];
