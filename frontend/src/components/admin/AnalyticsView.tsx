import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  Stethoscope,
  PieChart,
  FileSpreadsheet
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { exportToCSV } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export const AnalyticsView: React.FC = () => {
  const { cases, patients, appointments, users } = useHospital();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Simulated monthly trends
  const monthlyData = [
    { month: 'Mar', visits: 180, cases: 140, newPatients: 45 },
    { month: 'Apr', visits: 240, cases: 210, newPatients: 62 },
    { month: 'May', visits: 310, cases: 275, newPatients: 84 },
    { month: 'Jun', visits: 290, cases: 260, newPatients: 78 },
    { month: 'Jul', visits: 380, cases: 340, newPatients: 105 },
    { month: 'Aug', visits: 420, cases: 390, newPatients: 120 }
  ];

  // Department distribution
  const deptCounts: Record<string, number> = {
    'General Medicine': 45,
    'Cardiology': 28,
    'Neurology': 20,
    'Pediatrics': 18,
    'Gastroenterology': 14,
    'Orthopedics': 12
  };

  const totalDeptPatients = Object.values(deptCounts).reduce((a, b) => a + b, 0);

  const handleExportAnalytics = () => {
    exportToCSV(`Hospital_Monthly_Analytics_${new Date().toISOString().split('T')[0]}.csv`, monthlyData);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg border border-sky-200 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Clinical & Operational Hospital Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Longitudinal patient trends, OPD volumes, department footfall, and disease epidemiological patterns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === range ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportAnalytics}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Average Daily Consults</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">24.5</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% vs last month
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Avg Consultation Duration</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">11.8 min</h3>
          <p className="text-[11px] text-sky-600 font-semibold mt-1">✓ Optimized with AI Intake</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Follow-up Retention Rate</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">88.4%</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Top Tier Compliance</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Prescription Accuracy</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">99.8%</h3>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Allergy screening active</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Consultation Trend (SVG Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Patient Volume & Case Recordings</h3>
              <p className="text-[11px] text-slate-400">Total Consultations vs New Patient Registrations</p>
            </div>
            <Badge variant="primary" size="sm">2026 Trend</Badge>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
            {monthlyData.map(item => {
              const heightPercent = (item.visits / 450) * 100;
              const casesPercent = (item.cases / 450) * 100;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.visits}
                  </div>
                  <div className="w-full max-w-[36px] flex items-end gap-1 h-full">
                    <div
                      className="w-1/2 bg-sky-500 rounded-t-lg transition-all group-hover:bg-sky-600"
                      style={{ height: `${heightPercent}%` }}
                      title={`Visits: ${item.visits}`}
                    />
                    <div
                      className="w-1/2 bg-teal-400 rounded-t-lg transition-all group-hover:bg-teal-500"
                      style={{ height: `${casesPercent}%` }}
                      title={`Cases: ${item.cases}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span className="font-medium text-slate-600">Total OPD Visits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-400" />
              <span className="font-medium text-slate-600">Digital Case Sheets Signed</span>
            </div>
          </div>
        </div>

        {/* Department Footfall Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Department Distribution</h3>
            <p className="text-[11px] text-slate-400">Patient share by clinical specialty</p>
          </div>

          <div className="space-y-3">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const percent = Math.round((count / totalDeptPatients) * 100);
              return (
                <div key={dept} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800">{dept}</span>
                    <span className="text-slate-500">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
