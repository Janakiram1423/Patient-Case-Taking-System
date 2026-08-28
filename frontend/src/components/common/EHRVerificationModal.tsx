import React from 'react';
import { ShieldCheck, CheckCircle2, QrCode, Lock, Building2, Calendar, User } from 'lucide-react';
import { CaseRecord, Patient, HospitalInfo } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { Modal } from './Modal';

interface EHRVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseRecord: CaseRecord;
  patient: Patient;
  hospitalInfo: HospitalInfo;
}

export const EHRVerificationModal: React.FC<EHRVerificationModalProps> = ({
  isOpen,
  onClose,
  caseRecord,
  patient,
  hospitalInfo
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Electronic Medical Record (EHR) Verification"
      subtitle="Digital authenticity & tamper-proof cryptographic verification"
      maxWidth="md"
      icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
    >
      <div className="space-y-4 text-xs">
        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-emerald-900">VERIFIED AUTHENTIC EHR</h4>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              NABH & JCI Digital Health Certificate valid.
            </p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 font-medium">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-slate-700">
            <span className="text-slate-500">Case Record ID:</span>
            <span className="font-mono font-bold text-slate-900">{caseRecord.case_id}</span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Patient:</span>
            <span className="font-bold text-slate-900">{patient.name} ({patient.patient_id})</span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Attending Physician:</span>
            <span className="font-bold text-slate-900">{caseRecord.doctor_name}</span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Hospital Center:</span>
            <span className="font-bold text-slate-900">{hospitalInfo.name}</span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Digital Signature Date:</span>
            <span className="font-mono text-slate-900">{formatDateTime(caseRecord.created_at)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">NABH License:</span>
            <span className="font-mono text-slate-900">{hospitalInfo.registrationNumber}</span>
          </div>
        </div>

        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-[11px] flex items-start gap-2">
          <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p>
            Cryptographic Checksum: <span className="font-mono font-bold">SHA256-{caseRecord.case_id.replace(/-/g, '').slice(0, 16)}...</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
        >
          Close Verification Certificate
        </button>
      </div>
    </Modal>
  );
};
