"use client";

import { useEffect, useRef } from "react";
import { Languages } from "lucide-react";
import { MESSAGE_SENDERS } from "@/lib/constants";
import useProfileStore, {
  getNativeLanguageForTranslation,
  getSelectedChatLanguage,
} from "@/lib/store";
import { useTTS } from "@/hooks/useTTS";
import TTSButton from "@/components/ui/TTSButton";

export default function MessageBubble({
  message,
  isExpanded,
  translation,
  onToggleExpansion,
  // gradient prop retained for interface compatibility but not used now for readability
  gradient,
  index,
  isLatestAiMessage = false, // New prop to identify the latest AI message
}) {
  const isAiMessage = message.sender === MESSAGE_SENDERS.PERSON_A;
  const { showWordTranslationMenu } = useProfileStore();
  const {
    toggle: toggleTTS,
    speak,
    isSpeaking,
    isLoading,
    isSupported,
  } = useTTS();
  const hasAutoPlayedRef = useRef(false);

  // Auto-play TTS for the latest AI message when it first appears
  useEffect(() => {
    if (
      isAiMessage &&
      isLatestAiMessage &&
      isSupported &&
      message.text &&
      !hasAutoPlayedRef.current
    ) {
      // Small delay to ensure the message is rendered and visible
      const timer = setTimeout(() => {
        speak(message.text);
        hasAutoPlayedRef.current = true;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isAiMessage, isLatestAiMessage, isSupported, message.text, speak]);

  const handleClick = () => {
    if (isAiMessage) {
      onToggleExpansion(message.id, message.text);
    }
  };

  const handleWordTranslationClick = (e) => {
    e.stopPropagation();
    const sourceLanguage = getSelectedChatLanguage();
    const targetLanguage = getNativeLanguageForTranslation();

    // Only show word translation menu if languages are different
    if (sourceLanguage !== targetLanguage) {
      showWordTranslationMenu(
        message.text,
        sourceLanguage,
        targetLanguage,
        message.id,
        "message"
      );
    }
  };

  const handleTTSClick = (e) => {
    e.stopPropagation(); // Prevent triggering the main click handler
    toggleTTS(message.text);
  };

  return (
    <div className="flex relative">
      <div
        className={`flex ${
          isAiMessage ? "justify-start" : "justify-end"
        } w-full`}
      >
        <div className="relative">
          <div
            className={`group relative max-w-xs lg:max-w-md px-4 py-3 pr-12 rounded-3xl shadow-lg transition-all duration-300 overflow-hidden ${
              isAiMessage
                ? "cursor-pointer bg-slate-800/80 text-slate-100 border border-white/10 backdrop-blur hover:bg-slate-800/90 rounded-t-3xl rounded-bl-xl"
                : "bg-blue-600 text-white rounded-t-3xl rounded-br-xl shadow-blue-600/30 hover:bg-blue-600/90"
            } animate-in fade-in slide-in-from-bottom-2`}
            onClick={handleClick}
            style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">
              {message.text}
            </p>

            {isAiMessage && isExpanded && translation && (
              <>
                <div className="my-2" />
                <p className="text-sm leading-relaxed text-slate-300 italic relative z-10">
                  {translation}
                </p>
              </>
            )}

            {isSupported && (
              <div
                className={`absolute flex flex-col gap-1 bottom-1.5 right-1.5 opacity-100 scale-100 md:opacity-0 md:scale-90 md:group-hover:opacity-100 md:group-hover:scale-100 md:focus-within:opacity-100 md:focus-within:scale-100`}
              >
                {isAiMessage && isExpanded && translation && (
                  <button
                    type="button"
                    onClick={handleWordTranslationClick}
                    aria-label="Translate individual words"
                    className="relative inline-flex items-center justify-center w-7 h-7 rounded-full backdrop-blur-sm transition-all duration-200 bg-slate-900/40 text-slate-200 border border-white/10 hover:bg-slate-700/60 focus-visible:ring-2 focus-visible:ring-slate-400/40"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span className="sr-only">Translate individual words</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"
                    />
                  </button>
                )}
                <TTSButton
                  isSpeaking={isSpeaking}
                  isLoading={isLoading}
                  onClick={handleTTSClick}
                  variant={isAiMessage ? "ai" : "user"}
                  labelPlay="Play message audio"
                  labelStop="Stop message audio"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
