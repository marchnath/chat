"use client";

import { Lightbulb } from "lucide-react";
import useProfileStore, {
  getNativeLanguageForTranslation,
  getSelectedChatLanguage,
} from "@/lib/store";

export default function HintBubble({
  hint,
  translation,
  isExpanded,
  onToggle,
}) {
  const { showWordTranslationMenu } = useProfileStore();

  if (!hint) return null;

  const handleClick = () => {
    const { wordTranslationMenu } = useProfileStore.getState();

    // If the hint translation menu is already open, close it
    if (
      wordTranslationMenu.isVisible &&
      wordTranslationMenu.menuType === "hint"
    ) {
      useProfileStore.getState().hideWordTranslationMenu();
    } else {
      // Show word translation menu
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
    }

    onToggle();
  };

  return (
    <div className="mx-4 relative z-10">
      <div
        className="bg-blue-600/90 text-white rounded-t-2xl rounded-bl-2xl px-4 py-4 shadow-lg cursor-pointer hover:bg-blue-600 transition-colors backdrop-blur"
        onClick={handleClick}
      >
        <p className="text-sm leading-relaxed">{hint}</p>

        {isExpanded && translation && (
          <>
            <div className="my-2"></div>
            <p className="text-sm leading-relaxed text-blue-100 italic">
              {translation}
            </p>
          </>
        )}
      </div>

      {/* Bulb icon */}
      <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1 shadow-lg">
        <Lightbulb className="w-3 h-3 text-yellow-900" />
      </div>
    </div>
  );
}
