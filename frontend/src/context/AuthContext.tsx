import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextValue {
  currentUser: User;
  currentRole: UserRole;
  allUsers: User[];
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  canViewClinicalRecords: boolean;
  canCreateCase: boolean;
  canPrescribe: boolean;
  canManageUsers: boolean;
  canRegisterPatient: boolean;
  canManageQueue: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem('clinicase_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('clinicase_current_user_id');
    if (savedId) {
      const found = users.find(u => u.id === savedId);
      if (found) return found;
    }
    return users[0]; // Default to Dr. Sarah Chen
  });

  useEffect(() => {
    localStorage.setItem('clinicase_current_user_id', currentUser.id);
  }, [currentUser]);

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const switchRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const login = (email: string, preferredRole?: UserRole): boolean => {
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found && preferredRole) {
      found = users.find(u => u.role === preferredRole);
    }
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Switch back to default doctor demo user
    setCurrentUser(users[0]);
  };

  // Role permissions
  const role = currentUser.role;
  const canViewClinicalRecords = role === 'doctor' || role === 'admin' || role === 'patient';
  const canCreateCase = role === 'doctor';
  const canPrescribe = role === 'doctor';
  const canManageUsers = role === 'admin';
  const canRegisterPatient = role === 'receptionist' || role === 'doctor' || role === 'admin';
  const canManageQueue = role === 'receptionist' || role === 'admin' || role === 'doctor';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: role,
        allUsers: users,
        switchUser,
        switchRole,
        login,
        logout,
        canViewClinicalRecords,
        canCreateCase,
        canPrescribe,
        canManageUsers,
        canRegisterPatient,
        canManageQueue
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
