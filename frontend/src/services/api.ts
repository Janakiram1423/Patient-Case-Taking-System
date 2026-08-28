/**
 * CliniCase AI Unified API Service Client
 * Connects to the FastAPI backend with seamless local fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const apiClient = {
  // Patients
  async getPatients(search?: string) {
    try {
      const url = search ? `${API_BASE_URL}/patients?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/patients`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return null; // Signals fallback to local context
    }
  },

  async createPatient(data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Cases
  async getCases(patientId?: string) {
    try {
      const url = patientId ? `${API_BASE_URL}/cases?patient_id=${patientId}` : `${API_BASE_URL}/cases`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return null;
    }
  },

  async createCase(data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create case');
      return await res.json();
    } catch {
      return null;
    }
  },

  // AI Inference & Vitals
  async evaluateVitals(vitals: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/vitals-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitals)
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getSymptomQuestions(complaint: string, language: string = 'en') {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/symptom-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint, language })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getDifferentialDiagnosis(complaint: string, history: string = '', vitals: any = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/differential-diagnosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint, history, vitals })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async askAssistant(question: string, context: string = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context })
      });
      if (!res.ok) throw new Error('Assistant request failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Voice Scribe
  async parseVoiceTranscript(transcript: string, language: string = 'en') {
    try {
      const res = await fetch(`${API_BASE_URL}/voice/process-transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Lab OCR
  async analyzeLabReport(raw_text: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/lab-ocr/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Drug Safety & Interactions
  async checkDrugInteractions(drugNames: string[]) {
    try {
      const res = await fetch(`${API_BASE_URL}/drugs/check-interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drug_names: drugNames })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async calculatePediatricDose(weight_kg: number, drug_key: string, age_months: number = 24) {
    try {
      const res = await fetch(`${API_BASE_URL}/drugs/pediatric-dose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight_kg, drug_key, age_months })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Multilingual Patient Discharge & Prescription Instructions Generator
  async generatePatientDischargeInstructions(params: {
    patient_name: string;
    patient_age?: number;
    patient_gender?: string;
    diagnosis?: string;
    medications?: any[];
    follow_up_date?: string;
    language?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/patient-discharge-instructions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback seamlessly to client generator
    }

    // Client-side local fallback
    const { generateClientDischargePlan } = await import('../utils/dischargeGenerator');
    return generateClientDischargePlan(
      params.patient_name,
      params.patient_age || 30,
      params.patient_gender || 'Unknown',
      params.diagnosis || '',
      params.medications || [],
      params.follow_up_date,
      params.language || 'hi'
    );
  }
};

