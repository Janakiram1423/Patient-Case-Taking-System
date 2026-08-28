import React, { useState } from 'react';
import { Building2, Save, Phone, Mail, Globe, Award, ShieldCheck, Check } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { HospitalInfo } from '../../types';

export const HospitalSettings: React.FC = () => {
  const { hospitalInfo, updateHospitalInfo } = useHospital();
  const [formData, setFormData] = useState<HospitalInfo>(hospitalInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalInfo(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg border border-sky-200 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Hospital Configuration & Letterhead Setup
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize hospital branding, official letterhead, NABH accreditation details, and contacts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b border-slate-100 pb-2">
            Hospital Information & Letterhead Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Tagline / Subtitle</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium italic"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Helpline</label>
              <input
                type="text"
                value={formData.emergencyNumber}
                onChange={e => setFormData({ ...formData, emergencyNumber: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration / NABH License</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Accreditation Statement</label>
              <input
                type="text"
                value={formData.accreditation}
                onChange={e => setFormData({ ...formData, accreditation: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Hospital Configuration
            </button>
          </div>
        </form>

        {/* Live Letterhead Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Letterhead Preview
          </h3>

          <div className="p-4 rounded-xl border-2 border-sky-600 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg">
                +
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">{formData.name}</h4>
                <p className="text-[10px] text-sky-700 italic font-semibold">{formData.tagline}</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 space-y-0.5">
              <p>{formData.address}</p>
              <p>Phone: {formData.phone} • Emergency: {formData.emergencyNumber}</p>
              <p>{formData.accreditation} • Reg: {formData.registrationNumber}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              This letterhead is automatically rendered onto all generated PDF medical case sheets, prescriptions, and clinical discharge summaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
