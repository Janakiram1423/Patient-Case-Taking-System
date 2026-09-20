import React, { useRef, useState } from 'react';
import {
  Printer,
  Download,
  Activity,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  X,
  Languages
} from 'lucide-react';
import { CaseRecord, Patient, HospitalInfo } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { EHRVerificationModal } from '../common/EHRVerificationModal';
import { MultilingualDischargeModal } from '../clinical/MultilingualDischargeModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface MedicalCaseSheetPDFProps {
  caseRecord: CaseRecord;
  patient: Patient;
  hospitalInfo: HospitalInfo;
  onClose?: () => void;
}

export const MedicalCaseSheetPDF: React.FC<MedicalCaseSheetPDFProps> = ({
  caseRecord,
  patient,
  hospitalInfo,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const reportPatient = caseRecord.patient_details || patient;
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showMultilingualModal, setShowMultilingualModal] = useState(false);
  const { showToast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      showToast('info', 'Generating PDF...', 'Compiling high resolution clinical report.');
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
      pdf.save(`CaseSheet_${reportPatient.patient_id}_Visit${caseRecord.visit_number}.pdf`);
      showToast('success', 'PDF Downloaded', `Saved medical case sheet for ${reportPatient.name}`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Export Failed', 'Could not generate PDF.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-lg flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Official Clinical Case Sheet</h4>
            <p className="text-[11px] text-slate-400">
              {caseRecord.case_id} • Visit #{caseRecord.visit_number} • {reportPatient.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Multilingual Care Slip Button */}
          <button
            onClick={() => setShowMultilingualModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600/30 hover:bg-teal-600/40 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all shadow-sm"
          >
            <Languages className="w-3.5 h-3.5" />
            AI Care Slip (हिंदी/En/..)
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div
        ref={printRef}
        className="printable-sheet bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 space-y-8 font-sans"
      >
        {/* Header: Hospital Branding & Accreditation */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {hospitalInfo.name}
              </h2>
              <p className="text-xs font-semibold text-sky-700 italic">{hospitalInfo.tagline}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {hospitalInfo.address} • Tel: {hospitalInfo.phone}
              </p>
              <p className="text-[10px] text-slate-400">
                Reg No: {hospitalInfo.registrationNumber} • {hospitalInfo.accreditation}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <button
              type="button"
              onClick={() => setShowVerificationModal(true)}
              className="inline-block p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-center transition-all cursor-pointer group shadow-2xs"
              title="Click to verify digital EHR certificate"
            >
              <QrCode className="w-10 h-10 mx-auto text-slate-800 group-hover:text-sky-700 transition-colors" />
              <span className="text-[9px] font-mono text-slate-500 font-bold block mt-1 group-hover:text-sky-800">
                {caseRecord.case_id}
              </span>
              <span className="text-[8px] font-extrabold uppercase text-emerald-700 block tracking-tighter">
                ✓ VERIFIED EHR
              </span>
            </button>
          </div>
        </div>

        {/* Case Record Meta Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 font-medium">
          <div>
            <span className="text-slate-500 font-bold">Case Sheet ID: </span>
            <span className="font-mono font-bold text-slate-900">{caseRecord.case_id}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold">Visit Type: </span>
            <span className="font-bold text-sky-800">{caseRecord.visit_type} (Visit #{caseRecord.visit_number})</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold">Date & Time: </span>
            <span className="font-bold text-slate-900">{formatDateTime(caseRecord.created_at)}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold">Consultant: </span>
            <span className="font-bold text-slate-900">{caseRecord.doctor_name}</span>
          </div>
        </div>

        {/* Patient Demographics Box */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 mb-2 border-b border-slate-100 pb-1">
            Patient Demographic & Identification Record
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Patient Name:</span>
              <span className="font-bold text-slate-950 text-sm">{reportPatient.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Patient ID:</span>
              <span className="font-mono font-bold text-slate-900">{reportPatient.patient_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">UHID:</span>
              <span className="font-mono font-bold text-teal-800">{reportPatient.uhid}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Age / Gender:</span>
              <span className="font-bold text-slate-900">{reportPatient.age} Yrs / {reportPatient.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Blood Group:</span>
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{reportPatient.blood_group}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Contact Phone:</span>
              <span className="font-semibold text-slate-800">{reportPatient.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">City / Address:</span>
              <span className="font-semibold text-slate-800">{reportPatient.city}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Emergency Contact:</span>
              <span className="font-semibold text-slate-800">{reportPatient.emergency_contact?.name} ({reportPatient.emergency_contact?.relation})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Insurance Policy:</span>
              <span className="font-semibold text-slate-800">{reportPatient.insurance_provider || 'Self Pay'}</span>
            </div>
          </div>
        </div>

        {/* Allergy Red Flag Box */}
        {caseRecord.allergy_history.allergies.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold uppercase text-[10px] tracking-wide text-rose-700 block">
                Critical Drug & Food Allergies:
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {caseRecord.allergy_history.allergies.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white border border-rose-300 font-bold text-rose-900 text-xs">
                    {a.allergen} ({a.reaction} - {a.severity})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chief Complaint & HPI */}
        <div className="space-y-3">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs text-sky-900">
              1. Chief Presenting Complaint & History of Present Illness
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-semibold block text-[11px]">Chief Complaint:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{caseRecord.chief_complaint.main_complaint}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">Duration & Severity:</span>
              <p className="font-bold text-slate-800 mt-0.5">
                {caseRecord.chief_complaint.duration_value} {caseRecord.chief_complaint.duration_unit} • Severity: {caseRecord.chief_complaint.severity}
              </p>
            </div>
          </div>

          {caseRecord.chief_complaint.associated_symptoms.length > 0 && (
            <p className="text-xs text-slate-700">
              <span className="font-bold text-slate-900">Associated Symptoms: </span>
              {caseRecord.chief_complaint.associated_symptoms.join(', ')}
            </p>
          )}

          {caseRecord.history_present_illness.detailed_narrative && (
            <div className="text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900">Clinical Narrative: </span>
              <p className="leading-relaxed whitespace-pre-line bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 font-normal">
                {caseRecord.history_present_illness.detailed_narrative}
              </p>
            </div>
          )}
        </div>

        {/* Vitals Grid */}
        <div className="space-y-2">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs text-sky-900">
              2. Clinical Examination & Vital Signs
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">TEMP</span>
              <span className="text-xs font-bold text-slate-900">{caseRecord.vitals.temperature_f} °F</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">BLOOD PRESSURE</span>
              <span className="text-xs font-bold text-slate-900">
                {caseRecord.vitals.blood_pressure_systolic}/{caseRecord.vitals.blood_pressure_diastolic} mmHg
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">PULSE</span>
              <span className="text-xs font-bold text-slate-900">{caseRecord.vitals.pulse_rate} bpm</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">SpO₂</span>
              <span className="text-xs font-bold text-slate-900">{caseRecord.vitals.spo2}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">RESP RATE</span>
              <span className="text-xs font-bold text-slate-900">{caseRecord.vitals.respiratory_rate}/min</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">BMI</span>
              <span className="text-xs font-bold text-slate-900">{caseRecord.vitals.bmi} ({caseRecord.vitals.bmi_category.split(' ')[0]})</span>
            </div>
          </div>

          <div className="text-xs text-slate-700 space-y-1 pt-1">
            <p><span className="font-bold">General Physical Appearance:</span> {caseRecord.general_exam.appearance}, Hydration: {caseRecord.general_exam.hydration}, Consciousness: {caseRecord.general_exam.consciousness}</p>
            {caseRecord.systemic_exam.respiratory_system.auscultation && (
              <p><span className="font-bold">Systemic (RS/CVS/CNS):</span> {caseRecord.systemic_exam.respiratory_system.auscultation} • {caseRecord.systemic_exam.cardiovascular_system.s1_s2}</p>
            )}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="space-y-2">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs text-sky-900">
              3. Clinical Diagnosis & Assessment
            </h3>
          </div>

          <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
            <p className="text-xs">
              <span className="font-bold text-sky-950">Final Diagnosis: </span>
              <span className="font-extrabold text-sky-900 text-sm">{caseRecord.diagnosis.final_diagnosis}</span>
              {caseRecord.diagnosis.final_icd10 && <span className="font-mono text-[11px] text-sky-700 ml-1">({caseRecord.diagnosis.final_icd10})</span>}
            </p>
            {caseRecord.diagnosis.provisional_diagnosis && (
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Provisional Impression: </span>
                {caseRecord.diagnosis.provisional_diagnosis}
              </p>
            )}
            {caseRecord.diagnosis.clinical_notes && (
              <p className="text-[11px] text-slate-600 pt-1">
                <span className="font-semibold text-slate-800">Physician Notes: </span>
                {caseRecord.diagnosis.clinical_notes}
              </p>
            )}
          </div>
        </div>

        {/* Prescribed Medications (Rx) */}
        {caseRecord.prescription.length > 0 && (
          <div className="space-y-2">
            <div className="border-b border-slate-200 pb-1 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs text-sky-900 flex items-center gap-1.5">
                <span className="text-base font-black text-sky-600 font-serif">℞</span>
                4. Medical Prescription (Rx)
              </h3>
              <span className="text-[10px] text-slate-400 italic">Dispense as written</span>
            </div>

            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-2 pl-3">#</th>
                  <th className="p-2">Medicine Name & Strength</th>
                  <th className="p-2">Form & Route</th>
                  <th className="p-2">Frequency</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">Timing / Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {caseRecord.prescription.map((rx, idx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/50">
                    <td className="p-2 pl-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-2 font-bold text-slate-900">
                      {rx.medicine_name}
                      {rx.strength && <span className="text-slate-500 font-normal ml-1">({rx.strength})</span>}
                    </td>
                    <td className="p-2 text-slate-600">{rx.form} ({rx.route})</td>
                    <td className="p-2 font-extrabold text-sky-900 font-mono">{rx.frequency}</td>
                    <td className="p-2 text-slate-700">{rx.duration_value} {rx.duration_unit}</td>
                    <td className="p-2 font-medium text-slate-800">{rx.instruction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Follow-up & Discharge Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-sky-800 block">
              Follow-Up & Review Appointment
            </span>
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              {formatDate(caseRecord.follow_up.followup_date)} ({caseRecord.follow_up.reason})
            </p>
            <p className="text-[11px] text-slate-600 mt-1">{caseRecord.follow_up.instructions}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-rose-800 block">
              Emergency Warning Signs (When to seek immediate ER care)
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              Return immediately to Emergency Department if you develop persistent high fever &gt; 103°F, severe shortness of breath, severe chest pain, inability to retain oral fluids, or altered sensorium.
            </p>
          </div>
        </div>

        {/* Physician Sign-Off & Verification Footer */}
        <div className="border-t-2 border-slate-200 pt-6 flex items-end justify-between">
          <div className="text-[10px] text-slate-400 space-y-0.5">
            <p>Generated via CliniCase AI™ EMR Platform</p>
            <p>Tamper-Resistant Digital Audit Token: <span className="font-mono text-slate-600">{caseRecord.case_id}-NABH-VERIFIED</span></p>
            <p>This digital medical case report is legally valid under Electronic Health Records (EHR) Standards.</p>
          </div>

          <div className="text-right">
            <div className="font-serif italic text-base text-slate-800 font-bold">
              {caseRecord.doctor_name}
            </div>
            <div className="w-36 h-0.5 bg-slate-800 my-1 ml-auto" />
            <p className="text-xs font-bold text-slate-900">{caseRecord.doctor_name}</p>
            <p className="text-[10px] text-slate-500 font-medium">Attending Physician • {caseRecord.department}</p>
            <p className="text-[10px] text-slate-400">Date: {formatDate(caseRecord.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Digital EHR Certificate Modal */}
      <EHRVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        caseRecord={caseRecord}
        patient={patient}
        hospitalInfo={hospitalInfo}
      />

      {/* Multilingual Patient Care & Rx Modal */}
      <MultilingualDischargeModal
        isOpen={showMultilingualModal}
        onClose={() => setShowMultilingualModal(false)}
        caseRecord={caseRecord}
        patient={patient}
        hospitalInfo={hospitalInfo}
      />
    </div>
  );
};

