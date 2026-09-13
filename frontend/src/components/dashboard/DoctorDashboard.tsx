import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Stethoscope,
  Activity,
  FileText,
  Printer,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { MedicalCaseSheetPDF } from '../reports/MedicalCaseSheetPDF';
import { Modal } from '../common/Modal';
import { CaseRecord } from '../../types';

interface DoctorDashboardProps {
  onStartNewCase: (patientId?: string) => void;
  onViewPatientTimeline: (patientId: string) => void;
  onOpenAppointments: () => void;
  onOpenLabScanner?: () => void;
  onNavigateModule?: (module: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onStartNewCase,
  onViewPatientTimeline,
  onOpenAppointments,
  onOpenLabScanner,
  onNavigateModule
}) => {
  const { appointments, cases, patients, hospitalInfo, updateAppointmentStatus } = useHospital();
  const { currentUser } = useAuth();
  const [selectedCaseForSheet, setSelectedCaseForSheet] = useState<CaseRecord | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === today);
  const myAppointments = todayAppointments.filter(a => a.doctor_id === currentUser.id || a.doctor_name.includes(currentUser.name));

  const waitingAppointments = myAppointments.filter(a => a.status === 'Waiting');
  const inConsultationAppointments = myAppointments.filter(a => a.status === 'In Consultation');
  const completedCasesToday = cases.filter(c => c.created_at.startsWith(today) && (c.doctor_id === currentUser.id || c.doctor_name.includes(currentUser.name)));

  // Recent Case Sheets (default empty state)
  const recentCases: CaseRecord[] = [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
              Clinical Workspace
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Good day, {currentUser.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
              {currentUser.department} • Ready for OPD consultations with AI smart questioning, speech-to-text scribe, and lab OCR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onStartNewCase()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-800 font-extrabold text-xs shadow-lg hover:bg-sky-50 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              Start New Case Taking
            </button>

            {onOpenLabScanner && (
              <button
                onClick={onOpenLabScanner}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal-500/30 hover:bg-teal-500/40 text-white font-bold text-xs border border-teal-300/30 backdrop-blur-xs transition-colors"
                title="Open AI Diagnostic Lab Report Scanner"
              >
                <Activity className="w-4 h-4 text-teal-300" />
                <span>🔬 Lab OCR Scanner</span>
              </button>
            )}

            <button
              onClick={onOpenAppointments}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-xs transition-colors"
            >
              <Calendar className="w-4 h-4" />
              View Queue ({myAppointments.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Today's Appointments</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{myAppointments.length}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Scheduled for consultation</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Waiting in Queue</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">{waitingAppointments.length}</h3>
            <p className="text-[11px] text-amber-700 mt-1">Ready for intake</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Completed Cases</p>
            <h3 className="text-2xl font-black text-emerald-900 mt-1">{completedCasesToday.length}</h3>
            <p className="text-[11px] text-emerald-700 mt-1">Signed & documented</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide">Total Case Records</p>
            <h3 className="text-2xl font-black text-indigo-900 mt-1">{cases.length}</h3>
            <p className="text-[11px] text-indigo-700 mt-1">Longitudinal history</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Queue & Recent Case Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Patient Consultation Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Today's Patient Queue & Triage</h3>
              </div>
              <Badge variant="primary" size="sm">
                {waitingAppointments.length} Waiting
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {myAppointments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No appointments scheduled in your queue for today.
                </div>
              ) : (
                myAppointments.map(apt => (
                  <div
                    key={apt.appointment_id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                        <span className="text-[8px] uppercase">Token</span>
                        #{apt.token_number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs">{apt.patient_name}</p>
                          <Badge variant={apt.status === 'In Consultation' ? 'primary' : apt.status === 'Waiting' ? 'warning' : 'success'} size="sm">
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{apt.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onStartNewCase(apt.patient_id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        Take Case
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Prescriptions & Case Sheets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Recent Clinical Case Sheets</h3>
              </div>
              <span className="text-xs text-slate-400">Instant PDF & Print</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentCases.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No recent clinical history available.</div>
              ) : (
                recentCases.map(c => {
                  const patient = patients.find(p => p.patient_id === c.patient_id);
                  return (
                    <div
                      key={c.case_id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs">{patient?.name || c.patient_id}</p>
                          <span className="text-[10px] text-slate-400 font-mono">({c.case_id})</span>
                          <Badge variant="neutral" size="sm">Visit #{c.visit_number}</Badge>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          <span className="font-semibold text-slate-700">Diagnosis:</span> {c.diagnosis.final_diagnosis || c.chief_complaint.main_complaint}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatDateTime(c.created_at)} • Prescribed {c.prescription.length} items
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCaseForSheet(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        View Sheet
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Clinical quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm">Clinical Workflow</h3>
            </div>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <p>• Open patient queue for intake and triage.</p>
              <p>• Record structured case-taking details.</p>
              <p>• Review longitudinal history and print signed case sheets.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Sheet PDF Modal */}
      {selectedCaseForSheet && (
        <Modal
          isOpen={Boolean(selectedCaseForSheet)}
          onClose={() => setSelectedCaseForSheet(null)}
          title={`Clinical Case Sheet — ${selectedCaseForSheet.case_id}`}
          subtitle={`Visit #${selectedCaseForSheet.visit_number} • Dr. ${selectedCaseForSheet.doctor_name}`}
          maxWidth="5xl"
        >
          <MedicalCaseSheetPDF
            caseRecord={selectedCaseForSheet}
            patient={patients.find(p => p.patient_id === selectedCaseForSheet.patient_id) || patients[0]}
            hospitalInfo={hospitalInfo}
            onClose={() => setSelectedCaseForSheet(null)}
          />
        </Modal>
      )}
    </div>
  );
};
