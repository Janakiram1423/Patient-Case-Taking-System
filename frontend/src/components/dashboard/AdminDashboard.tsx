import React from 'react';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  BarChart3,
  ScrollText,
  Activity,
  Building2,
  TrendingUp,
  Award,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { hospitalInfo, patients, cases, appointments, users, auditLogs, deletePatient } = useHospital();

  const doctors = users.filter(u => u.role === 'doctor');
  const staff = users.filter(u => u.role !== 'patient');

  // Disease prevalence breakdown from recorded cases
  const diagnosisCounts: Record<string, number> = {};
  cases.forEach(c => {
    const diag = c.diagnosis.final_diagnosis || c.diagnosis.provisional_diagnosis || 'General Malaise';
    const cleanDiag = diag.split('(')[0].split('&')[0].trim();
    diagnosisCounts[cleanDiag] = (diagnosisCounts[cleanDiag] || 0) + 1;
  });

  const topDiagnoses = Object.entries(diagnosisCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-extrabold uppercase tracking-wider border border-purple-500/30">
            Administrative & Quality Governance
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-2">
            Hospital Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            {hospitalInfo.name} • {hospitalInfo.accreditation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('staff')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Staff ({users.length})
          </button>

          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            <ScrollText className="w-4 h-4 text-purple-400" />
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Registered Patients</h2>
                <p className="text-xs text-slate-500 mt-1">Remove a patient record from the hospital registry.</p>
              </div>
              <Badge variant="primary" size="sm">{patients.length} Patients</Badge>
            </div>

            {patients.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-5">No registered patients.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {patients.map(patient => (
                  <div key={patient.patient_id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{patient.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{patient.uhid} • {patient.patient_id} • {patient.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove patient ${patient.name} (${patient.patient_id})? This cannot be undone.`)) {
                          deletePatient(patient.patient_id);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Patient
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Patients Registered</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{patients.length}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ 100% Digitalized EMR</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Active Medical Faculty</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{doctors.length} Doctors</h3>
            <p className="text-[11px] text-slate-400 mt-1">{staff.length} Total Staff Members</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Clinical Case Sheets</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{cases.length} Records</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">NABH Compliant</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Tamper-Proof Audit Events</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{auditLogs.length} Events</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Active Tracking</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics & Prevalence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Prevalence & Diagnosis Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              Clinical Disease Incidence & Diagnoses
            </h3>
            <span className="text-xs text-slate-400">ICD Classification</span>
          </div>

          <div className="space-y-3">
            {topDiagnoses.length === 0 ? (
              <p className="text-xs text-slate-500">No diagnoses recorded yet.</p>
            ) : (
              topDiagnoses.map(([disease, count], idx) => {
                const percentage = Math.round((count / cases.length) * 100) || 50;
                return (
                  <div key={disease} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800 font-bold">
                        {idx + 1}. {disease}
                      </span>
                      <span className="text-slate-500">{count} Cases ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-sky-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Audit Trail Logs Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-sky-600" />
              Recent System Audit Trail
            </h3>
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              Full Log Viewer →
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map(log => (
              <div
                key={log.log_id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {log.user_name} ({log.user_role})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  <span className="font-semibold text-purple-800">{log.action}</span>: {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
