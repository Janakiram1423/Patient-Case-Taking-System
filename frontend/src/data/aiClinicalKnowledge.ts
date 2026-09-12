import { SmartQuestion } from '../types';

export interface SymptomKnowledgeBase {
  keywordPatterns: RegExp[];
  canonicalName: string;
  category: string;
  smartQuestions: SmartQuestion[];
  redFlags: string[];
  suggestedInvestigations: string[];
  provisionalDifferentials: string[];
}

export const SYMPTOM_KNOWLEDGE_BASE: SymptomKnowledgeBase[] = [
  // 1. Headache / Cephalea
  {
    keywordPatterns: [/headache/i, /head pain/i, /migraine/i, /throbbing head/i, /cephalea/i],
    canonicalName: 'Headache',
    category: 'Neurology / General Medicine',
    smartQuestions: [
      {
        id: 'hq-1',
        question: 'Did the headache begin suddenly like a "thunderclap" or build up gradually over hours/days?',
        category: 'Onset & Duration',
        suggestedField: 'hpi',
        targetKey: 'onset',
        quickAnswers: ['Gradual onset over 2-3 days', 'Sudden severe peak within 1 minute (Thunderclap)', 'Intermittent recurrent over months', 'Waking up with headache in morning'],
        isRedFlag: true
      },
      {
        id: 'hq-2',
        question: 'Where is the headache predominantly located and what is its character?',
        category: 'Location & Radiation',
        suggestedField: 'hpi',
        targetKey: 'character',
        quickAnswers: ['Unilateral throbbing / pulsating', 'Bilateral tight band-like sensation', 'Behind the eye / periorbital', 'Occipital & neck stiffness']
      },
      {
        id: 'hq-3',
        question: 'Are there visual changes, aura, sensitivity to light (photophobia), or nausea?',
        category: 'Associated Symptoms',
        suggestedField: 'chief_complaint',
        targetKey: 'associated_symptoms',
        quickAnswers: ['Nausea and vomiting', 'Photophobia & phonophobia', 'Visual aura (flashing lights / zigzag)', 'No visual disturbance']
      },
      {
        id: 'hq-4',
        question: 'Does the headache worsen with coughing, bending forward, or Valsalva maneuvers?',
        category: 'Triggers & Relievers',
        suggestedField: 'hpi',
        targetKey: 'aggravating_factors',
        quickAnswers: ['Worse with bright light & loud sound', 'Worse on bending forward / coughing', 'Worse during screen time / stress', 'Relieved by rest in dark room', 'Relieved by analgesic']
      },
      {
        id: 'hq-5',
        question: 'Are there warning signs like neck stiffness, high fever, limb weakness, or altered consciousness?',
        category: 'Red Flags & Risks',
        suggestedField: 'red_flags',
        quickAnswers: ['No focal deficits or neck stiffness', 'Mild neck stiffness with fever', 'Transient arm numbness / tingling', 'Confusion or drowsiness'],
        isRedFlag: true
      }
    ],
    redFlags: [
      'Thunderclap onset (reaching maximum intensity in < 1 minute)',
      'Headache with fever and neck stiffness (meningismus)',
      'New onset headache in patient > 50 years',
      'Papilledema or progressive focal neurological deficits',
      'Worse on Valsalva / postural change with vomiting'
    ],
    suggestedInvestigations: ['NCCT Brain / MRI Brain', 'Fundoscopy (Papilledema check)', 'Complete Blood Count (CBC)', 'ESR / CRP'],
    provisionalDifferentials: ['Migraine without Aura (G43.0)', 'Tension-type Headache (G44.2)', 'Sinusitis / Rhinogenic Headache', 'Secondary Headache Rule out Subarachnoid Hemorrhage']
  },

  // 2. Acute Fever / Pyrexia
  {
    keywordPatterns: [/fever/i, /pyrexia/i, /high temperature/i, /chills/i, /shivering/i, /body heat/i],
    canonicalName: 'Acute Fever',
    category: 'Infectious Disease / Internal Medicine',
    smartQuestions: [
      {
        id: 'fq-1',
        question: 'What is the pattern of fever and is it accompanied by chills or rigors?',
        category: 'Onset & Duration',
        suggestedField: 'hpi',
        targetKey: 'progression',
        quickAnswers: ['Continuous high grade with chills', 'Step-ladder rise in evening (Typhoid-like)', 'Intermittent spikes with rigors (Malaria-like)', 'Low grade fever with night sweats']
      },
      {
        id: 'fq-2',
        question: 'Are there localizing symptoms such as cough, sore throat, burning urination, or abdominal cramps?',
        category: 'Associated Symptoms',
        suggestedField: 'chief_complaint',
        targetKey: 'associated_symptoms',
        quickAnswers: ['Cough with phlegm and runny nose', 'Sore throat & difficulty swallowing', 'Dysuria (burning micturition) & frequency', 'Severe retro-orbital pain & body ache (Breakbone)', 'Loose stools & nausea']
      },
      {
        id: 'fq-3',
        question: 'Have any skin rashes, petechiae, or spontaneous bleeding (gum/nose) been noticed?',
        category: 'Red Flags & Risks',
        suggestedField: 'general_exam',
        targetKey: 'other_findings',
        quickAnswers: ['No rash or bleeding spots', 'Petechial rash on limbs', 'Maculopapular rash across trunk', 'Bleeding gums / epistaxis'],
        isRedFlag: true
      },
      {
        id: 'fq-4',
        question: 'Recent travel history, mosquito exposure, or contaminated water/food consumption?',
        category: 'Triggers & Relievers',
        suggestedField: 'past_history',
        targetKey: 'custom_conditions',
        quickAnswers: ['Travel to endemic / jungle area in past 2 weeks', 'Outside street food consumption 3 days ago', 'Multiple family members having similar fever', 'No recent travel']
      }
    ],
    redFlags: [
      'High grade fever > 103°F with altered sensorium or delirium',
      'Petechial or purpuric skin rash with thrombocytopenia',
      'Persistent vomiting and inability to retain fluids',
      'Hypotension / Cold clammy peripheries (Shock sign)',
      'Extreme tachypnea (Respiratory rate > 30/min)'
    ],
    suggestedInvestigations: ['Complete Blood Count (CBC) with Platelet Count', 'Dengue NS1 Antigen & IgM/IgG', 'Widal Test / Typhidot IgM', 'Malarial Parasite Dual Ag (MP)', 'Urine Routine & Microscopy', 'Chest X-Ray PA View'],
    provisionalDifferentials: ['Acute Viral Fever / Upper RTI', 'Dengue Fever with/without Warning Signs', 'Enteric Fever (Typhoid)', 'Acute Urinary Tract Infection (UTI)', 'Malaria']
  },

  // 3. Chest Pain / Angina / Dyspnea
  {
    keywordPatterns: [/chest pain/i, /angina/i, /chest tightness/i, /pressure on chest/i, /heaviness in chest/i, /precordial/i],
    canonicalName: 'Chest Pain',
    category: 'Cardiology / Emergency',
    smartQuestions: [
      {
        id: 'cp-1',
        question: 'What does the chest pain feel like and does it radiate to the left arm, neck, jaw, or back?',
        category: 'Character & Severity',
        suggestedField: 'hpi',
        targetKey: 'character',
        quickAnswers: ['Crushing retrosternal pressure radiating to left arm & jaw', 'Sharp stabbing pain worse on deep inspiration (Pleuritic)', 'Burning retrosternal sensation after meals', 'Tender localized pain on chest wall palpation'],
        isRedFlag: true
      },
      {
        id: 'cp-2',
        question: 'Is the pain precipitated by physical exertion/stress and relieved by rest or sublingual nitrates?',
        category: 'Triggers & Relievers',
        suggestedField: 'hpi',
        targetKey: 'relieving_factors',
        quickAnswers: ['Triggered by walking/climbing stairs, relieved by rest in 5 mins', 'Continuous at rest, not relieved by position changes', 'Worse on lying flat, relieved by sitting forward (Pericarditis)', 'Aggravated by spicy food and recumbency']
      },
      {
        id: 'cp-3',
        question: 'Are there accompanying symptoms like cold diaphoresis (profuse sweating), dizziness, or nausea?',
        category: 'Associated Symptoms',
        suggestedField: 'chief_complaint',
        targetKey: 'associated_symptoms',
        quickAnswers: ['Profuse cold sweating & breathlessness', 'Dizziness / near syncope', 'Palpitations and tachycardia', 'Acid regurgitation & water brash'],
        isRedFlag: true
      },
      {
        id: 'cp-4',
        question: 'Are there existing risk factors: Diabetes, Hypertension, Dyslipidemia, or Smoking?',
        category: 'Red Flags & Risks',
        suggestedField: 'past_history',
        targetKey: 'conditions',
        quickAnswers: ['Known hypertensive & diabetic for 8+ years', 'Chronic smoker (15 pack-years)', 'Family history of premature CAD / Heart Attack', 'No known chronic comorbidities']
      }
    ],
    redFlags: [
      'Retrosternal crushing pain > 20 mins with cold diaphoresis',
      'Radiation to jaw/left arm with hypotension (BP < 90/60)',
      'Associated acute shortness of breath (Killip class II/III)',
      'Sudden tearing interscapular back pain (Aortic dissection rule out)'
    ],
    suggestedInvestigations: ['12-Lead ECG (STAT)', 'Troponin-I / Troponin-T STAT', 'CK-MB', 'Chest X-Ray PA View', '2D Echocardiography', 'Lipid Profile & HbA1c'],
    provisionalDifferentials: ['Acute Coronary Syndrome (STEMI / NSTEMI / Unstable Angina)', 'GERD / Reflux Esophagitis', 'Costochondritis / Musculoskeletal Chest Pain', 'Pleuritis / Pulmonary Embolism']
  },

  // 4. Abdominal Pain / Dyspepsia
  {
    keywordPatterns: [/abdominal pain/i, /stomach ache/i, /belly pain/i, /epigastric/i, /gastric pain/i, /cramps in stomach/i],
    canonicalName: 'Abdominal Pain',
    category: 'Gastroenterology / General Surgery',
    smartQuestions: [
      {
        id: 'ap-1',
        question: 'In which abdominal quadrant is the pain localized (Epigastrium, Right Lower Quadrant, Right Upper, Diffuse)?',
        category: 'Location & Radiation',
        suggestedField: 'chief_complaint',
        targetKey: 'location',
        quickAnswers: ['Epigastric central burning', 'Right Iliac Fossa (McBurney point)', 'Right Upper Quadrant (subcostal)', 'Suprapubic colicky', 'Diffuse periumbilical']
      },
      {
        id: 'ap-2',
        question: 'How is the pain related to food intake (empty stomach vs post-fatty meal)?',
        category: 'Triggers & Relievers',
        suggestedField: 'hpi',
        targetKey: 'aggravating_factors',
        quickAnswers: ['Worse 1-2 hours after food / empty stomach', 'Worse after greasy/fatty meals', 'Relieved immediately after vomiting', 'Relieved after passing stool or flatus']
      },
      {
        id: 'ap-3',
        question: 'Are there changes in bowel habits, black tarry stools (melena), or blood in vomit (hematemesis)?',
        category: 'Red Flags & Risks',
        suggestedField: 'red_flags',
        quickAnswers: ['Normal bowel habits', 'Multiple watery loose stools', 'Constipation & obstipation (no flatus)', 'Black tarry sticky stools (Melena)', 'Fresh blood in stool'],
        isRedFlag: true
      },
      {
        id: 'ap-4',
        question: 'Is there abdominal distension, rebound tenderness, or abdominal guarding?',
        category: 'Red Flags & Risks',
        suggestedField: 'general_exam',
        targetKey: 'edema_details',
        quickAnswers: ['Soft, non-tender abdomen', 'Localized guarding in right lower quadrant', 'Positive Murphy sign (RUQ arrest)', 'Rigid board-like abdomen (Peritonitis)'],
        isRedFlag: true
      }
    ],
    redFlags: [
      'Board-like abdominal rigidity and severe rebound tenderness (Peritonitis)',
      'Upper GI bleed signs: Hematemesis or Melena',
      'Inability to pass flatus or stool with vomiting (Intestinal obstruction)',
      'Pulsatile abdominal mass in elderly hypertensive'
    ],
    suggestedInvestigations: ['Ultrasound Abdomen & Pelvis (USG Whole Abdomen)', 'Complete Blood Count (CBC) with Neutrophil %', 'Serum Amylase & Lipase', 'Liver Function Tests (LFT)', 'Urine Routine', 'Serum Creatinine & Electrolytes'],
    provisionalDifferentials: ['Acute Gastritis / Peptic Ulcer Disease', 'Acute Appendicitis (K35.8)', 'Acute Cholecystitis / Biliary Colic', 'Acute Gastroenteritis (A09)', 'Ureteric Colic / Renal Calculus']
  },

  // 5. Cough & Dyspnea / Respiratory
  {
    keywordPatterns: [/cough/i, /breathless/i, /wheezing/i, /shortness of breath/i, /phlegm/i, /sputum/i, /dyspnea/i],
    canonicalName: 'Cough & Respiratory Distress',
    category: 'Pulmonology / Internal Medicine',
    smartQuestions: [
      {
        id: 'rq-1',
        question: 'Is the cough dry or productive, and what is the color and volume of sputum?',
        category: 'Character & Severity',
        suggestedField: 'hpi',
        targetKey: 'character',
        quickAnswers: ['Dry hacking non-productive cough', 'Productive with yellow-green purulent sputum', 'White frothy mucoid sputum', 'Blood-tinged sputum (Hemoptysis)'],
        isRedFlag: true
      },
      {
        id: 'rq-2',
        question: 'Is breathlessness present at rest, on walking, or when lying flat (orthopnea)?',
        category: 'Onset & Duration',
        suggestedField: 'hpi',
        targetKey: 'progression',
        quickAnswers: ['Dyspnea only on moderate exertion (mMRC Grade 2)', 'Dyspnea even at rest (mMRC Grade 4)', 'Awakened at night gasping for breath (PND)', 'Paroxysmal wheezing after dust / cold air exposure']
      },
      {
        id: 'rq-3',
        question: 'Are there audible wheezes, chest tightness, or history of childhood asthma/allergies?',
        category: 'Associated Symptoms',
        suggestedField: 'chief_complaint',
        targetKey: 'associated_symptoms',
        quickAnswers: ['Bilateral expiratory wheezing & chest tightness', 'Nocturnal cough spikes', 'Associated allergic sneezing and itchy eyes', 'No history of asthma']
      }
    ],
    redFlags: [
      'Oxygen saturation SpO2 < 92% on room air',
      'Use of accessory muscles of respiration with tracheal tug',
      'Hemoptysis (Frank blood in sputum)',
      'Stridor or sudden upper airway obstruction'
    ],
    suggestedInvestigations: ['Pulse Oximetry (SpO2 monitoring)', 'Chest X-Ray PA View', 'Complete Blood Count (CBC) with Absolute Eosinophil Count', 'Peak Expiratory Flow Rate (PEFR) / Spirometry', 'Sputum for AFB / Culture'],
    provisionalDifferentials: ['Acute Bronchitis (J20.9)', 'Bronchial Asthma Exacerbation (J45.9)', 'Community Acquired Pneumonia (CAP)', 'COPD Acute Exacerbation', 'Post-Nasal Drip / GERD-induced Cough']
  }
];

// Fallback questions for general / uncategorized symptoms
export const GENERAL_SMART_QUESTIONS: SmartQuestion[] = [
  {
    id: 'gq-1',
    question: 'How long have you been experiencing this symptom and did it start suddenly or gradually?',
    category: 'Onset & Duration',
    suggestedField: 'hpi',
    targetKey: 'onset',
    quickAnswers: ['Started suddenly today', 'Gradually worsening over 3-5 days', 'Chronic issue for several weeks/months', 'Comes and goes intermittently']
  },
  {
    id: 'gq-2',
    question: 'On a scale of 1 to 10, how severe would you rate your discomfort?',
    category: 'Character & Severity',
    suggestedField: 'chief_complaint',
    targetKey: 'severity',
    quickAnswers: ['Mild (1-3) - manageable', 'Moderate (4-6) - interferes with work', 'Severe (7-8) - unable to function', 'Critical (9-10) - emergency']
  },
  {
    id: 'gq-3',
    question: 'What makes the symptom better or worse (food, movement, posture, rest)?',
    category: 'Triggers & Relievers',
    suggestedField: 'hpi',
    targetKey: 'aggravating_factors',
    quickAnswers: ['Worse with physical activity', 'Better with rest & lying down', 'Worse after meals', 'Relieved by over-the-counter medicine']
  },
  {
    id: 'gq-4',
    question: 'Are there any other associated symptoms like fever, nausea, dizziness, or sleep disturbance?',
    category: 'Associated Symptoms',
    suggestedField: 'chief_complaint',
    targetKey: 'associated_symptoms',
    quickAnswers: ['General fatigue & weakness', 'Mild fever and body pain', 'Loss of appetite', 'Disturbed sleep', 'No other complaints']
  }
];

/**
 * Intelligent NLP Symptom Parser for Voice-to-Text dictation and free text input
 */import {
  parseMultilingualDuration,
  parseMultilingualVitals,
  parseVoicePrescriptions,
  MULTILINGUAL_SYMPTOM_LEXICON
} from './multilingualClinicalDictionary';
import { SupportedLanguageCode, ParsedClinicalVoiceData } from '../types';

export function parseClinicalSpeechOrText(
  input: string,
  preferredLang: SupportedLanguageCode = 'en-IN'
): ParsedClinicalVoiceData {
  const clean = input.trim();
  const lower = clean.toLowerCase();

  // 1. Multi-lingual Duration extraction
  const parsedDur = parseMultilingualDuration(clean);
  const durationValue = parsedDur ? parsedDur.value : 3;
  const durationUnit = parsedDur ? parsedDur.unit : 'Days';

  // 2. Severity extraction (English + Indic keywords)
  let severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical' = 'Moderate';
  if (/severe|intense|unbearable|excruciating|very high|तेज|भयानक|తీవ్రమైన|கடுமையான|প্রচণ্ড|तीव्र/i.test(lower)) {
    severity = 'Severe';
  } else if (/mild|slight|minimal|low grade|हल्का|கொஞ்சம்|తేలికపాటి|সামান্য|किंचित/i.test(lower)) {
    severity = 'Mild';
  } else if (/critical|emergency|acute collapse|crushing|बेहोश|ஆபத்தான|জরুরি/i.test(lower)) {
    severity = 'Critical';
  }

  // 3. Multi-lingual Associated Symptoms Extraction
  const associatedSymptoms: string[] = [];
  let canonicalMatchedComplaint: string | undefined = undefined;
  let detectedCategory = 'General Medicine';
  let provisionalDifferentials: string[] = [];

  for (const symptomEntry of MULTILINGUAL_SYMPTOM_LEXICON) {
    const matched = symptomEntry.patterns.some(pattern => pattern.test(clean));
    if (matched) {
      associatedSymptoms.push(symptomEntry.canonicalEnglish);
      if (!canonicalMatchedComplaint) {
        canonicalMatchedComplaint = symptomEntry.canonicalEnglish;
        detectedCategory = symptomEntry.category;
      }
    }
  }

  // Fallback English symptom keywords if none matched
  if (associatedSymptoms.length === 0) {
    const symptomKeywords = [
      { label: 'Cough & Phlegm', regex: /cough|coughing/i },
      { label: 'Sore throat', regex: /sore throat|throat pain|pharyngitis/i },
      { label: 'Nausea & Vomiting', regex: /vomit|nausea|queasy/i },
      { label: 'Headache', regex: /headache|head pain/i },
      { label: 'Fever & Chills', regex: /fever|chills|shivering|pyrexia/i },
      { label: 'Shortness of breath', regex: /breathless|shortness of breath|dyspnea|wheez/i },
      { label: 'Chest heaviness', regex: /chest pain|chest heaviness|tightness/i },
      { label: 'Loose stools / Diarrhea', regex: /loose stool|diarrhea|watery stool/i },
      { label: 'Abdominal pain', regex: /stomach pain|abdominal pain|cramps/i },
      { label: 'Body ache / Myalgia', regex: /body pain|body ache|myalgia|weakness/i },
      { label: 'Burning urination', regex: /burning urine|dysuria|urine burning/i },
      { label: 'Dizziness / Vertigo', regex: /dizzy|dizziness|giddiness|vertigo/i },
      { label: 'Skin Rash', regex: /rash|itching|pruritus|eruption/i }
    ];

    symptomKeywords.forEach(item => {
      if (item.regex.test(lower)) {
        associatedSymptoms.push(item.label);
      }
    });
  }

  // 4. Multi-lingual Vitals Extraction
  const vitalsExtracted = parseMultilingualVitals(clean);

  // 5. Multi-lingual Prescriptions Extraction
  const prescriptions = parseVoicePrescriptions(clean);

  // 6. Match Knowledge Base for Smart Questions & Red Flags
  let matchedQuestions: SmartQuestion[] = [];
  let detectedRedFlags: string[] = [];

  for (const kb of SYMPTOM_KNOWLEDGE_BASE) {
    const isMatch = kb.keywordPatterns.some(pattern => pattern.test(lower)) ||
      (canonicalMatchedComplaint && kb.canonicalName.toLowerCase().includes(canonicalMatchedComplaint.toLowerCase().split(' ')[0]));

    if (isMatch) {
      detectedCategory = kb.category;
      matchedQuestions = kb.smartQuestions;
      detectedRedFlags = kb.redFlags;
      provisionalDifferentials = kb.provisionalDifferentials;
      break;
    }
  }

  if (matchedQuestions.length === 0) {
    matchedQuestions = GENERAL_SMART_QUESTIONS;
  }

  // Detect critical red flags from speech directly
  if (/crushing|radiating to arm|chest pressure|diaphoresis|cold sweat|छाती में दर्द|सीने में भारीपन/i.test(lower)) {
    if (!detectedRedFlags.includes('Crushing retrosternal chest pain radiating to arm / neck - Rule out Acute Coronary Syndrome')) {
      detectedRedFlags.unshift('CRITICAL: Crushing retrosternal chest pain radiating to arm / neck - Rule out ACS/STEMI');
    }
  }
  if (/thunderclap|sudden worst headache|meningismus|neck stiffness/i.test(lower)) {
    if (!detectedRedFlags.includes('Thunderclap headache onset - Rule out Subarachnoid Hemorrhage')) {
      detectedRedFlags.unshift('CRITICAL: Thunderclap headache onset - Rule out Subarachnoid Hemorrhage (SAH)');
    }
  }

  // HPI narrative snippets
  const hpiNarrativeSnippets: string[] = [];
  if (canonicalMatchedComplaint) {
    hpiNarrativeSnippets.push(`Patient presenting with ${canonicalMatchedComplaint} for ${durationValue} ${durationUnit.toLowerCase()}.`);
  }
  if (severity) {
    hpiNarrativeSnippets.push(`Severity assessed as ${severity}.`);
  }
  if (vitalsExtracted.temp) hpiNarrativeSnippets.push(`Recorded Body Temperature: ${vitalsExtracted.temp}°F.`);
  if (vitalsExtracted.bpSys && vitalsExtracted.bpDia) hpiNarrativeSnippets.push(`Recorded Blood Pressure: ${vitalsExtracted.bpSys}/${vitalsExtracted.bpDia} mmHg.`);
  if (vitalsExtracted.pulse) hpiNarrativeSnippets.push(`Recorded Pulse Rate: ${vitalsExtracted.pulse} bpm.`);
  if (vitalsExtracted.spo2) hpiNarrativeSnippets.push(`Recorded SpO2 Saturation: ${vitalsExtracted.spo2}%.`);

  return {
    originalTranscript: clean,
    detectedLanguage: preferredLang,
    chiefComplaint: canonicalMatchedComplaint || (clean.length > 3 ? clean : undefined),
    durationValue,
    durationUnit,
    severity,
    associatedSymptoms,
    vitalsExtracted,
    detectedCategory,
    matchedQuestions,
    detectedRedFlags,
    prescriptions,
    hpiNarrativeSnippets,
    provisionalDifferentials
  };
}
