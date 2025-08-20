// Voice Assistant Hook
// Provides comprehensive voice capabilities for the AI chatbot

import { useState, useEffect, useRef, useCallback } from 'react';

// Type declarations for browser APIs
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceSettings {
  language: string;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}

interface VoiceAssistantHook {
  // Speech Recognition
  isListening: boolean;
  transcript: string;
  isRecognitionSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  
  // Speech Synthesis
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  
  // Voice Settings
  voices: SpeechSynthesisVoice[];
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  
  // Voice Commands
  isCommandMode: boolean;
  toggleCommandMode: () => void;
  
  // Audio Features
  audioLevel: number;
  isAudioSupported: boolean;
}

export function useVoiceAssistant(): VoiceAssistantHook {
  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  
  // Speech Synthesis State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Voice Settings
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en-US',
    voice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
  });
  
  // Voice Commands
  const [isCommandMode, setIsCommandMode] = useState(false);
  
  // Audio Level
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAudioSupported, setIsAudioSupported] = useState(false);
  
  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize voice capabilities
  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    console.log('🎤 Voice Assistant Initialization:', {
      speechRecognition: !!SpeechRecognition,
      speechSynthesis: !!speechSynthesis,
      mediaDevices: !!navigator.mediaDevices?.getUserMedia
    });
    
    setIsRecognitionSupported(!!SpeechRecognition);
    setIsAudioSupported(!!navigator.mediaDevices?.getUserMedia);
    
    if (!SpeechRecognition) {
      console.warn('❌ Speech Recognition not supported in this browser');
    }
    
    if (!speechSynthesis) {
      console.warn('❌ Speech Synthesis not supported in this browser');
    }
    
    // Initialize Speech Recognition
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = settings.language;
        
        recognition.onstart = () => {
          console.log('🎤 Speech recognition started');
          setIsListening(true);
        };
        
        recognition.onend = () => {
          console.log('🛑 Speech recognition ended');
          setIsListening(false);
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsListening(false);
          
          // Handle common, non-critical errors quietly
          if (event.error === 'no-speech' || event.error === 'aborted') {
            console.log('ℹ️ Speech recognition:', event.error);
            return;
          }
          
          // Log actual errors
          console.error('❌ Speech recognition error:', event.error);
          
          // Provide specific error messages
          switch (event.error) {
            case 'audio-capture':
              console.error('❌ Microphone not accessible');
              break;
            case 'not-allowed':
              console.error('❌ Microphone permission denied');
              break;
            case 'network':
              console.error('❌ Network error during speech recognition');
              break;
            case 'language-not-supported':
              console.error('❌ Language not supported for speech recognition');
              break;
            default:
              console.error('❌ Unknown speech recognition error:', event.error);
          }
        };
      
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }
          
          setTranscript(finalTranscript + interimTranscript);
        };
        
        recognitionRef.current = recognition;
      } catch (error) {
        console.error('❌ Failed to initialize speech recognition:', error);
      }
    }
    
    // Initialize Speech Synthesis
    if (speechSynthesis) {
      synthRef.current = speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Set default voice (prefer a clear English voice)
        const preferredVoice = 
          availableVoices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google')) ||
          availableVoices.find(voice => voice.lang === 'en-US' && voice.name.includes('Microsoft')) ||
          availableVoices.find(voice => voice.lang.startsWith('en-US')) ||
          availableVoices.find(voice => voice.lang.startsWith('en')) || 
          availableVoices[0];
        
        if (preferredVoice) {
          setSettings(prev => ({ ...prev, voice: preferredVoice }));
        }
      };
      
      // Load voices immediately and on change
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
      
      // Ensure speech synthesis is ready
      if (speechSynthesis.getVoices().length === 0) {
        // Force load voices
        speechSynthesis.speak(new SpeechSynthesisUtterance(''));
        speechSynthesis.cancel();
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Audio level monitoring
  const initializeAudioContext = useCallback(async () => {
    if (!isAudioSupported) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;
      dataArrayRef.current = dataArray;
      
      const updateAudioLevel = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
          setAudioLevel(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [isAudioSupported]);

  // Speech Recognition Functions
  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      console.warn('❌ Speech recognition not available');
      return;
    }
    
    if (isListening) {
      console.log('⚠️ Already listening');
      return;
    }
    
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      console.log('🎤 Starting speech recognition...');
      setTranscript('');
      recognitionRef.current.start();
      initializeAudioContext();
    } catch (error) {
      console.error('❌ Failed to start listening:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          console.error('❌ Microphone permission denied');
        } else if (error.name === 'NotFoundError') {
          console.error('❌ No microphone found');
        } else {
          console.error('❌ Microphone access error:', error.message);
        }
      }
    }
  }, [isListening, initializeAudioContext]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Speech Synthesis Functions
  const speak = useCallback((text: string) => {
    if (!synthRef.current) {
      console.warn('❌ Speech synthesis not available');
      return;
    }
    
    // Check if speech synthesis is available and allowed
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      console.warn('❌ Speech synthesis not supported in this browser');
      return;
    }
    
    if (!text || text.trim() === '') {
      console.warn('⚠️ No text provided for speech');
      return;
    }
    
    console.log('🔊 Starting to speak:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    
    // Clear any pending speech timeout
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    
    // Stop any current speech
    try {
      synthRef.current.cancel();
    } catch (error) {
      console.warn('⚠️ Error canceling previous speech:', error);
    }
    
    // Create a promise to handle the speech synthesis
    return new Promise<void>((resolve, reject) => {
      if (!synthRef.current) {
        reject(new Error('Speech synthesis not available'));
        return;
      }
      
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = settings.voice;
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;
        
        utterance.onstart = () => {
          console.log('✅ Speech started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('✅ Speech completed');
          setIsSpeaking(false);
          speakTimeoutRef.current = null;
          resolve();
        };
        
        utterance.onerror = (event) => {
          setIsSpeaking(false);
          speakTimeoutRef.current = null;
          
          // Don't log "interrupted" and "canceled" as errors - they're normal
          if (event.error === 'interrupted' || event.error === 'canceled') {
            console.log('ℹ️ Speech was interrupted or canceled');
            resolve(); // Resolve, not reject, as this is normal
            return;
          }
          
          // Handle "not-allowed" error with user guidance
          if (event.error === 'not-allowed') {
            console.warn('⚠️ Speech synthesis not allowed. User interaction required first.');
            console.warn('💡 Try clicking a button or interacting with the page first, then try speech again.');
            reject(new Error('Speech not allowed - user interaction required'));
            return;
          }
          
          // Log actual errors
          console.error('❌ Speech synthesis error:', event.error);
          
          // Handle other specific error types
          switch (event.error) {
            case 'network':
              console.warn('⚠️ Network error during speech synthesis');
              break;
            case 'synthesis-failed':
              console.warn('⚠️ Speech synthesis failed');
              break;
            case 'audio-busy':
              console.warn('⚠️ Audio device busy');
              break;
            default:
              console.warn('⚠️ Unknown speech synthesis error:', event.error);
          }
          
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
        
        // Ensure speech synthesis is ready before speaking
        if (synthRef.current.getVoices().length === 0) {
          // Wait for voices to load
          const checkVoices = () => {
            if (synthRef.current && synthRef.current.getVoices().length > 0) {
              synthRef.current.speak(utterance);
            } else {
              setTimeout(checkVoices, 100);
            }
          };
          checkVoices();
        } else {
          synthRef.current.speak(utterance);
        }
      } catch (error) {
        console.error('❌ Error creating speech utterance:', error);
        setIsSpeaking(false);
        speakTimeoutRef.current = null;
        reject(error);
      }
    });
  }, [settings]);

  const stopSpeaking = useCallback(() => {
    // Clear any pending speech timeout
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (error) {
        // Ignore errors when stopping speech
        console.debug('Speech stop ignored error:', error);
      }
    }
    setIsSpeaking(false);
  }, []);

  const pauseSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.pause();
    }
  }, []);

  const resumeSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.resume();
    }
  }, []);

  // Settings Functions
  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Update recognition language if changed
    if (newSettings.language && recognitionRef.current) {
      recognitionRef.current.lang = newSettings.language;
    }
  }, []);

  // Command Mode
  const toggleCommandMode = useCallback(() => {
    setIsCommandMode(prev => !prev);
  }, []);

  return {
    // Speech Recognition
    isListening,
    transcript,
    isRecognitionSupported,
    startListening,
    stopListening,
    resetTranscript,
    
    // Speech Synthesis
    isSpeaking,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    
    // Voice Settings
    voices,
    settings,
    updateSettings,
    
    // Voice Commands
    isCommandMode,
    toggleCommandMode,
    
    // Audio Features
    audioLevel,
    isAudioSupported,
  };
}
