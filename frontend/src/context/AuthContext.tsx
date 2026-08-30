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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('clinicase_is_authenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('clinicase_current_user_id', currentUser.id);
  }, [currentUser]);

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
