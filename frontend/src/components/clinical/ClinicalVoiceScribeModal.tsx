import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Check,
  Languages,
  Activity,
  AlertTriangle,
  FileCheck2,
  Stethoscope,
  User,
  HeartPulse,
  Pill,
  Clock,
  Send,
  Zap,
  Radio
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  DEMO_VOICE_SCENARIOS
} from '../../data/multilingualClinicalDictionary';
import {
  ClinicalVoiceDictation,
  ClinicalTextToSpeech
} from '../../utils/speechRecognition';
import { parseClinicalSpeechOrText } from '../../data/aiClinicalKnowledge';
import {
  SupportedLanguageCode,
  ParsedClinicalVoiceData,
  VoiceScribeScenario,
  AmbientSpeakerTurn
} from '../../types';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';

interface ClinicalVoiceScribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToCase: (data: ParsedClinicalVoiceData) => void;
  initialLanguage?: SupportedLanguageCode;
}

export const ClinicalVoiceScribeModal: React.FC<ClinicalVoiceScribeModalProps> = ({
  isOpen,
  onClose,
  onApplyToCase,
  initialLanguage = 'hi-IN'
}) => {
  const { showToast } = useToast();

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>(initialLanguage);
  const [scribeMode, setScribeMode] = useState<'dictation' | 'ambient'>('dictation');
  const [activeSpeaker, setActiveSpeaker] = useState<'Doctor' | 'Patient'>('Patient');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Transcript states
  const [transcriptText, setTranscriptText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [speakerTurns, setSpeakerTurns] = useState<AmbientSpeakerTurn[]>([]);
  const [parsedData, setParsedData] = useState<ParsedClinicalVoiceData | null>(null);

  // Audio Visualizer Volume level (0-100)
  const [audioVolume, setAudioVolume] = useState<number>(0);

  // Engines
  const dictationEngineRef = useRef<ClinicalVoiceDictation | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const volumeIntervalRef = useRef<any>(null);

  // Initialize engine on open or language switch
  useEffect(() => {
    if (isOpen) {
      const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
      const speechCode = currentLangConfig?.speechCode || 'en-IN';

      const engine = new ClinicalVoiceDictation(speechCode);
      dictationEngineRef.current = engine;

      return () => {
        engine.stop();
        ClinicalTextToSpeech.stop();
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      };
    }
  }, [isOpen, selectedLanguage]);

  // Real-time NLP parsing whenever transcriptText changes
  useEffect(() => {
    if (transcriptText.trim().length > 3) {
      const result = parseClinicalSpeechOrText(transcriptText, selectedLanguage);
      result.conversationTurns = speakerTurns;
      setParsedData(result);
    } else {
      setParsedData(null);
    }
  }, [transcriptText, selectedLanguage, speakerTurns]);

  // Audio level animation tick
  useEffect(() => {
    if (isRecording) {
      volumeIntervalRef.current = setInterval(() => {
        if (dictationEngineRef.current) {
          const vol = dictationEngineRef.current.getAudioVolumeLevel();
          // Add a subtle organic bounce for visuals
          const simulatedVol = vol > 0 ? vol : Math.floor(Math.random() * 35) + 15;
          setAudioVolume(simulatedVol);
        }
      }, 100);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setAudioVolume(0);
    }

    return () => {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const handleToggleRecord = async () => {
    if (!dictationEngineRef.current) return;

    if (isRecording) {
      dictationEngineRef.current.stop();
      setIsRecording(false);
      showToast('info', 'Voice Scribe Paused', 'Microphone recording stopped.');
    } else {
      if (!dictationEngineRef.current.isSupported()) {
        showToast(
          'warning',
          'Live Mic Not Supported',
          'Web Speech API not available in this browser. You can use the Interactive Demo Audio Scenarios below!'
        );
        return;
      }

      setInterimText('');
      const started = await dictationEngineRef.current.start(
        result => {
          if (result.isFinal && result.transcript) {
            setTranscriptText(prev => {
              const appended = prev ? `${prev} ${result.transcript}` : result.transcript;
              return appended;
            });
            setInterimText('');

            // If in ambient mode, add speaker turn
            if (scribeMode === 'ambient') {
              const newTurn: AmbientSpeakerTurn = {
                id: `turn-${Date.now()}`,
                speaker: activeSpeaker,
                timestamp: formatTimer(recordingSeconds),
                originalText: result.transcript
              };
              setSpeakerTurns(prev => [...prev, newTurn]);
            }
          } else {
            setInterimText(result.interimTranscript || result.transcript);
          }
        },
        error => {
          console.warn('Speech recognition error:', error);
          setIsRecording(false);
          if (error === 'not-allowed') {
            showToast('error', 'Microphone Denied', 'Please grant browser microphone permission to speak.');
          } else {
            showToast('info', 'Microphone Idle', 'No speech detected or network interrupted.');
          }
        },
        () => {
          setIsRecording(false);
        }
      );

      if (started) {
        setIsRecording(true);
        showToast('success', 'Listening...', `Speaking in ${currentLangConfig.name}. Natural speech is parsed automatically.`);
      }
    }
  };

  const handleLanguageChange = (code: SupportedLanguageCode) => {
    setSelectedLanguage(code);
    const cfg = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (dictationEngineRef.current && cfg) {
      dictationEngineRef.current.setLanguage(cfg.speechCode);
    }
    showToast('info', 'Language Changed', `Voice Scribe recognition set to ${cfg?.name || code}`);
  };

  const handleSelectScenario = (scenario: VoiceScribeScenario) => {
    setSelectedLanguage(scenario.language);
    setScribeMode(scenario.mode);
    setTranscriptText(scenario.audioScript);
    if (scenario.turns) {
      setSpeakerTurns(scenario.turns);
    } else {
      setSpeakerTurns([]);
    }
    showToast('success', 'Scenario Loaded', `Loaded ${scenario.title}. AI extracted symptoms, duration & vitals.`);
  };

  const handlePlayScenarioAudio = (scenario: VoiceScribeScenario) => {
    handleSelectScenario(scenario);
    if (ClinicalTextToSpeech.isSupported()) {
      setIsSpeakingTTS(true);
      ClinicalTextToSpeech.speak(
        scenario.audioScript,
        scenario.language === 'hinglish' ? 'hi-IN' : scenario.language,
        () => setIsSpeakingTTS(false)
      );
      showToast('info', 'Playing Clinical Audio', `Synthesizing speech in ${scenario.languageLabel}...`);
    } else {
      showToast('info', 'Text-to-Speech Preview', 'Scenario transcript analyzed by AI.');
    }
  };

  const handleStopTTS = () => {
    ClinicalTextToSpeech.stop();
    setIsSpeakingTTS(false);
  };

  const handleClearAll = () => {
    setTranscriptText('');
    setInterimText('');
    setSpeakerTurns([]);
    setParsedData(null);
    setRecordingSeconds(0);
    ClinicalTextToSpeech.stop();
    setIsSpeakingTTS(false);
  };

  const handleApply = () => {
    if (!parsedData || !parsedData.chiefComplaint) {
      showToast('error', 'No Clinical Data', 'Please dictate or select a clinical voice scenario first.');
      return;
    }

    onApplyToCase(parsedData);
    onClose();
    showToast('success', 'Transferred to Case Taking', 'Extracted symptoms, duration, vitals, and medications loaded into the case wizard!');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] max-h-[850px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4 border-b border-sky-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  AI Multi-Lingual Clinical Voice Scribe
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
                  10+ Indian Languages
                </span>
              </div>
              <p className="text-xs text-sky-200/80 font-medium">
                Ambient Doctor-Patient Consultation Scribe & Clinical Entity Extraction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs text-white">
              <Languages className="w-4 h-4 text-amber-400" />
              <select
                value={selectedLanguage}
                onChange={e => handleLanguageChange(e.target.value as SupportedLanguageCode)}
                className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer pr-1"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 font-semibold">
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-white/10 p-0.5 rounded-xl border border-white/15 text-xs">
              <button
                type="button"
                onClick={() => setScribeMode('dictation')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  scribeMode === 'dictation' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Doctor Dictation
              </button>
              <button
                type="button"
                onClick={() => setScribeMode('ambient')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  scribeMode === 'ambient' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Ambient Scribe
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* AUDIO VISUALIZER & CONTROL RIBBON */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Record / Pause Mic Button */}
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-voice-pulse ring-4 ring-rose-200'
                  : 'bg-sky-600 hover:bg-sky-700 text-white hover:shadow-sky-200'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? 'PAUSE RECORDING' : 'START LIVE DICTATION'}</span>
            </button>

            {/* Recording Timer */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-mono">{formatTimer(recordingSeconds)}</span>
              {isRecording && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-0.5" />
              )}
            </div>

            {/* Speaker Toggle in Ambient Mode */}
            {scribeMode === 'ambient' && isRecording && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-[10px] text-slate-400 uppercase">Speaking Now:</span>
                <button
                  type="button"
                  onClick={() => setActiveSpeaker('Doctor')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                    activeSpeaker === 'Doctor' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  👨‍⚕️ Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSpeaker('Patient')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                    activeSpeaker === 'Patient' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🧑 Patient
                </button>
              </div>
            )}
          </div>

          {/* Real-time Dynamic Audio Frequency Spectrum Waveform Visualizer */}
          <div className="flex-1 max-w-xs mx-4 hidden md:flex items-center gap-1 h-8 px-3 bg-slate-900 rounded-xl justify-center">
            {Array.from({ length: 18 }).map((_, idx) => {
              const height = isRecording
                ? Math.max(15, Math.min(100, (audioVolume * ((idx % 5) + 1) * 1.5) % 100))
                : isSpeakingTTS
                ? Math.max(20, Math.sin(idx + Date.now() / 200) * 80)
                : 15;

              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isRecording
                      ? 'bg-gradient-to-t from-emerald-500 to-sky-400'
                      : isSpeakingTTS
                      ? 'bg-gradient-to-t from-amber-400 to-rose-400'
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {isSpeakingTTS ? (
              <button
                type="button"
                onClick={handleStopTTS}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" />
                Stop Audio
              </button>
            ) : (
              transcriptText && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSpeakingTTS(true);
                    ClinicalTextToSpeech.speak(transcriptText, selectedLanguage, () => setIsSpeakingTTS(false));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors"
                  title="Speak transcript using Text-to-Speech"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                  Read Aloud (TTS)
                </button>
              )
            )}

            <button
              type="button"
              onClick={handleClearAll}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Clear Transcript"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: SPLIT VIEW */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
          {/* LEFT PANEL: TRANSCRIPT STREAM & AUDIO SCENARIOS (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-white p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Top Prompt Banner */}
            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-start gap-2.5 text-xs text-sky-950">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Recognizing in {currentLangConfig.name}: </span>
                <span className="text-slate-600">
                  Speak chief complaints, symptoms, duration, vitals (BP, pulse, temp), or medications.
                </span>
              </div>
            </div>

            {/* Live Transcript Box */}
            <div className="flex-1 flex flex-col min-h-[220px] bg-slate-50 rounded-2xl border border-slate-200 p-4 relative focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                  Live Transcript Stream ({scribeMode === 'ambient' ? 'Doctor-Patient Dialogue' : 'Clinical Dictation'})
                </span>
                {isRecording && (
                  <span className="text-[11px] text-rose-600 font-extrabold flex items-center gap-1 animate-pulse">
                    ● Recording Voice
                  </span>
                )}
              </div>

              {/* Speaker Dialogue Turns or Single Stream */}
              {scribeMode === 'ambient' && speakerTurns.length > 0 ? (
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-52 pr-1">
                  {speakerTurns.map(turn => (
                    <div
                      key={turn.id}
                      className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                        turn.speaker === 'Doctor'
                          ? 'bg-indigo-50 border border-indigo-100 text-indigo-950 ml-4'
                          : 'bg-teal-50 border border-teal-100 text-teal-950 mr-4'
                      }`}
                    >
                      <span className="font-extrabold text-[10px] uppercase px-1.5 py-0.5 rounded-md bg-white border shrink-0">
                        {turn.speaker === 'Doctor' ? '👨‍⚕️ Dr' : '🧑 Pt'} • {turn.timestamp}
                      </span>
                      <p className="font-medium leading-relaxed">{turn.originalText}</p>
                    </div>
                  ))}
                  {interimText && (
                    <div className="p-2 rounded-xl bg-slate-200/50 text-xs italic text-slate-600">
                      {activeSpeaker}: {interimText}...
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  rows={6}
                  value={transcriptText + (interimText ? ` [${interimText}...]` : '')}
                  onChange={e => setTranscriptText(e.target.value)}
                  placeholder="Click 'Start Live Dictation' to speak in Hindi, Tamil, Telugu, English, etc., or choose a demonstration audio scenario below..."
                  className="w-full flex-1 bg-transparent text-sm text-slate-800 outline-none resize-none font-medium leading-relaxed placeholder:text-slate-400 placeholder:italic"
                />
              )}
            </div>

            {/* MULTI-LINGUAL DEMO AUDIO SCENARIOS (For Hackathon Judges) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Instant Demonstration Scenarios (Multi-Lingual Audio + TTS):
                </span>
                <span className="text-[10px] text-slate-500">1-Click Play & Extract</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_VOICE_SCENARIOS.map(sc => (
                  <div
                    key={sc.id}
                    className="p-3 bg-white hover:bg-sky-50/50 rounded-xl border border-slate-200 hover:border-sky-300 transition-all text-xs flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 group-hover:text-sky-700 line-clamp-1">
                          {sc.title}
                        </span>
                        <Badge variant="primary" size="sm">
                          {sc.languageLabel.split(' ')[0]}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-2">
                        "{sc.audioScript.slice(0, 75)}..."
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-600 font-semibold font-mono">
                        {sc.expectedExtractionSummary.duration} • Rx: {sc.expectedExtractionSummary.rxCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayScenarioAudio(sc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-2xs transition-all"
                      >
                        <Play className="w-2.5 h-2.5 fill-white" />
                        Play & Analyze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: LIVE STRUCTURED CLINICAL EXTRACTION (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-slate-50/70 p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Real-Time Clinical Extraction
              </h3>
              {parsedData && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  ✓ Active NLP
                </span>
              )}
            </div>

            {parsedData ? (
              <div className="space-y-3.5">
                {/* 1. Critical Red Flags Alert */}
                {parsedData.detectedRedFlags && parsedData.detectedRedFlags.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Critical Red Flags Detected
                    </div>
                    <ul className="text-[11px] text-rose-700 list-disc list-inside space-y-0.5 font-semibold">
                      {parsedData.detectedRedFlags.map((rf, i) => (
                        <li key={i}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. Chief Complaint & Category */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span>Chief Complaint:</span>
                    <Badge variant="primary" size="sm">{parsedData.detectedCategory}</Badge>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {parsedData.chiefComplaint || 'Pending symptom detection...'}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
                      Duration: {parsedData.durationValue} {parsedData.durationUnit}
                    </div>
                    <div className="px-2.5 py-1 bg-sky-50 rounded-lg border border-sky-200 text-xs font-bold text-sky-900">
                      Severity: {parsedData.severity}
                    </div>
                  </div>
                </div>

                {/* 3. Extracted Vitals */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                    Parsed Vital Signs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">TEMP</span>
                      <span className="text-xs font-black text-slate-900">
                        {parsedData.vitalsExtracted.temp ? `${parsedData.vitalsExtracted.temp}°F` : '—'}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">BP</span>
                      <span className="text-xs font-black text-slate-900">
                        {parsedData.vitalsExtracted.bpSys && parsedData.vitalsExtracted.bpDia
                          ? `${parsedData.vitalsExtracted.bpSys}/${parsedData.vitalsExtracted.bpDia}`
                          : '—'}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">PULSE</span>
                      <span className="text-xs font-black text-slate-900">
                        {parsedData.vitalsExtracted.pulse ? `${parsedData.vitalsExtracted.pulse} bpm` : '—'}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">SPO2</span>
                      <span className="text-xs font-black text-slate-900">
                        {parsedData.vitalsExtracted.spo2 ? `${parsedData.vitalsExtracted.spo2}%` : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Associated Symptoms Tags */}
                {parsedData.associatedSymptoms.length > 0 && (
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Associated Symptoms ({parsedData.associatedSymptoms.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.associatedSymptoms.map((sym, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Prescriptions Detected from Speech */}
                {parsedData.prescriptions && parsedData.prescriptions.length > 0 && (
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-purple-600" />
                      Medications Prescribed ({parsedData.prescriptions.length})
                    </span>
                    <div className="space-y-1.5">
                      {parsedData.prescriptions.map((rx, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-purple-50/60 rounded-xl border border-purple-100 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-purple-950">{rx.medicine_name}</span>
                            <p className="text-[10px] text-purple-700">{rx.dosage} • {rx.frequency}</p>
                          </div>
                          <Badge variant="purple" size="sm">{rx.duration_value} {rx.duration_unit}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3 bg-white rounded-2xl border border-dashed border-slate-200">
                <Radio className="w-8 h-8 text-slate-300 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-slate-600">Waiting for Voice Dictation...</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Start speaking in any supported language or select a demo clinical scenario on the left.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            {parsedData ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Structured clinical entities ready for automatic case sheet entry.
              </span>
            ) : (
              <span>Speak or select an audio demo to populate clinical fields hands-free.</span>
            )}
          </div>

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
              onClick={handleApply}
              disabled={!parsedData || !parsedData.chiefComplaint}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Check className="w-4 h-4" />
              Transfer to Case Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
