import React, { useState } from 'react';
import {
  Activity,
  Search,
  Users,
  Stethoscope,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Calendar,
  Mic
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from './Badge';

interface NavbarProps {
  onOpenNewPatientModal: () => void;
  onOpenNewCaseModal: () => void;
  onSelectPatient: (patientId: string) => void;
  onSelectCase: (caseId: string) => void;
  onOpenVoiceScribe?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewPatientModal,
  onOpenNewCaseModal,
  onSelectPatient,
  onSelectCase,
  onOpenVoiceScribe
}) => {
  const { currentUser, allUsers, switchUser, currentRole } = useAuth();
  const { hospitalInfo, patients, cases, resetToDefaultData } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Search matching patients and cases
  const matchingPatients = searchQuery.trim()
    ? patients.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery)
      )
    : [];

  const matchingCases = searchQuery.trim()
    ? cases.filter(
        c =>
          c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.chief_complaint.main_complaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.diagnosis.final_diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.diagnosis.provisional_diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];



  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Hospital Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  CliniCase<span className="text-sky-600">AI</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-black tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-xs font-medium">
                {hospitalInfo.name}
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient by Name, ID (PAT-...), Phone, Diagnosis..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-xl border border-transparent focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <div
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 max-h-96 overflow-y-auto z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowSearchDropdown(false)}
              >
                {matchingPatients.length === 0 && matchingCases.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching patients or clinical case records found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchingPatients.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                          Patients ({matchingPatients.length})
                        </p>
                        {matchingPatients.map(p => (
                          <button
                            key={p.patient_id}
                            onClick={() => {
                              onSelectPatient(p.patient_id);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left p-2 rounded-xl hover:bg-sky-50 flex items-center justify-between text-xs transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
                                alt={p.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-semibold text-slate-800 group-hover:text-sky-700">{p.name}</p>
                                <p className="text-[11px] text-slate-500">
                                  {p.patient_id} • {p.age}y {p.gender} • {p.phone}
                                </p>
                              </div>
                            </div>
                            <Badge variant="neutral" size="sm">{p.blood_group}</Badge>
                          </button>
                        ))}
                      </div>
                    )}

                    {matchingCases.length > 0 && (
                      <div className="border-t border-slate-100 pt-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                          Clinical Case Records ({matchingCases.length})
                        </p>
                        {matchingCases.map(c => (
                          <button
                            key={c.case_id}
                            onClick={() => {
                              onSelectCase(c.case_id);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left p-2 rounded-xl hover:bg-teal-50 flex items-center justify-between text-xs transition-colors group"
                          >
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-teal-700 flex items-center gap-1.5">
                                <span className="font-mono text-slate-500">{c.case_id}</span> • {c.chief_complaint.main_complaint}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Patient: {c.patient_id} • Dr: {c.doctor_name} • Visit #{c.visit_number}
                              </p>
                            </div>
                            <Badge variant="primary" size="sm">{c.status}</Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Voice Scribe Studio Trigger */}
            {onOpenVoiceScribe && (
              <button
                type="button"
                onClick={onOpenVoiceScribe}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-black shadow-xs transition-all hover:shadow-md"
                title="Open AI Multi-Lingual Voice Clinical Scribe"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden md:inline">🎙️ AI Voice Scribe</span>
                <span className="md:hidden">Voice</span>
              </button>
            )}

            {/* Quick Action Buttons */}
            {currentRole === 'doctor' && (
              <button
                onClick={onOpenNewCaseModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white text-xs font-bold shadow-xs hover:shadow-md hover:from-sky-700 hover:to-teal-700 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start New Case</span>
              </button>
            )}

            {(currentRole === 'receptionist' || currentRole === 'admin') && (
              <button
                onClick={onOpenNewPatientModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Register Patient</span>
              </button>
            )}

            {/* Reset Data Button */}
            <button
              onClick={resetToDefaultData}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Reset sample hospital demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
