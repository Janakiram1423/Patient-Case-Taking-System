// Browser Speech Recognition, Web Audio Frequency Visualizer & Text-to-Speech (TTS) Support

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
  webkitAudioContext?: typeof AudioContext;
  AudioContext?: typeof AudioContext;
}

export interface VoiceDictationResult {
  transcript: string;
  interimTranscript?: string;
  isFinal: boolean;
  confidence: number;
}

export class ClinicalVoiceDictation {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-IN';
  private onResultCallback?: (result: VoiceDictationResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;
  private restartTimeout: any = null;
  private shouldAutoRestart: boolean = false;
  private terminalError: string | null = null;
  private errorReported = false;

  // Web Audio Visualizer state
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private audioDataArray: Uint8Array<ArrayBuffer> | null = null;

  constructor(lang: string = 'en-IN') {
    this.currentLanguage = lang;
    this.initRecognition();
  }

  private initRecognition() {
    const win = window as unknown as IWindow;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      try {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;

        this.recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          if (this.onResultCallback) {
            this.onResultCallback({
              transcript: final || interim,
              interimTranscript: interim,
              isFinal: Boolean(final),
              confidence: event.results[0]?.[0]?.confidence || 0.95
            });
          }
        };

        this.recognition.onstart = () => {
          this.isListening = true;
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning/error:', event.error);
          if (event.error === 'no-speech' && this.shouldAutoRestart) {
            // Auto restart silently if continuous dictation is on
            return;
          }
          this.terminalError = event.error || 'unknown';
          this.shouldAutoRestart = false;
          this.isListening = false;
          if (this.errorReported) return;
          this.errorReported = true;
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error);
          }
        };

        this.recognition.onend = () => {
          if (this.shouldAutoRestart && this.isListening && !this.terminalError) {
            this.restartTimeout = setTimeout(() => {
              try {
                if (this.recognition && this.isListening) {
                  this.recognition.start();
                }
              } catch (e) {
                // Ignore already started error
              }
            }, 300);
          } else {
            this.isListening = false;
            this.stopAudioVisualizer();
            if (this.onEndCallback) {
              this.onEndCallback();
            }
          }
        };
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  public setLanguage(lang: string) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public isSupported(): boolean {
    const win = window as unknown as IWindow;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public async start(
    onResult: (result: VoiceDictationResult) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): Promise<boolean> {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;
    this.shouldAutoRestart = true;
    this.terminalError = null;
    this.errorReported = false;

    try {
      let permissionStream: MediaStream | undefined;
      if (navigator.mediaDevices?.getUserMedia) {
        permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
      this.isListening = true;

      // Start Audio Visualizer
      await this.startAudioVisualizer(permissionStream);
      await new Promise(resolve => setTimeout(resolve, 200));
      const started = this.isListening && !this.terminalError;
      if (!started) this.stopAudioVisualizer();
      return started;
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      this.shouldAutoRestart = false;
      this.isListening = false;
      if (this.onErrorCallback && !this.errorReported) {
        this.errorReported = true;
        this.onErrorCallback(err?.name === 'NotAllowedError' ? 'not-allowed' : 'start-failed');
      }
      return false;
    }
  }

  public stop(): void {
    this.shouldAutoRestart = false;
    this.terminalError = null;
    if (this.restartTimeout) clearTimeout(this.restartTimeout);

    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
    this.stopAudioVisualizer();
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // --- Real-time Audio Frequency Visualizer ---
  private async startAudioVisualizer(existingStream?: MediaStream) {
    try {
      const stream = existingStream || (navigator.mediaDevices?.getUserMedia
        ? await navigator.mediaDevices.getUserMedia({ audio: true })
        : null);
      if (!stream) return;
      this.mediaStream = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      this.audioContext = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      this.analyser = analyser;
      this.audioDataArray = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      // Non-critical: audio visualizer fallback
      console.log('Audio visualizer fallback:', e);
    }
  }

  private stopAudioVisualizer() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {
        // ignore
      }
      this.audioContext = null;
    }
    this.analyser = null;
    this.audioDataArray = null;
  }

  public getAudioVolumeLevel(): number {
    if (!this.analyser || !this.audioDataArray) return 0;
    try {
      this.analyser.getByteFrequencyData(this.audioDataArray);
      let sum = 0;
      for (let i = 0; i < this.audioDataArray.length; i++) {
        sum += this.audioDataArray[i];
      }
      return Math.min(100, Math.round((sum / (this.audioDataArray.length * 255)) * 100));
    } catch {
      return 0;
    }
  }
}

// Multi-lingual Text-to-Speech (TTS) Voice Synthesis
export class ClinicalTextToSpeech {
  public static isSupported(): boolean {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  public static speak(text: string, langCode: string = 'en-IN', onEnd?: () => void): void {
    if (!this.isSupported()) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'hinglish' ? 'hi-IN' : langCode;
      utterance.rate = 0.95; // Slightly measured rate for clinical clarity
      utterance.pitch = 1.0;

      // Select matching voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
      if (onEnd) onEnd();
    }
  }

  public static stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}

export const SAMPLE_VOICE_PROMPTS = [
  'Patient has moderate fever for 3 days with dry cough and mild sore throat. BP is 130 over 85, Pulse 88, SpO2 98 percent.',
  '45-year-old male with severe crushing chest pain radiating to left arm for 2 hours with cold sweating and dizziness.',
  'Patient complaining of acute epigastric stomach pain for 4 days, worse after meals with nausea and acid reflux.',
  'Recurrent throbbing headache on right side for 2 weeks with visual aura and photophobia. Relieved by dark room rest.',
  'Pediatric patient with high grade fever of 102 degrees for 2 days with runny nose, barking cough, and loss of appetite.'
];
