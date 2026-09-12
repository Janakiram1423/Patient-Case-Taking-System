import React from 'react';
import { CalendarCheck2, Clock3, Stethoscope } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../common/Badge';

interface TodaysQueueProps {
  onStartCase: (patientId: string) => void;
  onViewHistory: (patientId: string) => void;
}

export const TodaysQueue: React.FC<TodaysQueueProps> = ({ onStartCase, onViewHistory }) => {
  const { patients } = useHospital();
  const today = new Date().toISOString().split('T')[0];
  const todaysPatients = patients
    .filter(patient => patient.created_at.startsWith(today))
    .sort((first, second) => new Date(first.created_at).getTime() - new Date(second.created_at).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's Queue</h2>
            <p className="text-xs text-slate-500">Patients registered today are automatically added here for consultation.</p>
          </div>
        </div>
        <Badge variant="warning" size="sm">{todaysPatients.length} Today</Badge>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {todaysPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Clock3 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No patients registered today</p>
            <p className="text-xs text-slate-400">New registrations will appear in this queue automatically.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todaysPatients.map((patient, index) => (
              <div key={patient.patient_id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{patient.name}</p>
                    <p className="text-[11px] text-slate-500">{patient.patient_id} • {patient.age}y {patient.gender} • {patient.phone}</p>
                    <p className="text-[11px] text-slate-400">Registered {new Date(patient.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onViewHistory(patient.patient_id)} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">
                    History
                  </button>
                  <button type="button" onClick={() => onStartCase(patient.patient_id)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold">
                    <Stethoscope className="w-3.5 h-3.5" />
                    Take Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
