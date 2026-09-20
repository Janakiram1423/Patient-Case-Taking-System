import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Languages,
  Radio,
  ExternalLink
} from 'lucide-react';
import {
  ClinicalVoiceDictation,
  ClinicalTextToSpeech,
  SAMPLE_VOICE_PROMPTS
} from '../../utils/speechRecognition';
import { parseClinicalSpeechOrText } from '../../data/aiClinicalKnowledge';
import { SUPPORTED_LANGUAGES, DEMO_VOICE_SCENARIOS } from '../../data/multilingualClinicalDictionary';
import { SupportedLanguageCode, ParsedClinicalVoiceData } from '../../types';
import { useToast } from '../../context/ToastContext';

interface VoiceInputButtonProps {
  onTranscript: (rawText: string, parsedData?: ParsedClinicalVoiceData) => void;
  label?: string;
  variant?: 'button' | 'icon' | 'banner' | 'pill';
  autoParse?: boolean;
  onOpenFullScribe?: () => void;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  label = 'Voice Scribe',
  variant = 'button',
  autoParse = true,
  onOpenFullScribe
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>('hi-IN');
  const [dictationEngine, setDictationEngine] = useState<ClinicalVoiceDictation | null>(null);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
    const engine = new ClinicalVoiceDictation(langConfig?.speechCode || 'en-IN');
    setDictationEngine(engine);
    return () => {
      engine.stop();
    };
  }, [selectedLanguage]);

  const handleToggleRecord = async () => {
    if (!dictationEngine) return;

    if (isRecording) {
      dictationEngine.stop();
      setIsRecording(false);
      showToast('info', 'Dictation Stopped', 'Speech recording paused.');
    } else {
      if (!dictationEngine.isSupported()) {
        showToast(
          'warning',
          'Web Speech API Not Available',
          'Your browser does not support live microphone recognition. Choose an interactive clinical preset below!'
        );
        setShowSamplesModal(true);
        return;
      }

      const started = await dictationEngine.start(
        result => {
          if (result.transcript) {
            const parsed = autoParse ? parseClinicalSpeechOrText(result.transcript, selectedLanguage) : undefined;
            onTranscript(result.transcript, parsed);
          }
        },
        error => {
          console.warn('Speech error:', error);
          setIsRecording(false);
          if (error === 'not-allowed') {
            showToast('error', 'Microphone Access Denied', 'Please allow microphone permissions in browser settings.');
          } else if (error === 'network') {
            showToast('error', 'Voice service unavailable', 'Live browser dictation was interrupted. Check your internet connection or use a clinical demo scenario.');
          } else {
            showToast('warning', 'Voice dictation stopped', 'No usable speech was received. Check your microphone and try again.');
          }
        },
        () => {
          setIsRecording(false);
        }
      );

      if (started) {
        setIsRecording(true);
        const langName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'Multi-lingual';
        showToast('info', `Listening (${langName})...`, 'Speak clinical symptoms, vitals, or case notes clearly.');
      } else {
        setShowSamplesModal(true);
      }
    }
  };

  const handleSelectSample = (sample: string, langCode: SupportedLanguageCode = 'en-IN') => {
    const parsed = autoParse ? parseClinicalSpeechOrText(sample, langCode) : undefined;
    onTranscript(sample, parsed);
    setShowSamplesModal(false);
    showToast('success', 'Voice Dictation Analyzed', 'Clinical speech processed and parsed by AI.');
  };

  // BANNER VARIANT (Used at the top of Case Taking)
  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-indigo-500/10 border border-sky-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl shrink-0 transition-all ${
            isRecording
              ? 'bg-rose-600 text-white animate-voice-pulse shadow-md shadow-rose-200'
              : 'bg-sky-600 text-white shadow-md shadow-sky-200'
          }`}>
            {isRecording ? <MicOff className="w-5 h-5" /> : <Radio className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Multi-Lingual AI Voice Clinical Scribe
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase tracking-wide">
                10+ Languages
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isRecording
                ? 'Listening actively... Speak in Hindi, Tamil, Telugu, English, etc. Symptoms & vitals are parsed in real time.'
                : 'Dictate clinical findings hands-free in Indian languages, or open the Ambient Consultation Scribe Studio.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Quick Language Selector */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <Languages className="w-3.5 h-3.5 text-sky-600" />
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value as SupportedLanguageCode)}
              className="bg-transparent text-slate-800 font-bold text-xs outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleToggleRecord}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-voice-pulse'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isRecording ? 'Stop Recording' : 'Start Dictation'}</span>
          </button>

          {onOpenFullScribe ? (
            <button
              type="button"
              onClick={onOpenFullScribe}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Full Scribe Studio</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSamplesModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Presets</span>
            </button>
          )}
        </div>

        {/* Multi-lingual Presets Modal */}
        {showSamplesModal && renderPresetsModal()}
      </div>
    );
  }

  // ICON VARIANT
  if (variant === 'icon') {
    return (
      <div className="relative inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleToggleRecord}
          className={`p-2 rounded-xl border transition-all ${
            isRecording
              ? 'bg-rose-500 text-white border-rose-600 animate-voice-pulse shadow-md'
              : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
          }`}
          title={isRecording ? 'Stop Recording' : `Start Voice Dictation (${selectedLanguage})`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {onOpenFullScribe ? (
          <button
            type="button"
            onClick={onOpenFullScribe}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Open AI Multi-Lingual Voice Scribe Studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowSamplesModal(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
            title="Clinical Speech Samples"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </button>
        )}

        {showSamplesModal && renderPresetsModal()}
      </div>
    );
  }

  // DEFAULT BUTTON VARIANT
  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggleRecord}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
          isRecording
            ? 'bg-rose-600 text-white animate-voice-pulse ring-2 ring-rose-300'
            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-sky-300'
        }`}
      >
        {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-sky-600" />}
        <span>{isRecording ? 'Listening...' : label}</span>
      </button>

      {onOpenFullScribe && (
        <button
          type="button"
          onClick={onOpenFullScribe}
          className="p-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
          title="Open Voice Scribe Studio"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        </button>
      )}

      {showSamplesModal && renderPresetsModal()}
    </div>
  );

  function renderPresetsModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Multi-Lingual Clinical Audio Presets</h3>
            </div>
            <button
              onClick={() => setShowSamplesModal(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Select a multi-lingual doctor dictation scenario to auto-fill symptoms, duration, and vitals:
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {DEMO_VOICE_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectSample(sc.audioScript, sc.language)}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50 text-xs text-slate-700 transition-all flex items-start gap-2.5"
              >
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold shrink-0">
                  {sc.languageLabel.split(' ')[0]}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{sc.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{sc.audioScript}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
};
