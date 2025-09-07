"use client";

import { Lightbulb, Languages } from "lucide-react";
import useProfileStore, {
  getNativeLanguageForTranslation,
  getSelectedChatLanguage,
} from "@/lib/store";
import { useTTS } from "@/hooks/useTTS";
import TTSButton from "@/components/ui/TTSButton";

export default function HintBubble({
  hint,
  translation,
  isExpanded,
  onToggle,
}) {
  const { showWordTranslationMenu } = useProfileStore();
  const { toggle: toggleTTS, isSpeaking, isLoading, isSupported } = useTTS();

  if (!hint) return null;

  const handleClick = () => {
    onToggle();
  };

  const handleWordTranslationClick = (e) => {
    e.stopPropagation();
    const sourceLanguage = getSelectedChatLanguage();
    const targetLanguage = getNativeLanguageForTranslation();

    // Only show word translation menu if languages are different
    if (sourceLanguage !== targetLanguage) {
      showWordTranslationMenu(
        hint,
        sourceLanguage,
        targetLanguage,
        "hint",
        "hint"
      );
    }
  };

  const handleTTSClick = (e) => {
    e.stopPropagation(); // Prevent triggering the main click handler
    toggleTTS(hint);
  };

  return (
    <div className="mx-4 relative z-10">
      <div className="relative">
        <div
          className="group relative bg-blue-600/90 text-white rounded-t-2xl rounded-bl-2xl px-4 py-4 pr-12 shadow-lg cursor-pointer hover:bg-blue-600 transition-colors backdrop-blur"
          onClick={handleClick}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{hint}</p>

          {isExpanded && translation && (
            <>
              <div className="my-2" />
              <p className="text-sm leading-relaxed text-blue-100 italic">
                {translation}
              </p>
            </>
          )}

          {/* Action buttons container */}
          {isSupported && (
            <div className={`absolute flex flex-col gap-1 transition-all duration-200 ${
              isExpanded && translation 
                ? "bottom-1.5 right-1.5" // Normal position when translation is expanded
                : "bottom-1.5 right-1.5"
            } opacity-100 scale-100 md:opacity-0 md:scale-90 md:group-hover:opacity-100 md:group-hover:scale-100 md:focus-within:opacity-100 md:focus-within:scale-100`}>
              
              {/* Translate Words Icon Button - only show when translation is expanded */}
              {isExpanded && translation && (
                <button
                  type="button"
                  onClick={handleWordTranslationClick}
                  aria-label="Translate individual words"
                  className="relative inline-flex items-center justify-center w-7 h-7 rounded-full backdrop-blur-sm transition-all duration-200 bg-blue-800/40 text-blue-100 border border-blue-400/30 hover:bg-blue-700/60 focus-visible:ring-2 focus-visible:ring-blue-300/40"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span className="sr-only">Translate individual words</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"
                  />
                </button>
              )}

              {/* TTS Button */}
              <TTSButton
                isSpeaking={isSpeaking}
                isLoading={isLoading}
                onClick={handleTTSClick}
                variant="hint"
                labelPlay="Play hint audio"
                labelStop="Stop hint audio"
              />
            </div>
          )}
        </div>

        {/* Lightbulb icon */}
        {/* <div className="absolute -top-2 -left-2 bg-yellow-400/95 backdrop-blur-sm rounded-full p-1 shadow-lg border border-yellow-300/50">
          <Lightbulb className="w-3.5 h-3.5 text-yellow-900" />
        </div> */}
      </div>
    </div>
  );
}
