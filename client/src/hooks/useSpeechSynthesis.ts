import { useCallback, useEffect, useState } from 'react';

interface SpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface SpeechSynthesisHook {
  speak: (text: string, options?: SpeechOptions) => void;
  cancel: () => void;
  isPending: boolean;
  isSpeaking: boolean;
  hasSynthesisSupport: boolean;
  availableVoices: SpeechSynthesisVoice[];
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isPending, setIsPending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSynthesisSupport, setHasSynthesisSupport] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSynthesisSupport(true);
      setSynthesis(window.speechSynthesis);
      
      // Get available voices
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
        }
      };
      
      // Initial voice load
      updateVoices();
      
      // Chrome requires waiting for voiceschanged event
      window.speechSynthesis.onvoiceschanged = updateVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      console.warn('Speech synthesis is not supported in this browser');
      setHasSynthesisSupport(false);
    }
  }, []);

  // Find the best matching voice based on options
  const findVoice = useCallback((voiceOption: string) => {
    if (!voiceOption || availableVoices.length === 0) return null;
    
    // Parse language code and gender from option (e.g., 'en-US-female')
    const [langCode, gender] = voiceOption.split('-');
    const language = langCode.toLowerCase();
    
    // Try to find a matching voice
    return availableVoices.find(voice => {
      const voiceLang = voice.lang.toLowerCase();
      const matchesLanguage = voiceLang.includes(language);
      
      // If gender is specified, try to match it based on voice name
      if (gender) {
        const isFemale = voice.name.toLowerCase().includes('female') || 
                        voice.name.toLowerCase().includes('woman') || 
                        voice.name.toLowerCase().includes('girl');
        const isMale = voice.name.toLowerCase().includes('male') || 
                      voice.name.toLowerCase().includes('man') || 
                      voice.name.toLowerCase().includes('guy');
        
        if (gender.toLowerCase() === 'female' && isFemale) return true;
        if (gender.toLowerCase() === 'male' && isMale) return true;
        
        // If no explicit gender match, just match the language
        return matchesLanguage;
      }
      
      return matchesLanguage;
    }) || availableVoices[0]; // Fallback to first voice if no match
  }, [availableVoices]);

  // Speak function
  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!synthesis || !hasSynthesisSupport) return;
    
    // Cancel any ongoing speech
    synthesis.cancel();
    
    setIsPending(true);
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified
    if (options.voice) {
      const voice = findVoice(options.voice);
      if (voice) utterance.voice = voice;
    }
    
    // Set other options
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.volume) utterance.volume = options.volume;
    
    // Event handlers
    utterance.onstart = () => {
      setIsPending(false);
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsPending(false);
      setIsSpeaking(false);
    };
    
    // Speak the utterance
    synthesis.speak(utterance);
  }, [synthesis, hasSynthesisSupport, findVoice]);

  // Cancel speaking
  const cancel = useCallback(() => {
    if (!synthesis) return;
    synthesis.cancel();
    setIsSpeaking(false);
    setIsPending(false);
  }, [synthesis]);

  return {
    speak,
    cancel,
    isPending,
    isSpeaking,
    hasSynthesisSupport,
    availableVoices
  };
};
