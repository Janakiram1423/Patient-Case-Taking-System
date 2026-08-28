import React from 'react';
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  FolderHeart,
  CalendarCheck2,
  BarChart3,
  UserCog,
  ScrollText,
  Building2,
  FileText,
  Clock3,
  HeartPulse,
  LogOut,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';

export type ActiveTab =
  | 'dashboard'
  | 'patient-registration'
  | 'patient-history'
  | 'todays-queue'
  | 'new-case'
  | 'cases'
  | 'appointments'
  | 'ai-assistant'
  | 'analytics'
  | 'staff'
  | 'audit-logs'
  | 'settings'
  | 'formulary'
  | 'my-records'
  | 'my-timeline';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentRole, currentUser, logout } = useAuth();
  const { patients, cases, appointments } = useHospital();

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.appointment_date === today);

  const doctorNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Doctor Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'patient-registration',
      label: 'Patient Registration',
      icon: <Users className="w-4 h-4 text-emerald-500" />,
      badge: 'New',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'patient-history',
      label: 'Patient Medical History',
      icon: <Clock3 className="w-4 h-4 text-teal-500" />
    },
    {
      id: 'new-case',
      label: 'Digital Case Taking Form',
      icon: <FilePlus2 className="w-4 h-4 text-sky-500" />,
      badge: 'Start'
    },
    {
      id: 'todays-queue',
      label: "Today's Queue",
      icon: <CalendarCheck2 className="w-4 h-4 text-amber-500" />,
      badge: `${patients.filter(patient => patient.created_at.startsWith(today)).length}`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'cases',
      label: 'Automatic Case Summary & Review',
      icon: <FolderHeart className="w-4 h-4" />,
      badge: `${cases.length}`
    }
  ];

  const receptionistNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Reception Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'appointments',
      label: 'Queue & Token Manager',
      icon: <CalendarCheck2 className="w-4 h-4" />,
      badge: `${todayApts.length} Today`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'cases',
      label: 'Case Sheets Register',
      icon: <FolderHeart className="w-4 h-4" />
    }
  ];

  const adminNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Hospital Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Clinical Analytics',
      icon: <BarChart3 className="w-4 h-4 text-sky-500" />
    },
    {
      id: 'staff',
      label: 'Doctor & Staff Roster',
      icon: <UserCog className="w-4 h-4" />
    },
    {
      id: 'cases',
      label: 'Medical Audit Records',
      icon: <FolderHeart className="w-4 h-4" />
    },
    {
      id: 'audit-logs',
      label: 'Audit Trail Logs',
      icon: <ScrollText className="w-4 h-4 text-purple-500" />
    },
    {
      id: 'settings',
      label: 'Hospital Letterhead & Setup',
      icon: <Building2 className="w-4 h-4" />
    }
  ];

  const patientNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'My Health Portal',
      icon: <HeartPulse className="w-4 h-4 text-rose-500" />
    },
    {
      id: 'my-records',
      label: 'My Prescriptions & Cases',
      icon: <FileText className="w-4 h-4 text-sky-500" />
    },
    {
      id: 'my-timeline',
      label: 'My Clinical Timeline',
      icon: <Clock3 className="w-4 h-4 text-emerald-500" />
    }
  ];

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'doctor':
        return doctorNavItems;
      case 'receptionist':
        return receptionistNavItems;
      case 'admin':
        return adminNavItems;
      case 'patient':
        return patientNavItems;
      default:
        return doctorNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 min-h-0 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-between p-2 sm:p-3 lg:p-4 shrink-0 select-none shadow-xs">
      <div className="space-y-6">
        {/* Role Badge Indicator */}
        <div className="px-3 py-2.5 rounded-2xl bg-gradient-to-r from-slate-50 to-sky-50/60 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              currentRole === 'doctor' ? 'bg-sky-500 ring-2 ring-sky-200' :
              currentRole === 'receptionist' ? 'bg-amber-500 ring-2 ring-amber-200' :
              currentRole === 'admin' ? 'bg-purple-500 ring-2 ring-purple-200' :
              'bg-emerald-500 ring-2 ring-emerald-200'
            }`} />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
              {currentRole === 'doctor' ? '👨‍⚕️ Doctor OPD' :
               currentRole === 'receptionist' ? '🛎️ Reception Desk' :
               currentRole === 'admin' ? '🏛️ Hospital Admin' : '👤 Patient Portal'}
            </span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500">
            Live
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 overflow-x-auto lg:overflow-visible">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap">
            Main Menu & Folders
          </div>
          <div className="flex lg:block gap-1 min-w-max lg:min-w-0">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-auto lg:w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20 translate-x-0.5'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          </div>
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
          <p className="font-bold text-slate-700 truncate">{currentUser.name}</p>
          <p className="text-[10px] text-slate-400 truncate">{currentUser.department || currentUser.role}</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch / Exit Portal</span>
        </button>
      </div>
    </aside>
  );
};
