"use client";

import { useState, useCallback, useRef } from "react";
import useProfileStore from "@/lib/store";
import { SPEECH_LANG_CODE_MAP } from "@/lib/constants";

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUtteranceRef = useRef(null);
  const { learningLanguage } = useProfileStore();

  // Check if TTS is supported
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const getLanguageCode = useCallback(() => {
    const langKey = learningLanguage.toLowerCase();
    return SPEECH_LANG_CODE_MAP[langKey] || "en-US";
  }, [learningLanguage]);

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text.trim()) return;

      // Remove emojis and other non-text characters that might be read out awkwardly
      const cleanText = text
        .replace(
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F200}-\u{1F270}\u{2328}\u{203C}\u{2049}\u{2122}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{2611}\u{2614}-\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}-\u{2623}\u{2626}\u{262A}\u{262E}-\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}-\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}-\u{269C}\u{26A0}-\u{26A1}\u{26AA}-\u{26AB}\u{26B0}-\u{26B1}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26C8}\u{26CE}-\u{26CF}\u{26D1}\u{26D3}-\u{26D4}\u{26E9}-\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}]/gu,
          ""
        )
        .trim();

      if (!cleanText) return;

      // Stop any current speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      setIsLoading(true);

      // Ensure voices are loaded
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const languageCode = getLanguageCode();

        utterance.lang = languageCode;
        utterance.rate = 0.9; // Slightly slower for language learning
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Set up event listeners
        utterance.onstart = () => {
          setIsLoading(false);
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          setIsSpeaking(false);
          setIsLoading(false);
          currentUtteranceRef.current = null;
        };

        // Try to find a voice for the specific language
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(
          (voice) =>
            voice.lang.startsWith(languageCode.split("-")[0]) ||
            voice.lang === languageCode
        );

        if (targetVoice) {
          utterance.voice = targetVoice;
        }

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };

      // Check if voices are loaded, if not wait for them
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          speakWithVoice();
        };
      } else {
        speakWithVoice();
      }
    },
    [isSupported, getLanguageCode]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
    currentUtteranceRef.current = null;
  }, [isSupported]);

  const toggle = useCallback(
    (text) => {
      if (isSpeaking || isLoading) {
        stop();
      } else {
        speak(text);
      }
    },
    [isSpeaking, isLoading, speak, stop]
  );

  return {
    speak,
    stop,
    toggle,
    isSpeaking,
    isLoading,
    isSupported,
    currentLanguage: learningLanguage,
    languageCode: getLanguageCode(),
  };
};

export default useTTS;
