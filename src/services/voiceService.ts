// NAKSHA V2.0 — Voice Engine (Brian Neural Voice & Speech Recognition)
// Synchronous gesture execution, instant barge-in, reliable Chromium SpeechSynthesis

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface VoiceServiceListeners {
  onStateChange?: (state: VoiceState) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onWakeWord?: (commandText?: string) => void;
  onError?: (error: string) => void;
}

class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private listeners: VoiceServiceListeners = {};
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.initVoices();
    this.initRecognition();
  }

  public setListeners(listeners: VoiceServiceListeners) {
    this.listeners = listeners;
  }

  // Find Brian Neural Voice
  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // 1. Target Brian / Brien Neural
      const brian = voices.find(v => 
        v.name.toLowerCase().includes('brian') || 
        v.name.toLowerCase().includes('brien') ||
        v.voiceURI.toLowerCase().includes('brian')
      );
      if (brian) {
        this.preferredVoice = brian;
        return;
      }

      // 2. High-quality natural English voices
      const naturalEn = voices.find(v => 
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online')) &&
        v.lang.startsWith('en')
      );
      if (naturalEn) {
        this.preferredVoice = naturalEn;
        return;
      }

      // 3. Fallback: Any English voice
      const defaultEn = voices.find(v => v.lang.startsWith('en'));
      if (defaultEn) {
        this.preferredVoice = defaultEn;
        return;
      }

      this.preferredVoice = voices[0] || null;
    };

    pickVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        // Recognition active
      };

      this.recognition.onspeechstart = () => {
        // Immediate barge-in cutoff
        if (this.isSpeaking) {
          this.stopSpeaking();
        }
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const raw = (finalTranscript || interim).trim();
        if (!raw) return;

        const lower = raw.toLowerCase();

        // Check for Wake Word: "naksha"
        const wakeMatch = lower.match(/(?:hey\s+|ok\s+|hi\s+)?(?:naksha|nakshatra|naksa|nakhsa)(?:\s+(.*))?$/i);
        if (wakeMatch) {
          const cmd = wakeMatch[1]?.trim();
          this.isListening = true;
          this.stopSpeaking();
          this.listeners.onStateChange?.('listening');

          if (cmd) {
            this.listeners.onTranscript?.(cmd, true);
          } else {
            this.listeners.onWakeWord?.();
          }
          return;
        }

        if (this.isListening) {
          this.listeners.onTranscript?.(raw, !!finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('SpeechRecognition error:', event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Restart if still in listening mode
          try {
            this.recognition?.start();
          } catch (e) {}
        } else {
          this.listeners.onStateChange?.('idle');
        }
      };

      // Start continuous background listener for wake word
      try {
        this.recognition.start();
      } catch (e) {}
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
    }
  }

  // Single-Click synchronous activation
  public activateListening() {
    this.stopSpeaking();
    this.isListening = true;
    this.listeners.onStateChange?.('listening');

    if (!this.recognition) {
      this.initRecognition();
    }
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      try {
        this.recognition.start();
      } catch (e) {}
    }
  }

  // Double-Click Stop All
  public stopAll() {
    this.stopSpeaking();
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.listeners.onStateChange?.('idle');
  }

  public stopListening() {
    this.stopAll();
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  // Speak using Brian Neural voice with Chrome bug fixes
  public speak(text: string, onComplete?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {}

    const cleanText = text
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/-{3,}/g, '')
      .replace(/•|\*|\d+\.\s+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onComplete) onComplete();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;
    (window as any).__activeUtterance = utterance; // Prevents Chrome GC freeze bug

    if (!this.preferredVoice) {
      this.initVoices();
    }
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.listeners.onStateChange?.('speaking');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.listeners.onStateChange?.('idle');
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.listeners.onStateChange?.('idle');
      if (onComplete) onComplete();
    };

    // 25ms delay after cancel before speaking prevents Chrome audio race condition
    setTimeout(() => {
      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
        if (onComplete) onComplete();
      }
    }, 25);
  }
}

export const voiceService = new VoiceService();
