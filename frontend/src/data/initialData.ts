import { HospitalInfo, User, Patient, Appointment, CaseRecord, AuditLog } from '../types';

export const INITIAL_HOSPITAL_INFO: HospitalInfo = {
  name: 'Apex Healthcare & Multi-Specialty Hospital',
  tagline: 'Digitizing Patient History. Simplifying Clinical Care.',
  address: '42 Medical Enclave, Health City, Ring Road, Sector 8',
  phone: '+91 800-456-7890 / +91 987-654-3210',
  email: 'care@apexhealthhospital.org',
  website: 'https://apexhealthhospital.org',
  registrationNumber: 'NABH-HOSP-2026-98124',
  accreditation: 'NABH & JCI Accredited Medical Center',
  emergencyNumber: '108 / +91 800-456-7899'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'doc-01',
    name: 'Doctor',
    email: 'doctor1@apexhealth.org',
    role: 'doctor',
    avatar: '',
    department: 'General Medicine & Cardiology',
    phone: '+91 98765-10001',
    title: 'MD (Internal Medicine), FACC',
    registrationNumber: 'MCI-REG-847291',
    status: 'Active'
  },
  {
    id: 'doc-02',
    name: 'Doctor',
    email: 'doctor2@apexhealth.org',
    role: 'doctor',
    avatar: '',
    department: 'Neurology & Stroke Clinic',
    phone: '+91 98765-10002',
    title: 'MD, DM (Neurology)',
    registrationNumber: 'MCI-REG-993201',
    status: 'Active'
  },
  {
    id: 'doc-03',
    name: 'Doctor',
    email: 'doctor3@apexhealth.org',
    role: 'doctor',
    avatar: '',
    department: 'Pediatrics & Neonatology',
    phone: '+91 98765-10003',
    title: 'MBBS, MD (Pediatrics), DCH',
    registrationNumber: 'MCI-REG-449102',
    status: 'Active'
  },
  {
    id: 'rec-01',
    name: 'Reception',
    email: 'priya.sharma@apexhealth.org',
    role: 'receptionist',
    avatar: '',
    department: 'Front Desk & Patient Triage',
    phone: '+91 98765-20001',
    title: 'Chief Patient Coordinator',
    status: 'Active'
  },
  {
    id: 'adm-01',
    name: 'Admin',
    email: 'admin@apexhealth.org',
    role: 'admin',
    avatar: '',
    department: 'Hospital Administration & Quality',
    phone: '+91 98765-30001',
    title: 'Medical Director & COO',
    status: 'Active'
  },
  {
    id: 'pat-01',
    name: 'Patient',
    email: 'patient@example.com',
    role: 'patient',
    avatar: '',
    phone: '+91 98112-33445',
    patientId: 'PAT-2026-0001',
    status: 'Active'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    patient_id: 'PAT-2026-0001',
    name: 'Patient',
    dob: '1992-04-14',
    age: 34,
    gender: 'Male',
    phone: '+91 98112-33445',
    email: 'patient@example.com',
    address: 'Flat 402, Green Glen Heights, Outer Ring Road',
    city: 'Bangalore',
    emergency_contact: {
      name: 'Emergency Contact',
      phone: '+91 98112-33449',
      relation: 'Spouse'
    },
    blood_group: 'O+',
    created_at: '2026-08-10T09:30:00Z',
    updated_at: '2026-08-25T10:15:00Z',
    registered_by: 'Reception',
    national_id: 'AADHAAR-8921-4402-9912',
    insurance_provider: 'Star Health Premier Platinum',
    policy_number: 'SHP-99201948'
  },
  {
    patient_id: 'PAT-2026-0002',
    name: 'Patient',
    dob: '1968-11-20',
    age: 57,
    gender: 'Female',
    phone: '+91 98223-44556',
    email: 'patient2@example.com',
    address: 'B-12, Rosewood Villa, Civil Lines',
    city: 'New Delhi',
    emergency_contact: {
      name: 'Emergency Contact',
      phone: '+91 98223-44559',
      relation: 'Son'
    },
    blood_group: 'B+',
    created_at: '2026-08-15T11:00:00Z',
    updated_at: '2026-08-24T14:20:00Z',
    registered_by: 'Reception',
    national_id: 'AADHAAR-5532-1199-8834',
    insurance_provider: 'Care Health Super Top-Up',
    policy_number: 'CH-4819201'
  },
  {
    patient_id: 'PAT-2026-0003',
    name: 'Patient',
    dob: '1980-07-08',
    age: 46,
    gender: 'Male',
    phone: '+91 98334-55667',
    email: 'patient3@example.com',
    address: '74, Cyber Pearl Enclave, HITEC City',
    city: 'Hyderabad',
    emergency_contact: {
      name: 'Emergency Contact',
      phone: '+91 98334-55660',
      relation: 'Wife'
    },
    blood_group: 'A+',
    created_at: '2026-08-20T14:30:00Z',
    updated_at: '2026-08-25T11:00:00Z',
    registered_by: 'Reception',
    national_id: 'AADHAAR-3391-7711-2045',
    insurance_provider: 'HDFC ERGO Optima Secure',
    policy_number: 'HE-8829103'
  },
  {
    patient_id: 'PAT-2026-0004',
    name: 'Patient',
    dob: '2019-02-15',
    age: 7,
    gender: 'Male',
    phone: '+91 98445-66778',
    email: 'parent.nair@outlook.com',
    address: 'Plot 18, Coconut Grove, Marine Drive',
    city: 'Kochi',
    emergency_contact: {
      name: 'Emergency Contact',
      phone: '+91 98445-66778',
      relation: 'Father'
    },
    blood_group: 'AB+',
    created_at: '2026-08-22T10:15:00Z',
    updated_at: '2026-08-25T09:00:00Z',
    registered_by: 'Reception',
    national_id: 'AADHAAR-1192-8822-3344',
    insurance_provider: 'Max Bupa Health Companion',
    policy_number: 'MB-1029384'
  },
  {
    patient_id: 'PAT-2026-0005',
    name: 'Patient',
    dob: '1995-09-28',
    age: 30,
    gender: 'Female',
    phone: '+91 98556-77889',
    email: 'patient5@example.com',
    address: 'A-504, Skyline Towers, Baner',
    city: 'Pune',
    emergency_contact: {
      name: 'Emergency Contact',
      phone: '+91 98556-77880',
      relation: 'Brother'
    },
    blood_group: 'O-',
    created_at: '2026-08-24T16:45:00Z',
    updated_at: '2026-08-25T08:30:00Z',
    registered_by: 'Reception',
    national_id: 'AADHAAR-4491-5502-7719',
    insurance_provider: 'Tata AIG Medicare',
    policy_number: 'TA-5910294'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    appointment_id: 'APT-2026-101',
    patient_id: 'PAT-2026-0001',
    patient_name: 'Patient',
    doctor_id: 'doc-01',
    doctor_name: 'Doctor',
    department: 'General Medicine & Cardiology',
    appointment_date: '2026-08-25',
    appointment_time: '10:00 AM',
    token_number: 1,
    reason: 'Follow-up for persistent tension headache and elevated BP check',
    status: 'In Consultation',
    created_at: '2026-08-25T08:30:00Z',
    case_id: 'CASE-2026-001-V2'
  },
  {
    appointment_id: 'APT-2026-102',
    patient_id: 'PAT-2026-0002',
    patient_name: 'Patient',
    doctor_id: 'doc-01',
    doctor_name: 'Doctor',
    department: 'General Medicine & Cardiology',
    appointment_date: '2026-08-25',
    appointment_time: '10:30 AM',
    token_number: 2,
    reason: 'Type 2 Diabetes review and complaints of burning feet / neuropathy',
    status: 'Waiting',
    created_at: '2026-08-25T08:45:00Z'
  },
  {
    appointment_id: 'APT-2026-103',
    patient_id: 'PAT-2026-0003',
    patient_name: 'Patient',
    doctor_id: 'doc-02',
    doctor_name: 'Doctor',
    department: 'Neurology & Stroke Clinic',
    appointment_date: '2026-08-25',
    appointment_time: '11:00 AM',
    token_number: 3,
    reason: 'Severe migraine episodes with visual aura and cervical stiffness',
    status: 'Waiting',
    created_at: '2026-08-25T09:00:00Z'
  },
  {
    appointment_id: 'APT-2026-104',
    patient_id: 'PAT-2026-0004',
    patient_name: 'Patient',
    doctor_id: 'doc-03',
    doctor_name: 'Doctor',
    department: 'Pediatrics & Neonatology',
    appointment_date: '2026-08-25',
    appointment_time: '11:30 AM',
    token_number: 4,
    reason: 'High grade fever with barking cough and nocturnal wheezing',
    status: 'Scheduled',
    created_at: '2026-08-25T09:15:00Z'
  },
  {
    appointment_id: 'APT-2026-105',
    patient_id: 'PAT-2026-0005',
    patient_name: 'Patient',
    doctor_id: 'doc-01',
    doctor_name: 'Doctor',
    department: 'General Medicine & Cardiology',
    appointment_date: '2026-08-25',
    appointment_time: '12:00 PM',
    token_number: 5,
    reason: 'Acute epigastric burning pain and nausea after meals',
    status: 'Scheduled',
    created_at: '2026-08-25T09:30:00Z'
  }
];

export const INITIAL_CASES: CaseRecord[] = [
  // Longitudinal Visit 1
  {
    case_id: 'CASE-2026-001-V1',
    patient_id: 'PAT-2026-0001',
    doctor_id: 'doc-01',
    doctor_name: 'Doctor',
    department: 'General Medicine & Cardiology',
    visit_number: 1,
    visit_type: 'New Visit',
    created_at: '2026-08-10T10:00:00Z',
    updated_at: '2026-08-10T10:45:00Z',
    status: 'Signed',
    chief_complaint: {
      main_complaint: 'Throbbing headache & neck stiffness with high work stress',
      duration_value: 5,
      duration_unit: 'Days',
      severity: 'Severe',
      frequency: 'Intermittent',
      location: 'Bilateral temporal and occipital regions',
      associated_symptoms: ['Photophobia', 'Mild nausea', 'Disturbed sleep', 'Fatigue']
    },
    history_present_illness: {
      onset: 'Gradual',
      progression: 'Worsening',
      character: 'Dull aching, band-like heaviness with occasional sharp throbbing',
      aggravating_factors: ['Prolonged computer screen time', 'Bright fluorescent lights', 'Mental fatigue'],
      relieving_factors: ['Rest in dark quiet room', 'Temporary relief with cold compress'],
      previous_treatment: 'Self-medicated with OTC Paracetamol 500mg with partial 2-hour relief',
      detailed_narrative: 'Patient presents with 5-day history of progressively worsening bilateral temple throbbing headache. No history of aura, vomiting, head trauma, or limb weakness.'
    },
    past_history: {
      conditions: ['Essential Hypertension (borderline, unmedicated)'],
      custom_conditions: 'Occasional GERD episodes with spicy food',
      previous_hospitalizations: 'None in past 5 years',
      previous_surgeries: 'Appendectomy in 2015 without complications',
      immunization_history: 'Up to date with COVID-19 booster & annual Influenza vaccine'
    },
    medication_history: {
      current_medications: [
        {
          id: 'med-01',
          name: 'OTC Paracetamol',
          dosage: '500 mg',
          frequency: 'SOS (As needed)',
          duration: '5 Days',
          adherence: 'Irregular'
        }
      ],
      previous_adverse_reactions: 'None reported'
    },
    allergy_history: {
      allergies: [
        {
          id: 'all-01',
          allergen: 'Penicillin / Amoxicillin',
          type: 'Drug',
          reaction: 'Erythematous skin rash and facial pruritus',
          severity: 'Moderate'
        },
        {
          id: 'all-02',
          allergen: 'Peanuts',
          type: 'Food',
          reaction: 'Mild lip tingling and urticaria',
          severity: 'Mild'
        }
      ],
      has_no_known_allergies: false
    },
    family_history: {
      conditions: ['Hypertension (Father)', 'Type 2 Diabetes Mellitus (Mother)'],
      notes: 'Father had MI at age 62'
    },
    personal_history: {
      diet: 'Non-Vegetarian',
      sleep_pattern: 'Reduced (<5h)',
      physical_activity: 'Sedentary',
      smoking_status: 'Never',
      alcohol_status: 'Occasional',
      occupation: 'Lead Software Architect (High screen time > 11 hrs/day)',
      stress_level: 'High'
    },
    vitals: {
      temperature_f: 98.6,
      blood_pressure_systolic: 142,
      blood_pressure_diastolic: 92,
      pulse_rate: 84,
      respiratory_rate: 16,
      spo2: 99,
      height_cm: 178,
      weight_kg: 82,
      bmi: 25.9,
      bmi_category: 'Overweight',
      blood_sugar_random: 118
    },
    general_exam: {
      appearance: 'Distressed',
      consciousness: 'Conscious & Alert',
      hydration: 'Adequate',
      pallor: false,
      icterus: false,
      cyanosis: false,
      clubbing: false,
      lymphadenopathy: false,
      edema: false,
      other_findings: 'Pericranial muscle tenderness on bilateral trapezius and suboccipital palpation.'
    },
    systemic_exam: {
      respiratory_system: {
        inspection: 'Bilateral chest expansion symmetrical',
        auscultation: 'Bilateral vesicular breath sounds normal, clear',
        wheezing: false,
        crepitations: false,
        notes: 'No respiratory distress.'
      },
      cardiovascular_system: {
        s1_s2: 'S1 S2 heard normally, regular rhythm',
        murmurs: 'No murmurs or gallops',
        peripheral_pulses: 'All peripheral pulses palpable bilaterally',
        notes: 'Apex beat in 5th intercostal space midclavicular line.'
      },
      central_nervous_system: {
        gcs: '15/15',
        cranial_nerves: 'Cranial nerves II to XII grossly intact',
        motor_tone_power: 'Power 5/5 in all 4 limbs, normal tone',
        reflexes: 'Deep tendon reflexes 2+ symmetrical',
        sensory: 'Intact to light touch and pinprick bilaterally',
        notes: 'No signs of meningeal irritation. Kernig and Brudzinski negative.'
      },
      gastrointestinal_system: {
        inspection: 'Abdomen flat, soft, non-distended',
        tenderness: false,
        organomegaly: 'No hepatosplenomegaly',
        bowel_sounds: 'Normal active bowel sounds',
        notes: 'No guarding or rigidity.'
      },
      musculoskeletal_system: {
        joint_swelling: false,
        tenderness: true,
        range_of_motion: 'Cervical rotation mildly limited due to bilateral trapezius spasm',
        deformities: 'None',
        notes: 'Trapezius muscle spasm present.'
      }
    },
    investigations: [
      {
        id: 'inv-01',
        test_name: 'Complete Blood Count (CBC)',
        category: 'Blood / Hematology',
        requested_date: '2026-08-10',
        status: 'Result Ready',
        result_value: 'Hb: 14.8 g/dL, TLC: 7,400 /mcL, Platelets: 240,000 /mcL',
        normal_range: 'Hb: 13-17, TLC: 4,000-11,000',
        is_abnormal: false,
        remarks: 'Within normal limits.'
      },
      {
        id: 'inv-02',
        test_name: '12-Lead Electrocardiogram (ECG)',
        category: 'Cardiology (ECG/Echo)',
        requested_date: '2026-08-10',
        status: 'Result Ready',
        result_value: 'Normal sinus rhythm, Rate: 82 bpm. No ST-T changes or LVH signs.',
        normal_range: 'Sinus rhythm 60-100 bpm',
        is_abnormal: false,
        remarks: 'Normal ECG tracing.'
      },
      {
        id: 'inv-03',
        test_name: 'Lipid Profile & HbA1c',
        category: 'Biochemistry',
        requested_date: '2026-08-10',
        status: 'Result Ready',
        result_value: 'Total Cholesterol: 215 mg/dL, LDL: 138 mg/dL, Triglycerides: 165 mg/dL, HbA1c: 5.6%',
        normal_range: 'Cholesterol < 200, LDL < 100',
        is_abnormal: true,
        remarks: 'Mild borderline dyslipidemia. Advised dietary modifications.'
      }
    ],
    diagnosis: {
      provisional_diagnosis: 'Tension-Type Headache with Cervicogenic Component & Stage 1 Essential Hypertension',
      provisional_icd10: 'G44.2 / I10',
      final_diagnosis: 'Chronic Episodic Tension-Type Headache with Myofascial Spasm & Borderline Hypertension',
      final_icd10: 'G44.209',
      differential_diagnoses: ['Migraine without aura (G43.0)', 'Cervical Spondylosis', 'Screen-induced Asthenopia'],
      clinical_notes: 'Headache attributed to excessive screen exposure, poor ergonomics, and elevated blood pressure. Reassurance given regarding lack of focal neurological signs.',
      red_flags_noted: []
    },
    prescription: [
      {
        id: 'rx-01',
        medicine_name: 'Aceclofenac + Paracetamol (Zerodol-P)',
        generic_name: 'Aceclofenac 100mg + Paracetamol 325mg',
        form: 'Tablet',
        strength: '100mg / 325mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-0-1 (Twice daily)',
        duration_value: 5,
        duration_unit: 'Days',
        instruction: 'After Food',
        notes: 'For acute headache and neck muscle spasm relief.'
      },
      {
        id: 'rx-02',
        medicine_name: 'Pantoprazole (Pan 40)',
        generic_name: 'Pantoprazole Sodium 40mg',
        form: 'Tablet',
        strength: '40 mg',
        dosage: '1 Tab',
        route: 'Oral',
        frequency: '1-0-0 (Morning)',
        duration_value: 10,
        duration_unit: 'Days',
        instruction: 'Before Food',
        notes: 'Gastric mucosal protection during NSAID course.'
      },
      {
        id: 'rx-03',
        medicine_name: 'Multivitamin with B-Complex & Zinc (Becozinc)',
        generic_name: 'B-Complex + Zinc',
        form: 'Capsule',
        strength: '1 Cap',
        dosage: '1 Cap',
        route: 'Oral',
        frequency: '1-0-0 (Morning)',
        duration_value: 15,
        duration_unit: 'Days',
        instruction: 'After Food',
        notes: 'Nutritional support for fatigue.'
      }
    ],
    follow_up: {
      followup_date: '2026-08-25',
      reason: 'Review headache resolution, BP log chart, and lifestyle modifications',
      instructions: 'Maintain 7-day home blood pressure log. Take regular breaks from screen every 20 minutes (20-20-20 rule). Drink 2.5L water daily.',
      pending_investigations: ['Home Blood Pressure Diary (Morning & Evening)'],
      review_status: 'Upcoming'
    },
    doctor_signature: 'Doctor, MD (Cardiology & Internal Medicine)'
  },

  // Longitudinal Visit 2 (Current Visit - 25 Aug 2026)
  {
    case_id: 'CASE-2026-001-V2',
    patient_id: 'PAT-2026-0001',
    doctor_id: 'doc-01',
    doctor_name: 'Doctor',
    department: 'General Medicine & Cardiology',
    visit_number: 2,
    visit_type: 'Follow-up Visit',
    created_at: '2026-08-25T10:15:00Z',
    updated_at: '2026-08-25T10:40:00Z',
    status: 'Completed',
    chief_complaint: {
      main_complaint: 'Significant relief in headache; routine follow-up with home BP log review',
      duration_value: 2,
      duration_unit: 'Weeks',
      severity: 'Mild',
      frequency: 'Intermittent',
      location: 'Mild stiffness in posterior neck only',
      associated_symptoms: ['No nausea', 'Sleep improved to 7 hrs/night']
    },
    history_present_illness: {
      onset: 'Gradual',
      progression: 'Improving',
      character: 'Occasional mild tight sensation around forehead after 6+ hours of computer work',
      aggravating_factors: ['Prolonged desk posture'],
      relieving_factors: ['Neck stretching exercises & ergonomic chair'],
      previous_treatment: 'Completed 5-day course of Zerodol-P and Pan 40 with 85% symptom resolution',
      detailed_narrative: 'Patient reports 85% relief in head throbbing. Neck muscle spasm markedly improved. Sleep hygiene followed. Home BP log showed average 128/84 mmHg.'
    },
    past_history: {
      conditions: ['Essential Hypertension (well-controlled with lifestyle)', 'Resolved Tension Headache'],
      custom_conditions: 'None',
      previous_hospitalizations: 'None',
      previous_surgeries: 'Appendectomy (2015)',
      immunization_history: 'Up to date'
    },
    medication_history: {
      current_medications: [
        {
          id: 'med-02',
          name: 'Multivitamin B-Complex',
          dosage: '1 Cap',
          frequency: '1-0-0 (Morning)',
          duration: 'Ongoing',
          adherence: 'Good'
        }
      ],
      previous_adverse_reactions: 'Penicillin allergy noted'
    },
    allergy_history: {
      allergies: [
        {
          id: 'all-01',
          allergen: 'Penicillin / Amoxicillin',
          type: 'Drug',
          reaction: 'Skin rash and facial swelling',
          severity: 'Moderate'
        }
      ],
      has_no_known_allergies: false
    },
    family_history: {
      conditions: ['Hypertension (Father)', 'Type 2 Diabetes (Mother)'],
      notes: 'CAD in father'
    },
    personal_history: {
      diet: 'Non-Vegetarian',
      sleep_pattern: 'Normal (7-8h)',
      physical_activity: 'Moderate',
      smoking_status: 'Never',
      alcohol_status: 'Occasional',
      occupation: 'Lead Software Architect',
      stress_level: 'Moderate'
    },
    vitals: {
      temperature_f: 98.4,
      blood_pressure_systolic: 126,
      blood_pressure_diastolic: 82,
      pulse_rate: 76,
      respiratory_rate: 15,
      spo2: 99,
      height_cm: 178,
      weight_kg: 80.5,
      bmi: 25.4,
      bmi_category: 'Overweight (Improving)',
      blood_sugar_random: 104
    },
    general_exam: {
      appearance: 'Well',
      consciousness: 'Conscious & Alert',
      hydration: 'Adequate',
      pallor: false,
      icterus: false,
      cyanosis: false,
      clubbing: false,
      lymphadenopathy: false,
      edema: false,
      other_findings: 'Full range of active cervical motion with no pain.'
    },
    systemic_exam: {
      respiratory_system: {
        inspection: 'Normal chest wall motion',
        auscultation: 'Vesicular breath sounds clear bilaterally',
        wheezing: false,
        crepitations: false,
        notes: 'Clear lung fields.'
      },
      cardiovascular_system: {
        s1_s2: 'S1 S2 normal, regular rhythm',
        murmurs: 'No murmurs',
        peripheral_pulses: 'Good volume, symmetrical',
        notes: 'Normal heart sounds.'
      },
      central_nervous_system: {
        gcs: '15/15',
        cranial_nerves: 'Intact',
        motor_tone_power: '5/5 all limbs',
        reflexes: 'Normal',
        sensory: 'Normal',
        notes: 'No focal deficit.'
      },
      gastrointestinal_system: {
        inspection: 'Soft, non-tender',
        tenderness: false,
        organomegaly: 'None',
        bowel_sounds: 'Normal',
        notes: 'Non-tender.'
      },
      musculoskeletal_system: {
        joint_swelling: false,
        tenderness: false,
        range_of_motion: 'Full cervical range of motion restored',
        deformities: 'None',
        notes: 'Muscle spasm resolved.'
      }
    },
    investigations: [],
    diagnosis: {
      provisional_diagnosis: 'Resolving Tension-Type Headache with Well-Controlled Blood Pressure',
      provisional_icd10: 'G44.209',
      final_diagnosis: 'Resolved Acute Tension Headache & Optimized Lifestyle-Controlled BP',
      final_icd10: 'G44.209 / I10',
      differential_diagnoses: [],
      clinical_notes: 'Excellent therapeutic response. Patient lost 1.5 kg weight in 2 weeks. Blood pressure normalized to 126/82 mmHg. Discontinue acute analgesics.',
      red_flags_noted: []
    },
    prescription: [
      {
        id: 'rx-10',
        medicine_name: 'Vitamin D3 (Calcirol 60K)',
        generic_name: 'Cholecalciferol 60,000 IU',
        form: 'Capsule',
        strength: '60,000 IU',
        dosage: '1 Cap once weekly',
        route: 'Oral',
        frequency: 'SOS (As needed)',
        duration_value: 8,
        duration_unit: 'Weeks',
        instruction: 'With Food',
        notes: 'Take 1 capsule every Sunday with milk for 8 weeks.'
      }
    ],
    follow_up: {
      followup_date: '2026-11-25',
      reason: 'Quarterly routine wellness & blood pressure checkup',
      instructions: 'Continue regular 30-min brisk walk 5 days a week. Maintain low sodium diet. SOS consultation if severe headache recurs.',
      pending_investigations: ['Fasting Blood Sugar & Lipid Profile after 3 months'],
      review_status: 'Upcoming'
    },
    doctor_signature: 'Doctor, MD (Cardiology & Internal Medicine)'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    log_id: 'LOG-9921',
    user_id: 'doc-01',
    user_name: 'Doctor',
    user_role: 'Doctor',
    action: 'Completed Case Record',
    entity_type: 'Case',
    entity_id: 'CASE-2026-001-V2',
    details: 'Completed and finalized follow-up clinical case sheet for Patient (PAT-2026-0001)',
    ip_address: '192.168.1.104',
    timestamp: '2026-08-25T10:40:12Z'
  },
  {
    log_id: 'LOG-9920',
    user_id: 'rec-01',
    user_name: 'Reception',
    user_role: 'Receptionist',
    action: 'Updated Appointment Status',
    entity_type: 'Appointment',
    entity_id: 'APT-2026-101',
    details: 'Status advanced from Waiting to In Consultation for Doctor',
    ip_address: '192.168.1.101',
    timestamp: '2026-08-25T10:14:50Z'
  },
  {
    log_id: 'LOG-9919',
    user_id: 'rec-01',
    user_name: 'Reception',
    user_role: 'Receptionist',
    action: 'Registered New Patient',
    entity_type: 'Patient',
    entity_id: 'PAT-2026-0005',
    details: 'Registered Patient (Age 30, Female) with ID PAT-2026-0005',
    ip_address: '192.168.1.101',
    timestamp: '2026-08-25T08:30:15Z'
  },
  {
    log_id: 'LOG-9918',
    user_id: 'adm-01',
    user_name: 'Admin',
    user_role: 'Admin',
    action: 'Modified Hospital Configuration',
    entity_type: 'System',
    entity_id: 'HOSP-CFG-01',
    details: 'Updated NABH accreditation verification code and emergency helpline numbers',
    ip_address: '192.168.1.150',
    timestamp: '2026-08-24T18:00:22Z'
  },
  {
    log_id: 'LOG-9917',
    user_id: 'doc-02',
    user_name: 'Doctor',
    user_role: 'Doctor',
    action: 'Ordered Lab Investigation',
    entity_type: 'Case',
    entity_id: 'CASE-2026-003-V1',
    details: 'Ordered MRI Brain + NCCT Cervical Spine for patient',
    ip_address: '192.168.1.106',
    timestamp: '2026-08-24T14:15:30Z'
  }
];
