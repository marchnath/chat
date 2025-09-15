"use client";

import { Send, Mic, MicOff } from "lucide-react";
import { useState, useRef, useMemo } from "react";
import useProfileStore from "@/lib/store";
import { SPEECH_LANG_CODE_MAP } from "@/lib/constants";

export default function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Type your response...",
}) {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);
  // Speech recognition state/refs
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const baseTextRef = useRef("");
  const finalTranscriptRef = useRef("");

  const { learningLanguage } = useProfileStore();

  // Determine if browser supports Web Speech Recognition
  const SpeechRecognition = useMemo(() => {
    if (typeof window === "undefined") return null;
    return (
      window.SpeechRecognition ||
      // Safari/Chrome prefixed
      window.webkitSpeechRecognition ||
      null
    );
  }, []);

  const isSTTSupported = !!SpeechRecognition;

  const languageCode = useMemo(() => {
    const key = (learningLanguage || "English").toLowerCase();
    return SPEECH_LANG_CODE_MAP[key] || "en-US";
  }, [learningLanguage]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    // If user types while recording, stop recording and switch to send
    if (isRecordingRef.current) {
      stopRecording();
    }
    setInputText(val);
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Start speech recognition and stream text into the textarea
  // Uses the Web Speech Recognition API if available (Chrome-based, Safari). If unsupported, the mic button is disabled.
  const startRecording = () => {
    if (!isSTTSupported || isLoading || isRecordingRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = languageCode; // Use selected learning language
      recognition.interimResults = true; // show partials live
      recognition.continuous = true; // keep listening until stopped
      recognition.maxAlternatives = 1;

      baseTextRef.current = inputText
        ? inputText + (inputText.endsWith(" ") ? "" : " ")
        : "";
      finalTranscriptRef.current = "";
      isRecordingRef.current = true;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscriptRef.current += res[0].transcript + " ";
          } else {
            interim += res[0].transcript;
          }
        }
        const combined = (
          baseTextRef.current +
          finalTranscriptRef.current +
          interim
        ).replace(/\s+/g, " ");
        setInputText(combined.trimStart());
      };

      recognition.onerror = (event) => {
        // Permission blocked or no speech, stop gracefully
        console.warn("Speech recognition error:", event.error);
        stopRecording();
      };

      recognition.onend = () => {
        // Finalize text on end
        const combined = (
          baseTextRef.current + finalTranscriptRef.current
        ).replace(/\s+/g, " ");
        setInputText(combined.trim());
        isRecordingRef.current = false;
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      stopRecording();
    }
  };

  const stopRecording = () => {
    const rec = recognitionRef.current;
    if (rec && typeof rec.stop === "function") {
      try {
        rec.stop();
      } catch (_) {
        // ignore
      }
    }
    isRecordingRef.current = false;
    recognitionRef.current = null;
  };

  return (
    <div className="bg-transparent px-4 py-4 relative z-10">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 bg-transparent text-slate-100 placeholder-slate-400 rounded-3xl resize-none max-h-36 focus:outline-none scrollbar-hidden"
            rows="1"
            disabled={isLoading}
          />
        </div>
        {/* Unified action button: Mic (idle), MicOff (recording), Send (has text) */}
        <button
          onClick={() => {
            const hasText = inputText.trim().length > 0;
            if (hasText) {
              handleSend();
              return;
            }
            if (isRecordingRef.current) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
          disabled={isLoading || (!isSTTSupported && !inputText.trim())}
          className={`mb-1 inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            inputText.trim().length > 0
              ? "border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              : isRecordingRef.current
              ? "border-red-500/50 bg-red-500/15 text-red-400 hover:bg-red-500/25 animate-pulse"
              : "border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700 disabled:bg-slate-800/40 disabled:cursor-not-allowed"
          }`}
          aria-label={
            inputText.trim().length > 0
              ? "Send"
              : isRecordingRef.current
              ? "Stop voice input"
              : "Start voice input"
          }
          title={
            inputText.trim().length > 0
              ? "Send message"
              : !isSTTSupported
              ? "Voice input not supported in this browser"
              : `Voice input: ${languageCode}`
          }
        >
          {inputText.trim().length > 0 ? (
            <Send className="w-5 h-5" />
          ) : isRecordingRef.current ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
