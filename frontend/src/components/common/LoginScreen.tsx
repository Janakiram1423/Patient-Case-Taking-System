import React, { useMemo, useState } from 'react';
import { ShieldCheck, Stethoscope, Users, UserRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';

const loginOptions: Array<{
  role: UserRole;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}> = [
  {
    role: 'doctor',
    title: 'Doctor',
    subtitle: 'Clinical workflow and case taking',
    icon: <Stethoscope className="w-5 h-5" />
  },
  {
    role: 'patient',
    title: 'Patient',
    subtitle: 'View records and care timeline',
    icon: <UserRound className="w-5 h-5" />
  },
  {
    role: 'admin',
    title: 'Admin',
    subtitle: 'Hospital controls and AI access',
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    role: 'receptionist',
    title: 'Reception',
    subtitle: 'Queue and registration desk',
    icon: <Users className="w-5 h-5" />
  }
];

const rolePasswords: Record<UserRole, string> = {
  doctor: 'doctor123',
  patient: 'patient123',
  admin: 'admin123',
  receptionist: 'reception123'
};

export const LoginScreen: React.FC = () => {
  const { login, allUsers, registerPatient } = useAuth();
  const { addPatient } = useHospital();
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationName, setRegistrationName] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [error, setError] = useState('');

  const roleMembers = useMemo(() => {
    return allUsers.filter(user => user.role === selectedRole);
  }, [allUsers, selectedRole]);

  const handleLogin = () => {
    const normalized = email.trim().toLowerCase();
    const selectedMember = normalized
      ? roleMembers.find(member => member.email.toLowerCase() === normalized)
      : roleMembers[0];

    if (!selectedMember && normalized) {
      setError('This email does not belong to the selected login type.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    const expectedPassword = selectedMember?.password || rolePasswords[selectedRole];
    if (password.trim() !== expectedPassword) {
      setError('Incorrect password for this login type.');
      return;
    }

    const match = selectedMember
      ? login(selectedMember.email, selectedRole)
      : login(roleMembers[0]?.email || '', selectedRole);

    if (!match) {
      setError('Unable to sign in with this role. Please choose a valid user.');
      return;
    }

    setError('');
  };

  const handlePatientRegistration = () => {
    const normalizedEmail = registrationEmail.trim().toLowerCase();
    if (!registrationName.trim() || !normalizedEmail || !registrationPassword.trim()) {
      setError('Enter your name, email, and password to register as a patient.');
      return;
    }

    if (registrationPassword.length < 6) {
      setError('Patient password must be at least 6 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    if (allUsers.some(user => user.email.toLowerCase() === normalizedEmail)) {
      setError('This email is already registered. Please sign in.');
      return;
    }

    const patient = addPatient({
      name: registrationName.trim(),
      dob: 'Not provided',
      age: 0,
      gender: 'Other',
      phone: 'Not provided',
      email: normalizedEmail,
      address: 'Not provided',
      city: 'Not provided',
      emergency_contact: {
        name: 'Not provided',
        phone: 'Not provided',
        relation: 'Other'
      },
      blood_group: 'Unknown'
    });

    if (!patient || !registerPatient(normalizedEmail, registrationName, patient.patient_id, registrationPassword)) {
      setError('Unable to register this patient account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-sky-700 via-sky-800 to-indigo-900 p-8 text-white">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-100">
                CliniCase AI
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Select login</h1>
            <p className="mt-3 text-sm text-sky-100 max-w-md">
              Choose your login type to continue.
            </p>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sky-50">
                <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-100">
                  Login options
                </div>
                <div className="space-y-2">
                  {loginOptions.map(option => (
                    <button
                      key={option.role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(option.role);
                        setEmail('');
                        setPassword('');
                        setRegistrationName('');
                        setRegistrationEmail('');
                        setRegistrationPassword('');
                        setError('');
                      }}
                      className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        selectedRole === option.role
                          ? 'bg-white text-sky-900 border-white shadow-md'
                          : 'bg-transparent border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedRole === option.role ? 'bg-sky-100 text-sky-700' : 'bg-white/10 text-white'}`}>
                          {option.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{option.title}</div>
                          <div className={`text-[11px] ${selectedRole === option.role ? 'text-sky-700' : 'text-sky-100'}`}>
                            {option.subtitle}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mb-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Sign in</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {loginOptions.find(r => r.role === selectedRole)?.title} access
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder={roleMembers[0]?.email || 'name@hospital.org'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 text-sm"
                />
              </div>

              {selectedRole === 'patient' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-800">New patient registration</p>
                  <input
                    type="text"
                    value={registrationName}
                    onChange={event => setRegistrationName(event.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white focus:border-emerald-500 focus:outline-none text-sm"
                  />
                  <input
                    type="email"
                    value={registrationEmail}
                    onChange={event => setRegistrationEmail(event.target.value)}
                    placeholder="Your email address"
                    className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white focus:border-emerald-500 focus:outline-none text-sm"
                  />
                  <input
                    type="password"
                    value={registrationPassword}
                    onChange={event => setRegistrationPassword(event.target.value)}
                    placeholder="Create a password (6+ characters)"
                    className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white focus:border-emerald-500 focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={handlePatientRegistration}
                    className="w-full rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 transition-colors"
                  >
                    Register with email
                  </button>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-sky-700 transition-colors"
              >
                Sign in as {loginOptions.find(r => r.role === selectedRole)?.title}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
