"use client";

import { Send, Smile, Mic, MicOff } from "lucide-react";
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
    setInputText(e.target.value);
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

      baseTextRef.current = inputText ? inputText + (inputText.endsWith(" ") ? "" : " ") : "";
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
        const combined = (baseTextRef.current + finalTranscriptRef.current + interim).replace(/\s+/g, " ");
        setInputText(combined.trimStart());
      };

      recognition.onerror = (event) => {
        // Permission blocked or no speech, stop gracefully
        console.warn("Speech recognition error:", event.error);
        stopRecording();
      };

      recognition.onend = () => {
        // Finalize text on end
        const combined = (baseTextRef.current + finalTranscriptRef.current).replace(/\s+/g, " ");
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
        <button className="p-2 text-slate-400 hover:text-slate-300 transition-colors mb-1">
          <Smile className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 bg-transparent text-slate-100 placeholder-slate-400 rounded-3xl resize-none max-h-36 focus:outline-none"
            rows="1"
            disabled={isLoading}
          />
        </div>
        {/* Microphone toggle for speech-to-text. Uses selected learning language. */}
        <button
          onClick={() => (isRecordingRef.current ? stopRecording() : startRecording())}
          disabled={!isSTTSupported || isLoading}
          className={`p-2 mb-1 transition-colors duration-200 ${
            isRecordingRef.current
              ? "text-red-400 hover:text-red-300"
              : "text-slate-400 hover:text-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed"
          }`}
          aria-label={isRecordingRef.current ? "Stop voice input" : "Start voice input"}
          title={
            !isSTTSupported
              ? "Voice input not supported in this browser"
              : `Voice input: ${languageCode}`
          }
        >
          {isRecordingRef.current ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading}
          className="text-blue-400 hover:text-blue-300 disabled:text-slate-600 disabled:cursor-not-allowed p-2 transition-colors duration-200 mb-1"
          aria-label="Send"
        >
          <Send className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
