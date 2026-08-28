import React, { useState } from 'react';
import { ArrowRight, Bot, Send, ShieldAlert } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';

interface AICaseAssistantViewProps {
  onSelectSymptomForCase?: (symptom: string) => void;
  onNavigate?: (module: string) => void;
}

const getMedicalAnswer = (command: string) => {
  const text = command.toLowerCase();
  if (text.includes('fever')) return 'Fever is a raised body temperature. Check temperature, duration, hydration, associated symptoms, exposure history, and red flags. Urgent assessment is needed for confusion, breathing difficulty, shock, seizure, or severe dehydration.';
  if (text.includes('chest pain')) return 'Chest pain needs prompt triage. Check onset, character, radiation, breathing difficulty, sweating, nausea, vital signs, and cardiac risk factors. Treat severe or ongoing pain as urgent and follow local emergency protocol.';
  if (text.includes('blood pressure') || text.includes('bp')) return 'For a raised blood pressure reading, repeat it after rest using the correct cuff size and assess symptoms. Chest pain, neurological symptoms, severe headache, breathlessness, or very high readings require urgent clinical assessment.';
  if (text.includes('diabetes')) return 'For diabetes-related questions, review glucose readings, medicines, food intake, hydration, and symptoms of hypo- or hyperglycaemia. Altered consciousness, severe weakness, vomiting, or breathing changes require urgent assessment.';
  if (text.includes('emergency') || text.includes('urgent')) return 'For an emergency, assess airway, breathing, circulation, consciousness, and vital signs first. Activate the hospital emergency response and follow the local emergency protocol.';
  if (text.includes('patient') || text.includes('registered')) return 'Use Patient Registration for a new patient, Today\'s Queue for today\'s intake, and Patient Medical History for previous visits and clinical records.';
  if (text.includes('queue') || text.includes('today')) return 'Today\'s Queue contains patients registered today. Open a patient\'s case from the queue to begin the digital case-taking form.';
  return 'I can answer general hospital and medical questions, explain clinical terms, guide basic case-taking, and point you to the right workflow. Ask about symptoms, vitals, medicines, emergencies, patients, or today\'s queue.';
};

export const AICaseAssistantView: React.FC<AICaseAssistantViewProps> = ({ onSelectSymptomForCase, onNavigate }) => {
  const { patients, appointments } = useHospital();
  const { currentUser } = useAuth();
  const [command, setCommand] = useState('');
  const [answer, setAnswer] = useState('Ask a hospital or medical question.');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!command.trim()) return;
    setIsLoading(true);
    const result = await apiClient.askAssistant(
      command.trim(),
      `Available modules: Doctor Dashboard, Patient Registration, Patient Medical History, Today's Queue, Digital Case Taking Form, Automatic Case Summary & Review. Current workspace: ${patients.length} patients and ${appointments.length} appointments.`
    );
    setAnswer(result?.answer || getMedicalAnswer(command));
    const text = command.toLowerCase();
    if (onNavigate) {
      if (text.includes('dashboard')) onNavigate('dashboard');
      else if (text.includes('register')) onNavigate('patient-registration');
      else if (text.includes('history')) onNavigate('patient-history');
      else if (text.includes('queue')) onNavigate('todays-queue');
      else if (text.includes('case') || text.includes('form')) onNavigate('new-case');
      else if (text.includes('summary') || text.includes('review')) onNavigate('cases');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-md border border-slate-700 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-sky-400" />
          <div>
            <h4 className="font-bold text-sm">Normal AI Case Assistant</h4>
            <p className="text-[11px] text-slate-400">Hospital and medical questions</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-300">Ready</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={command}
          onChange={event => setCommand(event.target.value)}
          placeholder="Ask about fever, BP, emergency care, or queue..."
          className="min-w-0 flex-1 px-3 py-2.5 rounded-xl bg-white text-slate-900 text-xs outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Ask the hospital and medical assistant"
        />
        <button type="submit" className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white" aria-label="Send question" title="Send question">
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs leading-relaxed text-slate-200 min-h-16">
          {isLoading ? 'Thinking...' : answer}
      </div>

      <div className="flex items-start gap-2 text-[10px] text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Assistant guidance supports clinical work. The doctor makes the final decision.</span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>{currentUser.name} • {patients.length} patients • {appointments.length} appointments • All modules available</span>
        {onSelectSymptomForCase && (
          <button type="button" onClick={() => onSelectSymptomForCase(command)} className="inline-flex items-center gap-1 text-sky-300 hover:text-white font-bold">
            Start case <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
