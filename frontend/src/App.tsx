import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar, ActiveTab } from './components/common/Sidebar';
import { LoginScreen } from './components/common/LoginScreen';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { ReceptionDashboard } from './components/dashboard/ReceptionDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import { PatientTimeline } from './components/patients/PatientTimeline';
import { PatientHistoryView } from './components/patients/PatientHistoryView';
import { PatientRegistrationView } from './components/patients/PatientRegistrationView';
import { PreConsultationIntake } from './components/patients/PreConsultationIntake';
import { PatientRegistrationModal } from './components/patients/PatientRegistrationModal';
import { AppointmentList } from './components/appointments/AppointmentList';
import { TodaysQueue } from './components/appointments/TodaysQueue';
import { NewCaseTaking } from './components/cases/NewCaseTaking';
import { MedicalCaseSheetPDF } from './components/reports/MedicalCaseSheetPDF';
import { AICaseAssistantView } from './components/ai/AICaseAssistantModal';
import { StaffManagement } from './components/admin/StaffManagement';
import { PatientRegistry } from './components/admin/PatientRegistry';
import { AuditLogViewer } from './components/admin/AuditLogViewer';
import { HospitalSettings } from './components/admin/HospitalSettings';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { DrugCatalogExplorer } from './components/clinical/DrugCatalogExplorer';
import { EmergencyTriageModal } from './components/clinical/EmergencyTriageModal';
import { PediatricCalculatorModal } from './components/clinical/PediatricCalculatorModal';
import { LabReportScannerModal } from './components/clinical/LabReportScannerModal';
import { Modal } from './components/common/Modal';
import { CaseRecord, Patient, Investigation } from './types';
import { FileText, Printer, Stethoscope, Clock3, CalendarCheck2 } from 'lucide-react';
import { formatDate, formatDateTime } from './utils/formatters';
import { Badge } from './components/common/Badge';

const MainAppContent: React.FC = () => {
  const { currentRole, currentUser, isAuthenticated, canAccessAIFeatures } = useAuth();
  const { patients, cases, hospitalInfo, clearCaseRecords } = useHospital();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPatientTimelineId, setSelectedPatientTimelineId] = useState<string | null>(null);
  const [selectedCaseForReport, setSelectedCaseForReport] = useState<CaseRecord | null>(null);
  const [isRegisterPatientOpen, setIsRegisterPatientOpen] = useState(false);
  const [caseTakingPatientId, setCaseTakingPatientId] = useState<string | undefined>(undefined);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isPediatricModalOpen, setIsPediatricModalOpen] = useState(false);
  const [isGlobalLabScannerOpen, setIsGlobalLabScannerOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Handlers
  const handleOpenTimeline = (patientId: string) => {
    setSelectedPatientTimelineId(patientId);
  };

  const handleStartNewCase = (patientId?: string) => {
    setCaseTakingPatientId(patientId || (patients.length > 0 ? patients[0].patient_id : undefined));
    setSelectedPatientTimelineId(null);
    setActiveTab('new-case');
  };

  const handleCaseFinished = (savedCase: CaseRecord) => {
    setSelectedCaseForReport(savedCase);
    setActiveTab('dashboard');
  };

  // Find patient for timeline
  const timelinePatient = selectedPatientTimelineId
    ? patients.find(p => p.patient_id === selectedPatientTimelineId)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenNewPatientModal={() => setIsRegisterPatientOpen(true)}
        onSelectPatient={patientId => handleOpenTimeline(patientId)}
        onSelectCase={caseId => {
          const found = cases.find(c => c.case_id === caseId);
          if (found) setSelectedCaseForReport(found);
        }}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto min-w-0">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={tab => {
            setSelectedPatientTimelineId(null);
            setActiveTab(tab);
          }}
        />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* If a patient timeline is specifically open */}
          {timelinePatient ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedPatientTimelineId(null)}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 mb-2"
              >
                ← Back to Previous View
              </button>
              <PatientTimeline
                patient={timelinePatient}
                onStartNewVisit={pid => handleStartNewCase(pid)}
              />
            </div>
          ) : (
            <>
              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <>
                  {currentRole === 'doctor' && (
                    <DoctorDashboard
                      onStartNewCase={pid => handleStartNewCase(pid)}
                      onViewPatientTimeline={pid => handleOpenTimeline(pid)}
                      onOpenAppointments={() => setActiveTab('appointments')}
                      onOpenLabScanner={() => setIsGlobalLabScannerOpen(true)}
                      onNavigateModule={module => {
                        setSelectedPatientTimelineId(null);
                        setActiveTab(module as ActiveTab);
                      }}
                    />
                  )}

                  {currentRole === 'receptionist' && (
                    <ReceptionDashboard
                      onOpenRegisterPatient={() => setIsRegisterPatientOpen(true)}
                      onOpenAppointments={() => setActiveTab('appointments')}
                    />
                  )}

                  {currentRole === 'admin' && (
                    <AdminDashboard onNavigateTab={tab => setActiveTab(tab)} />
                  )}

                  {currentRole === 'patient' && <PatientDashboard onOpenPreConsultation={() => setActiveTab('pre-consultation')} />}
                </>
              )}

              {/* START CASE TAKING WIZARD */}
              {activeTab === 'new-case' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-sky-600" />
                        Structured Clinical Case Taking
                      </h2>
                      <p className="text-xs text-slate-500">
                        AI-assisted history collection, vitals scoring, investigations & prescription
                      </p>
                    </div>
                  </div>

                  <NewCaseTaking
                    initialPatientId={caseTakingPatientId}
                    onFinishCase={handleCaseFinished}
                    onCancel={() => {
                      setActiveTab('dashboard');
                    }}
                  />
                </div>
              )}

              {/* PATIENT REGISTRATION */}
              {activeTab === 'patient-registration' && (
                <PatientRegistrationView
                  onStartCase={handleStartNewCase}
                />
              )}

              {/* PATIENT MEDICAL HISTORY */}
              {activeTab === 'patient-history' && (
                <PatientHistoryView onStartCase={handleStartNewCase} />
              )}

              {/* TODAY'S REGISTERED PATIENT QUEUE */}
              {activeTab === 'todays-queue' && (
                <TodaysQueue onStartCase={handleStartNewCase} onViewHistory={handleOpenTimeline} />
              )}

              {/* APPOINTMENTS & QUEUE */}
              {activeTab === 'appointments' && (
                <AppointmentList
                  onStartConsultationCase={pid => handleStartNewCase(pid)}
                />
              )}

              {/* ALL CASE RECORDS LIST */}
              {activeTab === 'cases' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-sky-600" />
                        All Medical Case Records ({cases.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Search and print signed clinical visit case sheets
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={cases.length === 0}
                      onClick={() => {
                        if (window.confirm('Delete all saved case records? This cannot be undone.')) {
                          clearCaseRecords();
                        }
                      }}
                      className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold"
                    >
                      Delete All Records
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cases.map(c => {
                      const patient = patients.find(p => p.patient_id === c.patient_id);
                      return (
                        <div
                          key={c.case_id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {patient?.name || c.patient_id}
                              </span>
                              <span className="font-mono text-slate-400 font-bold">({c.case_id})</span>
                              <Badge variant="primary" size="sm">Visit #{c.visit_number}</Badge>
                              <Badge variant={c.status === 'Completed' || c.status === 'Signed' ? 'success' : 'warning'} size="sm">
                                {c.status}
                              </Badge>
                            </div>
                            <p className="text-slate-700 font-semibold mt-1">
                              Diagnosis: {c.diagnosis.final_diagnosis || c.chief_complaint.main_complaint}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Attending: Dr. {c.doctor_name} • Date: {formatDateTime(c.created_at)} • Prescriptions: {c.prescription.length} items
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenTimeline(c.patient_id)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                            >
                              Timeline
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedCaseForReport(c)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-2xs"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              View / Print Case Sheet
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI ASSISTANT EXPLORER */}
              {activeTab === 'ai-assistant' && (
                canAccessAIFeatures ? (
                  <AICaseAssistantView
                    onSelectSymptomForCase={symptom => {
                      handleStartNewCase();
                    }}
                  />
                ) : (
                  <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-xs text-center">
                    <h3 className="text-lg font-black text-rose-700">Access Denied</h3>
                    <p className="mt-2 text-sm text-slate-600">This AI feature is restricted to admin users only.</p>
                  </div>
                )
              )}

              {/* ADMIN: STAFF ROSTER */}
              {activeTab === 'staff' && <StaffManagement />}

              {/* ADMIN: PATIENT REGISTRY */}
              {activeTab === 'patient-registry' && <PatientRegistry />}

              {/* ADMIN: AUDIT LOGS */}
              {activeTab === 'audit-logs' && <AuditLogViewer />}

              {/* ADMIN: CLINICAL ANALYTICS */}
              {activeTab === 'analytics' && (
                canAccessAIFeatures ? <AnalyticsView /> : (
                  <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-xs text-center">
                    <h3 className="text-lg font-black text-rose-700">Access Denied</h3>
                    <p className="mt-2 text-sm text-slate-600">AI analytics is available only to admin users.</p>
                  </div>
                )
              )}

              {/* ADMIN: HOSPITAL SETTINGS */}
              {activeTab === 'settings' && <HospitalSettings />}

              {/* PHARMACOPEIA / DRUG FORMULARY */}
              {activeTab === 'formulary' && <DrugCatalogExplorer />}

              {/* PATIENT VIEWS */}
              {activeTab === 'my-records' && <PatientDashboard />}
              {activeTab === 'my-timeline' && (
                <PatientTimeline
                  patient={patients.find(p => p.patient_id === currentUser.patientId) || patients[0]}
                />
              )}
              {activeTab === 'pre-consultation' && (
                <PreConsultationIntake
                  patient={patients.find(p => p.patient_id === currentUser.patientId) || patients[0]}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Emergency Protocols Modal */}
      <EmergencyTriageModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Pediatric Dose Calculator Modal */}
      <PediatricCalculatorModal
        isOpen={isPediatricModalOpen}
        onClose={() => setIsPediatricModalOpen(false)}
      />

      {/* Global Patient Registration Modal */}
      <PatientRegistrationModal
        isOpen={isRegisterPatientOpen}
        onClose={() => setIsRegisterPatientOpen(false)}
        onPatientCreated={newPatient => {
          handleOpenTimeline(newPatient.patient_id);
        }}
      />

      {/* Global AI Diagnostic Lab Report Scanner Modal */}
      <LabReportScannerModal
        isOpen={isGlobalLabScannerOpen}
        onClose={() => setIsGlobalLabScannerOpen(false)}
        onImportInvestigations={(invs, diffs) => {
          setIsGlobalLabScannerOpen(false);
          setActiveTab('new-case');
        }}
      />

      {/* Global Case Sheet PDF Modal */}
      {selectedCaseForReport && (
        <Modal
          isOpen={Boolean(selectedCaseForReport)}
          onClose={() => setSelectedCaseForReport(null)}
          title={`Clinical Case Sheet — ${selectedCaseForReport.case_id}`}
          subtitle={`Visit #${selectedCaseForReport.visit_number} • Dr. ${selectedCaseForReport.doctor_name}`}
          maxWidth="5xl"
        >
          <MedicalCaseSheetPDF
            caseRecord={selectedCaseForReport}
            patient={patients.find(p => p.patient_id === selectedCaseForReport.patient_id) || patients[0]}
            hospitalInfo={hospitalInfo}
            autoDownload={selectedCaseForReport.status !== 'Draft'}
            onClose={() => setSelectedCaseForReport(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HospitalProvider>
          <MainAppContent />
        </HospitalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
