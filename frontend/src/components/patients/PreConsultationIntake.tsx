import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileUp, Languages, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { SUPPORTED_LANGUAGES } from '../../data/multilingualClinicalDictionary';
import { AyushProfile, Patient, PreConsultationIntake as IntakeRecord, PriorDocument } from '../../types';
import { PatientVoiceInput } from '../common/PatientVoiceInput';

const fieldClass = 'mt-1 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-sky-500 text-sm';
const redFlagPatterns = [
  { label: 'Breathing difficulty', pattern: /breathless|shortness of breath|difficulty breathing|सांस फूलना|दम घुटना/i },
  { label: 'Severe chest pain', pattern: /chest pain|chest pressure|सीने में दर्द|छाती में दर्द/i },
  { label: 'Stroke warning signs', pattern: /face droop|slurred speech|one-sided weakness|लकवा|बोलने में दिक्कत/i },
  { label: 'Reduced consciousness', pattern: /unconscious|confusion|fainted|बेहोश|बेहोशी/i }
];

const guidedQuestionSets = [
  { keywords: ['chest', 'heart', 'सीने', 'छाती'], questions: ['When did the pain start?', 'Does it spread to your arm, jaw, back, or neck?', 'Do you have breathlessness, sweating, nausea, or fainting?'] },
  { keywords: ['fever', 'cough', 'bukhar', 'बुखार', 'खांसी'], questions: ['How high has the fever been, if measured?', 'Do you have breathing difficulty, rash, bleeding, or persistent vomiting?', 'Have you had recent travel, mosquito exposure, or sick contacts?'] },
  { keywords: ['headache', 'migraine', 'सिरदर्द'], questions: ['Was the headache sudden or gradual?', 'Do you have weakness, speech difficulty, confusion, fever, or neck stiffness?', 'What makes it better or worse?'] }
];

interface PreConsultationIntakeProps {
  patient: Patient;
}

export const PreConsultationIntake: React.FC<PreConsultationIntakeProps> = ({ patient }) => {
  const { updatePatient } = useHospital();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const existing = patient.pre_consultation;
  const [abhaId, setAbhaId] = useState(patient.abha_id || '');
  const [language, setLanguage] = useState(patient.preferred_language || 'hi-IN');
  const [careMode, setCareMode] = useState<IntakeRecord['care_mode']>(patient.care_mode || 'Allopathy');
  const [consent, setConsent] = useState(Boolean(patient.consent_given));
  const [chiefComplaint, setChiefComplaint] = useState(existing?.chief_complaint || '');
  const [duration, setDuration] = useState(existing?.duration || '');
  const [severity, setSeverity] = useState<IntakeRecord['severity']>(existing?.severity || 'Moderate');
  const [symptoms, setSymptoms] = useState(existing?.symptoms || '');
  const [priorRecords, setPriorRecords] = useState(existing?.prior_records_summary || '');
  const [guidedAnswers, setGuidedAnswers] = useState<Record<string, string>>(existing?.guided_answers || {});
  const [priorDocuments, setPriorDocuments] = useState<PriorDocument[]>(existing?.prior_documents || []);
  const [ayush, setAyush] = useState<AyushProfile>(existing?.ayush_profile || {
    prakriti: '', vikriti: '', agni: '', koshtha: '', ahara_vihara: '', nidana: '', samprapti: '', dashavidha_notes: ''
  });

  const detectedRedFlags = useMemo(() => {
    const text = `${chiefComplaint} ${symptoms}`;
    return redFlagPatterns.filter(item => item.pattern.test(text)).map(item => item.label);
  }, [chiefComplaint, symptoms]);

  const guidedQuestions = useMemo(() => {
    const text = `${chiefComplaint} ${symptoms}`.toLowerCase();
    return guidedQuestionSets.find(set => set.keywords.some(keyword => text.includes(keyword)))?.questions
      || ['When did this problem start?', 'What symptoms are most difficult right now?', 'What makes the symptoms better or worse?'];
  }, [chiefComplaint, symptoms]);

  const updateAyush = (key: keyof AyushProfile, value: string) => {
    setAyush(current => ({ ...current, [key]: value }));
  };

  const handleDocuments = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const nextDocuments = files.slice(0, 5).map(file => ({
      id: `doc-${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      uploaded_at: new Date().toISOString()
    }));
    setPriorDocuments(current => [...current, ...nextDocuments].slice(0, 5));
    event.target.value = '';
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent) {
      showToast('error', 'Consent required', 'Please review and grant consent before submitting your intake.');
      return;
    }
    if (!chiefComplaint.trim() || !symptoms.trim()) {
      showToast('error', 'Clinical details missing', 'Add your main concern and describe your symptoms.');
      return;
    }

    const intake: IntakeRecord = {
      chief_complaint: chiefComplaint.trim(),
      duration: duration.trim(),
      severity,
      symptoms: symptoms.trim(),
      prior_records_summary: priorRecords.trim(),
      red_flags: detectedRedFlags,
      preferred_language: language,
      care_mode: careMode,
      ayush_profile: careMode === 'AYUSH' ? ayush : undefined,
      guided_answers: guidedAnswers,
      prior_documents: priorDocuments,
      submitted_at: new Date().toISOString()
    };

    updatePatient({
      ...patient,
      abha_id: abhaId.trim() || undefined,
      preferred_language: language,
      consent_given: true,
      consent_granted_at: new Date().toISOString(),
      consent_scope: ['clinical_history', 'prior_records', 'physician_review'],
      care_mode: careMode,
      pre_consultation: intake
    });

    showToast(
      detectedRedFlags.length > 0 ? 'warning' : 'success',
      detectedRedFlags.length > 0 ? 'Priority review requested' : 'Pre-consultation submitted',
      detectedRedFlags.length > 0
        ? `${detectedRedFlags.join(', ')} detected. Please alert the reception or triage desk immediately.`
        : `Your intake is ready for physician review. ${currentUser.name} can open patient number ${patient.patient_id}.`
    );
  };

  return (
    <div className="max-w-5xl space-y-5">
      <div className="bg-gradient-to-r from-teal-700 via-sky-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-teal-100">Before your consultation</p>
            <h1 className="text-xl sm:text-2xl font-black mt-1">Patient Pre-consultation Intake</h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-2 max-w-2xl">Share your concern, previous records, and preferred language so your clinician can review a structured summary before meeting you.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Identity, language and consent</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <label className="font-bold text-slate-700">ABHA ID (optional)<input value={abhaId} onChange={event => setAbhaId(event.target.value)} placeholder="Enter ABHA ID" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Preferred language<select value={language} onChange={event => setLanguage(event.target.value)} className={fieldClass}><option value="hi-IN">Hindi</option><option value="en-IN">English</option>{SUPPORTED_LANGUAGES.filter(option => !['hi-IN', 'en-IN'].includes(option.code)).map(option => <option key={option.code} value={option.code}>{option.nativeName}</option>)}</select></label>
            <label className="font-bold text-slate-700">Clinical pathway<select value={careMode} onChange={event => setCareMode(event.target.value as IntakeRecord['care_mode'])} className={fieldClass}><option value="Allopathy">Allopathy</option><option value="AYUSH">AYUSH / Ayurveda</option></select></label>
          </div>
          <label className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
            <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5" />
            <span>I consent to the collection of this clinical history and prior-record summary for physician review and care coordination. I understand this is a draft intake, not an autonomous diagnosis.</span>
          </label>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ClipboardCheck className="w-4 h-4 text-teal-600" />
            <div><h2 className="text-sm font-extrabold text-slate-900">Guided follow-up questions</h2><p className="text-xs text-slate-500 mt-1">Answer by typing or speaking naturally. These answers help the clinician prepare.</p></div>
          </div>
          <div className="space-y-3">
            {guidedQuestions.map(question => (
              <label key={question} className="block text-xs font-bold text-slate-700">
                {question}
                <textarea rows={2} value={guidedAnswers[question] || ''} onChange={event => setGuidedAnswers(current => ({ ...current, [question]: event.target.value }))} placeholder="Your answer" className={fieldClass} />
                <PatientVoiceInput value={guidedAnswers[question] || ''} onChange={value => setGuidedAnswers(current => ({ ...current, [question]: value }))} language={language} />
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3"><Languages className="w-4 h-4 text-sky-600" /><h2 className="text-sm font-extrabold text-slate-900">Your current concern</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <label className="font-bold text-slate-700 sm:col-span-2">Main concern *<input required value={chiefComplaint} onChange={event => setChiefComplaint(event.target.value)} placeholder="What brings you to the hospital?" className={fieldClass} /><PatientVoiceInput value={chiefComplaint} onChange={setChiefComplaint} language={language} /></label>
            <label className="font-bold text-slate-700">How long?<input value={duration} onChange={event => setDuration(event.target.value)} placeholder="Example: 3 days" className={fieldClass} /><PatientVoiceInput value={duration} onChange={setDuration} language={language} /></label>
            <label className="font-bold text-slate-700">Severity<select value={severity} onChange={event => setSeverity(event.target.value as IntakeRecord['severity'])} className={fieldClass}><option>Mild</option><option>Moderate</option><option>Severe</option></select></label>
            <label className="font-bold text-slate-700 sm:col-span-2">Describe your symptoms *<textarea required rows={4} value={symptoms} onChange={event => setSymptoms(event.target.value)} placeholder="Tell us what you are experiencing, in your own words." className={fieldClass} /><PatientVoiceInput value={symptoms} onChange={setSymptoms} language={language} /></label>
          </div>
          {detectedRedFlags.length > 0 && <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-300 p-3 text-xs text-rose-900"><AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /><span><strong>Priority symptoms detected:</strong> {detectedRedFlags.join(', ')}. Do not wait for routine registration; contact the triage desk now.</span></div>}
        </section>

        {careMode === 'AYUSH' && (
          <section className="bg-amber-50 rounded-2xl border border-amber-200 p-5 sm:p-6 space-y-4">
            <div><h2 className="text-sm font-extrabold text-amber-950">AYUSH / Dashavidha Pariksha</h2><p className="text-xs text-amber-800 mt-1">These details help the Ayurvedic practitioner prepare a personalized assessment.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {([['prakriti', 'Prakriti / constitution'], ['vikriti', 'Vikriti / current imbalance'], ['agni', 'Agni / digestive capacity'], ['koshtha', 'Koshtha / bowel nature'], ['ahara_vihara', 'Ahara-Vihara / diet and lifestyle'], ['nidana', 'Nidana / possible causes'], ['samprapti', 'Samprapti / disease progression']] as Array<[keyof AyushProfile, string]>).map(([key, label]) => <label key={key} className="font-bold text-amber-950">{label}<input value={ayush[key]} onChange={event => updateAyush(key, event.target.value)} placeholder="Add details if known" className="mt-1 w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-500 text-sm" /><PatientVoiceInput value={ayush[key]} onChange={value => updateAyush(key, value)} language={language} /></label>)}
              <label className="font-bold text-amber-950 sm:col-span-2">Other Dashavidha observations<textarea rows={3} value={ayush.dashavidha_notes} onChange={event => updateAyush('dashavidha_notes', event.target.value)} placeholder="Sara, Samhanana, Pramana, Satmya, Sattva, Vaya, exercise capacity" className="mt-1 w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-500 text-sm" /><PatientVoiceInput value={ayush.dashavidha_notes} onChange={value => updateAyush('dashavidha_notes', value)} language={language} /></label>
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900">Prior records summary</h2>
          <p className="text-xs text-slate-500">Mention previous diagnoses, medicines, allergies, surgeries, or important lab results. Staff can attach and scan documents during consultation.</p>
          <textarea rows={4} value={priorRecords} onChange={event => setPriorRecords(event.target.value)} placeholder="Example: Diabetes for 5 years; taking metformin; allergic to penicillin; last HbA1c was..." className={fieldClass} />
          <PatientVoiceInput value={priorRecords} onChange={setPriorRecords} language={language} />
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 text-xs font-bold cursor-pointer">
            <FileUp className="w-4 h-4" />
            Attach prescriptions, lab reports, or discharge summaries
            <input type="file" multiple accept="image/*,.pdf,.txt,.csv" onChange={handleDocuments} className="sr-only" />
          </label>
          {priorDocuments.length > 0 && <div className="space-y-2">{priorDocuments.map(document => <div key={document.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"><span className="truncate">{document.name}</span><button type="button" onClick={() => setPriorDocuments(current => current.filter(item => item.id !== document.id))} className="p-1 text-rose-600 hover:bg-rose-50 rounded" title="Remove attached document" aria-label={`Remove ${document.name}`}><Trash2 className="w-3.5 h-3.5" /></button></div>)}</div>}
          <p className="text-[11px] text-slate-500">Files are attached to the consented intake record for staff review. Image and PDF OCR is performed from the clinical scanner workflow.</p>
        </section>

        <section className="bg-slate-900 text-white rounded-2xl p-5 space-y-2">
          <h2 className="text-sm font-extrabold">Physician-ready intake preview</h2>
          <p className="text-xs text-slate-300">{chiefComplaint || 'Main concern not entered'} • {severity} • {language}</p>
          <p className="text-xs text-slate-300">{detectedRedFlags.length > 0 ? `Priority triage: ${detectedRedFlags.join(', ')}` : 'No red-flag phrases detected in the current draft.'}</p>
          <p className="text-xs text-slate-300">{Object.values(guidedAnswers).filter(Boolean).length} guided answers • {priorDocuments.length} prior documents attached • {careMode} pathway</p>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">Patient number: <span className="font-mono font-bold text-sky-800">{patient.patient_id}</span></p>
          <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-extrabold"><CheckCircle2 className="w-4 h-4" />Submit intake for review</button>
        </div>
      </form>
    </div>
  );
};