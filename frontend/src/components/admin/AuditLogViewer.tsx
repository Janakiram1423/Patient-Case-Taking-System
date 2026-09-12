import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  FileSpreadsheet,
  ShieldCheck,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { formatDateTime, exportToCSV } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEntity = selectedEntity === 'All' || log.entity_type === selectedEntity;
    const matchesRole = selectedRole === 'All' || log.user_role.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesEntity && matchesRole;
  });

  const handleExportCSV = () => {
    exportToCSV(
      `Hospital_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`,
      auditLogs.map(l => ({
        'Log ID': l.log_id,
        Timestamp: l.timestamp,
        User: l.user_name,
        Role: l.user_role,
        Action: l.action,
        'Entity Type': l.entity_type,
        'Entity ID': l.entity_id,
        Details: l.details,
        'IP Address': l.ip_address
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg border border-purple-200 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tamper-Resistant Security Audit Trail
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              NABH / HIPAA compliant immutable access logs capturing all clinical changes, user logins, and case recordings.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-xs"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Export Audit Trail (CSV)
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by User, Action, Case ID, Patient ID, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedEntity}
            onChange={e => setSelectedEntity(e.target.value)}
            className="p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="All">All Entities</option>
            <option value="Case">Clinical Cases</option>
            <option value="Patient">Patients</option>
            <option value="Appointment">Appointments</option>
            <option value="User">Users / Staff</option>
            <option value="System">System Config</option>
          </select>

          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Doctor">Doctor</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No audit log entries matching your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="p-3.5 pl-5">Timestamp</th>
                  <th className="p-3.5">User & Role</th>
                  <th className="p-3.5">Action Executed</th>
                  <th className="p-3.5">Entity & ID</th>
                  <th className="p-3.5">Audit Details</th>
                  <th className="p-3.5 pr-5">IP / Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <tr key={log.log_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-slate-600">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>
                        <p>{log.user_name}</p>
                        <span className="text-[10px] text-slate-400 font-normal capitalize">
                          {log.user_role}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="purple" size="sm">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 text-[11px]">
                        {log.entity_type}: {log.entity_id}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-xs truncate font-medium">
                      {log.details}
                    </td>
                    <td className="p-3.5 pr-5 text-slate-400 font-mono text-[11px]">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
