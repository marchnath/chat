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
  // gradient prop kept for potential future use but not applied (user wants blue like user messages)
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
    <div className="mx-4 sm:mx-6 relative z-10">
      <div className="relative">
        <div
          className="group relative bg-blue-600 text-white rounded-t-3xl rounded-bl-3xl rounded-br-none px-5 py-4 pr-14 shadow-lg cursor-pointer transition-colors hover:bg-blue-600/90 overflow-hidden"
          onClick={handleClick}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-medium">
            {hint}
          </p>

          {isExpanded && translation && (
            <>
              <div className="my-2" />
              <p className="text-sm leading-relaxed text-white/90 italic relative z-10">
                {translation}
              </p>
            </>
          )}

          {isSupported && (
            <div className="absolute flex flex-col gap-1 bottom-1.5 right-1.5 opacity-100 scale-100 md:opacity-0 md:scale-90 md:group-hover:opacity-100 md:group-hover:scale-100 md:focus-within:opacity-100 md:focus-within:scale-100">
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
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"
                  />
                </button>
              )}
              <TTSButton
                isSpeaking={isSpeaking}
                isLoading={isLoading}
                onClick={handleTTSClick}
                variant="user"
                labelPlay="Play hint audio"
                labelStop="Stop hint audio"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
