# MediKiosk: AI Clinical History Software Platform

## 1. Background

### 1.1 The Clinical History-Taking Bottleneck in Indian Hospitals

History taking, the structured elicitation of a patient's presenting complaints, history of present illness, past medical and surgical history, drug and allergy history, family and personal history, and review of systems, is one of the most important diagnostic activities in clinical medicine. Classical teaching holds that a well-conducted history yields the correct diagnosis in 70-80% of cases before examination or investigation.

In India's overburdened public hospital outpatient departments, the time available for this interaction has collapsed to unsustainable levels. Tertiary government hospitals and apex institutions routinely register 4,000-10,000 OPD patients per day, while doctor-patient consultation time may be only 2-5 minutes. Within that window, the physician must elicit history, examine the patient, review prior records, formulate a diagnosis, counsel the patient, and prescribe. The result is under-elicited history, missed comorbidities, repeated questioning across visits, and diagnostic error.

AYUSH institutions face an additional layer of complexity. Ayurvedic history taking through Trividha, Ashtavidha, and Dashavidha Pariksha requires detailed assessment of Prakriti, Vikriti, Agni, Koshtha, Ahara-Vihara, Nidana, and Samprapti. Capturing this depth manually within OPD time constraints is difficult, forcing practitioners to abbreviate the assessment that defines personalized Ayurvedic care.

### 1.2 Documentation and Records Fragmentation

Patients in India commonly carry paper prescriptions, laboratory reports, discharge summaries, and imaging records from multiple providers. These documents may be handwritten, multilingual, chronologically disordered, and difficult to review during a short consultation. There is no consistent point-of-entry mechanism to digitize, structure, and organize prior medical documents before the patient reaches the consultation room.

The Ayushman Bharat Digital Mission has established national digital health infrastructure through ABHA IDs, the Health Information Exchange, and FHIR-based interoperability standards. However, the first-mile problem remains: patients need a practical, patient-facing platform that captures structured history and digitizes documents before the clinical encounter begins.

### 1.3 The Opportunity

Self-service kiosks have improved throughput in banking, aviation, and quick-service industries by shifting structured data entry to the user. Healthcare check-in kiosks exist in developed-country hospitals, but they generally handle administrative check-in rather than deep, AI-driven, multimodal clinical history acquisition and medical-document digitization.

The convergence of Indian-language automatic speech recognition, clinical language models, multilingual OCR, and ABDM interoperability makes an AI-powered clinical history software platform feasible.

## 2. Description

### 2.1 Problem Statement

There is no purpose-built, patient-facing software platform that enables patients to independently and comprehensively record their medical history through natural spoken conversation and guided touchscreen interaction while simultaneously digitizing existing physical medical documents. The platform should generate a structured, physician-ready clinical history summary that integrates with the hospital information system and can be linked to the patient's ABHA record before the consultation, with minimal staff assistance.

### 2.2 Why Existing Solutions Fall Short

- Hospital registration systems capture demographic and appointment data but do not elicit clinical history or process medical documents.
- Mobile health apps and tele-triage chatbots require smartphone literacy, stable connectivity, and advance enrolment, excluding many elderly, rural, low-literacy, and first-visit patients.
- Manual nurse-led triage and history desks are resource-limited and recreate the same time and transcription bottleneck.
- Generic document scanners digitize images but do not extract, structure, chronologically organize, or link clinical content to a structured history or ABHA record.

### 2.3 Specific Challenges

- Multilingual, multi-accent voice capture in noisy hospital environments across Hindi, English, and regional languages.
- Accessibility for low-literacy and elderly users through icon-driven UI, audio prompts, and conversational guidance.
- Accurate structuring of chief complaint, HPI, past history, drug and allergy history, family history, personal history, review of systems, and AYUSH parameters.
- Reliable OCR of handwritten and printed prescriptions, laboratory reports, and discharge summaries in multiple languages.
- Privacy, consent, and data-security compliance with the Digital Personal Data Protection Act 2023 and the ABDM consent framework.

## 3. Expected Solution: MediKiosk

### 3.1 Solution Overview

MediKiosk is an AI-powered clinical history software platform that allows a patient to record comprehensive medical history through natural voice conversation and guided touchscreen interaction, scan and digitize existing physical medical documents, and generate a structured, physician-ready clinical history summary before consultation.

The summary can be reviewed by clinical staff, integrated with the hospital information system, and linked to the patient's ABHA record through appropriate consent and interoperability services. The physician retains responsibility for reviewing, editing, confirming, or rejecting the generated summary.

### 3.2 Software and AI Stack

| Layer | Proposed technology and responsibility |
| --- | --- |
| Patient interface | React, TypeScript, Vite, responsive touchscreen-first workflows, icon-driven interaction |
| Hospital workflows | Role-based doctor, reception, admin, and patient portals; registration, queue, case-taking, registry, and reporting |
| Voice capture | Browser speech recognition and an Indian-language ASR integration such as Bhashini or AI4Bharat |
| Conversational history | Clinical question bank, complaint-specific branching, SOCRATES-style HPI prompts, red-flag detection, and structured output |
| Document intelligence | Image/PDF upload, OCR pipeline, multilingual extraction of diagnoses, medications, investigation values, and dates |
| Clinical support | Vitals evaluation, emergency protocols, drug interaction checks, pediatric dosing, and lab abnormality highlighting |
| Data and API | FastAPI, Pydantic schemas, MongoDB with an in-memory fallback, REST APIs, and patient/case timeline models |
| Interoperability | ABHA identity and FHIR-compatible integration boundary, subject to hospital and ABDM authorization |
| Security and audit | Consent records, role-based access, audit logs, digital case signatures, and temporary-session cleanup |
| Deployment | Vercel-ready frontend and Render-ready FastAPI backend with MongoDB Atlas support |

### 3.3 Integrated Modules

#### Module A: Conversational Multimodal History Engine

The conversational engine conducts a structured history interview through voice and touch. Patients speak naturally in their preferred language while the engine asks follow-up questions. For example, after a patient reports chest pain, it can ask about onset, character, radiation, aggravating factors, and relieving factors using the SOCRATES framework.

- Adaptive questioning branches based on the chief complaint and prior answers.
- Every question can be answered by speaking or tapping.
- AYUSH mode captures Dashavidha Pariksha and Ahara-Vihara parameters.
- Red-flag detection identifies emergency symptoms such as acute chest pain with dyspnoea or stroke symptoms and triggers priority triage instead of routine queueing.

#### Module B: Medical Document Digitization and Intelligence

Patients can upload prior prescriptions, lab reports, and discharge summaries. The pipeline performs OCR and extracts structured clinical entities.

- Extracts diagnoses, medications with dosages, investigation results, reference ranges, and procedure history.
- Dates and documents are organized into a chronological medical timeline.
- Abnormal laboratory values and potential drug interactions are highlighted for physician review.

#### Module C: Structured History Summary Generator

The summarization engine synthesizes conversational history and digitized documents into a concise, physician-ready summary.

- Standard format: chief complaint, HPI, past medical and surgical history, drug and allergy history, family history, personal history, review of systems, and prior investigation summary.
- Physician-editable and verifiable: the output is a draft, never an autonomous diagnosis.
- Bilingual patient-facing confirmation and physician-facing English/Hindi output.

#### Module D: Consent, Privacy, and ABDM Integration

A consent and security layer supports the Digital Personal Data Protection Act 2023 and the ABDM consent framework.

- ABHA-based patient identification where authorized.
- Explicit consent for data capture and sharing, with granular and revocable scope.
- Secure processing of voice and document data.
- Temporary session data is cleared after submission where retention is not required.
- Audio explanations support low-literacy patients.

### 3.4 End-to-End Patient Journey

1. **Identify:** The patient enters or scans an ABHA ID or other permitted identifier, registers if needed, selects a language, and grants consent through an audio-guided flow.
2. **Converse:** AI conducts an adaptive voice and touch history interview covering chief complaint, HPI, and full history. Red flags trigger priority triage.
3. **Scan:** The patient uploads prescriptions, lab reports, and discharge summaries. AI digitizes, structures, and timelines them.
4. **Summarize and route:** AI generates a structured history summary, links it to the authorized patient record, and makes it available to the hospital workflow.
5. **Consult:** The physician reviews the complete history, edits or confirms it, and spends the consultation on examination, reasoning, counselling, and care.

## 4. Current Repository Alignment

This repository already contains working foundations for the proposed platform:

- Patient registration with UHID and patient demographic records.
- Structured clinical case-taking and longitudinal patient timelines.
- Voice scribe, speech parsing, multilingual discharge instructions, and AI case assistance.
- Lab report OCR, abnormal-value interpretation, drug interaction checks, and pediatric dosing.
- Emergency triage protocols and reception-side Red-Flag Detection.
- Admin patient registry, staff management, audit logs, and role-based portals.
- Case-sheet PDF generation, automatic PDF download for finalized case summaries, and embedded patient-details snapshots.
- FastAPI backend APIs with MongoDB and in-memory fallback storage.

## 5. Validation and Scope Notes

The current implementation is a functional clinical workflow prototype. External ABDM/FHIR connectivity, production-grade Indian-language ASR/OCR providers, hospital identity integration, formal DPDP compliance review, and clinical safety validation require deployment-specific configuration, authorized credentials, governance review, and testing with clinical stakeholders.
