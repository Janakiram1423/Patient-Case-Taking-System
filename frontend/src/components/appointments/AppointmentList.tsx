import React, { useState } from 'react';
import {
  CalendarCheck2,
  Clock,
  Plus,
  User,
  Stethoscope,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { Appointment, AppointmentStatus, Patient } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { formatTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface AppointmentListProps {
  onStartConsultationCase?: (patientId: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ onStartConsultationCase }) => {
  const { appointments, updateAppointmentStatus, addAppointment, patients, users } = useHospital();
  const { currentRole, currentUser } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    currentRole === 'doctor' ? currentUser.id : 'All'
  );
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

  // New Appointment Form State
  const [targetPatientId, setTargetPatientId] = useState<string>(patients[0]?.patient_id || '');
  const [targetDoctorId, setTargetDoctorId] = useState<string>(
    users.find(u => u.role === 'doctor')?.id || ''
  );
  const [appointmentDate, setAppointmentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [reason, setReason] = useState('Routine consultation & symptom check');

  const doctors = users.filter(u => u.role === 'doctor');

  // Filter appointments
  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
    const matchesDoctor = selectedDoctorId === 'All' || a.doctor_id === selectedDoctorId;
    return matchesStatus && matchesDoctor;
  });

  const waitingCount = appointments.filter(a => a.status === 'Waiting').length;
  const inConsultCount = appointments.filter(a => a.status === 'In Consultation').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.patient_id === targetPatientId);
    const doctor = users.find(u => u.id === targetDoctorId);

    if (!patient || !doctor) return;

    addAppointment({
      patient_id: patient.patient_id,
      patient_name: patient.name,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      department: doctor.department || 'General Medicine',
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      reason,
      status: 'Waiting'
    });

    setIsNewAppointmentModalOpen(false);
  };

  const statusVariantMap: Record<AppointmentStatus, 'warning' | 'primary' | 'success' | 'danger' | 'neutral'> = {
    Waiting: 'warning',
    'In Consultation': 'primary',
    Completed: 'success',
    Cancelled: 'danger',
    Scheduled: 'neutral',
    'No Show': 'danger'
  };

  return (
    <div className="space-y-6">
      {/* Header & Token Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Queue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{appointments.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Waiting in Lobby</p>
            <h3 className="text-2xl font-black text-amber-900 mt-0.5">{waitingCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sky-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-sky-800 uppercase tracking-wide">In Consultation</p>
            <h3 className="text-2xl font-black text-sky-900 mt-0.5">{inConsultCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Completed Cases</p>
            <h3 className="text-2xl font-black text-emerald-900 mt-0.5">{completedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="All">All Queue Statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={selectedDoctorId}
            onChange={e => setSelectedDoctorId(e.target.value)}
            className="p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="All">All Doctors</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department?.split('&')[0]})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsNewAppointmentModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Issue Token / Book Appointment
        </button>
      </div>

      {/* Appointment Queue List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <CalendarCheck2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No appointments in the queue for selected filters</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map(apt => (
              <div
                key={apt.appointment_id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Token & Patient Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex flex-col items-center justify-center font-extrabold border border-sky-200 shrink-0">
                    <span className="text-[9px] uppercase font-bold text-sky-600">Token</span>
                    <span className="text-sm leading-none">#{apt.token_number}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{apt.patient_name}</h4>
                      <span className="text-xs text-slate-400 font-mono">({apt.patient_id})</span>
                      <Badge variant={statusVariantMap[apt.status]} size="sm" dot={true}>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{apt.reason}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Doctor: <span className="font-semibold text-slate-700">{apt.doctor_name}</span> • Dept: {apt.department} • Time: {apt.appointment_time}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {apt.status === 'Waiting' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.appointment_id, 'In Consultation')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Call Patient
                    </button>
                  )}

                  {apt.status === 'In Consultation' && (
                    <>
                      {onStartConsultationCase && (
                        <button
                          type="button"
                          onClick={() => onStartConsultationCase(apt.patient_id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          Take Case Sheet
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(apt.appointment_id, 'Completed')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Completed
                      </button>
                    </>
                  )}

                  {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.appointment_id, 'Cancelled')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Cancel appointment"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book New Appointment Modal */}
      <Modal
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        title="Issue OPD Token / Book Appointment"
        subtitle="Assign patient to doctor consultation queue"
        maxWidth="lg"
        icon={<CalendarCheck2 className="w-5 h-5" />}
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient</label>
            <select
              value={targetPatientId}
              onChange={e => setTargetPatientId(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
            >
              {patients.map(p => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.name} ({p.patient_id}) — {p.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Consulting Doctor</label>
            <select
              value={targetDoctorId}
              onChange={e => setTargetDoctorId(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.department}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={e => setAppointmentDate(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Slot Time</label>
              <input
                type="text"
                value={appointmentTime}
                onChange={e => setAppointmentTime(e.target.value)}
                placeholder="e.g. 11:30 AM"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit</label>
            <input
              type="text"
              placeholder="e.g. Fever for 3 days, Hypertension checkup, Follow-up..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewAppointmentModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Issue Token & Enqueue
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
