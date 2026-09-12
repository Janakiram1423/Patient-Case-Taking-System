import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  CalendarCheck2,
  Clock,
  CheckCircle2,
  Phone,
  Ticket,
  ShieldCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../common/Badge';

interface ReceptionDashboardProps {
  onOpenRegisterPatient: () => void;
  onOpenAppointments: () => void;
}

export const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({
  onOpenRegisterPatient,
  onOpenAppointments
}) => {
  const { patients, appointments, users, addAppointment } = useHospital();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === today);
  const waitingPatients = todayAppointments.filter(a => a.status === 'Waiting');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
            Front Desk & Patient Triage
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-2">
            Reception Desk Portal
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
            Register new patients, issue token numbers, manage OPD queue, and coordinate doctor schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRegisterPatient}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-lg hover:bg-emerald-50 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            Register New Patient
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Today's Token Count</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{todayAppointments.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase">Currently Waiting</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">{waitingPatients.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sky-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-sky-800 uppercase">Total Patients Directory</p>
            <h3 className="text-2xl font-black text-sky-900 mt-1">{patients.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Live Token Status */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Ticket className="w-4 h-4 text-sky-600" />
              Live Consultation Room Status
            </h3>
            <button
              onClick={onOpenAppointments}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              Full Queue →
            </button>
          </div>

          <div className="space-y-3">
            {todayAppointments.slice(0, 5).map(apt => (
              <div
                key={apt.appointment_id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    #{apt.token_number}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{apt.patient_name}</p>
                    <p className="text-[11px] text-slate-500">Dr. {apt.doctor_name} • {apt.department}</p>
                  </div>
                </div>

                <Badge variant={apt.status === 'In Consultation' ? 'primary' : apt.status === 'Waiting' ? 'warning' : 'success'} size="sm">
                  {apt.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
