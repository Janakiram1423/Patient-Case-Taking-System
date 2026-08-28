import React, { useState } from 'react';
import {
  HeartPulse,
  Pill,
  Calendar,
  Clock3,
  FileText,
  Printer,
  ShieldAlert,
  Download,
  AlertCircle,
  Languages
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { MedicalCaseSheetPDF } from '../reports/MedicalCaseSheetPDF';
import { MultilingualDischargeModal } from '../clinical/MultilingualDischargeModal';
import { Modal } from '../common/Modal';
import { CaseRecord } from '../../types';

export const PatientDashboard: React.FC = () => {
  const { patients, getPatientCases, hospitalInfo } = useHospital();
  const { currentUser } = useAuth();
  const [selectedCaseForReport, setSelectedCaseForReport] = useState<CaseRecord | null>(null);
  const [selectedCaseForDischarge, setSelectedCaseForDischarge] = useState<CaseRecord | null>(null);


  // Find patient record for logged in patient (or default Alex Mercer)
  const patient = patients.find(p => p.patient_id === currentUser.patientId) || patients[0];
  const patientCases = getPatientCases(patient.patient_id);
  const latestCase = patientCases[0];

  return (
    <div className="space-y-6">
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={patient.avatar_url || currentUser.avatar}
            alt={patient.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md shrink-0"
          />
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
              Patient Health Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              Welcome, {patient.name}!
            </h1>
            <p className="text-xs text-sky-100 mt-0.5">
              Patient ID: <span className="font-mono font-bold text-white">{patient.patient_id}</span> • Blood Group: <span className="font-bold text-white">{patient.blood_group}</span> • Total Visits: {patientCases.length}
            </p>
          </div>
        </div>
      </div>

      {/* Health Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Prescriptions Box */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm">Active Prescribed Medications</h3>
            </div>
            <div className="flex items-center gap-2">
              {latestCase && (
                <button
                  type="button"
                  onClick={() => setSelectedCaseForDischarge(latestCase)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors"
                >
                  <Languages className="w-3.5 h-3.5 text-teal-600" />
                  AI Care Slip (हिंदी/English/..)
                </button>
              )}
              <Badge variant="primary" size="sm">
                {latestCase ? latestCase.prescription.length : 0} Active
              </Badge>
            </div>
          </div>

          {!latestCase || latestCase.prescription.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 text-center">No active medications prescribed.</p>
          ) : (
            <div className="space-y-2">
              {latestCase.prescription.map((rx, idx) => (
                <div
                  key={rx.id || idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{rx.medicine_name}</p>
                    <p className="text-[11px] text-slate-500">
                      Take: <span className="font-extrabold text-sky-800 font-mono">{rx.frequency}</span> • {rx.instruction} • {rx.duration_value} {rx.duration_unit}
                    </p>
                  </div>
                  <Badge variant="neutral" size="sm">{rx.form}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Follow-up Reminder */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">Follow-up Appointment</h3>
            </div>
            <Badge variant="success" size="sm">Scheduled</Badge>
          </div>

          {latestCase?.follow_up ? (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 space-y-2 text-xs">
              <p className="font-extrabold text-teal-950 text-sm">
                {formatDate(latestCase.follow_up.followup_date)}
              </p>
              <p className="text-teal-900 font-medium">
                Reason: {latestCase.follow_up.reason}
              </p>
              <p className="text-[11px] text-teal-700 pt-1 border-t border-teal-200/60">
                {latestCase.follow_up.instructions}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No scheduled follow-up at this time.</p>
          )}

          {/* Allergy Safety Shield */}
          {latestCase?.allergy_history.allergies.length ? (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-800 text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                Allergy Caution:
              </div>
              <p className="text-[11px] text-rose-700">
                {latestCase.allergy_history.allergies.map(a => `${a.allergen} (${a.reaction})`).join(', ')}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Case Sheets List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">My Medical Case Sheets & Visit History</h3>
          </div>
          <span className="text-xs text-slate-400">Download & Print</span>
        </div>

        <div className="divide-y divide-slate-100">
          {patientCases.map(c => (
            <div
              key={c.case_id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Visit #{c.visit_number}</span>
                  <span className="text-slate-400 font-mono">({c.case_id})</span>
                  <Badge variant="primary" size="sm">{c.visit_type}</Badge>
                </div>
                <p className="text-slate-700 font-semibold mt-1">
                  Diagnosis: {c.diagnosis.final_diagnosis || c.chief_complaint.main_complaint}
                </p>
                <p className="text-[11px] text-slate-500">
                  Doctor: {c.doctor_name} • Date: {formatDateTime(c.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedCaseForDischarge(c)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold text-xs border border-teal-200 transition-colors"
                >
                  <Languages className="w-3.5 h-3.5 text-teal-600" />
                  AI Care Slip
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCaseForReport(c)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  View & Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Sheet Modal */}
      {selectedCaseForReport && (
        <Modal
          isOpen={Boolean(selectedCaseForReport)}
          onClose={() => setSelectedCaseForReport(null)}
          title={`Clinical Case Sheet — ${selectedCaseForReport.case_id}`}
          subtitle={`Visit #${selectedCaseForReport.visit_number} • Dr. ${selectedCaseForReport.doctor_name}`}
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

