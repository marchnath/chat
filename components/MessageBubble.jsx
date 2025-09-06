"use client";

import { MESSAGE_SENDERS } from "@/lib/constants";
import useProfileStore, {
  getNativeLanguageForTranslation,
  getSelectedChatLanguage,
} from "@/lib/store";

export default function MessageBubble({
  message,
  isExpanded,
  translation,
  onToggleExpansion,
}) {
  const isAiMessage = message.sender === MESSAGE_SENDERS.PERSON_A;
  const { showWordTranslationMenu } = useProfileStore();

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

  return (
    <div className="flex">
      <div
        className={`flex ${
          isAiMessage ? "justify-start" : "justify-end"
        } w-full`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
            isAiMessage
              ? "bg-slate-700/80 text-slate-100 rounded-bl-md border border-slate-600/50 hover:bg-slate-700/90 cursor-pointer backdrop-blur"
              : "bg-blue-600 text-white rounded-br-md shadow-blue-600/30"
          }`}
          onClick={handleClick}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>

          {isAiMessage && isExpanded && translation && (
            <>
              <div className="my-2"></div>
              <p className="text-sm leading-relaxed text-slate-300 italic">
                {translation}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
