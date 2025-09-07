"use client";

import { useState, useCallback, useRef } from "react";
import useProfileStore from "@/lib/store";

// Map language display names to Speech API language codes
const LANGUAGE_CODE_MAP = {
  english: "en-US",
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  portuguese: "pt-PT",
  russian: "ru-RU",
  japanese: "ja-JP",
  korean: "ko-KR",
  chinese: "zh-CN",
  arabic: "ar-SA",
};

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
    return LANGUAGE_CODE_MAP[langKey] || "en-US";
  }, [learningLanguage]);

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text.trim()) return;

      // Stop any current speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      setIsLoading(true);

      // Ensure voices are loaded
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(text);
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
