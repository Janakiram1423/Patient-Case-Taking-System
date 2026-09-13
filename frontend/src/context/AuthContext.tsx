import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextValue {
  currentUser: User;
  currentRole: UserRole;
  allUsers: User[];
  isAuthenticated: boolean;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => boolean;
  registerPatient: (email: string, name: string, patientId: string, password: string) => boolean;
  logout: () => void;
  canViewClinicalRecords: boolean;
  canCreateCase: boolean;
  canPrescribe: boolean;
  canManageUsers: boolean;
  canRegisterPatient: boolean;
  canManageQueue: boolean;
  canAccessAIFeatures: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const normalizeUserList = (incoming: User[]) => {
  const allUsers = incoming.filter(user => user.role !== 'patient');
  const seen = new Set<string>();
  return allUsers.filter(user => {
    const key = `${user.role}:${user.email || user.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(user => ({
    ...user,
    name: user.role === 'doctor' ? 'Doctor' : user.role === 'patient' ? 'Patient' : user.name,
    avatar: ''
  }));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultDoctorUsers = INITIAL_USERS.filter(user => user.role === 'doctor');
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('clinicase_users');
    if (saved) {
      try {
        const storedUsers: User[] = JSON.parse(saved);
        return normalizeUserList(storedUsers.length ? storedUsers : INITIAL_USERS.filter(user => user.role !== 'patient'));
      } catch (e) {
        return [...defaultDoctorUsers, ...INITIAL_USERS.filter(user => user.role === 'admin' || user.role === 'receptionist')];
      }
    }
    return INITIAL_USERS.filter(user => user.role !== 'patient');
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('clinicase_current_user_id');
    if (savedId) {
      const found = users.find(u => u.id === savedId);
      if (found) return found;
    }
    return users[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('clinicase_is_authenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('clinicase_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('clinicase_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const loadUsersFromServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/staff`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const nextUsers = normalizeUserList(data as User[]);
          setUsers(nextUsers);
          if (!nextUsers.some(user => user.id === currentUser.id)) {
            setCurrentUser(nextUsers[0]);
          }
        }
      } catch {
        // Fall back to local cache if the backend is unavailable.
      }
    };

    loadUsersFromServer();

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'clinicase_users' || !event.newValue) return;
      try {
        const storedUsers: User[] = JSON.parse(event.newValue);
        setUsers(normalizeUserList(storedUsers));
      } catch {
        // Ignore malformed local data.
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [currentUser.id]);

  useEffect(() => {
    localStorage.setItem('clinicase_is_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
    }
  };

  const switchRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
    }
  };

  const login = (email: string, preferredRole?: UserRole): boolean => {
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found && preferredRole) {
      found = users.find(u => u.role === preferredRole);
    }
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const registerPatient = (email: string, name: string, patientId: string, password: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(user => user.email.toLowerCase() === normalizedEmail)) return false;

    const newUser: User = {
      id: `pat-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: normalizedEmail,
      role: 'patient',
      avatar: '',
      phone: 'Not provided',
      password,
      patientId,
      status: 'Active'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(users[0]);
    localStorage.removeItem('clinicase_current_user_id');
  };

  // Role permissions
  const role = currentUser.role;
  const canViewClinicalRecords = role === 'doctor' || role === 'admin' || role === 'patient';
  const canCreateCase = role === 'doctor';
  const canPrescribe = role === 'doctor';
  const canManageUsers = role === 'admin';
  const canRegisterPatient = role === 'receptionist' || role === 'doctor' || role === 'admin';
  const canManageQueue = role === 'receptionist' || role === 'admin' || role === 'doctor';
  const canAccessAIFeatures = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: role,
        allUsers: users,
        isAuthenticated,
        switchUser,
        switchRole,
        login,
        logout,
        registerPatient,
        canViewClinicalRecords,
        canCreateCase,
        canPrescribe,
        canManageUsers,
        canRegisterPatient,
        canManageQueue,
        canAccessAIFeatures
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
