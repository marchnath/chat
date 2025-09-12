import { useState, useCallback, useEffect } from "react";
import ChatService from "@/lib/services/chatService";
import { MESSAGE_SENDERS } from "@/lib/constants";
import {
  saveConversation,
  loadConversation,
  clearConversation,
} from "@/lib/chatStorage";

export function useChat(contactName) {
  const [messages, setMessages] = useState([]);
  const [isLoadingLLM, setIsLoadingLLM] = useState(false);
  const [currentHint, setCurrentHint] = useState("");
  const [messageTranslations, setMessageTranslations] = useState({});
  const [hintTranslation, setHintTranslation] = useState("");
  const [isConversationLoaded, setIsConversationLoaded] = useState(false);

  // Load conversation from localStorage when contactName changes
  useEffect(() => {
    if (contactName) {
      const savedConversation = loadConversation(contactName);
      if (savedConversation) {
        setMessages(savedConversation.messages || []);
        setCurrentHint(savedConversation.currentHint || "");
        setMessageTranslations(savedConversation.messageTranslations || {});
        setHintTranslation(savedConversation.hintTranslation || "");
      } else {
        // Reset state for new conversation
        setMessages([]);
        setCurrentHint("");
        setMessageTranslations({});
        setHintTranslation("");
      }
      setIsConversationLoaded(true);
    }
  }, [contactName]);

  // Save conversation whenever state changes (debounced)
  useEffect(() => {
    if (contactName && isConversationLoaded) {
      const conversationData = {
        messages,
        currentHint,
        messageTranslations,
        hintTranslation,
      };

      // Debounce saving to avoid excessive localStorage writes
      const timeoutId = setTimeout(() => {
        saveConversation(contactName, conversationData);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [
    contactName,
    messages,
    currentHint,
    messageTranslations,
    hintTranslation,
    isConversationLoaded,
  ]);

  const sendMessage = useCallback(
    async (
      userMessage,
      { language, nativeLanguage, proficiencyLevel, contactName }
    ) => {
      // Add user message
      const userMsg = {
        id: Date.now(),
        text: userMessage,
        sender: MESSAGE_SENDERS.PERSON_B,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsLoadingLLM(true);
      try {
        const response = await ChatService.sendMessage({
          message: userMessage,
          conversationHistory: messages.filter(
            (msg) => msg.sender !== MESSAGE_SENDERS.SYSTEM
          ),
          language,
          nativeLanguage,
          proficiencyLevel,
          contactName,
        });

        // Add AI message
        const aiMsg = {
          id: Date.now() + 1,
          text: response.message,
          sender: MESSAGE_SENDERS.PERSON_A,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        // Store translation if provided
        if (response.messageTranslation) {
          setMessageTranslations((prev) => ({
            ...prev,
            [aiMsg.id]: response.messageTranslation,
          }));
        }

        // Update hint and its translation
        const newHint = response.hint || "Continue the conversation naturally.";
        console.log("Setting new hint:", newHint); // Debug log
        setCurrentHint(newHint);

        // Store hint translation if provided, otherwise clear it
        if (response.hintTranslation) {
          console.log("Setting hint translation:", response.hintTranslation); // Debug log
          setHintTranslation(response.hintTranslation);
        } else {
          setHintTranslation("");
        }

        return response;
      } catch (error) {
        console.error("Error sending message:", error);

        const errorMsg = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble responding right now. Please try again.",
          sender: MESSAGE_SENDERS.PERSON_A,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setCurrentHint("Try sending your message again.");
        throw error;
      } finally {
        setIsLoadingLLM(false);
      }
    },
    [messages]
  );

  const translateMessage = useCallback(
    async (messageId, messageText, targetLanguage) => {
      if (messageTranslations[messageId]) {
        return messageTranslations[messageId];
      }

      try {
        const translation = await ChatService.translateText(
          messageText,
          targetLanguage
        );
        setMessageTranslations((prev) => ({
          ...prev,
          [messageId]: translation,
        }));
        return translation;
      } catch (error) {
        console.error("Error translating message:", error);
        return messageText;
      }
    },
    [messageTranslations]
  );

  const setInitialHint = useCallback((hint, translation = "") => {
    setCurrentHint(hint);
    setHintTranslation(translation);
  }, []);

  const clearTranslations = useCallback(() => {
    setMessageTranslations({});
    setHintTranslation("");
  }, []);

  const clearChat = useCallback(() => {
    if (contactName) {
      clearConversation(contactName);
      setMessages([]);
      setCurrentHint("");
      setMessageTranslations({});
      setHintTranslation("");
    }
  }, [contactName]);

  return {
    messages,
    isLoadingLLM,
    currentHint,
    messageTranslations,
    hintTranslation,
    isConversationLoaded,
    sendMessage,
    translateMessage,
    setInitialHint,
    setHintTranslation,
    clearTranslations,
    clearChat,
  };
}
