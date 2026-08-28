import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
  Zap,
  RotateCcw,
  Check,
  Stethoscope,
  HeartPulse,
  Flame,
  ShieldAlert,
  Search
} from 'lucide-react';
import {
  SAMPLE_LAB_REPORTS_DATABASE,
  InterpretedLabReport,
  AnalyteReportItem
} from '../../data/labReportKnowledge';
import { parseLabReportText } from '../../utils/labReportOCR';
import { Investigation } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';

interface LabReportScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientGender?: 'Male' | 'Female';
  onImportInvestigations: (investigations: Investigation[], differentials?: string[]) => void;
}

export const LabReportScannerModal: React.FC<LabReportScannerModalProps> = ({
  isOpen,
  onClose,
  patientName = 'Active Patient',
  patientGender = 'Male',
  onImportInvestigations
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedReport, setSelectedReport] = useState<InterpretedLabReport>(SAMPLE_LAB_REPORTS_DATABASE[0]);
  const [customText, setCustomText] = useState(
    'Complete Blood Count:\nHb: 10.2\nWBC: 14500\nPlatelets: 1.8\nESR: 45\nCreatinine: 1.2\nRBS: 165'
  );
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: InterpretedLabReport) => {
    setSelectedReport(preset);
    showToast('info', 'Lab Report Loaded', `Loaded ${preset.reportTitle}`);
  };

  const handleScanCustomText = () => {
    setIsScanning(true);
    setTimeout(() => {
      const parsed = parseLabReportText(customText, patientGender, patientName);
      setSelectedReport(parsed);
      setIsScanning(false);
      showToast('success', 'OCR Analysis Complete', `Identified ${parsed.analytes.length} lab analytes with AI interpretation.`);
    }, 600);
  };

  const handleApplyToCase = () => {
    if (!selectedReport || selectedReport.analytes.length === 0) {
      showToast('error', 'No Analytes', 'Please select or scan a lab report first.');
      return;
    }

    const newInvestigations: Investigation[] = selectedReport.analytes.map((item, idx) => ({
      id: `inv-ocr-${Date.now()}-${idx}`,
      test_name: item.testName,
      category: item.category,
      requested_date: selectedReport.sampleDate,
      status: 'Result Ready',
      result_value: `${item.measuredValue} ${item.measuredUnit}`,
      normal_range: item.referenceRange,
      is_abnormal: item.status !== 'Normal',
      remarks: `${item.status}: ${item.clinicalInterpretation}`
    }));

    onImportInvestigations(newInvestigations, selectedReport.differentialsUpdated);
    onClose();
    showToast('success', 'Lab Findings Imported', `Added ${newInvestigations.length} laboratory test results to the active clinical case.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] max-h-[820px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-teal-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  AI Diagnostic Lab Report Scanner & OCR
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-wide border border-teal-500/30">
                  Panic Value Engine
                </span>
              </div>
              <p className="text-xs text-teal-200/80 font-medium">
                Automated Analyte Extraction, Biological Range Verification & Diagnostic Correlation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/10 p-0.5 rounded-xl border border-white/15 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'presets' ? 'bg-teal-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sample Clinical Reports
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'custom' ? 'bg-teal-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Custom OCR / Text
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* TOP SELECTOR OR OCR TEXT INPUT */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200">
          {activeTab === 'presets' ? (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Select Pre-Configured Clinical Demonstration Report:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_LAB_REPORTS_DATABASE.map(rep => {
                  const isSelected = selectedReport.id === rep.id;
                  return (
                    <button
                      key={rep.id}
                      type="button"
                      onClick={() => handleSelectPreset(rep)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs text-slate-900">{rep.reportTitle}</span>
                          {rep.panicAlertCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-extrabold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-rose-600" /> Panic
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">{rep.aiClinicalImpression}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold mt-2">
                        <span>{rep.analytes.length} Analytes</span>
                        <span className="text-teal-700 font-bold">{rep.abnormalCount} Abnormal</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Paste Lab Report OCR Text / Blood Test Values:</span>
                <button
                  type="button"
                  onClick={handleScanCustomText}
                  disabled={isScanning}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isScanning ? 'Analyzing OCR...' : 'Run AI Interpretation'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Paste lab report parameters (e.g. Hb: 11.2, Platelets: 0.45, Creatinine: 2.8, SGPT: 84)..."
                className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-teal-500 font-mono"
              />
            </div>
          )}
        </div>

        {/* MAIN BODY: REPORT ANALYSIS */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* CRITICAL PANIC ALERT BANNER */}
          {selectedReport.panicAlertCount > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 shadow-xs">
              <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-rose-950 uppercase tracking-wide">
                    CRITICAL LABORATORY PANIC VALUES DETECTED
                  </h4>
                  <Badge variant="danger" size="sm">Emergency Action Needed</Badge>
                </div>
                <p className="text-xs text-rose-900 font-semibold leading-relaxed">
                  {selectedReport.aiClinicalImpression}
                </p>
                <div className="mt-2 p-2.5 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-950 font-bold flex items-center gap-2">
                  <span className="text-rose-600">⚡ Immediate Action:</span>
                  <span>{selectedReport.suggestedAction}</span>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTE RESULTS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Laboratory Test Findings ({selectedReport.analytes.length} Analytes)
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Sample Date: {selectedReport.sampleDate}
              </span>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-[11px] font-bold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="p-3">Investigation Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Measured Value</th>
                    <th className="p-3">Biological Reference</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Clinical Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedReport.analytes.map((item, idx) => {
                    let statusBadge = <Badge variant="success" size="sm">Normal</Badge>;
                    let rowBg = 'hover:bg-slate-50/60';

                    if (item.status === 'Critical Low' || item.status === 'Critical High') {
                      statusBadge = <Badge variant="danger" size="sm">{item.status}</Badge>;
                      rowBg = 'bg-rose-50/40 hover:bg-rose-50/60';
                    } else if (item.status === 'High' || item.status === 'Low') {
                      statusBadge = <Badge variant="warning" size="sm">{item.status}</Badge>;
                      rowBg = 'bg-amber-50/30 hover:bg-amber-50/50';
                    }

                    return (
                      <tr key={idx} className={`${rowBg} transition-colors`}>
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                          {item.isPanicAlert && <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          <span>{item.testName}</span>
                        </td>
                        <td className="p-3 text-slate-500">{item.category}</td>
                        <td className="p-3 font-black text-slate-900 font-mono text-sm">
                          {item.measuredValue} <span className="text-xs font-normal text-slate-500">{item.measuredUnit}</span>
                        </td>
                        <td className="p-3 text-slate-600 font-mono">{item.referenceRange}</td>
                        <td className="p-3">{statusBadge}</td>
                        <td className="p-3 text-slate-700 font-medium max-w-xs">{item.clinicalInterpretation}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI DIFFERENTIALS CORRELATION */}
          {selectedReport.differentialsUpdated && selectedReport.differentialsUpdated.length > 0 && (
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  AI Suggested Differential Diagnoses based on Lab Findings:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedReport.differentialsUpdated.map((diff, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-900 text-xs font-bold shadow-2xs"
                    >
                      {diff}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-500 font-semibold">
            {selectedReport.analytes.length} tests ready for case sheet documentation.
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyToCase}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white text-xs font-black shadow-md shadow-teal-200 transition-all"
            >
              <Check className="w-4 h-4" />
              Import All Findings to Case Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
