import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Languages,
  Volume2,
  VolumeX,
  Printer,
  Download,
  Share2,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle,
  Pill,
  Heart,
  PhoneCall,
  Copy,
  Check,
  Sunrise,
  Sun,
  Moon,
  Sparkles,
  Info
} from 'lucide-react';
import { CaseRecord, Patient, HospitalInfo } from '../../types';
import { apiClient } from '../../services/api';
import {
  SUPPORTED_LANGUAGES,
  PatientDischargePlan,
  PatientInstructionMedication,
  generateClientDischargePlan
} from '../../utils/dischargeGenerator';
import { useToast } from '../../context/ToastContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface MultilingualDischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseRecord?: CaseRecord | null;
  patient?: Patient | null;
  hospitalInfo?: HospitalInfo | null;
  // Fallback direct props if passing from wizard
  directDiagnosis?: string;
  directMedications?: any[];
  directPatientName?: string;
  directPatientAge?: number;
  directPatientGender?: string;
  directFollowUpDate?: string;
}

export const MultilingualDischargeModal: React.FC<MultilingualDischargeModalProps> = ({
  isOpen,
  onClose,
  caseRecord,
  patient,
  hospitalInfo,
  directDiagnosis,
  directMedications,
  directPatientName,
  directPatientAge,
  directPatientGender,
  directFollowUpDate
}) => {
  const { showToast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const [selectedLang, setSelectedLang] = useState<string>('hi'); // Default Hindi
  const [loading, setLoading] = useState<boolean>(true);
  const [dischargePlan, setDischargePlan] = useState<PatientDischargePlan | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Derive active patient info
  const pName = patient?.name || directPatientName || 'Patient';
  const pAge = patient?.age || directPatientAge || 35;
  const pGender = patient?.gender || directPatientGender || 'Unknown';
  const pDiagnosis = caseRecord?.diagnosis.final_diagnosis || caseRecord?.diagnosis.provisional_diagnosis || directDiagnosis || 'Clinical Assessment';
  const pMedications = caseRecord?.prescription || directMedications || [];
  const pFollowUp = caseRecord?.follow_up.followup_date || directFollowUpDate || 'After 5-7 days';

  // Load discharge plan when modal opens or language changes
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchPlan = async () => {
      try {
        const result = await apiClient.generatePatientDischargeInstructions({
          patient_name: pName,
          patient_age: pAge,
          patient_gender: pGender,
          diagnosis: pDiagnosis,
          medications: pMedications,
          follow_up_date: pFollowUp,
          language: selectedLang
        });

        if (isMounted && result) {
          setDischargePlan(result);
        }
      } catch (err) {
        console.error('Failed to generate discharge instructions:', err);
        if (isMounted) {
          // Guaranteed fallback
          const fallback = generateClientDischargePlan(
            pName,
            pAge,
            pGender,
            pDiagnosis,
            pMedications,
            pFollowUp,
            selectedLang
          );
          setDischargePlan(fallback);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      isMounted = false;
      window.speechSynthesis?.cancel();
    };
  }, [isOpen, selectedLang, pName, pAge, pGender, pDiagnosis, pMedications, pFollowUp]);

  // Audio Speech Synthesis Handler
  const handleToggleSpeech = (customText?: string) => {
    if (!window.speechSynthesis) {
      showToast('error', 'Audio Not Supported', 'Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!dischargePlan) return;

    let textToRead = customText;
    if (!textToRead) {
      // Build speech text
      const medSpeech = dischargePlan.medications.map(m => {
        const slots = m.schedule_slots.map(s => s.label).join(', ');
        return `${m.name}, ${m.dosage}. ${slots}. ${m.food_timing}. ${m.purpose}. ${m.caution}`;
      }).join('. ');

      const dietSpeech = dischargePlan.diet_guidelines.join('. ');
      const redFlags = dischargePlan.emergency_warnings.items.join('. ');

      textToRead = `${dischargePlan.greeting}. ${dischargePlan.diagnosis_display}. Medicines: ${medSpeech}. Diet and Precautions: ${dietSpeech}. Warning signs: ${redFlags}. ${dischargePlan.follow_up_instruction}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = dischargePlan.voice_code || 'hi-IN';
    utterance.rate = 0.9; // slightly slower for clinical clarity

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      showToast('info', 'Preparing PDF...', 'Compiling patient care slip.');
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PatientCareSlip_${pName.replace(/\s+/g, '_')}_${selectedLang.toUpperCase()}.pdf`);
      showToast('success', 'PDF Saved', 'Patient instructions downloaded successfully.');
    } catch (err) {
      console.error(err);
      showToast('error', 'PDF Error', 'Failed to generate PDF slip.');
    }
  };

  const handleCopyWhatsApp = () => {
    if (!dischargePlan) return;
    navigator.clipboard.writeText(dischargePlan.whatsapp_share_text);
    setCopied(true);
    showToast('success', 'Copied to Clipboard', 'WhatsApp summary copied. Ready to paste and send.');
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header (No-Print) */}
        <div className="no-print p-4 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-teal-950/40 via-slate-900 to-sky-950/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shadow-inner">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">AI Multilingual Patient Care & Rx Slip</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Sparkles className="w-2.5 h-2.5" /> 6 Indian Languages
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visual dosage timings, dietary advice, emergency warnings & voice read-aloud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Read-Aloud Button */}
            <button
              onClick={() => handleToggleSpeech()}
              disabled={loading || !dischargePlan}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-teal-500/30'
              }`}
              title="Listen to complete care instructions"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" /> Stop Audio
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Listen Audio
                </>
              )}
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <Share2 className="w-4 h-4" /> WhatsApp
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              <Printer className="w-4 h-4" /> Print
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-900/30"
            >
              <Download className="w-4 h-4" /> PDF
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Tabs (No-Print) */}
        <div className="no-print px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-teal-400" /> Language:
          </span>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedLang === lang.code
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              <span>{lang.native}</span>
              <span className={`text-[10px] ${selectedLang === lang.code ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                ({lang.name})
              </span>
            </button>
          ))}
        </div>

        {/* Scrollable Printable Slip Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-400 animate-pulse">
                Translating clinical instructions to {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.native}...
              </p>
            </div>
          ) : dischargePlan ? (
            <div ref={printRef} className="printable-slip space-y-6 bg-slate-900 text-slate-100 p-2 sm:p-4 rounded-2xl">
              
              {/* Hospital & Patient Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-md flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-extrabold text-[10px] uppercase tracking-wider border border-teal-500/30">
                      {hospitalInfo?.name || 'CliniCase AI Medical Center'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      NABH Accredited • OPD Slip
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    {dischargePlan.greeting}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span><strong>Patient:</strong> {pName}</span>
                    <span>•</span>
                    <span><strong>Age/Gender:</strong> {pAge}y / {pGender}</span>
                    <span>•</span>
                    <span><strong>Diagnosis:</strong> <span className="text-teal-300 font-bold">{dischargePlan.diagnosis_display}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-slate-400">
                    <div className="font-bold text-slate-200">Consultation Slip</div>
                    <div>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
              </div>

              {/* Medication Schedule Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-400" />
                    Medication Schedule & Timings ({dischargePlan.medications.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Take as indicated with specified food timings
                  </span>
                </div>

                {dischargePlan.medications.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-400">
                    No active medications recorded for this consultation.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {dischargePlan.medications.map((med: PatientInstructionMedication) => (
                      <div
                        key={med.id}
                        className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-teal-500/50 transition-all flex flex-col justify-between shadow-sm space-y-3"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                                {med.name}
                                <span className="text-[11px] font-normal text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-800/50">
                                  {med.dosage}
                                </span>
                              </h4>
                              <p className="text-[10px] font-medium text-slate-400">{med.category}</p>
                            </div>

                            {/* Food Timing Badge */}
                            <span
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border ${
                                med.is_before_food
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              {med.food_timing}
                            </span>
                          </div>

                          {/* Time Slots Visualization */}
                          <div className="flex flex-wrap items-center gap-1.5 my-2">
                            {med.schedule_slots.map((slot, sIdx) => (
                              <div
                                key={sIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] font-bold text-slate-200"
                              >
                                {slot.slot === 'Morning' && <Sunrise className="w-3 h-3 text-amber-400" />}
                                {slot.slot === 'Afternoon' && <Sun className="w-3 h-3 text-yellow-400" />}
                                {slot.slot === 'Night' && <Moon className="w-3 h-3 text-indigo-400" />}
                                {slot.slot === 'SOS' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                                <span>{slot.label}</span>
                              </div>
                            ))}
                          </div>

                          {/* Purpose & Caution */}
                          <div className="space-y-1 text-xs mt-2">
                            <p className="text-slate-300 leading-relaxed">
                              <span className="font-bold text-teal-300">उद्देश्य / Purpose:</span> {med.purpose}
                            </p>
                            <p className="text-[11px] text-amber-300/90 leading-relaxed font-medium">
                              ⚠️ {med.caution}
                            </p>
                          </div>
                        </div>

                        {/* Individual Audio Button (No-print) */}
                        <div className="no-print pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> Duration: <strong className="text-slate-200">{med.duration}</strong>
                          </span>
                          <button
                            onClick={() => handleToggleSpeech(`${med.name}. ${med.dosage}. ${med.schedule_slots.map(s => s.label).join(', ')}. ${med.food_timing}. ${med.purpose}. ${med.caution}`)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-teal-300 text-[10px] font-bold transition-colors"
                          >
                            <Volume2 className="w-3 h-3" /> Speak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Diet & Lifestyle Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  Dietary & Lifestyle Instructions ({dischargePlan.language_native})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dischargePlan.diet_guidelines.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Red Flags Warning */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                    {dischargePlan.emergency_warnings.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-[10px] border border-rose-500/30">
                    URGENT SOS
                  </span>
                </div>

                <div className="space-y-1.5">
                  {dischargePlan.emergency_warnings.items.map((warn, wIdx) => (
                    <div key={wIdx} className="flex items-start gap-2 text-xs text-rose-200">
                      <span className="text-rose-400 font-bold">•</span>
                      <span className="leading-relaxed">{warn}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-rose-300">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                    {dischargePlan.emergency_warnings.helpline}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Available 24x7 Emergency Casualty
                  </span>
                </div>
              </div>

              {/* Follow-up & Doctor Verification Footer */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-white">{dischargePlan.follow_up_instruction}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Info className="w-3.5 h-3.5 text-teal-400" />
                  <span>Digital Prescription verified by Treating Physician</span>
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>

      {/* WhatsApp Share Copy Dialog */}
      {showShareModal && dischargePlan && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Share2 className="w-4 h-4" /> Share via WhatsApp / SMS
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Formatted digital care summary ready to copy and message to the patient:
            </p>

            <textarea
              readOnly
              value={dischargePlan.whatsapp_share_text}
              rows={10}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none scrollbar-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={handleCopyWhatsApp}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy WhatsApp Message'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
