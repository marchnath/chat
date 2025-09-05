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

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const messagesEndRef = useRef(null);

  // URL params
  const contactName = searchParams.get("name") || "Pal";
  const contactAvatar = searchParams.get("avatar") || "/avatars/avatar0.png";

  // Get contact personality information
  const contact = getContactByName(contactName);
  const personality = contact?.personality || "friend";

  // Store state
  const { _hasHydrated, learningLanguage, learningProficiency } =
    useProfileStore();

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
    sendMessage,
    translateMessage,
    setInitialHint: setChatInitialHint,
    setHintTranslation,
    clearTranslations,
  } = useChat();

  const {
    toggleExpansion: toggleMessageExpansion,
    isExpanded: isMessageExpanded,
    clearExpanded,
  } = useExpandableItems();

  const [isHintExpanded, setIsHintExpanded] = useState(false);

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
      const hint = getInitialHint(language);
      setInitialHint(hint);
    }
  }, [_hasHydrated, learningLanguage, learningProficiency]);

  // Set initial hint and translation only when starting a new conversation
  useEffect(() => {
    if (initialHint && messages.length === 0) {
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
  ]);

  // Reset expansions when language changes
  useEffect(() => {
    clearExpanded();
    setIsHintExpanded(false);
    clearTranslations();
  }, [selectedLanguage, clearExpanded, clearTranslations]);

  const handleSendMessage = async (messageText) => {
    try {
      await sendMessage(messageText, {
        language: selectedLanguage,
        nativeLanguage: getNativeLanguageForTranslation(),
        proficiencyLevel: learningProficiency,
        personality,
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
    <div className="flex flex-col h-screen max-w-4xl mx-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3Cpath d='M20 20h10v10H20zM5 35h10v10H5zM35 5h10v10H35z' fill-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />

      <ChatHeader contactName={contactName} contactAvatar={contactAvatar} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative">
        {isLoadingLLM && messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-slate-400">
              <TypingIndicator />
              Starting conversation...
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isExpanded={isMessageExpanded(message.id)}
            translation={messageTranslations[message.id]}
            onToggleExpansion={handleMessageExpansion}
          />
        ))}

        {isLoadingLLM && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-slate-700/80 text-slate-100 rounded-2xl rounded-bl-md border border-slate-600/50 px-4 py-3 shadow-lg backdrop-blur">
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
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoadingLLM}
        placeholder="Type your response..."
      />
    </div>
  );
}
