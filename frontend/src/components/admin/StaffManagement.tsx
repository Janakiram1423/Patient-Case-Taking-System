import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Trash2,
  Stethoscope,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { User } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const StaffManagement: React.FC = () => {
  const { users, addUser, deleteUser } = useHospital();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<User['role']>('doctor');
  const [department, setDepartment] = useState('General Medicine & Cardiology');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('MD (Internal Medicine)');
  const [regNo, setRegNo] = useState('MCI-REG-');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || password.length < 6) return;

    addUser({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@apexhealth.org`,
      role,
      department: role === 'doctor' ? department : undefined,
      phone: phone || '+91 98765-00000',
      password,
      title: role === 'doctor' ? title : undefined,
      registrationNumber: role === 'doctor' ? regNo : undefined,
      status: 'Active',
      avatar: ''
    });

    setIsAddUserModalOpen(false);
    setName('');
    setPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg border border-sky-200 shrink-0">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Doctor & Hospital Staff Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage clinical departments, registration licenses, permissions, and roles.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Doctor / Staff
        </button>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => (
          <div
            key={u.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 p-5 shadow-xs transition-all space-y-4"
          >
            <div className="flex items-start gap-3.5">
              {u.avatar ? (
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-extrabold">
                  {u.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{u.name}</h4>
                  <Badge variant={u.role === 'doctor' ? 'primary' : u.role === 'admin' ? 'purple' : u.role === 'receptionist' ? 'success' : 'neutral'} size="sm">
                    {u.role}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {u.title || (u.role === 'receptionist' ? 'Front Desk Executive' : u.role)}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-600">
              {u.department && (
                <p className="font-medium text-slate-800 flex items-center gap-1.5 truncate">
                  <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  {u.department}
                </p>
              )}
              {u.registrationNumber && (
                <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {u.registrationNumber}
                </p>
              )}
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {u.email}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {u.phone}
              </p>
            </div>

            <button
              type="button"
              onClick={() => deleteUser(u.id)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Account
            </button>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add Medical Staff Member"
        subtitle="Create physician or administrative account"
        maxWidth="lg"
        icon={<UserCog className="w-5 h-5" />}
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name & Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Arthur Pendelton, MD"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist / Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                placeholder="e.g. Cardiology, Pediatrics"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration / License No.</label>
              <input
                type="text"
                placeholder="MCI-REG-XXXXXX"
                value={regNo}
                onChange={e => setRegNo(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98765-XXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Login Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
