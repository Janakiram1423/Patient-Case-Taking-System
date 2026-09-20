import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  HospitalInfo,
  Patient,
  Appointment,
  AppointmentStatus,
  CaseRecord,
  AuditLog,
  User
} from '../types';
import {
  INITIAL_HOSPITAL_INFO,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_CASES,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { generatePatientId, generateRegistrationNumber, generateUHID, generateCaseId } from '../utils/formatters';

interface HospitalContextValue {
  hospitalInfo: HospitalInfo;
  updateHospitalInfo: (info: HospitalInfo) => void;
  patients: Patient[];
  addPatient: (patientData: Omit<Patient, 'patient_id' | 'uhid' | 'created_at' | 'updated_at' | 'registered_by'> & { uhid?: string }) => Patient | null;
  updatePatient: (patient: Patient) => void;
  deletePatient: (patientId: string) => void;
  getPatientById: (patientId: string) => Patient | undefined;
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'appointment_id' | 'created_at' | 'token_number'>) => Appointment;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  cases: CaseRecord[];
  saveCaseRecord: (caseData: Omit<CaseRecord, 'case_id' | 'created_at' | 'updated_at' | 'visit_number'> & { case_id?: string; visit_number?: number }) => CaseRecord;
  clearCaseRecords: () => void;
  getPatientCases: (patientId: string) => CaseRecord[];
  getCaseById: (caseId: string) => CaseRecord | undefined;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entityType: AuditLog['entity_type'], entityId: string, details: string) => void;
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => User;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  resetToDefaultData: () => void;
}

const HospitalContext = createContext<HospitalContextValue | undefined>(undefined);
const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) return configured;

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
    return 'http://127.0.0.1:8000/api';
  }

  return `http://${host}:8000/api`;
};

const API_BASE_URL = getApiBaseUrl();

const normalizeStaffUsers = (incoming: User[]) =>
  incoming
    .filter(user => user.role !== 'patient')
    .map(user => ({
      ...user,
      name: user.role === 'receptionist' ? 'Reception' : user.role === 'admin' ? 'Admin' : user.name,
      avatar: ''
    }));

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const demoPatientIds = new Set(['PAT-2026-0001', 'PAT-2026-0002', 'PAT-2026-0003', 'PAT-2026-0004', 'PAT-2026-0005']);
  const demoAuditLogIds = new Set(['LOG-9921', 'LOG-9920', 'LOG-9919', 'LOG-9918', 'LOG-9917']);
  const redactNames = (value: string) => value
    .replaceAll('Dr. Sarah Chen', 'Doctor')
    .replaceAll('Dr. Rajesh Verma', 'Doctor')
    .replaceAll('Dr. Emily Watson', 'Doctor')
    .replaceAll('Dr. Robert Vance', 'Admin')
    .replaceAll('Priya Sharma', 'Reception')
    .replaceAll('Alex Mercer', 'Patient')
    .replaceAll('Sunita Mehra', 'Patient')
    .replaceAll('Vikramaditya Rao', 'Patient')
    .replaceAll('Aarav Nair', 'Patient')
    .replaceAll('Meera Deshmukh', 'Patient')
    .replaceAll('Elena Mercer', 'Emergency Contact')
    .replaceAll('Rohan Mehra', 'Emergency Contact')
    .replaceAll('Ananya Rao', 'Emergency Contact')
    .replaceAll('Gautam Nair', 'Emergency Contact')
    .replaceAll('Amit Deshmukh', 'Emergency Contact');

  // 1. Hospital Info
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo>(() => {
    const saved = localStorage.getItem('clinicase_hospital_info');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITAL_INFO;
  });

  // 2. Patients
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('clinicase_patients');
    const storedPatients: Patient[] = saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    const usedPatientIds = new Set<string>();
    const usedUHIDs = new Set<string>();

    return storedPatients
      .filter(patient => !demoPatientIds.has(patient.patient_id))
      .map(({ avatar_url: _avatarUrl, ...patient }) => {
        const patientId = patient.patient_id && !usedPatientIds.has(patient.patient_id)
          ? patient.patient_id
          : generatePatientId(usedPatientIds);
        usedPatientIds.add(patientId);
        const uhid = patient.uhid && !usedUHIDs.has(patient.uhid)
          ? patient.uhid
          : generateUHID(usedUHIDs);
        usedUHIDs.add(uhid);

        return {
          ...patient,
          patient_id: patientId,
          uhid,
          name: 'Patient',
          emergency_contact: { ...patient.emergency_contact, name: 'Emergency Contact' },
          registered_by: 'Reception'
        };
      });
  });

  // 3. Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('clinicase_appointments');
    const storedAppointments: Appointment[] = saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    return storedAppointments
      .filter(appointment => !demoPatientIds.has(appointment.patient_id))
      .map(appointment => ({ ...appointment, patient_name: 'Patient', doctor_name: 'Doctor' }));
  });

  // 4. Case Records
  const [cases, setCases] = useState<CaseRecord[]>(() => {
    const saved = localStorage.getItem('clinicase_cases');
    const storedCases: CaseRecord[] = saved ? JSON.parse(saved) : INITIAL_CASES;
    return storedCases
      .filter(caseRecord => !demoPatientIds.has(caseRecord.patient_id))
      .map(caseRecord => ({
        ...caseRecord,
        patient_details: caseRecord.patient_details || patients.find(patient => patient.patient_id === caseRecord.patient_id),
        doctor_name: 'Doctor',
        doctor_signature: caseRecord.doctor_signature || 'Doctor'
      }));
  });

  // 5. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('clinicase_audit_logs');
    const storedAuditLogs: AuditLog[] = saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    return storedAuditLogs
      .filter(log => !demoAuditLogIds.has(log.log_id))
      .map(log => ({
        ...log,
        user_name: log.user_role === 'Doctor' ? 'Doctor' : log.user_role === 'Receptionist' ? 'Reception' : log.user_role === 'Admin' ? 'Admin' : log.user_name,
        details: redactNames(log.details)
      }));
  });

  // 6. Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('clinicase_users');
    const storedUsers: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    return normalizeStaffUsers(storedUsers);
  });

  useEffect(() => {
    const loadUsersFromServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/staff`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const nextUsers = normalizeStaffUsers(data as User[]);
          setUsers(nextUsers);
          localStorage.setItem('clinicase_users', JSON.stringify(nextUsers));
        }
      } catch {
        // Ignore if backend is unavailable.
      }
    };

    loadUsersFromServer();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('clinicase_hospital_info', JSON.stringify(hospitalInfo));
  }, [hospitalInfo]);

  useEffect(() => {
    localStorage.setItem('clinicase_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('clinicase_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('clinicase_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('clinicase_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('clinicase_users', JSON.stringify(users));
  }, [users]);

  // Audit Logger
  const addAuditLog = useCallback(
    (action: string, entityType: AuditLog['entity_type'], entityId: string, details: string) => {
      const newLog: AuditLog = {
        log_id: `LOG-${Date.now().toString().slice(-5)}`,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1),
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        ip_address: '192.168.1.' + (100 + (currentUser.name.length * 3) % 90),
        timestamp: new Date().toISOString()
      };
      setAuditLogs(prev => [newLog, ...prev]);
    },
    [currentUser]
  );

  // Hospital Info updater
  const updateHospitalInfo = (info: HospitalInfo) => {
    setHospitalInfo(info);
    addAuditLog('Updated Hospital Profile', 'System', 'HOSP-CFG', `Updated settings for ${info.name}`);
    showToast('success', 'Hospital Settings Saved', 'Hospital letterhead and information updated successfully.');
  };

  // Patient Management
  const addPatient = (patientData: Omit<Patient, 'patient_id' | 'uhid' | 'created_at' | 'updated_at' | 'registered_by'> & { uhid?: string }): Patient | null => {
    // Duplicate Phone Check
    const existingPhone = patients.find(p => p.phone.replace(/\D/g, '') === patientData.phone.replace(/\D/g, ''));
    if (existingPhone) {
      showToast('error', 'Duplicate Patient Found', `A patient with phone number ${patientData.phone} is already registered (${existingPhone.name} - ${existingPhone.patient_id}).`);
      return null;
    }

    const patientId = generatePatientId(patients.map(patient => patient.patient_id));
    const registrationNumber = patientData.registration_number || generateRegistrationNumber(patients.map(patient => patient.registration_number || ''));
    const uhid = patientData.uhid || generateUHID(patients.map(patient => patient.uhid));
    const now = new Date().toISOString();

    const newPatient: Patient = {
      ...patientData,
      uhid,
      registration_number: registrationNumber,
      patient_id: patientId,
      created_at: now,
      updated_at: now,
      registered_by: `${currentUser.name} (${currentUser.role})`
    };

    setPatients(prev => [newPatient, ...prev]);
    addAuditLog('Registered Patient', 'Patient', patientId, `Registered ${newPatient.name} (${newPatient.age}y, ${newPatient.gender})`);
    showToast('success', 'Patient Registered Successfully', `Generated Patient ID: ${patientId}`);
    return newPatient;
  };

  const updatePatient = (patient: Patient) => {
    const now = new Date().toISOString();
    const updated = { ...patient, updated_at: now };
    setPatients(prev => prev.map(p => (p.patient_id === patient.patient_id ? updated : p)));
    addAuditLog('Updated Patient Demographics', 'Patient', patient.patient_id, `Updated contact/profile details for ${patient.name}`);
    showToast('success', 'Patient Profile Updated', `Changes saved for ${patient.name}`);
  };

  const deletePatient = (patientId: string) => {
    const target = patients.find(p => p.patient_id === patientId);
    if (!target) return;
    setPatients(prev => prev.filter(p => p.patient_id !== patientId));
    addAuditLog('Deleted Patient Record', 'Patient', patientId, `Removed patient record for ${target.name}`);
    showToast('info', 'Patient Removed', `Patient record ${patientId} deleted.`);
  };

  const getPatientById = (patientId: string) => {
    return patients.find(p => p.patient_id === patientId);
  };

  // Appointment Management
  const addAppointment = (
    appointmentData: Omit<Appointment, 'appointment_id' | 'created_at' | 'token_number'>
  ): Appointment => {
    const appointmentId = `APT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const createdAt = new Date().toISOString();

    const newAppointment: Appointment = {
      ...appointmentData,
      appointment_id: appointmentId,
      token_number: 0,
      created_at: createdAt
    };

    const doctorQueue = [...appointments, newAppointment]
      .filter(appointment =>
        appointment.appointment_date === appointmentData.appointment_date &&
        appointment.doctor_id === appointmentData.doctor_id
      )
      .sort((first, second) => {
        const timeOrder = first.appointment_time.localeCompare(second.appointment_time, undefined, { numeric: true });
        return timeOrder || first.created_at.localeCompare(second.created_at);
      });

    const tokenByAppointmentId = new Map(
      doctorQueue.map((appointment, index) => [appointment.appointment_id, index + 1])
    );
    const tokenNumber = tokenByAppointmentId.get(appointmentId) || 1;
    const numberedAppointment = { ...newAppointment, token_number: tokenNumber };

    setAppointments(prev => [numberedAppointment, ...prev].map(appointment => ({
      ...appointment,
      token_number: tokenByAppointmentId.get(appointment.appointment_id) || appointment.token_number
    })));
    addAuditLog(
      'Scheduled Appointment',
      'Appointment',
      appointmentId,
      `Booked token #${tokenNumber} for ${numberedAppointment.patient_name} with ${numberedAppointment.doctor_name} at ${numberedAppointment.appointment_time}`
    );
    showToast('success', 'Appointment Confirmed', `Token #${tokenNumber} assigned for ${numberedAppointment.patient_name}`);
    return numberedAppointment;
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(a => {
        if (a.appointment_id === appointmentId) {
          return { ...a, status };
        }
        return a;
      })
    );
    addAuditLog('Updated Appointment Status', 'Appointment', appointmentId, `Status changed to ${status}`);
    showToast('info', 'Appointment Updated', `Status changed to ${status}`);
  };

  // Case Record Management
  const saveCaseRecord = (
    caseData: Omit<CaseRecord, 'case_id' | 'created_at' | 'updated_at' | 'visit_number'> & {
      case_id?: string;
      visit_number?: number;
    }
  ): CaseRecord => {
    const patientCases = cases.filter(c => c.patient_id === caseData.patient_id);
    const isNew = !caseData.case_id || !cases.some(c => c.case_id === caseData.case_id);
    const visitNumber = caseData.visit_number || (isNew ? patientCases.length + 1 : 1);
    const caseId = caseData.case_id || generateCaseId(caseData.patient_id, visitNumber);
    const now = new Date().toISOString();

    const recordToSave: CaseRecord = {
      ...caseData,
      patient_details: caseData.patient_details || patients.find(patient => patient.patient_id === caseData.patient_id),
      case_id: caseId,
      visit_number: visitNumber,
      created_at: isNew ? now : (cases.find(c => c.case_id === caseId)?.created_at || now),
      updated_at: now
    };

    if (isNew) {
      setCases(prev => [recordToSave, ...prev]);
      addAuditLog(
        'Created Clinical Case Sheet',
        'Case',
        caseId,
        `Recorded Visit #${visitNumber} for Patient ${caseData.patient_id}. Provisional Diagnosis: ${caseData.diagnosis.provisional_diagnosis || 'Under Evaluation'}`
      );
    } else {
      setCases(prev => prev.map(c => (c.case_id === caseId ? recordToSave : c)));
      addAuditLog('Updated Clinical Case Sheet', 'Case', caseId, `Updated Visit #${visitNumber} record`);
    }

    // Auto-update appointment status to Completed if linked
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.patient_id === caseData.patient_id && apt.status === 'In Consultation') {
          return { ...apt, status: 'Completed', case_id: caseId };
        }
        return apt;
      })
    );

    showToast('success', 'Case Record Saved', `Visit #${visitNumber} for ${caseData.patient_id} has been recorded.`);
    return recordToSave;
  };

  const clearCaseRecords = () => {
    if (cases.length === 0) return;
    setCases([]);
    addAuditLog('Cleared Clinical Case Records', 'Case', 'ALL', `Removed ${cases.length} saved case records`);
    showToast('info', 'Case records removed', 'All saved case records have been deleted.');
  };

  const getPatientCases = (patientId: string) => {
    return cases
      .filter(c => c.patient_id === patientId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getCaseById = (caseId: string) => {
    return cases.find(c => c.case_id === caseId);
  };

  // User Management
  const syncUsersToServer = async (nextUsers: User[]) => {
    try {
      await fetch(`${API_BASE_URL}/admin/staff`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextUsers)
      });
    } catch {
      // Client-side localStorage remains the fallback when the backend is unavailable.
    }
  };

  const publishUsersUpdate = (nextUsers: User[]) => {
    localStorage.setItem('clinicase_users', JSON.stringify(nextUsers));
    window.dispatchEvent(new CustomEvent<User[]>('clinicase_users_updated', { detail: nextUsers }));
  };

  const addUser = (userData: Omit<User, 'id'>): User => {
    const id = `${userData.role.slice(0, 3)}-${Date.now().toString().slice(-3)}`;
    const newUser: User = { ...userData, id };
    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    publishUsersUpdate(nextUsers);
    syncUsersToServer(nextUsers);
    addAuditLog('Created User Account', 'User', id, `Added ${newUser.name} with role ${newUser.role}`);
    showToast('success', 'User Added', `${newUser.name} has been added to staff.`);
    return newUser;
  };

  const updateUser = (user: User) => {
    const nextUsers = users.map(u => (u.id === user.id ? user : u));
    setUsers(nextUsers);
    publishUsersUpdate(nextUsers);
    syncUsersToServer(nextUsers);
    addAuditLog('Updated User Profile', 'User', user.id, `Updated profile for ${user.name}`);
    showToast('success', 'User Profile Saved', `Changes saved for ${user.name}`);
  };

  const deleteUser = (userId: string) => {
    const target = users.find(user => user.id === userId);
    if (!target || target.id === currentUser.id) return;
    const nextUsers = users.filter(user => user.id !== userId);
    setUsers(nextUsers);
    publishUsersUpdate(nextUsers);
    syncUsersToServer(nextUsers);
    addAuditLog('Deleted User Account', 'User', userId, `Removed ${target.name} from staff accounts`);
    showToast('info', 'User Removed', `${target.name} no longer has access.`);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem('clinicase_hospital_info');
    localStorage.removeItem('clinicase_appointments');
    localStorage.removeItem('clinicase_cases');
    localStorage.removeItem('clinicase_audit_logs');
    localStorage.removeItem('clinicase_users');

    setHospitalInfo(INITIAL_HOSPITAL_INFO);
    setAppointments([]);
    setCases([]);
    setAuditLogs([]);
    setUsers(INITIAL_USERS.filter(user => user.role !== 'patient'));

    showToast('info', 'Demo Data Restored', 'Sample clinical records and audit trails reset. Patient records were preserved.');
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitalInfo,
        updateHospitalInfo,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        cases,
        saveCaseRecord,
        clearCaseRecords,
        getPatientCases,
        getCaseById,
        auditLogs,
        addAuditLog,
        users,
        addUser,
        updateUser,
        deleteUser,
        resetToDefaultData
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = (): HospitalContextValue => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
