import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Heart, Shield, AlertCircle } from 'lucide-react';
import { Patient } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated?: (patient: Patient) => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  isOpen,
  onClose,
  onPatientCreated
}) => {
  const { addPatient } = useHospital();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('1995-05-15');
  const [age, setAge] = useState<number>(31);
  const [gender, setGender] = useState<Patient['gender']>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [bloodGroup, setBloodGroup] = useState<Patient['blood_group']>('O+');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [nationalId, setNationalId] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');

  const handleDobChange = (dobStr: string) => {
    setDob(dobStr);
    try {
      const birth = new Date(dobStr);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge > 0 ? calculatedAge : 1);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('error', 'Validation Error', 'Patient full name is required.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      showToast('error', 'Validation Error', 'Valid phone number is required.');
      return;
    }

    const created = addPatient({
      name: name.trim(),
      dob,
      age: Number(age) || 30,
      gender,
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@patient.org`,
      address: address.trim() || 'Residential Enclave',
      city: city.trim() || 'City Center',
      blood_group: bloodGroup,
      emergency_contact: {
        name: emergencyName || 'Primary Relative',
        phone: emergencyPhone || phone,
        relation: emergencyRelation
      },
      national_id: nationalId || undefined,
      insurance_provider: insuranceProvider || undefined,
      policy_number: policyNumber || undefined,
      avatar_url: `https://images.unsplash.com/photo-${gender === 'Female' ? '1544005313-94ddf0286df2' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=256`
    });

    if (created) {
      if (onPatientCreated) onPatientCreated(created);
      onClose();
      // Reset
      setName('');
      setPhone('');
      setEmail('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Patient"
      subtitle="Complete demographic intake with automated duplicate checking"
      maxWidth="3xl"
      icon={<User className="w-5 h-5" />}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Demographics */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-3 border-b border-slate-100 pb-1">
            1. Basic Personal Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra / Sarah Jenkins"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => handleDobChange(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={e => setAge(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-3 border-b border-slate-100 pb-1">
            2. Contact & Address
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765-43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="patient@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                placeholder="e.g. Bangalore, Delhi, Mumbai"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="House No, Apartment, Street, Landmark"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact & Insurance */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-3 border-b border-slate-100 pb-1">
            3. Emergency Contact & Identification / Insurance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Person</label>
              <input
                type="text"
                placeholder="Contact Name"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Phone</label>
              <input
                type="tel"
                placeholder="Emergency Phone"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Relation</label>
              <select
                value={emergencyRelation}
                onChange={e => setEmergencyRelation(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Guardian">Guardian</option>
                <option value="Friend">Friend</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">National ID (Aadhaar/SSN)</label>
              <input
                type="text"
                placeholder="AADHAAR-XXXX-XXXX"
                value={nationalId}
                onChange={e => setNationalId(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Health Insurance Company</label>
              <input
                type="text"
                placeholder="e.g. Star Health, HDFC ERGO, Max"
                value={insuranceProvider}
                onChange={e => setInsuranceProvider(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Policy / Card Number</label>
              <input
                type="text"
                placeholder="POL-XXXXXX"
                value={policyNumber}
                onChange={e => setPolicyNumber(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Register Patient & Generate ID
          </button>
        </div>
      </form>
    </Modal>
  );
};
