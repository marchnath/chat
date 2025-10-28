"use client";

import { Send, Mic, MicOff } from "lucide-react";
import { useState, useRef, useMemo } from "react";
import useProfileStore from "@/lib/store";
import { SPEECH_LANG_CODE_MAP } from "@/lib/constants";
import { useTTS } from "@/hooks/useTTS";

export default function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Type your response...",
  currentHint,
}) {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);
  const hasPlayedHintRef = useRef(false);
  // Speech recognition state/refs
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const baseTextRef = useRef("");
  const finalTranscriptRef = useRef("");
  const manualStopRef = useRef(false);

  const { learningLanguage } = useProfileStore();
  const {
    speak: speakTTS,
    stop: stopTTS,
    isSupported: isTTSSupported,
  } = useTTS();

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

  // Detect iOS Safari / mobile quirks
  const isIOS = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

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

  // Helpers to reduce repeated words and avoid boundary duplicates between segments
  const collapseImmediateDuplicates = (str) => {
    // Collapse immediate duplicate words like "the the" or "I I I" (case-insensitive)
    // Keep it conservative: only collapse consecutive duplicates, preserve punctuation
    return str.replace(/\b(\w+)(\s+\1\b)+/gi, "$1").replace(/\s+/g, " ");
  };

  const removeBoundaryDuplicate = (left, right) => {
    // If last word of left equals first word of right, drop the first word of right
    const leftMatch = left.match(/([A-Za-zÀ-ÖØ-öø-ÿ']+)\s*$/i);
    const rightMatch = right.match(/^\s*([A-Za-zÀ-ÖØ-öø-ÿ']+)(.*)$/i);
    if (!leftMatch || !rightMatch) return left + right;
    const leftWord = leftMatch[1].toLowerCase();
    const rightWord = rightMatch[1].toLowerCase();
    if (leftWord && rightWord && leftWord === rightWord) {
      return left + rightMatch[2];
    }
    return left + right;
  };

  const WORD = "[A-Za-zÀ-ÖØ-öø-ÿ\\u0400-\\u04FF']+"; // Latin + Cyrillic + apostrophes
  // Collapse repeated phrases (bigrams to 6-grams): "Каким вы Каким вы Каким вы" => "Каким вы"
  const collapseRepeatingPhrases = (str) => {
    let out = str;
    try {
      const pattern = new RegExp(
        `\\b(${WORD}(?:\\s+${WORD}){0,5})\\b(?:\\s+\\1\\b){1,}`,
        "gi"
      );
      out = out.replace(pattern, "$1");
    } catch (_) {
      // Fallback: no-op if regex fails in older engines
    }
    return out.replace(/\s+/g, " ");
  };

  // Append new final segment while removing overlaps with the existing final
  const appendFinalWithOverlap = (existing, addition) => {
    const ex = (existing || "").trim();
    const ad = (addition || "").trim();
    if (!ad) return ex + (ex ? " " : "");
    if (!ex) return ad + " ";
    const exWords = ex.split(/\s+/);
    const adLower = ad.toLowerCase();
    const maxN = Math.min(6, exWords.length);
    for (let n = maxN; n >= 1; n--) {
      const tail = exWords.slice(-n).join(" ");
      if (adLower.startsWith(tail.toLowerCase())) {
        const remainder = ad.slice(tail.length).trimStart();
        if (!remainder) {
          // Entire addition is already present at the end
          return ex + " ";
        }
        return ex + " " + remainder + " ";
      }
    }
    // If the existing already ends with the whole addition, skip appending
    if (ex.toLowerCase().endsWith(adLower)) {
      return ex + " ";
    }
    return ex + " " + ad + " ";
  };

  // Start speech recognition and stream text into the textarea
  // Uses the Web Speech Recognition API if available (Chrome-based, Safari). If unsupported, the mic button is disabled.
  const startRecording = () => {
    if (!isSTTSupported || isLoading || isRecordingRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = languageCode; // Use selected learning language
      // On iOS Safari, continuous/interim can cause aggressive repetition. Prefer short utterances.
      recognition.interimResults = isIOS ? false : true; // show partials live (desktop)
      recognition.continuous = isIOS ? false : true; // keep listening until stopped (desktop)
      recognition.maxAlternatives = 1;

      baseTextRef.current = inputText
        ? inputText + (inputText.endsWith(" ") ? "" : " ")
        : "";
      finalTranscriptRef.current = "";
      manualStopRef.current = false;
      isRecordingRef.current = true;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscriptRef.current = appendFinalWithOverlap(
              finalTranscriptRef.current,
              res[0].transcript
            );
          } else {
            interim += res[0].transcript;
          }
        }
        // Smartly join segments and reduce duplicate words/phrases
        let combinedFinal = removeBoundaryDuplicate(
          baseTextRef.current,
          finalTranscriptRef.current
        );
        let combined = removeBoundaryDuplicate(combinedFinal, interim);
        combined = collapseRepeatingPhrases(
          collapseImmediateDuplicates(combined)
        ).trimStart();
        setInputText(combined);
      };

      recognition.onerror = (event) => {
        // Permission blocked or no speech, stop gracefully
        console.warn("Speech recognition error:", event.error);
        stopRecording();
      };

      recognition.onend = () => {
        // Finalize text on end
        let combined = removeBoundaryDuplicate(
          baseTextRef.current,
          finalTranscriptRef.current
        );
        combined = collapseRepeatingPhrases(
          collapseImmediateDuplicates(combined)
        ).trim();
        setInputText(combined);

        // On iOS, emulate continuous mode by restarting automatically if not manually stopped
        if (isIOS && isRecordingRef.current && !manualStopRef.current) {
          try {
            recognition.start();
            return; // keep recording state
          } catch (_) {
            // If restart fails, fall through and stop
          }
        }
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
        manualStopRef.current = true;
        rec.stop();
      } catch (_) {
        // ignore
      }
    }
    isRecordingRef.current = false;
    recognitionRef.current = null;
  };

  const handleInputFocus = () => {
    // Play hint audio when user focuses on input, but only once per hint
    if (currentHint && isTTSSupported && !hasPlayedHintRef.current) {
      hasPlayedHintRef.current = true;
      speakTTS(currentHint);
    }
  };

  // Reset the hint played flag when the hint changes
  useMemo(() => {
    hasPlayedHintRef.current = false;
  }, [currentHint]);

  return (
    <div className="bg-transparent px-4 py-4 relative z-10">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
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
