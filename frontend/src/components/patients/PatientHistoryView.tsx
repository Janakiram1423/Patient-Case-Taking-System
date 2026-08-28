import React, { useState } from 'react';
import { Clock3, UserRound } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { PatientTimeline } from './PatientTimeline';

interface PatientHistoryViewProps {
  onStartCase: (patientId: string) => void;
}

export const PatientHistoryView: React.FC<PatientHistoryViewProps> = ({ onStartCase }) => {
  const { patients } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.patient_id || '');
  const selectedPatient = patients.find(patient => patient.patient_id === selectedPatientId);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center border border-teal-200">
            <Clock3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Patient Medical History</h2>
            <p className="text-xs text-slate-500">Select a patient to review previous visits, diagnoses, medicines, and vitals.</p>
          </div>
        </div>

        {patients.length === 0 ? (
          <p className="text-sm text-slate-500">No patients are registered yet.</p>
        ) : (
          <label className="block max-w-xl text-xs font-bold text-slate-700">
            Patient
            <div className="relative mt-1">
              <UserRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedPatientId}
                onChange={event => setSelectedPatientId(event.target.value)}
                className="w-full appearance-none pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-sky-500"
              >
                {patients.map(patient => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.name} ({patient.patient_id})
                  </option>
                ))}
              </select>
            </div>
          </label>
        )}
      </div>

      {selectedPatient && (
        <PatientTimeline patient={selectedPatient} onStartNewVisit={onStartCase} />
      )}
    </div>
  );
};
