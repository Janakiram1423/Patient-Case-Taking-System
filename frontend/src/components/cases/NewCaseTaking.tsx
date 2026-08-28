import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Stethoscope,
  Activity,
  Heart,
  FileText,
  Pill,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  FileDown,
  Printer,
  Info,
  ShieldAlert,
  HelpCircle,
  Languages
} from 'lucide-react';
import {
  Patient,
  CaseRecord,
  PrescriptionItem,
  Investigation,
  AllergyItem,
  MedicationItem,
  ParsedClinicalVoiceData
} from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DRUG_CATALOG } from '../../data/drugDatabase';
import { checkDrugInteractions, checkAllergyConflict, DrugInteractionAlert } from '../../data/drugInteractions';
import { evaluateVitals } from '../../utils/vitalsEvaluator';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { ClinicalVoiceScribeModal } from '../clinical/ClinicalVoiceScribeModal';
import { LabReportScannerModal } from '../clinical/LabReportScannerModal';
import { MultilingualDischargeModal } from '../clinical/MultilingualDischargeModal';
import { Badge } from '../common/Badge';
import { AICaseAssistantView } from '../ai/AICaseAssistantModal';


interface NewCaseTakingProps {
  initialPatientId?: string;
  initialVoiceData?: ParsedClinicalVoiceData | null;
  onFinishCase?: (savedCase: CaseRecord) => void;
  onCancel?: () => void;
}

export const NewCaseTaking: React.FC<NewCaseTakingProps> = ({
  initialPatientId,
  initialVoiceData,
  onFinishCase,
  onCancel
}) => {
  const { patients, saveCaseRecord, getPatientCases, hospitalInfo } = useHospital();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Current Step (1 to 7 structured tabs for high physician usability)
  const [activeStep, setActiveStep] = useState(1);

  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || (patients.length > 0 ? patients[0].patient_id : '')
  );

  const selectedPatient = patients.find(p => p.patient_id === selectedPatientId);
  const existingCases = selectedPatient ? getPatientCases(selectedPatient.patient_id) : [];
  const nextVisitNumber = existingCases.length + 1;

  // 1. Visit Details & Chief Complaint
  const [visitType, setVisitType] = useState<CaseRecord['visit_type']>(
    existingCases.length > 0 ? 'Follow-up Visit' : 'New Visit'
  );
  const [mainComplaint, setMainComplaint] = useState('');
  const [durationValue, setDurationValue] = useState<number>(3);
  const [durationUnit, setDurationUnit] = useState<CaseRecord['chief_complaint']['duration_unit']>('Days');
  const [severity, setSeverity] = useState<CaseRecord['chief_complaint']['severity']>('Moderate');
  const [frequency, setFrequency] = useState<CaseRecord['chief_complaint']['frequency']>('Continuous');
  const [complaintLocation, setComplaintLocation] = useState('');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [newSymptomInput, setNewSymptomInput] = useState('');

  // 2. History of Present Illness (HPI)
  const [hpiOnset, setHpiOnset] = useState<CaseRecord['history_present_illness']['onset']>('Gradual');
  const [hpiProgression, setHpiProgression] = useState<CaseRecord['history_present_illness']['progression']>('Worsening');
  const [hpiCharacter, setHpiCharacter] = useState('');
  const [aggravatingFactors, setAggravatingFactors] = useState<string[]>([]);
  const [relievingFactors, setRelievingFactors] = useState<string[]>([]);
  const [previousTreatment, setPreviousTreatment] = useState('');
  const [detailedNarrative, setDetailedNarrative] = useState('');

  // 3. Past, Meds, Allergies, Family, Social History
  const [pastConditions, setPastConditions] = useState<string[]>([]);
  const [customPastConditions, setCustomPastConditions] = useState('');
  const [previousSurgeries, setPreviousSurgeries] = useState('');
  const [previousHospitalizations, setPreviousHospitalizations] = useState('');
  const [currentMeds, setCurrentMeds] = useState<MedicationItem[]>([]);
  const [allergies, setAllergies] = useState<AllergyItem[]>([]);
  const [hasNoKnownAllergies, setHasNoKnownAllergies] = useState(false);
  const [familyConditions, setFamilyConditions] = useState<string[]>([]);
  const [familyNotes, setFamilyNotes] = useState('');
  const [diet, setDiet] = useState<CaseRecord['personal_history']['diet']>('Non-Vegetarian');
  const [sleepPattern, setSleepPattern] = useState<CaseRecord['personal_history']['sleep_pattern']>('Normal (7-8h)');
  const [physicalActivity, setPhysicalActivity] = useState<CaseRecord['personal_history']['physical_activity']>('Moderate');
  const [smokingStatus, setSmokingStatus] = useState<CaseRecord['personal_history']['smoking_status']>('Never');
  const [alcoholStatus, setAlcoholStatus] = useState<CaseRecord['personal_history']['alcohol_status']>('Never');
  const [occupation, setOccupation] = useState('');
  const [stressLevel, setStressLevel] = useState<CaseRecord['personal_history']['stress_level']>('Moderate');

  // 4. Clinical Examination & Vitals
  const [tempF, setTempF] = useState<number>(98.6);
  const [bpSys, setBpSys] = useState<number>(120);
  const [bpDia, setBpDia] = useState<number>(80);
  const [pulseRate, setPulseRate] = useState<number>(76);
  const [respRate, setRespRate] = useState<number>(16);
  const [spo2, setSpo2] = useState<number>(99);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [bloodSugar, setBloodSugar] = useState<number | undefined>(undefined);

  // General Exam
  const [appearance, setAppearance] = useState<CaseRecord['general_exam']['appearance']>('Well');
  const [consciousness, setConsciousness] = useState<CaseRecord['general_exam']['consciousness']>('Conscious & Alert');
  const [hydration, setHydration] = useState<CaseRecord['general_exam']['hydration']>('Adequate');
  const [pallor, setPallor] = useState(false);
  const [icterus, setIcterus] = useState(false);
  const [cyanosis, setCyanosis] = useState(false);
  const [clubbing, setClubbing] = useState(false);
  const [lymphadenopathy, setLymphadenopathy] = useState(false);
  const [edema, setEdema] = useState(false);
  const [generalExamNotes, setGeneralExamNotes] = useState('');

  // Systemic Exam
  const [rsNotes, setRsNotes] = useState('Bilateral vesicular breath sounds normal, clear.');
  const [rsWheezing, setRsWheezing] = useState(false);
  const [rsCrepitations, setRsCrepitations] = useState(false);

  const [cvsS1S2, setCvsS1S2] = useState('S1 S2 heard normally, regular rhythm.');
  const [cvsMurmurs, setCvsMurmurs] = useState('No murmurs');
  const [cvsPulses, setCvsPulses] = useState('All peripheral pulses palpable');

  const [cnsGcs, setCnsGcs] = useState('15/15');
  const [cnsNotes, setCnsNotes] = useState('Pupils equal and reactive. Cranial nerves grossly intact. No focal neurological deficits.');

  const [gitTenderness, setGitTenderness] = useState(false);
  const [gitSite, setGitSite] = useState('');
  const [gitNotes, setGitNotes] = useState('Abdomen soft, non-distended, normal bowel sounds.');

  const [mskNotes, setMskNotes] = useState('Full range of motion in all major joints, no deformity or swelling.');

  // 5. Investigations
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestCategory, setNewTestCategory] = useState<Investigation['category']>('Blood / Hematology');

  // 6. Diagnosis
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
  const [provisionalIcd, setProvisionalIcd] = useState('');
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [finalIcd, setFinalIcd] = useState('');
  const [differentials, setDifferentials] = useState<string[]>([]);
  const [newDiffInput, setNewDiffInput] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [redFlagsNoted, setRedFlagsNoted] = useState<string[]>([]);

  // 7. Prescription & Follow-up
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [followupDate, setFollowupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [followupReason, setFollowupReason] = useState('Review symptom resolution & repeat evaluation');
  const [followupInstructions, setFollowupInstructions] = useState('Drink plenty of fluids. SOS follow-up if symptoms worsen.');

  // Evaluated Vitals in real-time
  const evaluatedVitals = evaluateVitals(
    heightCm,
    weightKg,
    tempF,
    bpSys,
    bpDia,
    pulseRate,
    spo2,
    respRate
  );

  // Prepopulate if patient changes or has previous visit
  useEffect(() => {
    if (selectedPatient) {
      setMainComplaint(selectedPatient.presenting_disease || selectedPatient.current_symptoms || '');
      setDetailedNarrative(selectedPatient.current_symptoms || '');
      if (selectedPatient.symptom_severity) setSeverity(selectedPatient.symptom_severity);
      if (selectedPatient.vital_signs?.temperature) {
        const temperature = Number.parseFloat(selectedPatient.vital_signs.temperature);
        if (!Number.isNaN(temperature)) setTempF(temperature);
      }
      if (selectedPatient.vital_signs?.pulse_rate) {
        const pulseRate = Number.parseInt(selectedPatient.vital_signs.pulse_rate, 10);
        if (!Number.isNaN(pulseRate)) setPulseRate(pulseRate);
      }
      if (selectedPatient.vital_signs?.weight) {
        const weight = Number.parseFloat(selectedPatient.vital_signs.weight);
        if (!Number.isNaN(weight)) setWeightKg(weight);
      }

      const prevCases = getPatientCases(selectedPatient.patient_id);
      if (prevCases.length > 0) {
        const lastCase = prevCases[0];
        // Populate chronic history from previous case
        setPastConditions(lastCase.past_history.conditions || []);
        setCustomPastConditions(lastCase.past_history.custom_conditions || '');
        setAllergies(lastCase.allergy_history.allergies || []);
        setHasNoKnownAllergies(lastCase.allergy_history.has_no_known_allergies || false);
        setFamilyConditions(lastCase.family_history.conditions || []);
        setFamilyNotes(lastCase.family_history.notes || '');
        setDiet(lastCase.personal_history.diet || 'Non-Vegetarian');
        setSmokingStatus(lastCase.personal_history.smoking_status || 'Never');
        setAlcoholStatus(lastCase.personal_history.alcohol_status || 'Never');
        setOccupation(lastCase.personal_history.occupation || '');
        setHeightCm(lastCase.vitals.height_cm || 170);
      } else {
        setPastConditions([]);
        setCustomPastConditions('');
        setAllergies([]);
        setHasNoKnownAllergies(false);
        setFamilyConditions([]);
        setFamilyNotes('');
        setDiet('Non-Vegetarian');
        setSmokingStatus('Never');
        setAlcoholStatus('Never');
        setOccupation('');
        setHeightCm(170);
      }
    }
  }, [selectedPatientId]);

  // AI Voice Scribe Studio Modal State
  const [isScribeModalOpen, setIsScribeModalOpen] = useState(false);

  // AI Diagnostic Lab Report Scanner Modal State
  const [isLabScannerModalOpen, setIsLabScannerModalOpen] = useState(false);

  // AI Multilingual Discharge & Rx Slip Modal State
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);

  // Handle Lab Investigations Import from OCR Scanner
  const handleImportLabInvestigations = (newInvs: Investigation[], updatedDifferentials?: string[]) => {
    setInvestigations(prev => [...prev, ...newInvs]);
    if (updatedDifferentials && updatedDifferentials.length > 0) {
      setDifferentials(prev => Array.from(new Set([...prev, ...updatedDifferentials])));
      if (!provisionalDiagnosis) {
        setProvisionalDiagnosis(updatedDifferentials[0]);
      }
    }
    showToast('success', 'Lab Investigations Imported', `Added ${newInvs.length} laboratory test findings to case.`);
  };

  // Apply initialVoiceData if passed as prop
  useEffect(() => {
    if (initialVoiceData) {
      handleApplyVoiceData(initialVoiceData);
    }
  }, [initialVoiceData]);

  // Comprehensive Voice Data Applicator
  const handleApplyVoiceData = (parsed: ParsedClinicalVoiceData) => {
    if (parsed.chiefComplaint) {
      setMainComplaint(parsed.chiefComplaint);
    }
    if (parsed.durationValue) setDurationValue(parsed.durationValue);
    if (parsed.durationUnit) setDurationUnit(parsed.durationUnit);
    if (parsed.severity) setSeverity(parsed.severity);

    if (parsed.associatedSymptoms && parsed.associatedSymptoms.length > 0) {
      setAssociatedSymptoms(prev => Array.from(new Set([...prev, ...parsed.associatedSymptoms])));
    }

    // Auto-fill vitals if detected
    if (parsed.vitalsExtracted.temp) setTempF(parsed.vitalsExtracted.temp);
    if (parsed.vitalsExtracted.bpSys) setBpSys(parsed.vitalsExtracted.bpSys);
    if (parsed.vitalsExtracted.bpDia) setBpDia(parsed.vitalsExtracted.bpDia);
    if (parsed.vitalsExtracted.pulse) setPulseRate(parsed.vitalsExtracted.pulse);
    if (parsed.vitalsExtracted.spo2) setSpo2(parsed.vitalsExtracted.spo2);
    if (parsed.vitalsExtracted.respRate) setRespRate(parsed.vitalsExtracted.respRate);
    if (parsed.vitalsExtracted.bloodSugar) setBloodSugar(parsed.vitalsExtracted.bloodSugar);

    // HPI Narrative snippets
    if (parsed.hpiNarrativeSnippets && parsed.hpiNarrativeSnippets.length > 0) {
      setDetailedNarrative(prev => {
        const added = parsed.hpiNarrativeSnippets.map(s => `• ${s}`).join('\n');
        return prev ? `${prev}\n${added}` : added;
      });
    }

    // Prescriptions
    if (parsed.prescriptions && parsed.prescriptions.length > 0) {
      const newItems: PrescriptionItem[] = parsed.prescriptions.map((rx, idx) => {
        let inst: PrescriptionItem['instruction'] = 'After Food';
        if (/before|empty/i.test(rx.instruction)) inst = 'Before Food';
        else if (/with/i.test(rx.instruction)) inst = 'With Food';
        else if (/bedtime|night/i.test(rx.instruction)) inst = 'Bedtime';
        else if (/directed/i.test(rx.instruction)) inst = 'As directed';

        return {
          id: `rx-voice-${Date.now()}-${idx}`,
          medicine_name: rx.medicine_name,
          generic_name: rx.generic_name,
          form: 'Tablet',
          strength: rx.dosage,
          dosage: '1 Unit',
          route: 'Oral',
          frequency: rx.frequency,
          duration_value: rx.duration_value,
          duration_unit: rx.duration_unit,
          instruction: inst,
          notes: 'Voice dictated medication'
        };
      });
      setPrescriptions(prev => [...prev, ...newItems]);
    }

    if (parsed.provisionalDifferentials && parsed.provisionalDifferentials.length > 0) {
      setProvisionalDiagnosis(parsed.provisionalDifferentials[0]);
      setDifferentials(parsed.provisionalDifferentials);
    }

    showToast('success', 'Voice Dictation Applied', 'Symptoms, duration, vitals, narrative, and prescriptions populated automatically.');
  };

  // Handle Speech Transcribe from quick mic
  const handleVoiceTranscription = (rawText: string, parsed?: ParsedClinicalVoiceData) => {
    if (!parsed) {
      setMainComplaint(prev => (prev ? `${prev} ${rawText}` : rawText));
      return;
    }
    handleApplyVoiceData(parsed);
  };

  // Prescription Drug Auto-Add
  const handleAddDrug = (catalogItem: (typeof DRUG_CATALOG)[0]) => {
    // Check allergy conflict
    const isAllergic = allergies.some(a =>
      catalogItem.generic_name.toLowerCase().includes(a.allergen.toLowerCase()) ||
      catalogItem.name.toLowerCase().includes(a.allergen.toLowerCase())
    );

    if (isAllergic) {
      showToast(
        'clinical-alert',
        'ALLERGY WARNING!',
        `Patient has a recorded allergy to ${catalogItem.generic_name}! Use caution.`
      );
    }

    const newRx: PrescriptionItem = {
      id: `rx-${Date.now()}-${Math.random()}`,
      medicine_name: catalogItem.name,
      generic_name: catalogItem.generic_name,
      form: catalogItem.form,
      strength: catalogItem.strength,
      dosage: catalogItem.dosage,
      route: catalogItem.route,
      frequency: catalogItem.defaultFrequency,
      duration_value: catalogItem.defaultDurationValue,
      duration_unit: catalogItem.defaultDurationUnit,
      instruction: catalogItem.defaultInstruction,
      notes: catalogItem.commonIndications.slice(0, 2).join(', ')
    };

    setPrescriptions(prev => [...prev, newRx]);
    setDrugSearchQuery('');
    showToast('success', 'Medication Added', `${catalogItem.name} added to prescription.`);
  };

  // Quick Order Investigation
  const handleAddInvestigation = (testName: string, category: Investigation['category']) => {
    if (!testName.trim()) return;
    const newInv: Investigation = {
      id: `inv-${Date.now()}`,
      test_name: testName,
      category,
      requested_date: new Date().toISOString().split('T')[0],
      status: 'Ordered',
      is_abnormal: false
    };
    setInvestigations(prev => [...prev, newInv]);
    setNewTestName('');
    showToast('success', 'Investigation Ordered', `${testName} added to case.`);
  };

  // Save / Finalize Case
  const handleSaveCase = (status: CaseRecord['status'] = 'Completed') => {
    if (!selectedPatient) {
      showToast('error', 'Missing Patient', 'Please select a patient before saving.');
      return;
    }

    if (status === 'Completed' && !mainComplaint.trim()) {
      showToast('error', 'Missing Chief Complaint', 'Chief complaint is mandatory to record clinical case.');
      setActiveStep(1);
      return;
    }

    if (status === 'Completed' && !provisionalDiagnosis.trim() && !finalDiagnosis.trim()) {
      showToast('error', 'Missing Diagnosis', 'Add a provisional or final diagnosis before completing the case.');
      setActiveStep(6);
      return;
    }

    const caseData: Omit<CaseRecord, 'case_id' | 'created_at' | 'updated_at' | 'visit_number'> & {
      visit_number: number;
    } = {
      patient_id: selectedPatient.patient_id,
      doctor_id: currentUser.id,
      doctor_name: currentUser.name,
      department: currentUser.department || 'General Medicine',
      visit_number: nextVisitNumber,
      visit_type: visitType,
      status,
      chief_complaint: {
        main_complaint: mainComplaint,
        duration_value: durationValue,
        duration_unit: durationUnit,
        severity,
        frequency,
        location: complaintLocation,
        associated_symptoms: associatedSymptoms
      },
      history_present_illness: {
        onset: hpiOnset,
        progression: hpiProgression,
        character: hpiCharacter,
        aggravating_factors: aggravatingFactors,
        relieving_factors: relievingFactors,
        previous_treatment: previousTreatment,
        detailed_narrative: detailedNarrative
      },
      past_history: {
        conditions: pastConditions,
        custom_conditions: customPastConditions,
        previous_hospitalizations: previousHospitalizations,
        previous_surgeries: previousSurgeries,
        immunization_history: 'Up to date'
      },
      medication_history: {
        current_medications: currentMeds,
        previous_adverse_reactions: ''
      },
      allergy_history: {
        allergies,
        has_no_known_allergies: hasNoKnownAllergies
      },
      family_history: {
        conditions: familyConditions,
        notes: familyNotes
      },
      personal_history: {
        diet,
        sleep_pattern: sleepPattern,
        physical_activity: physicalActivity,
        smoking_status: smokingStatus,
        alcohol_status: alcoholStatus,
        occupation,
        stress_level: stressLevel
      },
      vitals: {
        temperature_f: tempF,
        blood_pressure_systolic: bpSys,
        blood_pressure_diastolic: bpDia,
        pulse_rate: pulseRate,
        respiratory_rate: respRate,
        spo2,
        height_cm: heightCm,
        weight_kg: weightKg,
        bmi: evaluatedVitals.bmi,
        bmi_category: evaluatedVitals.bmiCategory,
        blood_sugar_random: bloodSugar
      },
      general_exam: {
        appearance,
        consciousness,
        hydration,
        pallor,
        icterus,
        cyanosis,
        clubbing,
        lymphadenopathy,
        edema,
        other_findings: generalExamNotes
      },
      systemic_exam: {
        respiratory_system: {
          inspection: 'Normal chest expansion',
          auscultation: rsNotes,
          wheezing: rsWheezing,
          crepitations: rsCrepitations,
          notes: rsNotes
        },
        cardiovascular_system: {
          s1_s2: cvsS1S2,
          murmurs: cvsMurmurs,
          peripheral_pulses: cvsPulses,
          notes: ''
        },
        central_nervous_system: {
          gcs: cnsGcs,
          cranial_nerves: 'Intact',
          motor_tone_power: '5/5 bilaterally',
          reflexes: 'Normal 2+',
          sensory: 'Intact',
          notes: cnsNotes
        },
        gastrointestinal_system: {
          inspection: 'Normal',
          tenderness: gitTenderness,
          tenderness_site: gitSite,
          organomegaly: 'No organomegaly',
          bowel_sounds: 'Normal',
          notes: gitNotes
        },
        musculoskeletal_system: {
          joint_swelling: false,
          tenderness: false,
          range_of_motion: 'Full',
          deformities: 'None',
          notes: mskNotes
        }
      },
      investigations,
      diagnosis: {
        provisional_diagnosis: provisionalDiagnosis || 'Under Evaluation',
        provisional_icd10: provisionalIcd,
        final_diagnosis: finalDiagnosis || provisionalDiagnosis || 'Clinical Assessment Recorded',
        final_icd10: finalIcd,
        differential_diagnoses: differentials,
        clinical_notes: clinicalNotes,
        red_flags_noted: redFlagsNoted
      },
      prescription: prescriptions,
      follow_up: {
        followup_date: followupDate,
        reason: followupReason,
        instructions: followupInstructions,
        pending_investigations: investigations.filter(i => i.status === 'Ordered').map(i => i.test_name),
        review_status: 'Upcoming'
      },
      doctor_signature: `${currentUser.name}, ${currentUser.title || 'MD'}`
    };

    const saved = saveCaseRecord(caseData);
    if (onFinishCase) {
      onFinishCase(saved);
    }
  };

  const steps = [
    { num: 1, label: 'Symptoms', required: true, icon: <Sparkles className="w-4 h-4" /> },
    { num: 2, label: 'History', icon: <FileText className="w-4 h-4" /> },
    { num: 3, label: 'Medical Background', icon: <Heart className="w-4 h-4" /> },
    { num: 4, label: 'Vitals & Exam', icon: <Activity className="w-4 h-4" /> },
    { num: 5, label: 'Tests', icon: <Stethoscope className="w-4 h-4" /> },
    { num: 6, label: 'Diagnosis', required: true, icon: <ShieldAlert className="w-4 h-4" /> },
    { num: 7, label: 'Medicines & Follow-up', icon: <Pill className="w-4 h-4" /> }
  ];
  const visibleSteps = steps;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Patient Header & Step Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col gap-4 pb-5 border-b border-slate-100">
          {/* Patient Selector */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-lg shrink-0">
              {selectedPatient ? selectedPatient.name.charAt(0) : 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="min-w-0 max-w-full font-bold text-slate-900 text-base bg-transparent border-b border-dashed border-slate-300 hover:border-sky-500 focus:outline-none cursor-pointer pr-4"
                >
                  {patients.map(p => (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.name} ({p.patient_id}) — {p.age}y {p.gender}
                    </option>
                  ))}
                </select>
                <Badge variant="primary" size="sm">Visit #{nextVisitNumber}</Badge>
              </div>
              {selectedPatient && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Phone: {selectedPatient.phone} • Blood Group: <span className="font-semibold text-slate-700">{selectedPatient.blood_group}</span> • Prev. Visits: {existingCases.length}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDischargeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold whitespace-nowrap transition-all shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-teal-600" />
              Multilingual Care Slip
            </button>

            <button
              type="button"
              onClick={() => handleSaveCase('Draft')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold whitespace-nowrap text-slate-700 transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSaveCase('Completed')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold whitespace-nowrap transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalize & Sign Case
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4">
          <p className="text-[11px] leading-relaxed text-slate-500 max-w-2xl">
            Save a draft at any time. For completion, enter the patient complaint and a provisional or final diagnosis; all other fields are optional.
          </p>
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Required: Symptoms + Diagnosis</span>
        </div>

        {/* Persistent Seven-Module Navigation */}
        <div className="sticky top-0 z-20 -mx-5 bg-white px-5 pt-4 pb-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Case progress
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {visibleSteps.findIndex(step => step.num === activeStep) + 1} of {visibleSteps.length}
            </span>
          </div>
          <div className="flex w-full items-center gap-2 overflow-x-auto pb-2">
          {visibleSteps.map((step, index) => {
            const isActive = activeStep === step.num;
            const isCompleted = visibleSteps.findIndex(item => item.num === activeStep) > index;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${step.num}: ${step.label}${step.required ? ' (required to complete)' : ' (optional)'}`}
                className={`flex min-w-[150px] items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-200'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                    isActive
                      ? 'bg-white text-sky-700'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className="min-w-0 truncate">{step.label}</span>
                {step.required && (
                  <span className={`shrink-0 text-[9px] uppercase tracking-wide ${isActive ? 'text-sky-100' : 'text-rose-600'}`}>
                    Required
                  </span>
                )}
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Multi-Lingual Voice Dictation & Scribe Studio Banner */}
      <VoiceInputButton
        variant="banner"
        onTranscript={handleVoiceTranscription}
        autoParse={true}
        onOpenFullScribe={() => setIsScribeModalOpen(true)}
      />

      {/* STEP 1: Chief Complaint & AI Smart Assistant */}
      {activeStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Complaint Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Primary Chief Complaint
                </h3>
                <span className="text-xs text-rose-500 font-semibold">* Mandatory Field</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Main Complaint / Presenting Symptom
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="e.g. Acute severe throbbing headache for 3 days with nausea and sensitivity to light..."
                    value={mainComplaint}
                    onChange={e => setMainComplaint(e.target.value)}
                    className="w-full p-3.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                  <div className="absolute right-3 bottom-3">
                    <VoiceInputButton
                      variant="icon"
                      onTranscript={handleVoiceTranscription}
                      autoParse={true}
                    />
                  </div>
                </div>
              </div>

              {/* Duration & Severity Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={durationValue}
                      onChange={e => setDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 p-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                    />
                    <select
                      value={durationUnit}
                      onChange={e => setDurationUnit(e.target.value as any)}
                      className="flex-1 p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                    >
                      <option value="Hours">Hours</option>
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                      <option value="Months">Months</option>
                      <option value="Years">Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity Scale</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                  >
                    <option value="Mild">Mild (1-3) — Tolerable</option>
                    <option value="Moderate">Moderate (4-6) — Interferes with work</option>
                    <option value="Severe">Severe (7-8) — Severe distress</option>
                    <option value="Critical">Critical (9-10) — Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as any)}
                    className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
                  >
                    <option value="Continuous">Continuous</option>
                    <option value="Intermittent">Intermittent (Comes & goes)</option>
                    <option value="Paroxysmal">Paroxysmal (Sudden spikes)</option>
                    <option value="Morning">Predominantly Morning</option>
                    <option value="Night">Predominantly Night</option>
                  </select>
                </div>
              </div>

              {/* Anatomical Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Anatomical Location / Radiation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unilateral right temporal, Epigastric, Retrosternal radiating to left arm..."
                  value={complaintLocation}
                  onChange={e => setComplaintLocation(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none"
                />
              </div>

              {/* Associated Symptoms Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Associated Symptoms
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {associatedSymptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold"
                    >
                      {sym}
                      <button
                        type="button"
                        onClick={() => setAssociatedSymptoms(prev => prev.filter((_, i) => i !== idx))}
                        className="text-sky-500 hover:text-sky-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add associated symptom (e.g. Vomiting, Chills, Photophobia)..."
                    value={newSymptomInput}
                    onChange={e => setNewSymptomInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newSymptomInput.trim()) {
                        e.preventDefault();
                        setAssociatedSymptoms(prev => [...prev, newSymptomInput.trim()]);
                        setNewSymptomInput('');
                      }
                    }}
                    className="flex-1 p-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSymptomInput.trim()) {
                        setAssociatedSymptoms(prev => [...prev, newSymptomInput.trim()]);
                        setNewSymptomInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Normal AI Assistant */}
          <div className="space-y-4">
            <AICaseAssistantView
              onSelectSymptomForCase={command => {
                if (command.trim()) setMainComplaint(command.trim());
              }}
            />
          </div>
        </div>
      )}

      {/* STEP 2: History of Present Illness (HPI) */}
      {activeStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              History of Present Illness (HPI)
            </h3>
            <span className="text-xs text-slate-500">Structured narrative breakdown</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Onset Mode</label>
              <select
                value={hpiOnset}
                onChange={e => setHpiOnset(e.target.value as any)}
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
              >
                <option value="Gradual">Gradual onset</option>
                <option value="Sudden">Sudden acute onset</option>
                <option value="Insidious">Insidious / Unnoticed progression</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Progression Trend</label>
              <select
                value={hpiProgression}
                onChange={e => setHpiProgression(e.target.value as any)}
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
              >
                <option value="Worsening">Progressively Worsening</option>
                <option value="Improving">Improving with time</option>
                <option value="Static">Static / Unchanged</option>
                <option value="Fluctuating">Fluctuating / Waxing & Waning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Character of Pain/Symptom</label>
              <input
                type="text"
                placeholder="e.g. Throbbing, Dull aching, Burning, Stabbing, Colicky..."
                value={hpiCharacter}
                onChange={e => setHpiCharacter(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Aggravating Factors</label>
              <input
                type="text"
                placeholder="e.g. Physical exertion, Screen time, Fatty food, Cold weather..."
                value={aggravatingFactors.join(', ')}
                onChange={e => setAggravatingFactors(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Relieving Factors</label>
              <input
                type="text"
                placeholder="e.g. Rest in dark room, Antacids, Postural changes, Heat compress..."
                value={relievingFactors.join(', ')}
                onChange={e => setRelievingFactors(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Previous Treatment & Medications Taken for Current Episode
            </label>
            <input
              type="text"
              placeholder="e.g. Took OTC Paracetamol 500mg with temporary relief; visited local clinic 2 days ago..."
              value={previousTreatment}
              onChange={e => setPreviousTreatment(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Detailed Chronological Clinical Narrative
              </label>
              <span className="text-[11px] text-slate-400">Auto-populated by AI answers & voice</span>
            </div>
            <textarea
              rows={4}
              placeholder="Detailed chronological history of patient's illness..."
              value={detailedNarrative}
              onChange={e => setDetailedNarrative(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none font-medium leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Past Medical, Medications, Allergies & Social */}
      {activeStep === 3 && (
        <div className="space-y-6">
          {/* Allergies & Adverse Reactions Shield */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Allergy & Drug Reaction History</h3>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNoKnownAllergies}
                  onChange={e => {
                    setHasNoKnownAllergies(e.target.checked);
                    if (e.target.checked) setAllergies([]);
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                No Known Drug Allergies (NKDA)
              </label>
            </div>

            {!hasNoKnownAllergies && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {allergies.map(a => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 p-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-xs"
                    >
                      <div>
                        <p className="font-bold text-rose-950">{a.allergen} ({a.type})</p>
                        <p className="text-[10px] text-rose-700">Reaction: {a.reaction} • {a.severity}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAllergies(prev => prev.filter(x => x.id !== a.id))}
                        className="text-rose-400 hover:text-rose-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    id="new-allergen-input"
                    placeholder="Allergen (e.g. Penicillin, Sulfa, Peanuts)"
                    className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                  <select
                    id="new-allergy-type"
                    className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Drug">Drug Allergy</option>
                    <option value="Food">Food Allergy</option>
                    <option value="Environmental">Environmental</option>
                  </select>
                  <input
                    type="text"
                    id="new-allergy-reaction"
                    placeholder="Reaction (e.g. Anaphylaxis, Rash, Bronchospasm)"
                    className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-allergen-input') as HTMLInputElement;
                      const type = document.getElementById('new-allergy-type') as HTMLSelectElement;
                      const reaction = document.getElementById('new-allergy-reaction') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        setAllergies(prev => [
                          ...prev,
                          {
                            id: `all-${Date.now()}`,
                            allergen: input.value.trim(),
                            type: type.value as any,
                            reaction: reaction.value.trim() || 'Allergic response',
                            severity: 'Moderate'
                          }
                        ]);
                        input.value = '';
                        reaction.value = '';
                      }
                    }}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    + Add Allergy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Past Comorbidities Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Past Medical Comorbidities & Chronic Conditions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'Diabetes Mellitus Type 2',
                'Essential Hypertension',
                'Bronchial Asthma / COPD',
                'Coronary Artery Disease (CAD)',
                'Hypothyroidism',
                'Chronic Kidney Disease (CKD)',
                'Dyslipidemia',
                'GERD / Peptic Ulcer',
                'Stroke / TIA',
                'Migraine / Seizure',
                'Tuberculosis',
                'Osteoarthritis'
              ].map(cond => {
                const isSelected = pastConditions.includes(cond);
                return (
                  <label
                    key={cond}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => {
                        if (e.target.checked) {
                          setPastConditions(prev => [...prev, cond]);
                        } else {
                          setPastConditions(prev => prev.filter(c => c !== cond));
                        }
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="truncate">{cond}</span>
                  </label>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Other Chronic Conditions</label>
                <input
                  type="text"
                  placeholder="Specify other medical conditions..."
                  value={customPastConditions}
                  onChange={e => setCustomPastConditions(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Previous Surgeries</label>
                <input
                  type="text"
                  placeholder="e.g. Appendectomy (2015), CABG (2020)..."
                  value={previousSurgeries}
                  onChange={e => setPreviousSurgeries(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Previous Hospitalizations</label>
                <input
                  type="text"
                  placeholder="e.g. Pneumonia (2023)..."
                  value={previousHospitalizations}
                  onChange={e => setPreviousHospitalizations(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Social & Personal Habits */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Personal, Social & Family History
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Pattern</label>
                <select
                  value={diet}
                  onChange={e => setDiet(e.target.value as any)}
                  className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Special / Diabetic">Special / Diabetic Diet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Smoking / Tobacco</label>
                <select
                  value={smokingStatus}
                  onChange={e => setSmokingStatus(e.target.value as any)}
                  className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Never">Never Smoked</option>
                  <option value="Former Smoker">Former Smoker</option>
                  <option value="Current Smoker">Current Smoker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alcohol Consumption</label>
                <select
                  value={alcoholStatus}
                  onChange={e => setAlcoholStatus(e.target.value as any)}
                  className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Never">Never / Teetotaler</option>
                  <option value="Occasional">Occasional / Social</option>
                  <option value="Regular / Heavy">Regular / Heavy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Occupation & Work Stress</label>
                <input
                  type="text"
                  placeholder="e.g. IT Engineer, Sedentary, Teacher..."
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Clinical Examination & Vitals Evaluation */}
      {activeStep === 4 && (
        <div className="space-y-6">
          {/* Vitals Input Cards with Live Scoring */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                Vital Signs & Anthropometry
              </h3>
              <span className="text-xs text-slate-500">Auto-evaluates BMI & BP risk stages</span>
            </div>

            {/* Critical Alert Warning Banner */}
            {evaluatedVitals.hasCriticalAlert && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 space-y-1 animate-pulse">
                <div className="font-bold flex items-center gap-1.5 text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  CRITICAL PHYSIOLOGICAL ALERTS DETECTED:
                </div>
                <ul className="list-disc pl-5 font-semibold space-y-0.5">
                  {evaluatedVitals.criticalAlerts.map((ca, idx) => (
                    <li key={idx}>{ca}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Temperature */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Temp (°F)</p>
                <input
                  type="number"
                  step="0.1"
                  value={tempF}
                  onChange={e => setTempF(parseFloat(e.target.value) || 98.6)}
                  className="w-full text-base font-extrabold text-slate-900 bg-transparent outline-none"
                />
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${evaluatedVitals.feverBadgeColor}`}>
                  {evaluatedVitals.feverClassification}
                </span>
              </div>

              {/* Blood Pressure (Systolic / Diastolic) */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 col-span-2 sm:col-span-2">
                <p className="text-[11px] font-bold text-slate-500">Blood Pressure (mmHg)</p>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={bpSys}
                    onChange={e => setBpSys(parseInt(e.target.value) || 120)}
                    className="w-16 text-base font-extrabold text-slate-900 bg-transparent outline-none text-right"
                  />
                  <span className="text-slate-400 font-bold">/</span>
                  <input
                    type="number"
                    value={bpDia}
                    onChange={e => setBpDia(parseInt(e.target.value) || 80)}
                    className="w-16 text-base font-extrabold text-slate-900 bg-transparent outline-none"
                  />
                </div>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${evaluatedVitals.bpBadgeColor}`}>
                  {evaluatedVitals.bpClassification}
                </span>
              </div>

              {/* Pulse Rate */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Pulse (bpm)</p>
                <input
                  type="number"
                  value={pulseRate}
                  onChange={e => setPulseRate(parseInt(e.target.value) || 72)}
                  className="w-full text-base font-extrabold text-slate-900 bg-transparent outline-none"
                />
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${evaluatedVitals.pulseBadgeColor}`}>
                  {evaluatedVitals.pulseClassification.split(' ')[0]}
                </span>
              </div>

              {/* SpO2 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-500">SpO₂ (%)</p>
                <input
                  type="number"
                  value={spo2}
                  onChange={e => setSpo2(parseInt(e.target.value) || 99)}
                  className="w-full text-base font-extrabold text-slate-900 bg-transparent outline-none"
                />
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${evaluatedVitals.spo2BadgeColor}`}>
                  {evaluatedVitals.spo2Classification.split(' ')[0]}
                </span>
              </div>

              {/* Height & Weight & BMI */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Height / Weight</p>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(parseInt(e.target.value) || 170)}
                    className="w-12 bg-transparent outline-none"
                  />
                  <span>cm</span>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(parseInt(e.target.value) || 70)}
                    className="w-12 bg-transparent outline-none"
                  />
                  <span>kg</span>
                </div>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${evaluatedVitals.bmiBadgeColor}`}>
                  BMI {evaluatedVitals.bmi} ({evaluatedVitals.bmiCategory.split(' ')[0]})
                </span>
              </div>

              {/* Resp Rate */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Resp Rate (/min)</p>
                <input
                  type="number"
                  value={respRate}
                  onChange={e => setRespRate(parseInt(e.target.value) || 16)}
                  className="w-full text-base font-extrabold text-slate-900 bg-transparent outline-none"
                />
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Normal
                </span>
              </div>
            </div>
          </div>

          {/* General Physical & Systemic Exam */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              General Physical & Systemic Examination
            </h3>

            {/* PICLE Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                PICLE Signs (Pallor, Icterus, Cyanosis, Clubbing, Lymphadenopathy, Edema)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { label: 'Pallor', val: pallor, set: setPallor },
                  { label: 'Icterus (Jaundice)', val: icterus, set: setIcterus },
                  { label: 'Cyanosis', val: cyanosis, set: setCyanosis },
                  { label: 'Clubbing', val: clubbing, set: setClubbing },
                  { label: 'Lymphadenopathy', val: lymphadenopathy, set: setLymphadenopathy },
                  { label: 'Pedal Edema', val: edema, set: setEdema }
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.set(!item.val)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      item.val
                        ? 'bg-rose-50 border-rose-300 text-rose-800 ring-1 ring-rose-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.val ? '✓ ' : '— '} {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Systemic Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                  Respiratory System (RS)
                </p>
                <textarea
                  rows={2}
                  value={rsNotes}
                  onChange={e => setRsNotes(e.target.value)}
                  className="w-full p-2 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  Cardiovascular System (CVS)
                </p>
                <textarea
                  rows={2}
                  value={cvsS1S2}
                  onChange={e => setCvsS1S2(e.target.value)}
                  className="w-full p-2 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800">Central Nervous System (CNS)</p>
                <textarea
                  rows={2}
                  value={cnsNotes}
                  onChange={e => setCnsNotes(e.target.value)}
                  className="w-full p-2 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800">Gastrointestinal & Abdomen (GIT)</p>
                <textarea
                  rows={2}
                  value={gitNotes}
                  onChange={e => setGitNotes(e.target.value)}
                  className="w-full p-2 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Investigations & Lab Tests */}
      {activeStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                Diagnostic Investigations & Laboratory Reports
              </h3>
              <p className="text-xs text-slate-500">Order lab panels, upload PDF/image reports, or scan OCR results</p>
            </div>

            <button
              type="button"
              onClick={() => setIsLabScannerModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white text-xs font-black shadow-sm shadow-teal-200 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>🔬 AI Scan & Interpret Lab Report</span>
            </button>
          </div>

          {/* AI Scanner Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  Smart Diagnostic OCR & Panic Value Highlighter
                  <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-extrabold uppercase">
                    AI Enabled
                  </span>
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Upload CBC, LFT, KFT, Cardiac Troponin, or Dengue reports to automatically identify critical out-of-range analytes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLabScannerModalOpen(true)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-teal-300 text-teal-800 text-xs font-bold rounded-xl shadow-2xs transition-all shrink-0"
            >
              Open Lab Scanner
            </button>
          </div>

          {/* Quick Popular Test Ordering Buttons */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Quick Order Standard Lab Panels:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Complete Blood Count (CBC)', cat: 'Blood / Hematology' as const },
                { name: '12-Lead Electrocardiogram (ECG)', cat: 'Cardiology (ECG/Echo)' as const },
                { name: 'Chest X-Ray PA View', cat: 'Imaging (X-Ray/CT/MRI)' as const },
                { name: 'Liver Function Tests (LFT)', cat: 'Biochemistry' as const },
                { name: 'Kidney Function Tests (KFT / Creatinine)', cat: 'Biochemistry' as const },
                { name: 'Lipid Profile & HbA1c', cat: 'Biochemistry' as const },
                { name: 'Urine Routine & Microscopy', cat: 'Urine' as const },
                { name: 'Ultrasound Whole Abdomen (USG)', cat: 'Imaging (X-Ray/CT/MRI)' as const },
                { name: 'Dengue NS1 Antigen & IgM', cat: 'Blood / Hematology' as const }
              ].map(t => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => handleAddInvestigation(t.name, t.cat)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-xs font-semibold text-slate-700 transition-colors"
                >
                  + {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Test Input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="Custom Test Name (e.g. MRI Brain, Serum Amylase)..."
              value={newTestName}
              onChange={e => setNewTestName(e.target.value)}
              className="p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none"
            />
            <select
              value={newTestCategory}
              onChange={e => setNewTestCategory(e.target.value as any)}
              className="p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none"
            >
              <option value="Blood / Hematology">Blood / Hematology</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Urine">Urine & Body Fluids</option>
              <option value="Imaging (X-Ray/CT/MRI)">Imaging (X-Ray/CT/MRI)</option>
              <option value="Cardiology (ECG/Echo)">Cardiology (ECG/Echo)</option>
            </select>
            <button
              type="button"
              onClick={() => handleAddInvestigation(newTestName, newTestCategory)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Add Investigation
            </button>
          </div>

          {/* Table of Ordered Investigations */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-700">
              Ordered Investigations ({investigations.length})
            </p>

            {investigations.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                No diagnostic investigations added yet. Select from the quick panels above or enter a custom test.
              </div>
            ) : (
              <div className="space-y-2">
                {investigations.map((inv, idx) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{inv.test_name}</span>
                        <Badge variant="neutral" size="sm">{inv.category}</Badge>
                        <Badge variant={inv.status === 'Result Ready' ? 'success' : 'warning'} size="sm">
                          {inv.status}
                        </Badge>
                      </div>
                      {inv.result_value && (
                        <p className="text-xs text-slate-600 mt-1">
                          <span className="font-semibold">Result:</span> {inv.result_value}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter test result / value..."
                        value={inv.result_value || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setInvestigations(prev =>
                            prev.map(item =>
                              item.id === inv.id
                                ? { ...item, result_value: val, status: val ? 'Result Ready' : 'Ordered' }
                                : item
                            )
                          );
                        }}
                        className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none w-48"
                      />
                      <button
                        type="button"
                        onClick={() => setInvestigations(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 6: Diagnosis & Clinical Decision */}
      {activeStep === 6 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-600" />
              Diagnosis & Clinical Decision Making
            </h3>
            <span className="text-xs text-slate-500">Provisional, Final ICD-10 & Differential</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Provisional Diagnosis (Working Impression)
              </label>
              <input
                type="text"
                placeholder="e.g. Acute Tension-Type Headache / Rule out Migraine..."
                value={provisionalDiagnosis}
                onChange={e => setProvisionalDiagnosis(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Final Confirmed Diagnosis & ICD-10 Code
              </label>
              <input
                type="text"
                placeholder="e.g. Chronic Tension Headache (G44.2) with Essential HTN (I10)..."
                value={finalDiagnosis}
                onChange={e => setFinalDiagnosis(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none font-bold text-sky-900"
              />
            </div>
          </div>

          {/* Differential Diagnoses */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Differential Diagnoses (Differentials considered)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {differentials.map((diff, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold"
                >
                  {diff}
                  <button
                    type="button"
                    onClick={() => setDifferentials(prev => prev.filter((_, i) => i !== idx))}
                    className="text-amber-500 hover:text-amber-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add differential diagnosis..."
                value={newDiffInput}
                onChange={e => setNewDiffInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newDiffInput.trim()) {
                    e.preventDefault();
                    setDifferentials(prev => [...prev, newDiffInput.trim()]);
                    setNewDiffInput('');
                  }
                }}
                className="flex-1 p-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newDiffInput.trim()) {
                    setDifferentials(prev => [...prev, newDiffInput.trim()]);
                    setNewDiffInput('');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
              >
                + Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Physician Clinical Notes & Observations
            </label>
            <textarea
              rows={3}
              placeholder="Additional physician observations, risk assessment, explanation given to patient..."
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none font-medium"
            />
          </div>
        </div>
      )}

      {/* STEP 7: Prescription & Follow-up Scheduler */}
      {activeStep === 7 && (
        <div className="space-y-6">
          {/* Prescription Writer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Prescription (Rx) & Safety Engine</h3>
                  <p className="text-[11px] text-slate-500">Auto-suggested dosages with allergy conflict & drug-drug interaction screening</p>
                </div>
              </div>
              <Badge variant="primary" size="sm">{prescriptions.length} Medications</Badge>
            </div>

            {/* Drug-Drug Interaction & Allergy Alerts */}
            {(() => {
              const interactions = checkDrugInteractions(prescriptions);
              const allergyAlerts = checkAllergyConflict(prescriptions, allergies);

              if (!interactions.length && !allergyAlerts.length) return null;

              return (
                <div className="space-y-2 p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs">
                  {allergyAlerts.map((w, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 font-bold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                      <div>{w}</div>
                    </div>
                  ))}

                  {interactions.map((inter, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-amber-950">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        Interaction Alert: {inter.drugA} + {inter.drugB} ({inter.severity} Risk)
                      </p>
                      <p className="text-[11px] text-amber-800">{inter.description}</p>
                      <p className="text-[11px] font-semibold text-teal-800">Recommendation: {inter.clinicalRecommendation}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Drug Search Catalog */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Search Verified Drug Database (Type medicine name, brand, or symptom)
              </label>
              <input
                type="text"
                placeholder="Search Dolo, Pan 40, Augmentin, Amlodipine, Montelukast, Azithromycin..."
                value={drugSearchQuery}
                onChange={e => setDrugSearchQuery(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 outline-none font-medium"
              />

              {/* Quick Drug Suggestions */}
              {drugSearchQuery.trim() && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 max-h-60 overflow-y-auto">
                  {DRUG_CATALOG.filter(
                    d =>
                      d.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                      d.generic_name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                      d.commonIndications.some(i => i.toLowerCase().includes(drugSearchQuery.toLowerCase()))
                  ).map(drug => (
                    <button
                      key={drug.id}
                      type="button"
                      onClick={() => handleAddDrug(drug)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-sky-700">{drug.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{drug.form}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{drug.generic_name}</p>
                      <p className="text-[10px] text-teal-700 font-bold mt-1">Default: {drug.defaultFrequency} • {drug.defaultDurationValue} {drug.defaultDurationUnit}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prescribed Items Table */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700">Prescribed Medicines ({prescriptions.length})</p>

              {prescriptions.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                  No medications prescribed yet. Search for a medicine above to add.
                </div>
              ) : (
                <div className="space-y-2">
                  {prescriptions.map((rx, idx) => (
                    <div
                      key={rx.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-6 gap-3 items-center"
                    >
                      <div className="sm:col-span-2">
                        <p className="font-bold text-xs text-slate-900">{rx.medicine_name}</p>
                        <p className="text-[10px] text-slate-500">{rx.generic_name} • {rx.form}</p>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">Frequency</label>
                        <input
                          type="text"
                          value={rx.frequency}
                          onChange={e => {
                            const val = e.target.value;
                            setPrescriptions(prev => prev.map((item, i) => (i === idx ? { ...item, frequency: val } : item)));
                          }}
                          className="w-full p-1 text-xs bg-slate-50 border border-slate-200 rounded font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">Duration</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={rx.duration_value}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 1;
                              setPrescriptions(prev => prev.map((item, i) => (i === idx ? { ...item, duration_value: val } : item)));
                            }}
                            className="w-12 p-1 text-xs bg-slate-50 border border-slate-200 rounded font-semibold"
                          />
                          <span className="text-[11px] text-slate-500 self-center">{rx.duration_unit}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">Instructions</label>
                        <select
                          value={rx.instruction}
                          onChange={e => {
                            const val = e.target.value as any;
                            setPrescriptions(prev => prev.map((item, i) => (i === idx ? { ...item, instruction: val } : item)));
                          }}
                          className="w-full p-1 text-xs bg-slate-50 border border-slate-200 rounded font-semibold"
                        >
                          <option value="After Food">After Food</option>
                          <option value="Before Food">Before Food</option>
                          <option value="With Food">With Food</option>
                          <option value="Bedtime">Bedtime</option>
                          <option value="As directed">As directed</option>
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setPrescriptions(prev => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Follow-up & Discharge Instructions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Follow-up & Discharge Advice
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Follow-up Date</label>
                <input
                  type="date"
                  value={followupDate}
                  onChange={e => setFollowupDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Follow-up</label>
                <input
                  type="text"
                  placeholder="e.g. Review BP diary, symptom resolution, evaluate lab results..."
                  value={followupReason}
                  onChange={e => setFollowupReason(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Lifestyle & Emergency Warning Instructions
              </label>
              <textarea
                rows={2}
                value={followupInstructions}
                onChange={e => setFollowupInstructions(e.target.value)}
                placeholder="Instructions on hydration, diet, red flag warning triggers for immediate ER visit..."
                className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          disabled={visibleSteps.findIndex(step => step.num === activeStep) <= 0}
          onClick={() => {
            const currentIndex = visibleSteps.findIndex(step => step.num === activeStep);
            setActiveStep(visibleSteps[Math.max(0, currentIndex - 1)].num);
          }}
          aria-label="Go to previous case-taking step"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          <span className="font-bold text-slate-700">{steps[activeStep - 1].label}</span>
          <span className="block text-[10px] mt-0.5">Step {visibleSteps.findIndex(step => step.num === activeStep) + 1} of {visibleSteps.length}</span>
        </div>

        {visibleSteps.findIndex(step => step.num === activeStep) < visibleSteps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              const currentIndex = visibleSteps.findIndex(step => step.num === activeStep);
              setActiveStep(visibleSteps[Math.min(visibleSteps.length - 1, currentIndex + 1)].num);
            }}
            aria-label={`Go to next case-taking step: ${steps[activeStep]?.label || 'next'}`}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-xs"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSaveCase('Completed')}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete & Sign Case Record
          </button>
        )}
      </div>

      {/* AI Multi-Lingual Clinical Voice Scribe Studio Modal */}
      <ClinicalVoiceScribeModal
        isOpen={isScribeModalOpen}
        onClose={() => setIsScribeModalOpen(false)}
        onApplyToCase={handleApplyVoiceData}
      />

      {/* AI Diagnostic Lab Report Scanner & OCR Modal */}
      <LabReportScannerModal
        isOpen={isLabScannerModalOpen}
        onClose={() => setIsLabScannerModalOpen(false)}
        patientName={selectedPatient?.name}
        patientGender={selectedPatient?.gender === 'Female' ? 'Female' : 'Male'}
        onImportInvestigations={handleImportLabInvestigations}
      />

      {/* AI Multilingual Patient Discharge & Rx Modal */}
      <MultilingualDischargeModal
        isOpen={isDischargeModalOpen}
        onClose={() => setIsDischargeModalOpen(false)}
        patient={selectedPatient}
        hospitalInfo={hospitalInfo}
        directDiagnosis={provisionalDiagnosis || finalDiagnosis || 'Clinical Assessment'}
        directMedications={prescriptions.map(p => ({
          name: p.medicine_name,
          dosage: p.dosage || p.strength,
          frequency: p.frequency,
          duration: `${p.duration_value} ${p.duration_unit}`,
          instructions: p.instruction || 'After Food'
        }))}
        directPatientName={selectedPatient?.name}
        directPatientAge={selectedPatient?.age}
        directPatientGender={selectedPatient?.gender}
        directFollowUpDate={followupDate}
      />
    </div>
  );
};

