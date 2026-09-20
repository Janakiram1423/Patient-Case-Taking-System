from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class EmergencyContact(BaseModel):
    name: str = ""
    phone: str = ""
    relation: str = ""

class AyushProfile(BaseModel):
    prakriti: str = ""
    vikriti: str = ""
    agni: str = ""
    koshtha: str = ""
    ahara_vihara: str = ""
    nidana: str = ""
    samprapti: str = ""
    dashavidha_notes: str = ""

class PreConsultationIntake(BaseModel):
    chief_complaint: str
    duration: str = ""
    severity: str = "Moderate"
    symptoms: str
    prior_records_summary: str = ""
    red_flags: List[str] = Field(default_factory=list)
    preferred_language: str = "en-IN"
    care_mode: str = "Allopathy"
    ayush_profile: Optional[AyushProfile] = None
    submitted_at: str

class PatientBase(BaseModel):
    uhid: str = ""
    registration_number: Optional[str] = ""
    name: str
    dob: str
    age: int
    gender: str
    phone: str
    email: Optional[str] = ""
    blood_group: Optional[str] = ""
    address: Optional[str] = ""
    city: Optional[str] = ""
    emergency_contact: Optional[EmergencyContact] = Field(default_factory=EmergencyContact)
    known_allergies: List[str] = Field(default_factory=list)
    chronic_conditions: List[str] = Field(default_factory=list)
    abha_id: Optional[str] = ""
    preferred_language: Optional[str] = "en-IN"
    consent_given: bool = False
    consent_granted_at: Optional[str] = ""
    consent_scope: List[str] = Field(default_factory=list)
    care_mode: str = "Allopathy"
    pre_consultation: Optional[PreConsultationIntake] = None

class PatientCreate(PatientBase):
    patient_id: Optional[str] = None

class Patient(PatientBase):
    patient_id: str
    created_at: str

class VitalSigns(BaseModel):
    temperature: Optional[float] = None
    pulse: Optional[int] = None
    bp_systolic: Optional[int] = None
    bp_diastolic: Optional[int] = None
    respiratory_rate: Optional[int] = None
    spo2: Optional[float] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None
    grbs: Optional[float] = None
    pain_scale: Optional[int] = None
    consciousness: Optional[str] = "Alert"
    news2_score: Optional[int] = 0
    risk_level: Optional[str] = "Low"

class ChiefComplaint(BaseModel):
    main_complaint: str = ""
    duration_value: Optional[int] = 1
    duration_unit: Optional[str] = "days"
    severity: Optional[str] = "Moderate"
    onset: Optional[str] = "Sudden"
    character: Optional[str] = ""
    radiation: Optional[str] = ""
    aggravating_factors: Optional[str] = ""
    relieving_factors: Optional[str] = ""
    associated_symptoms: List[str] = Field(default_factory=list)
    detailed_hopi: Optional[str] = ""

class PastMedicalHistory(BaseModel):
    diabetes: bool = False
    hypertension: bool = False
    cad: bool = False
    asthma_copd: bool = False
    thyroid: bool = False
    ckd: bool = False
    tuberculosis: bool = False
    other_conditions: Optional[str] = ""
    past_surgeries: List[Dict[str, str]] = Field(default_factory=list)
    current_medications: List[Dict[str, str]] = Field(default_factory=list)
    drug_allergies: List[str] = Field(default_factory=list)
    family_history: Optional[str] = ""
    smoking: Optional[str] = "Non-smoker"
    alcohol: Optional[str] = "Non-drinker"

class SystemicExamination(BaseModel):
    cvs: Optional[str] = "S1 S2 heard, no murmurs"
    respiratory: Optional[str] = "Bilateral air entry equal, clear vesicular breath sounds"
    cns: Optional[str] = "Conscious, oriented, GCS 15/15, no focal deficits"
    per_abdomen: Optional[str] = "Soft, non-tender, no organomegaly"
    musculoskeletal: Optional[str] = "Normal tone and power 5/5 in all limbs"
    skin_general: Optional[str] = "No pallor, icterus, cyanosis, clubbing, lymphadenopathy, edema"

class Investigation(BaseModel):
    test_id: str = ""
    category: str = "Biochemistry"
    test_name: str
    result_value: str
    unit: str = ""
    reference_range: str = ""
    status: str = "Normal" # Normal, High, Low, Critical High, Critical Low
    notes: Optional[str] = ""

class PrescriptionItem(BaseModel):
    drug_id: Optional[str] = ""
    brand_name: str
    generic_name: str
    dosage_form: str = "Tablet" # Tablet, Capsule, Syrup, Injection, Inhaler, Drops, Ointment
    strength: str
    frequency: str = "1-0-1" # 1-0-0, 0-1-0, 0-0-1, 1-0-1, 1-1-1, SOS, QID
    timing: str = "After Food" # After Food, Before Food, With Food, At Bedtime
    duration_value: int = 5
    duration_unit: str = "days"
    quantity: Optional[int] = 10
    special_instructions: Optional[str] = ""

class Diagnosis(BaseModel):
    provisional_diagnosis: str = ""
    final_diagnosis: str = ""
    icd10_code: Optional[str] = ""
    differential_diagnoses: List[str] = Field(default_factory=list)
    clinical_notes: Optional[str] = ""

class CaseRecordCreate(BaseModel):
    patient_id: str
    patient_details: Optional[Dict[str, Any]] = None
    doctor_id: str
    doctor_name: str
    department: str
    chief_complaint: ChiefComplaint
    history: PastMedicalHistory
    vitals: VitalSigns
    systemic_examination: SystemicExamination
    investigations: List[Investigation] = Field(default_factory=list)
    diagnosis: Diagnosis
    prescription: List[PrescriptionItem] = Field(default_factory=list)
    advice_instructions: Optional[str] = ""
    follow_up_date: Optional[str] = ""
    status: str = "Completed"

class CaseRecord(CaseRecordCreate):
    case_id: str
    visit_number: int
    created_at: str
    digital_signature: Optional[Dict[str, Any]] = None

class AppointmentCreate(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    department: str
    appointment_date: str
    appointment_time: str
    reason: str
    status: str = "Waiting"

class Appointment(AppointmentCreate):
    id: str
    token_number: int
    created_at: str

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: Optional[str] = ""
    phone: Optional[str] = ""
    title: Optional[str] = ""
    registrationNumber: Optional[str] = ""
    status: str = "Active"
    avatar: Optional[str] = ""

class AuditLog(BaseModel):
    id: str
    timestamp: str
    user_id: str
    user_name: str
    role: str
    action: str
    module: str
    details: str
    ip_address: str = "127.0.0.1"

class HospitalInfo(BaseModel):
    name: str
    tagline: str
    address: str
    phone: str
    email: str
    website: str
    registrationNumber: str
    accreditation: str
    emergencyNumber: str
