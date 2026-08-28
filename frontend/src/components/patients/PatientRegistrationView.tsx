import React, { useState } from 'react';
import { CheckCircle2, ClipboardList, UserPlus } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { Patient } from '../../types';

interface PatientRegistrationViewProps {
  onStartCase: (patientId: string) => void;
}

const fieldClass = 'mt-1 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-sky-500 font-medium';

export const PatientRegistrationView: React.FC<PatientRegistrationViewProps> = ({ onStartCase }) => {
  const { addPatient } = useHospital();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Patient['gender']>('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [bloodGroup, setBloodGroup] = useState<Patient['blood_group']>('Unknown');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Parent / Spouse');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [disease, setDisease] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<Patient['symptom_severity']>('Moderate');
  const [existingDiseases, setExistingDiseases] = useState('');
  const [previousHistory, setPreviousHistory] = useState('');
  const [medicines, setMedicines] = useState('');
  const [allergies, setAllergies] = useState('');
  const [temperature, setTemperature] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [pulseRate, setPulseRate] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !age || !symptoms.trim()) {
      showToast('error', 'Required details missing', 'Enter name, age, phone, and current symptoms.');
      return;
    }

    const patient = addPatient({
      name: name.trim(),
      dob: dob || 'Not provided',
      age: Number(age),
      gender,
      phone: phone.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '')}@patient.org`,
      address: address.trim() || 'Not provided',
      city: city.trim() || 'Not provided',
      emergency_contact: {
        name: emergencyName.trim() || 'Not provided',
        phone: emergencyPhone.trim() || phone.trim(),
        relation: emergencyName.trim() ? emergencyRelation : 'Other'
      },
      blood_group: bloodGroup,
      insurance_provider: hasInsurance ? insuranceProvider.trim() || undefined : undefined,
      policy_number: hasInsurance ? policyNumber.trim() || undefined : undefined,
      avatar_url: undefined,
      presenting_disease: disease.trim() || undefined,
      symptom_duration: symptomDuration.trim() || undefined,
      current_symptoms: symptoms.trim(),
      symptom_severity: severity,
      existing_diseases: existingDiseases.trim() || undefined,
      previous_illnesses_or_surgeries: previousHistory.trim() || undefined,
      current_medicines: medicines.trim() || undefined,
      allergy_information: allergies.trim() || undefined,
      vital_signs: {
        temperature: temperature.trim() || undefined,
        blood_pressure: bloodPressure.trim() || undefined,
        pulse_rate: pulseRate.trim() || undefined,
        weight: weight.trim() || undefined
      }
    });

    if (!patient) return;
    showToast('success', 'Patient registered', 'Opening the digital case form.');
    onStartCase(patient.patient_id);
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">New Patient Registration</h2>
            <p className="text-xs text-slate-500 mt-0.5">Complete the intake once, then continue to the digital case form.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
        <section className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 border-b border-slate-100 pb-2">Patient details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="font-bold text-slate-700 sm:col-span-2">Full name *<input value={name} onChange={event => setName(event.target.value)} placeholder="Patient name" className={fieldClass} required /></label>
            <label className="font-bold text-slate-700">Date of birth<input type="date" value={dob} onChange={event => setDob(event.target.value)} className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Age *<input type="number" min={0} max={120} value={age} onChange={event => setAge(event.target.value ? Number(event.target.value) : '')} placeholder="Age" className={fieldClass} required /></label>
            <label className="font-bold text-slate-700">Gender<select value={gender} onChange={event => setGender(event.target.value as Patient['gender'])} className={fieldClass}><option>Male</option><option>Female</option><option>Other</option></select></label>
            <label className="font-bold text-slate-700">Phone *<input type="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="Phone number" className={fieldClass} required /></label>
            <label className="font-bold text-slate-700 sm:col-span-2">Address<input value={address} onChange={event => setAddress(event.target.value)} placeholder="Current address" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">City<input value={city} onChange={event => setCity(event.target.value)} placeholder="City" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Blood group<select value={bloodGroup} onChange={event => setBloodGroup(event.target.value as Patient['blood_group'])} className={fieldClass}><option value="Unknown">Not known</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select></label>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 border-b border-slate-100 pb-2">Emergency contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <label className="font-bold text-slate-700">Contact name<input value={emergencyName} onChange={event => setEmergencyName(event.target.value)} placeholder="Emergency contact name" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Contact phone<input type="tel" value={emergencyPhone} onChange={event => setEmergencyPhone(event.target.value)} placeholder="Contact phone" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Relationship<input value={emergencyRelation} onChange={event => setEmergencyRelation(event.target.value)} placeholder="Parent, spouse, friend" className={fieldClass} /></label>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 border-b border-slate-100 pb-2">Insurance</h3>
          <div className="flex items-center gap-5 text-xs font-bold text-slate-700">
            <span>Does the patient have insurance?</span>
            <label className="inline-flex items-center gap-2"><input type="radio" name="hasInsurance" checked={!hasInsurance} onChange={() => setHasInsurance(false)} /> No</label>
            <label className="inline-flex items-center gap-2"><input type="radio" name="hasInsurance" checked={hasInsurance} onChange={() => setHasInsurance(true)} /> Yes</label>
          </div>
          {hasInsurance && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="font-bold text-slate-700">Insurance provider<input value={insuranceProvider} onChange={event => setInsuranceProvider(event.target.value)} placeholder="Insurance company" className={fieldClass} /></label>
              <label className="font-bold text-slate-700">Policy number<input value={policyNumber} onChange={event => setPolicyNumber(event.target.value)} placeholder="Policy number" className={fieldClass} /></label>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 border-b border-slate-100 pb-2">Current problem</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="font-bold text-slate-700">Main disease or concern<input value={disease} onChange={event => setDisease(event.target.value)} placeholder="What is the main problem?" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">How many days has it occurred?<input value={symptomDuration} onChange={event => setSymptomDuration(event.target.value)} placeholder="Example: 3 days" className={fieldClass} /></label>
            <label className="font-bold text-slate-700 sm:col-span-2">Current symptoms *<textarea rows={3} value={symptoms} onChange={event => setSymptoms(event.target.value)} placeholder="Describe the current symptoms" className={fieldClass} required /></label>
            <label className="font-bold text-slate-700">Severity<select value={severity} onChange={event => setSeverity(event.target.value as Patient['symptom_severity'])} className={fieldClass}><option>Mild</option><option>Moderate</option><option>Severe</option></select></label>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 border-b border-slate-100 pb-2">Medical history</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="font-bold text-slate-700">Existing diseases<textarea rows={2} value={existingDiseases} onChange={event => setExistingDiseases(event.target.value)} placeholder="Diabetes, BP, asthma, etc." className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Previous illnesses or surgeries<textarea rows={2} value={previousHistory} onChange={event => setPreviousHistory(event.target.value)} placeholder="Major illnesses or surgeries" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Current medicines<textarea rows={2} value={medicines} onChange={event => setMedicines(event.target.value)} placeholder="Medicines being taken now" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Allergy information<textarea rows={2} value={allergies} onChange={event => setAllergies(event.target.value)} placeholder="Medicine, food, or other allergies" className={fieldClass} /></label>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 border-b border-slate-100 pb-2">Vital signs</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <label className="font-bold text-slate-700">Temperature<input value={temperature} onChange={event => setTemperature(event.target.value)} placeholder="°F" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Blood pressure<input value={bloodPressure} onChange={event => setBloodPressure(event.target.value)} placeholder="120/80" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Pulse rate<input value={pulseRate} onChange={event => setPulseRate(event.target.value)} placeholder="BPM" className={fieldClass} /></label>
            <label className="font-bold text-slate-700">Weight<input value={weight} onChange={event => setWeight(event.target.value)} placeholder="Kg" className={fieldClass} /></label>
          </div>
        </section>

        <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold">
          <UserPlus className="w-4 h-4" />
          Register & Start Case
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
