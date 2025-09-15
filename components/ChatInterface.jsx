"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getInitialHint, getHintTranslation } from "@/lib/conversationData";
import { getContactByName } from "@/lib/contacts";
import useProfileStore, {
  getSelectedChatLanguage,
  getNativeLanguageForTranslation,
} from "@/lib/store";
import { useChat } from "@/hooks/useChat";
import { useExpandableItems } from "@/hooks/useExpandableItems";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import HintBubble from "./HintBubble";
import ChatInput from "./ChatInput";
import WordTranslationsMenu from "./WordTranslationsMenu";

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const messagesEndRef = useRef(null);

  // URL params
  const contactName = searchParams.get("name") || "Pal";
  const contactAvatar = searchParams.get("avatar") || "/avatars/avatar0.png";

  // Get contact information
  const contact = getContactByName(contactName); // still used for avatar/name only

  // Store state
  const {
    _hasHydrated,
    learningLanguage,
    learningProficiency,
    wordTranslationMenu,
    hideWordTranslationMenu,
  } = useProfileStore();

  // Local state for language to avoid hydration issues
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [initialHint, setInitialHint] = useState("");

  // Custom hooks
  const {
    messages,
    isLoadingLLM,
    currentHint,
    messageTranslations,
    hintTranslation,
    isConversationLoaded,
    sendMessage,
    translateMessage,
    setInitialHint: setChatInitialHint,
    setHintTranslation,
    clearTranslations,
    clearChat,
  } = useChat(contactName);

  const {
    toggleExpansion: toggleMessageExpansion,
    isExpanded: isMessageExpanded,
    clearExpanded,
  } = useExpandableItems();

  const [isHintExpanded, setIsHintExpanded] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasInputText, setHasInputText] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update language when store hydrates
  useEffect(() => {
    if (_hasHydrated) {
      const language = getSelectedChatLanguage();
      setSelectedLanguage(language);
      const hint = getInitialHint(language, contactName); // Pass contactName as the mode
      setInitialHint(hint);
    }
  }, [_hasHydrated, learningLanguage, learningProficiency, contactName]); // Add contactName to dependencies

  // Set initial hint and translation only when starting a new conversation
  useEffect(() => {
    if (
      initialHint &&
      messages.length === 0 &&
      isConversationLoaded &&
      _hasHydrated
    ) {
      setChatInitialHint(initialHint);

      // Load initial hint translation only if languages are different
      const loadInitialHintTranslation = async () => {
        const nativeLanguage = getNativeLanguageForTranslation();

        if (nativeLanguage !== selectedLanguage) {
          const predefinedTranslation = getHintTranslation(
            initialHint,
            nativeLanguage
          );

          if (predefinedTranslation) {
            setHintTranslation(predefinedTranslation);
          } else {
            try {
              const translation = await translateMessage(
                "hint",
                initialHint,
                nativeLanguage
              );
              setHintTranslation(translation);
            } catch (error) {
              console.error("Error loading initial hint translation:", error);
            }
          }
        } else {
          // Clear translation if languages are the same
          setHintTranslation("");
        }
      };

      loadInitialHintTranslation();
    }
  }, [
    initialHint,
    setChatInitialHint,
    setHintTranslation,
    translateMessage,
    selectedLanguage,
    messages.length,
    isConversationLoaded,
    _hasHydrated,
  ]);

  // Reset expansions when language changes
  useEffect(() => {
    clearExpanded();
    setIsHintExpanded(false);
    clearTranslations();
    hideWordTranslationMenu(); // Also hide word translation menu
  }, [
    selectedLanguage,
    clearExpanded,
    clearTranslations,
    hideWordTranslationMenu,
  ]);

  const handleSendMessage = async (messageText) => {
    try {
      await sendMessage(messageText, {
        language: selectedLanguage,
        nativeLanguage: getNativeLanguageForTranslation(),
        proficiencyLevel: learningProficiency,
        contactName,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleMessageExpansion = async (messageId, messageText) => {
    toggleMessageExpansion(messageId);

    // If expanding and no translation exists, try to get one
    if (!isMessageExpanded(messageId) && !messageTranslations[messageId]) {
      const nativeLanguage = getNativeLanguageForTranslation();

      // Only try to translate if languages are different
      if (nativeLanguage !== selectedLanguage) {
        try {
          await translateMessage(messageId, messageText, nativeLanguage);
        } catch (error) {
          console.error("Error translating message:", error);
        }
      }
    }
  };

  const handleHintExpansion = async () => {
    setIsHintExpanded(!isHintExpanded);

    // If we're expanding and don't have a translation yet, try to get one
    if (!isHintExpanded && currentHint && !hintTranslation) {
      const nativeLanguage = getNativeLanguageForTranslation();

      // Only try to translate if languages are different
      if (nativeLanguage !== selectedLanguage) {
        const predefinedTranslation = getHintTranslation(
          currentHint,
          nativeLanguage
        );

        if (predefinedTranslation) {
          setHintTranslation(predefinedTranslation);
        } else {
          try {
            const translation = await translateMessage(
              "current-hint",
              currentHint,
              nativeLanguage
            );
            setHintTranslation(translation);
          } catch (error) {
            console.error("Error translating hint:", error);
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto relative overflow-hidden">
      {/* Layered playful background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div
        className={`absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-500 opacity-[0.08]`}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.25)' stroke-width='0.5'%3E%3Ccircle cx='8' cy='8' r='1'/%3E%3Ccircle cx='32' cy='32' r='1'/%3E%3Ccircle cx='56' cy='56' r='1'/%3E%3Cpath d='M24 24h8v8h-8zM6 42h8v8H6zM42 6h8v8h-8z' stroke='none' fill='rgba(255,255,255,0.25)'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "64px 64px",
        }}
      />

      <ChatHeader
        contactName={contactName}
        contactAvatar={contactAvatar}
        onClearChat={clearChat}
      />

      {/* Messages area container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 relative">
        {/* Empty state */}
        {messages.length === 0 && !isLoadingLLM && (
          <div className="flex items-center justify-center h-full animate-in fade-in zoom-in-50">
            <div className="text-center max-w-sm">
              <div
                className={`inline-flex items-center justify-center mb-4 w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-black/40 ring-4 ring-white/5 relative overflow-hidden`}
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.35),transparent_60%)]" />
                <span className="font-extrabold text-white text-2xl drop-shadow">
                  Hi
                </span>
              </div>
              <p className="font-semibold text-xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-2 tracking-tight capitalize">
                Let's chat!
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Let&apos;s start chatting. Share something or ask me a question
                in your learning language.
              </p>
            </div>
          </div>
        )}

        {isLoadingLLM && messages.length === 0 && (
          <div className="text-center py-12 animate-in fade-in">
            <div className="inline-flex items-center gap-2 text-slate-300 text-sm font-medium bg-slate-800/60 rounded-full px-5 py-2.5 shadow-inner shadow-black/40 backdrop-blur border border-white/10">
              <TypingIndicator />
              Starting conversation...
            </div>
          </div>
        )}

        {messages.map((message, idx) => (
          <MessageBubble
            key={message.id}
            message={message}
            isExpanded={isMessageExpanded(message.id)}
            translation={messageTranslations[message.id]}
            onToggleExpansion={handleMessageExpansion}
            index={idx}
          />
        ))}

        {isLoadingLLM && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-slate-800/70 backdrop-blur text-slate-100 rounded-3xl rounded-bl-xl border border-white/10 px-4 py-3 shadow-lg shadow-black/40">
              <div className="flex items-center gap-2">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <HintBubble
        hint={currentHint}
        translation={hintTranslation}
        isExpanded={isHintExpanded}
        onToggle={handleHintExpansion}
        isVisible={!(isInputFocused && hasInputText)}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoadingLLM}
        placeholder="Type your response..."
        onFocusChange={setIsInputFocused}
        onHasTextChange={setHasInputText}
      />

      <WordTranslationsMenu
        text={wordTranslationMenu.text}
        sourceLanguage={wordTranslationMenu.sourceLanguage}
        targetLanguage={wordTranslationMenu.targetLanguage}
        isVisible={wordTranslationMenu.isVisible}
        onClose={hideWordTranslationMenu}
        position="right"
      />
    </div>
  );
}
