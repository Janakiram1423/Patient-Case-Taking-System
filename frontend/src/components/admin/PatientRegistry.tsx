import React from 'react';
import { Search, Trash2, Users } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../common/Badge';

export const PatientRegistry: React.FC = () => {
  const { patients, deletePatient } = useHospital();
  const [search, setSearch] = React.useState('');
  const query = search.trim().toLowerCase();
  const filteredPatients = patients.filter(patient =>
    !query || [patient.name, patient.uhid, patient.patient_id, patient.phone]
      .some(value => value.toLowerCase().includes(query))
  );

  const handleRemove = (patientId: string, patientName: string) => {
    if (window.confirm(`Remove patient ${patientName} (${patientId})? This cannot be undone.`)) {
      deletePatient(patientId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Patient Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Review and remove registered patient records.</p>
            </div>
          </div>
          <Badge variant="primary" size="sm">{patients.length} Patients</Badge>
        </div>
        <label className="relative block mt-5 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search name, UHID, patient ID, or phone"
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-sky-500"
          />
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {filteredPatients.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-10">No matching registered patients.</p>
        ) : filteredPatients.map(patient => (
          <div key={patient.patient_id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">{patient.name}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                UHID: <span className="font-mono font-semibold text-teal-800">{patient.uhid}</span>
                {' • '}{patient.patient_id} • {patient.phone}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(patient.patient_id, patient.name)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Patient
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
