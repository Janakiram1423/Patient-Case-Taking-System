import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}

interface PatientVoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  label?: string;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export const PatientVoiceInput: React.FC<PatientVoiceInputProps> = ({
  value,
  onChange,
  language = 'en-IN',
  label = 'Use voice input'
}) => {
  const { showToast } = useToast();
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const valueRef = useRef(value);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const speechWindow = window as SpeechWindow;
  const isSupported = Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
  }, []);

  const appendText = (spokenText: string) => {
    const cleanText = spokenText.trim();
    if (!cleanText) return;
    const existing = valueRef.current.trimEnd();
    const nextValue = existing ? `${existing} ${cleanText}` : cleanText;
    valueRef.current = nextValue;
    onChange(nextValue);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText('');
  };

  const startListening = () => {
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      showToast('warning', 'Voice input unavailable', 'Voice input is not supported in this browser.');
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.onresult = event => {
      let finalText = '';
      let currentInterim = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalText += result[0].transcript;
        else currentInterim += result[0].transcript;
      }
      if (finalText) appendText(finalText);
      setInterimText(currentInterim);
    };
    recognition.onerror = event => {
      setIsListening(false);
      setInterimText('');
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        showToast('error', 'Microphone permission required', 'Microphone permission is required.');
      } else if (event.error === 'no-speech') {
        showToast('warning', 'No speech detected', 'Please try speaking again.');
      } else {
        showToast('warning', 'Voice input stopped', 'Please try speaking again.');
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
      showToast('info', 'Listening...', 'Speak naturally. Your words will be added to this field.');
    } catch {
      setIsListening(false);
      showToast('warning', 'Microphone unavailable', 'Please try speaking again.');
    }
  };

  if (!isSupported) return null;

  return (
    <div className="mt-1 flex items-center gap-2">
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-colors ${
          isListening
            ? 'bg-rose-100 border-rose-300 text-rose-800 animate-pulse'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700'
        }`}
        aria-label={isListening ? 'Stop voice input' : label}
        title={isListening ? 'Stop voice input' : label}
      >
        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        {isListening ? 'Listening...' : 'Speak'}
      </button>
      {isListening && <span className="text-[11px] text-rose-700" aria-live="polite">{interimText || 'Listening...'}</span>}
    </div>
  );
};
