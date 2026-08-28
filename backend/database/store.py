import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from models.schemas import (
    Patient, CaseRecord, Appointment, User, AuditLog, HospitalInfo
)

class InMemoryHospitalStore:
    def __init__(self):
        self.hospital_info: Dict[str, Any] = {
            "name": "Apex Healthcare & Multi-Specialty Hospital",
            "tagline": "Digitizing Patient History. Simplifying Clinical Care.",
            "address": "42 Medical Enclave, Health City, Ring Road, Sector 8",
            "phone": "+91 800-456-7890 / +91 987-654-3210",
            "email": "care@apexhealthhospital.org",
            "website": "https://apexhealthhospital.org",
            "registrationNumber": "NABH-HOSP-2026-98124",
            "accreditation": "NABH & JCI Accredited Medical Center",
            "emergencyNumber": "108 / +91 800-456-7899"
        }

        self.users: List[Dict[str, Any]] = [
            {
                "id": "doc-01",
                "name": "Dr. Sarah Chen",
                "email": "sarah.chen@apexhealth.org",
                "role": "doctor",
                "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
                "department": "General Medicine & Cardiology",
                "phone": "+91 98765-10001",
                "title": "MD (Internal Medicine), FACC",
                "registrationNumber": "MCI-REG-847291",
                "status": "Active"
            },
            {
                "id": "doc-02",
                "name": "Dr. Rajesh Verma",
                "email": "rajesh.verma@apexhealth.org",
                "role": "doctor",
                "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256",
                "department": "Neurology & Stroke Clinic",
                "phone": "+91 98765-10002",
                "title": "MD, DM (Neurology)",
                "registrationNumber": "MCI-REG-993201",
                "status": "Active"
            },
            {
                "id": "rec-01",
                "name": "Priya Sharma",
                "email": "priya.sharma@apexhealth.org",
                "role": "receptionist",
                "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
                "department": "Front Desk & Patient Triage",
                "phone": "+91 98765-20001",
                "title": "Chief Patient Coordinator",
                "status": "Active"
            },
            {
                "id": "adm-01",
                "name": "Dr. Robert Vance",
                "email": "admin@apexhealth.org",
                "role": "admin",
                "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256",
                "department": "Hospital Administration & Quality",
                "phone": "+91 98765-30001",
                "title": "Medical Director & COO",
                "status": "Active"
            }
        ]

        self.patients: List[Dict[str, Any]] = [
            {
                "patient_id": "PAT-2026-0001",
                "name": "Alex Mercer",
                "dob": "1992-04-14",
                "age": 34,
                "gender": "Male",
                "phone": "+91 98112-33445",
                "email": "alex.mercer@gmail.com",
                "address": "Flat 402, Green Glen Heights, Outer Ring Road",
                "city": "Bangalore",
                "blood_group": "O+",
                "emergency_contact": {
                    "name": "Elena Mercer",
                    "phone": "+91 98112-33449",
                    "relation": "Spouse"
                },
                "known_allergies": ["Penicillin", "Sulfa Drugs"],
                "chronic_conditions": ["Essential Hypertension (5 yrs)", "Type 2 Diabetes Mellitus"],
                "created_at": "2026-01-10T09:30:00Z"
            },
            {
                "patient_id": "PAT-2026-0002",
                "name": "Sunita Devi",
                "dob": "1968-11-20",
                "age": 58,
                "gender": "Female",
                "phone": "+91 98223-44556",
                "email": "sunita.devi@outlook.com",
                "address": "House No 12, Gandhi Nagar",
                "city": "New Delhi",
                "blood_group": "B+",
                "emergency_contact": {
                    "name": "Rohan Sharma",
                    "phone": "+91 98223-44557",
                    "relation": "Son"
                },
                "known_allergies": ["Aspirin", "NSAIDs"],
                "chronic_conditions": ["Osteoarthritis (Bilateral Knees)", "Hypothyroidism"],
                "created_at": "2026-01-15T11:15:00Z"
            },
            {
                "patient_id": "PAT-2026-0003",
                "name": "Kavita Raman",
                "dob": "1997-08-05",
                "age": 29,
                "gender": "Female",
                "phone": "+91 98334-55667",
                "email": "kavita.raman@gmail.com",
                "address": "78 Coral Bay Apt, Anna Nagar",
                "city": "Chennai",
                "blood_group": "A+",
                "emergency_contact": {
                    "name": "Raman Nathan",
                    "phone": "+91 98334-55668",
                    "relation": "Father"
                },
                "known_allergies": ["None"],
                "chronic_conditions": ["Bronchial Asthma (since childhood)"],
                "created_at": "2026-02-01T14:20:00Z"
            }
        ]

        self.appointments: List[Dict[str, Any]] = [
            {
                "id": "APT-2026-101",
                "token_number": 1,
                "patient_id": "PAT-2026-0001",
                "patient_name": "Alex Mercer",
                "doctor_id": "doc-01",
                "doctor_name": "Dr. Sarah Chen",
                "department": "General Medicine & Cardiology",
                "appointment_date": datetime.now().strftime("%Y-%m-%d"),
                "appointment_time": "09:30 AM",
                "reason": "Follow-up for chest tightness and BP check",
                "status": "In Consultation",
                "created_at": "2026-08-26T03:30:00Z"
            },
            {
                "id": "APT-2026-102",
                "token_number": 2,
                "patient_id": "PAT-2026-0002",
                "patient_name": "Sunita Devi",
                "doctor_id": "doc-01",
                "doctor_name": "Dr. Sarah Chen",
                "department": "General Medicine & Cardiology",
                "appointment_date": datetime.now().strftime("%Y-%m-%d"),
                "appointment_time": "10:00 AM",
                "reason": "Knee pain worsening and high blood sugar",
                "status": "Waiting",
                "created_at": "2026-08-26T04:00:00Z"
            },
            {
                "id": "APT-2026-103",
                "token_number": 3,
                "patient_id": "PAT-2026-0003",
                "patient_name": "Kavita Raman",
                "doctor_id": "doc-01",
                "doctor_name": "Dr. Sarah Chen",
                "department": "General Medicine & Cardiology",
                "appointment_date": datetime.now().strftime("%Y-%m-%d"),
                "appointment_time": "10:30 AM",
                "reason": "Acute wheezing and persistent nocturnal cough",
                "status": "Waiting",
                "created_at": "2026-08-26T04:15:00Z"
            }
        ]

        self.cases: List[Dict[str, Any]] = [
            {
                "case_id": "CASE-2026-8801",
                "patient_id": "PAT-2026-0001",
                "doctor_id": "doc-01",
                "doctor_name": "Dr. Sarah Chen",
                "department": "General Medicine & Cardiology",
                "visit_number": 1,
                "status": "Signed",
                "created_at": "2026-02-10T10:30:00Z",
                "chief_complaint": {
                    "main_complaint": "Retrosternal chest discomfort on brisk walking",
                    "duration_value": 4,
                    "duration_unit": "days",
                    "severity": "Moderate",
                    "onset": "Gradual",
                    "character": "Pressure-like squeezing discomfort",
                    "radiation": "Radiates to left shoulder and inner arm",
                    "aggravating_factors": "Exertion, climbing stairs",
                    "relieving_factors": "Rest after 5-10 minutes",
                    "associated_symptoms": ["Mild shortness of breath", "Sweating on exertion"],
                    "detailed_hopi": "Patient experienced retrosternal chest heaviness 4 days ago while climbing stairs. Lasts ~5 mins and relieved with rest. No orthopnea or syncope."
                },
                "history": {
                    "diabetes": True,
                    "hypertension": True,
                    "cad": False,
                    "asthma_copd": False,
                    "thyroid": False,
                    "ckd": False,
                    "tuberculosis": False,
                    "other_conditions": "Dyslipidemia on statins",
                    "past_surgeries": [],
                    "current_medications": [{"name": "Telmisartan", "dose": "40mg OD"}, {"name": "Metformin", "dose": "500mg BD"}],
                    "drug_allergies": ["Penicillin"],
                    "family_history": "Father had MI at age 52",
                    "smoking": "Ex-smoker (Quit 3 yrs ago)",
                    "alcohol": "Occasional"
                },
                "vitals": {
                    "temperature": 98.4,
                    "pulse": 82,
                    "bp_systolic": 138,
                    "bp_diastolic": 88,
                    "respiratory_rate": 18,
                    "spo2": 98.0,
                    "height": 174.0,
                    "weight": 78.0,
                    "bmi": 25.76,
                    "grbs": 142.0,
                    "pain_scale": 4,
                    "consciousness": "Alert",
                    "news2_score": 0,
                    "risk_level": "Low"
                },
                "systemic_examination": {
                    "cvs": "S1 S2 heard normal. No murmurs or gallop.",
                    "respiratory": "Bilateral clear vesicular breath sounds, no added wheeze/crepitations.",
                    "cns": "Conscious, oriented, GCS 15/15.",
                    "per_abdomen": "Soft, non-tender, liver/spleen not palpable.",
                    "musculoskeletal": "No spinal tenderness, chest wall non-tender to palpation.",
                    "skin_general": "No peripheral edema, no cyanosis or pallor."
                },
                "investigations": [
                    {"test_id": "INV-101", "category": "Cardiology", "test_name": "12-Lead ECG", "result_value": "T-wave inversion in V4-V6", "unit": "", "reference_range": "Normal Sinus", "status": "High", "notes": "Suggestive of anterolateral ischemia"},
                    {"test_id": "INV-102", "category": "Biochemistry", "test_name": "Serum Troponin-I", "result_value": "0.02", "unit": "ng/mL", "reference_range": "< 0.04", "status": "Normal", "notes": "Baseline non-elevated"},
                    {"test_id": "INV-103", "category": "Lipid Profile", "test_name": "LDL Cholesterol", "result_value": "148", "unit": "mg/dL", "reference_range": "< 100", "status": "High", "notes": "Elevated atherogenic index"}
                ],
                "diagnosis": {
                    "provisional_diagnosis": "Stable Angina Pectoris / Coronary Artery Disease (CAD)",
                    "final_diagnosis": "Chronic Stable Angina (CCS Class II) with Underlying CAD & Dyslipidemia",
                    "icd10_code": "I20.9 - Angina pectoris, unspecified",
                    "differential_diagnoses": ["Gastroesophageal Reflux Disease (GERD)", "Costochondritis", "Acute Coronary Syndrome (NSTEMI)"],
                    "clinical_notes": "Patient advised urgent Cardiology outpatient review and Stress Echocardiography."
                },
                "prescription": [
                    {"brand_name": "Ecosprin", "generic_name": "Aspirin", "dosage_form": "Tablet", "strength": "75mg", "frequency": "0-1-0", "timing": "After Food", "duration_value": 30, "duration_unit": "days", "quantity": 30, "special_instructions": "Take after lunch"},
                    {"brand_name": "Atorva", "generic_name": "Atorvastatin", "dosage_form": "Tablet", "strength": "40mg", "frequency": "0-0-1", "timing": "At Bedtime", "duration_value": 30, "duration_unit": "days", "quantity": 30, "special_instructions": "Take at night"},
                    {"brand_name": "Met XL", "generic_name": "Metoprolol Succinate ER", "dosage_form": "Tablet", "strength": "25mg", "frequency": "1-0-0", "timing": "After Food", "duration_value": 30, "duration_unit": "days", "quantity": 30, "special_instructions": "Monitor pulse rate daily"},
                    {"brand_name": "Sorbitrate (SOS)", "generic_name": "Isosorbide Dinitrate", "dosage_form": "Tablet", "strength": "5mg", "frequency": "SOS", "timing": "Under Tongue", "duration_value": 10, "duration_unit": "days", "quantity": 10, "special_instructions": "Place under tongue if chest pain occurs during exertion"}
                ],
                "advice_instructions": "Strict low-salt, low-fat diet. Daily 30 min brisk walk as tolerated. Avoid sudden strenuous lifting. Report to ER immediately if chest pain lasts > 15 mins.",
                "follow_up_date": "2026-03-10",
                "digital_signature": {
                    "signed_by": "Dr. Sarah Chen",
                    "registration_no": "MCI-REG-847291",
                    "timestamp": "2026-02-10T11:05:22Z",
                    "hash": "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
                }
            }
        ]

        self.audit_logs: List[Dict[str, Any]] = [
            {
                "id": "LOG-1001",
                "timestamp": "2026-02-10T11:05:30Z",
                "user_id": "doc-01",
                "user_name": "Dr. Sarah Chen",
                "role": "doctor",
                "action": "SIGN_CASE_RECORD",
                "module": "Clinical Case Taking",
                "details": "Case CASE-2026-8801 signed and finalized for patient Alex Mercer (PAT-2026-0001)",
                "ip_address": "192.168.1.45"
            },
            {
                "id": "LOG-1002",
                "timestamp": datetime.now().isoformat() + "Z",
                "user_id": "rec-01",
                "user_name": "Priya Sharma",
                "role": "receptionist",
                "action": "QUEUE_APPOINTMENT",
                "module": "OPD Appointments",
                "details": "Patient Sunita Devi queued with Token #2 for Dr. Sarah Chen",
                "ip_address": "192.168.1.12"
            }
        ]

db_store = InMemoryHospitalStore()
