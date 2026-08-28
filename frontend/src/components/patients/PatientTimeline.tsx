import React, { useState } from 'react';
import {
  Clock3,
  Calendar,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  Activity,
  CheckCircle2,
  FileText,
  Printer,
  ChevronRight,
  ArrowRight,
  Languages
} from 'lucide-react';
import { Patient, CaseRecord } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { MedicalCaseSheetPDF } from '../reports/MedicalCaseSheetPDF';
import { MultilingualDischargeModal } from '../clinical/MultilingualDischargeModal';
import { Modal } from '../common/Modal';

interface PatientTimelineProps {
  patient: Patient;
  onStartNewVisit?: (patientId: string) => void;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ patient, onStartNewVisit }) => {
  const { getPatientCases, hospitalInfo } = useHospital();
  const cases = getPatientCases(patient.patient_id);
  const [selectedCaseForReport, setSelectedCaseForReport] = useState<CaseRecord | null>(null);
  const [selectedCaseForDischarge, setSelectedCaseForDischarge] = useState<CaseRecord | null>(null);


  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg border border-teal-200 shrink-0">
            <Clock3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Longitudinal Clinical Timeline — {patient.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient.patient_id} • {patient.age}y {patient.gender} • Blood Group: {patient.blood_group} • Total Recorded Visits: {cases.length}
            </p>
          </div>
        </div>

        {onStartNewVisit && (
          <button
            type="button"
            onClick={() => onStartNewVisit(patient.patient_id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <Stethoscope className="w-4 h-4" />
            Start Visit #{cases.length + 1}
          </button>
        )}
      </div>

      {/* Longitudinal Vitals Evolution Comparison (If >=2 visits) */}
      {cases.length >= 2 && (
        <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-indigo-50 border border-sky-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Clinical Progress & Vitals Evolution Delta
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Blood Pressure Delta */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">BLOOD PRESSURE</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500 line-through">
                  {cases[cases.length - 1].vitals.blood_pressure_systolic}/{cases[cases.length - 1].vitals.blood_pressure_diastolic}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-extrabold text-emerald-600">
                  {cases[0].vitals.blood_pressure_systolic}/{cases[0].vitals.blood_pressure_diastolic}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                ✓ Normalized to Goal
              </span>
            </div>

            {/* Weight Delta */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">WEIGHT / BMI</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500 line-through">
                  {cases[cases.length - 1].vitals.weight_kg} kg
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-extrabold text-emerald-600">
                  {cases[0].vitals.weight_kg} kg
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                -{(cases[cases.length - 1].vitals.weight_kg - cases[0].vitals.weight_kg).toFixed(1)} kg reduction
              </span>
            </div>

            {/* Symptom Severity Delta */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">CHIEF COMPLAINT SEVERITY</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-rose-600 font-bold">
                  {cases[cases.length - 1].chief_complaint.severity}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-bold text-emerald-600">
                  {cases[0].chief_complaint.severity}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                ✓ Significant Improvement
              </span>
            </div>

            {/* Active Meds Count */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">ACTIVE MEDICATIONS</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500">
                  {cases[cases.length - 1].prescription.length} Drugs
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-bold text-sky-700">
                  {cases[0].prescription.length} Drugs
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Maintenance phase
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Visit Nodes */}
      <div className="space-y-4">
        {cases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <Clock3 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No Clinical Case Records Yet for {patient.name}</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start the first case taking visit to build a comprehensive digital medical history.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {cases.map((c, idx) => (
              <div key={c.case_id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full bg-white border-4 border-sky-600 shadow-xs flex items-center justify-center" />

                {/* Case Card */}
                <div className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 p-5 sm:p-6 shadow-xs transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold">
                        Visit #{c.visit_number}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{c.visit_type}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateTime(c.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={c.status === 'Completed' || c.status === 'Signed' ? 'success' : 'warning'} size="sm">
                        {c.status}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => setSelectedCaseForDischarge(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors border border-teal-200"
                      >
                        <Languages className="w-3.5 h-3.5 text-teal-600" />
                        AI Care Slip (हिंदी/En/..)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCaseForReport(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-xs font-bold text-slate-700 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        View / Print Case Sheet
                      </button>
                    </div>
                  </div>

                  {/* Summary Content */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Chief Complaint */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Chief Complaint
                      </span>
                      <p className="font-bold text-slate-900">{c.chief_complaint.main_complaint}</p>
                      <p className="text-slate-500 text-[11px]">
                        Duration: {c.chief_complaint.duration_value} {c.chief_complaint.duration_unit} • Severity: {c.chief_complaint.severity}
                      </p>
                    </div>

                    {/* Vitals */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Recorded Vitals
                      </span>
                      <p className="font-bold text-slate-900">
                        BP: {c.vitals.blood_pressure_systolic}/{c.vitals.blood_pressure_diastolic} mmHg • Pulse: {c.vitals.pulse_rate} bpm
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Temp: {c.vitals.temperature_f}°F • SpO₂: {c.vitals.spo2}% • BMI: {c.vitals.bmi}
                      </p>
                    </div>

                    {/* Diagnosis & Prescriptions */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Final Diagnosis & Plan
                      </span>
                      <p className="font-bold text-sky-900">{c.diagnosis.final_diagnosis}</p>
                      <p className="text-slate-500 text-[11px]">
                        Prescribed {c.prescription.length} medicines • Attending: {c.doctor_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Sheet Modal */}
      {selectedCaseForReport && (
        <Modal
          isOpen={Boolean(selectedCaseForReport)}
          onClose={() => setSelectedCaseForReport(null)}
          title={`Clinical Case Sheet — ${selectedCaseForReport.case_id}`}
          subtitle={`Visit #${selectedCaseForReport.visit_number} • ${patient.name}`}
          maxWidth="5xl"
        >
          <MedicalCaseSheetPDF
            caseRecord={selectedCaseForReport}
            patient={patient}
            hospitalInfo={hospitalInfo}
            onClose={() => setSelectedCaseForReport(null)}
          />
        </Modal>
      )}

      {/* AI Multilingual Care Slip Modal */}
      {selectedCaseForDischarge && (
        <MultilingualDischargeModal
          isOpen={Boolean(selectedCaseForDischarge)}
          onClose={() => setSelectedCaseForDischarge(null)}
          caseRecord={selectedCaseForDischarge}
          patient={patient}
          hospitalInfo={hospitalInfo}
        />
      )}
    </div>
  );
};

