export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  phone: string;
  password?: string;
  title?: string;
  registrationNumber?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  patientId?: string; // For patient role
}

export interface Patient {
  patient_id: string; // e.g. PAT-2026-0042
  uhid: string; // e.g. UHID-2026-0042
  registration_number?: string; // e.g. REG-2026-0001
  name: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  city: string;
  emergency_contact: {
    name: string;
    phone: string;
    relation: string;
  };
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  created_at: string;
  updated_at: string;
  registered_by: string;
  avatar_url?: string;
  national_id?: string;
  insurance_provider?: string;
  policy_number?: string;
  presenting_disease?: string;
  symptom_duration?: string;
  current_symptoms?: string;
  symptom_severity?: 'Mild' | 'Moderate' | 'Severe';
  existing_diseases?: string;
  previous_illnesses_or_surgeries?: string;
  current_medicines?: string;
  allergy_information?: string;
  vital_signs?: {
    temperature?: string;
    blood_pressure?: string;
    pulse_rate?: string;
    spo2?: string;
    height?: string;
    weight?: string;
    respiratory_rate?: string;
  };
  abha_id?: string;
  preferred_language?: string;
  consent_given?: boolean;
  consent_granted_at?: string;
  consent_scope?: string[];
  care_mode?: 'Allopathy' | 'AYUSH';
  pre_consultation?: PreConsultationIntake;
}

export interface AyushProfile {
  prakriti: string;
  vikriti: string;
  agni: string;
  koshtha: string;
  ahara_vihara: string;
  nidana: string;
  samprapti: string;
  dashavidha_notes: string;
}

export interface PreConsultationIntake {
  chief_complaint: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string;
  prior_records_summary: string;
  red_flags: string[];
  preferred_language: string;
  care_mode: 'Allopathy' | 'AYUSH';
  ayush_profile?: AyushProfile;
  submitted_at: string;
}

export type AppointmentStatus = 'Scheduled' | 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  token_number: number;
  reason: string;
  status: AppointmentStatus;
  created_at: string;
  vital_id?: string;
  case_id?: string;
}

export interface ChiefComplaint {
  main_complaint: string;
  duration_value: number;
  duration_unit: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years';
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  frequency: 'Continuous' | 'Intermittent' | 'Paroxysmal' | 'Morning' | 'Night';
  location: string;
  associated_symptoms: string[];
  trigger_or_onset_event?: string;
}

export interface HistoryOfPresentIllness {
  onset: 'Sudden' | 'Gradual' | 'Insidious';
  progression: 'Improving' | 'Worsening' | 'Static' | 'Fluctuating';
  character: string; // e.g. Throbbing, Burning, Stabbing, Dull aching, Colicky
  aggravating_factors: string[];
  relieving_factors: string[];
  previous_treatment: string;
  detailed_narrative: string;
}

export interface PastMedicalHistory {
  conditions: string[];
  custom_conditions: string;
  previous_hospitalizations: string;
  previous_surgeries: string;
  immunization_history: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  adherence: 'Good' | 'Irregular' | 'Non-compliant';
}

export interface MedicationHistory {
  current_medications: MedicationItem[];
  previous_adverse_reactions: string;
}

export interface AllergyItem {
  id: string;
  allergen: string;
  type: 'Drug' | 'Food' | 'Environmental' | 'Other';
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe (Anaphylaxis)';
}

export interface AllergyHistory {
  allergies: AllergyItem[];
  has_no_known_allergies: boolean;
}

export interface FamilyHistory {
  conditions: string[];
  notes: string;
}

export interface PersonalSocialHistory {
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Ovo-Vegetarian' | 'Special / Diabetic';
  sleep_pattern: 'Normal (7-8h)' | 'Disturbed / Insomnia' | 'Reduced (<5h)' | 'Excessive (>10h)';
  physical_activity: 'Sedentary' | 'Moderate' | 'Active / Athletic';
  smoking_status: 'Never' | 'Former Smoker' | 'Current Smoker';
  smoking_pack_years?: string;
  alcohol_status: 'Never' | 'Occasional' | 'Regular / Heavy';
  occupation: string;
  stress_level: 'Low' | 'Moderate' | 'High';
}

export interface VitalSigns {
  temperature_f: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  pulse_rate: number;
  respiratory_rate: number;
  spo2: number;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  bmi_category: string;
  blood_sugar_random?: number;
}

export interface GeneralExamination {
  appearance: 'Well' | 'Acutely Ill' | 'Chronically Ill' | 'Distressed' | 'Lethargic';
  consciousness: 'Conscious & Alert' | 'Confused' | 'Drowsy' | 'Stuporous' | 'Unconscious';
  hydration: 'Adequate' | 'Mild Dehydration' | 'Moderate Dehydration' | 'Severe Dehydration';
  pallor: boolean;
  icterus: boolean;
  cyanosis: boolean;
  clubbing: boolean;
  lymphadenopathy: boolean;
  edema: boolean;
  edema_details?: string;
  other_findings?: string;
}

export interface SystemicExamination {
  respiratory_system: {
    inspection: string;
    auscultation: string;
    wheezing: boolean;
    crepitations: boolean;
    notes: string;
  };
  cardiovascular_system: {
    s1_s2: string;
    murmurs: string;
    peripheral_pulses: string;
    notes: string;
  };
  central_nervous_system: {
    gcs: string;
    cranial_nerves: string;
    motor_tone_power: string;
    reflexes: string;
    sensory: string;
    notes: string;
  };
  gastrointestinal_system: {
    inspection: string;
    tenderness: boolean;
    tenderness_site?: string;
    organomegaly: string;
    bowel_sounds: string;
    notes: string;
  };
  musculoskeletal_system: {
    joint_swelling: boolean;
    tenderness: boolean;
    range_of_motion: string;
    deformities: string;
    notes: string;
  };
}

export interface Investigation {
  id: string;
  test_name: string;
  category: 'Blood / Hematology' | 'Biochemistry' | 'Urine' | 'Imaging (X-Ray/CT/MRI)' | 'Cardiology (ECG/Echo)' | 'Microbiology / Other';
  requested_date: string;
  status: 'Ordered' | 'Sample Collected' | 'Result Ready';
  result_value?: string;
  normal_range?: string;
  is_abnormal?: boolean;
  remarks?: string;
  attachment_name?: string;
  attachment_url?: string;
}

export interface Diagnosis {
  provisional_diagnosis: string;
  provisional_icd10?: string;
  final_diagnosis: string;
  final_icd10?: string;
  differential_diagnoses: string[];
  clinical_notes: string;
  red_flags_noted: string[];
}

export interface PrescriptionItem {
  id: string;
  medicine_name: string;
  generic_name?: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Ointment' | 'Drops';
  strength: string;
  dosage: string;
  route: 'Oral' | 'Sublingual' | 'IV' | 'IM' | 'SC' | 'Inhalation' | 'Topical' | 'Ophthalmic';
  frequency: string; // e.g. 1-0-1, 1-1-1, 1-0-0, 0-0-1, SOS, PRN
  duration_value: number;
  duration_unit: 'Days' | 'Weeks' | 'Months';
  instruction: 'Before Food' | 'After Food' | 'With Food' | 'Bedtime' | 'As directed';
  notes?: string;
}

export interface FollowUp {
  followup_date: string;
  reason: string;
  instructions: string;
  pending_investigations: string[];
  review_status: 'Upcoming' | 'Completed' | 'Overdue' | 'Not Required';
}

export interface CaseRecord {
  case_id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  visit_number: number;
  visit_type: 'New Visit' | 'Follow-up Visit' | 'Emergency' | 'Routine Checkup';
  created_at: string;
  updated_at: string;
  chief_complaint: ChiefComplaint;
  history_present_illness: HistoryOfPresentIllness;
  past_history: PastMedicalHistory;
  medication_history: MedicationHistory;
  allergy_history: AllergyHistory;
  family_history: FamilyHistory;
  personal_history: PersonalSocialHistory;
  vitals: VitalSigns;
  general_exam: GeneralExamination;
  systemic_exam: SystemicExamination;
  investigations: Investigation[];
  diagnosis: Diagnosis;
  prescription: PrescriptionItem[];
  follow_up: FollowUp;
  status: 'Draft' | 'Completed' | 'Signed';
  doctor_signature?: string;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  entity_type: 'Patient' | 'Case' | 'Appointment' | 'Prescription' | 'User' | 'System' | 'Audit';
  entity_id: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface HospitalInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  registrationNumber: string;
  accreditation: string;
  emergencyNumber: string;
}

export interface SmartQuestion {
  id: string;
  question: string;
  category: 'Onset & Duration' | 'Character & Severity' | 'Location & Radiation' | 'Triggers & Relievers' | 'Associated Symptoms' | 'Red Flags & Risks';
  suggestedField: 'hpi' | 'chief_complaint' | 'past_history' | 'general_exam' | 'red_flags';
  targetKey?: string;
  quickAnswers: string[];
  isRedFlag?: boolean;
}

export type SupportedLanguageCode =
  | 'hi-IN'
  | 'en-IN'
  | 'en-US'
  | 'hinglish'
  | 'ta-IN'
  | 'te-IN'
  | 'bn-IN'
  | 'mr-IN'
  | 'gu-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'pa-IN';

export interface LanguageOption {
  code: SupportedLanguageCode;
  speechCode: string; // Browser Web Speech API lang code
  name: string;
  nativeName: string;
  flag: string;
  samplePrompt: string;
}

export interface AmbientSpeakerTurn {
  id: string;
  speaker: 'Doctor' | 'Patient';
  timestamp: string;
  originalText: string;
  translatedText?: string;
}

export interface ExtractedVoicePrescription {
  medicine_name: string;
  generic_name: string;
  dosage: string;
  frequency: string;
  duration_value: number;
  duration_unit: 'Days' | 'Weeks' | 'Months';
  instruction: string;
}

export interface ParsedClinicalVoiceData {
  originalTranscript: string;
  detectedLanguage: SupportedLanguageCode;
  englishTranslation?: string;
  chiefComplaint?: string;
  durationValue?: number;
  durationUnit?: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years';
  severity?: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  associatedSymptoms: string[];
  vitalsExtracted: {
    temp?: number;
    bpSys?: number;
    bpDia?: number;
    pulse?: number;
    spo2?: number;
    respRate?: number;
    bloodSugar?: number;
    weightKg?: number;
  };
  detectedCategory: string;
  matchedQuestions: SmartQuestion[];
  detectedRedFlags: string[];
  prescriptions: ExtractedVoicePrescription[];
  hpiNarrativeSnippets: string[];
  conversationTurns?: AmbientSpeakerTurn[];
  provisionalDifferentials?: string[];
}

export interface VoiceScribeScenario {
  id: string;
  title: string;
  language: SupportedLanguageCode;
  languageLabel: string;
  category: string;
  patientName: string;
  patientAgeGender: string;
  mode: 'dictation' | 'ambient';
  audioScript: string;
  turns?: AmbientSpeakerTurn[];
  expectedExtractionSummary: {
    chiefComplaint: string;
    duration: string;
    vitals: string;
    rxCount: number;
    redFlagAlert?: string;
  };
}

export interface OfflineSyncStatus {
  isOnline: boolean;
  pendingSyncCount: number;
  lastSyncedTimestamp?: string;
  isSyncing: boolean;
}

export interface EndToEndDemoScenario {
  id: string;
  title: string;
  badge: string;
  badgeColor: 'primary' | 'success' | 'warning' | 'danger' | 'purple';
  patient: Patient;
  voiceDictation: ParsedClinicalVoiceData;
  investigations: Investigation[];
  diagnosis: Diagnosis;
  prescriptions: PrescriptionItem[];
  vitals: VitalSigns;
  keyHighlight: string;
  learningPoint: string;
}


