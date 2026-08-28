import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Activity, Heart, Brain, Wind, CheckCircle2 } from 'lucide-react';
import { EMERGENCY_PROTOCOLS, EmergencyProtocol } from '../../data/emergencyProtocols';
import { Modal } from '../common/Modal';

interface EmergencyTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyTriageModal: React.FC<EmergencyTriageModalProps> = ({ isOpen, onClose }) => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(EMERGENCY_PROTOCOLS[0].id);

  const activeProtocol = EMERGENCY_PROTOCOLS.find(p => p.id === selectedProtocolId) || EMERGENCY_PROTOCOLS[0];

  const categoryIcons = {
    Cardiology: <Heart className="w-4 h-4 text-rose-500" />,
    Neurology: <Brain className="w-4 h-4 text-purple-500" />,
    'Allergy / Emergency': <AlertTriangle className="w-4 h-4 text-amber-500" />,
    Respiratory: <Wind className="w-4 h-4 text-sky-500" />,
    Trauma: <Activity className="w-4 h-4 text-emerald-500" />
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emergency Triage & Acute Resuscitation Protocols"
      subtitle="Standardized clinical pathways for life-threatening emergencies"
      maxWidth="4xl"
      icon={<ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Protocol Sidebar Selector */}
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Emergency Pathways
          </p>
          {EMERGENCY_PROTOCOLS.map(proto => {
            const isSelected = proto.id === selectedProtocolId;
            return (
              <button
                key={proto.id}
                type="button"
                onClick={() => setSelectedProtocolId(proto.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="mt-0.5">{categoryIcons[proto.category]}</div>
                <div>
                  <p className="text-xs font-bold leading-snug">{proto.title}</p>
                  <span className="text-[10px] text-rose-700 font-semibold">{proto.severity}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Protocol Content Body */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-rose-950 flex items-center gap-2">
                {categoryIcons[activeProtocol.category]}
                {activeProtocol.title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px]">
                STAT
              </span>
            </div>
            <p className="text-[11px] text-rose-800 font-medium italic">
              ⭐ {activeProtocol.clinicalPearl}
            </p>
          </div>

          {/* Immediate STAT Actions */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5 text-sky-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              Immediate Resuscitative Actions (First 5-10 mins)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {activeProtocol.immediateActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* STAT Investigations & First Line Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs">STAT Investigations</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                {activeProtocol.investigationsSTAT.map((inv, i) => (
                  <li key={i}>{inv}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs">First-Line Medications</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 font-semibold">
                {activeProtocol.firstLineMedications.map((med, i) => (
                  <li key={i}>{med}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contraindications Warning */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <p className="font-bold text-amber-950">⚠️ Critical Contraindications & Pitfalls:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
              {activeProtocol.contraindications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};
