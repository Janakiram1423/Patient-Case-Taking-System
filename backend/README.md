# CliniCase AI™ — Backend API Service

FastAPI-powered asynchronous clinical intelligence and EHR management backend for CliniCase AI.

## 🚀 Key Modules & Endpoints

- **Patients API** (`/api/patients`): CRUD operations, clinical timeline, UHID registration.
- **Cases API** (`/api/cases`): Structured case records, SHA-256 digital signature, visit history.
- **Appointments API** (`/api/appointments`): OPD token allocation and status tracking.
- **AI Clinical Assistant** (`/api/ai`):
  - `/api/ai/symptom-questions`: Dynamic clinical questioning generator.
  - `/api/ai/differential-diagnosis`: Ranked differential diagnosis engine with ICD-10 suggestions.
  - `/api/ai/vitals-score`: NEWS-2 (National Early Warning Score) and clinical risk evaluation.
- **Voice Scribe API** (`/api/voice`):
  - `/api/voice/process-transcript`: Multi-lingual entity extraction (Hindi, Tamil, Telugu, English, etc.).
- **Diagnostic Lab OCR** (`/api/lab-ocr`):
  - `/api/lab-ocr/analyze`: Lab test values parsing and abnormality flags.
- **Drug Formulary & Interactions** (`/api/drugs`):
  - `/api/drugs/check-interactions`: Harmful drug-drug interaction warning checker.
  - `/api/drugs/pediatric-dose`: Weight-based pediatric dosage calculation.
- **Emergency Protocols** (`/api/emergency`): Acute resuscitation protocols (STEMI, Anaphylaxis, Asthma).
- **Admin Operations** (`/api/admin`): Staff roster, audit logs, and hospital metrics.

## 📦 How to Run Backend

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the API Server**:
   ```bash
   python run.py
   ```
   or with uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **Interactive Swagger API Documentation**:
   - Open: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - Alternative ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
