"use client";

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
}) {
  const isAiMessage = message.sender === MESSAGE_SENDERS.PERSON_A;
  const { showWordTranslationMenu } = useProfileStore();
  const { toggle: toggleTTS, isSpeaking, isLoading, isSupported } = useTTS();

  const handleClick = () => {
    if (isAiMessage) {
      const { wordTranslationMenu } = useProfileStore.getState();

      // If the same message's word translation menu is already open, close it
      if (
        wordTranslationMenu.isVisible &&
        wordTranslationMenu.messageId === message.id
      ) {
        useProfileStore.getState().hideWordTranslationMenu();
      } else {
        // Show word translation menu
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
      }

      onToggleExpansion(message.id, message.text);
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
            className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 pr-11 ${
              isAiMessage
                ? "bg-slate-700/80 text-slate-100 rounded-bl-md border border-slate-600/50 hover:bg-slate-700/90 cursor-pointer backdrop-blur"
                : "bg-blue-600 text-white rounded-br-md shadow-blue-600/30"
            }`}
            onClick={handleClick}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>

            {isAiMessage && isExpanded && translation && (
              <>
                <div className="my-2" />
                <p className="text-sm leading-relaxed text-slate-300 italic">
                  {translation}
                </p>
              </>
            )}

            {isSupported && (
              <div className="absolute bottom-1.5 right-1.5 opacity-100 scale-100 md:opacity-0 md:scale-90 md:group-hover:opacity-100 md:group-hover:scale-100 md:focus-within:opacity-100 md:focus-within:scale-100 transition-all duration-200">
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
