"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Send,
  MoreVertical,
  Globe,
  ArrowLeft,
  Lightbulb,
  Smile,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  translateLocally,
  getOfflineResponse,
  getRandomFallbackResponse,
  getInitialHint,
  uiText,
  phraseTranslations,
} from "@/lib/conversationData";
import { getContactByName, getPersonalityStarters } from "@/lib/contacts";

export default function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const contactName = searchParams.get("name") || "Pal";
  const contactAvatar = searchParams.get("avatar") || "/avatars/avatar0.png";

  // Get contact personality information
  const contact = getContactByName(contactName);
  const personality = contact?.personality || "friend";

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoadingLLM, setIsLoadingLLM] = useState(false);
  const [currentHint, setCurrentHint] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [expandedHint, setExpandedHint] = useState(false);
  const [messageTranslations, setMessageTranslations] = useState({});
  const [hintTranslation, setHintTranslation] = useState("");
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const initialHint = useMemo(
    () => getPersonalityStarters(personality, selectedLanguage),
    [selectedLanguage, personality]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial hint and keep it visible
  useEffect(() => {
    setCurrentHint(initialHint);
  }, [initialHint]);

  // Reset expansion states when language changes
  useEffect(() => {
    setExpandedMessages(new Set());
    setExpandedHint(false);
    setMessageTranslations({});
    setHintTranslation("");
  }, [selectedLanguage]);

  const translateText = async (text, targetLanguage) => {
    try {
      // First try local translation
      const localTranslation = translateLocally(text, targetLanguage);

      // Check if local translation actually worked (doesn't contain unavailable indicators)
      if (
        !localTranslation.includes("(translation unavailable)") &&
        !localTranslation.includes("(перевод недоступен)") &&
        localTranslation !== text && // Not just the original text
        localTranslation.toLowerCase() !== "привет" && // Not generic fallback
        localTranslation.toLowerCase() !== "нет" // Not generic fallback
      ) {
        return localTranslation;
      }

      // If in offline mode, don't try API
      if (isOfflineMode) {
        // Remove the unavailable indicator and just return the original text
        return localTranslation
          .replace(" (translation unavailable)", "")
          .replace(" (перевод недоступен)", "");
      }

      // Use API for translation
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: [],
          isTranslationMode: true,
          targetLanguage: targetLanguage,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data.translation || text; // Return original text if no translation
    } catch (error) {
      console.error("Error translating text:", error);
      // Return original text without unavailable indicator
      return text;
    }
  };

  const toggleMessageExpansion = async (messageId, messageText) => {
    const newExpandedMessages = new Set(expandedMessages);

    if (expandedMessages.has(messageId)) {
      newExpandedMessages.delete(messageId);
    } else {
      newExpandedMessages.add(messageId);
      // Store translation if not already stored
      if (!messageTranslations[messageId]) {
        const targetLang =
          selectedLanguage === "english" ? "russian" : "english";
        const translation = await translateText(messageText, targetLang);
        setMessageTranslations((prev) => ({
          ...prev,
          [messageId]: translation,
        }));
      }
    }

    setExpandedMessages(newExpandedMessages);
  };

  const toggleHintExpansion = async () => {
    if (!expandedHint && currentHint && !hintTranslation) {
      const targetLang = selectedLanguage === "english" ? "russian" : "english";
      const translation = await translateText(currentHint, targetLang);
      setHintTranslation(translation);
    }
    setExpandedHint(!expandedHint);
  };

  const sendToLLM = async (userMessage) => {
    setIsLoadingLLM(true);
    try {
      // If already in offline mode, use fallback directly
      if (isOfflineMode) {
        const fallbackResponse = getOfflineResponse(
          userMessage,
          selectedLanguage,
          personality
        );

        const llmMessage = {
          id: Date.now(),
          text: fallbackResponse.message,
          sender: "personA",
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, llmMessage]);
        setCurrentHint(fallbackResponse.hint);
        setIsLoadingLLM(false);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.filter(
            (msg) => msg.sender !== "system"
          ),
          isLLMMode: true,
          language: selectedLanguage,
          personality: personality,
          contactName: contactName,
        }),
      });

      // Check for rate limiting status code
      if (response.status === 429) {
        setIsOfflineMode(true);
        const fallbackResponse = getOfflineResponse(
          userMessage,
          selectedLanguage,
          personality
        );

        const llmMessage = {
          id: Date.now(),
          text: fallbackResponse.message,
          sender: "personA",
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, llmMessage]);
        setCurrentHint(fallbackResponse.hint);
        setIsLoadingLLM(false);
        return;
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const llmMessage = {
        id: Date.now(),
        text: data.message,
        sender: "personA",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, llmMessage]);
      setCurrentHint(
        data.hint ||
          (selectedLanguage === "russian"
            ? "Продолжайте разговор естественно."
            : "Continue the conversation naturally.")
      );
    } catch (error) {
      console.error("Error calling LLM:", error);

      // Check if it's a quota error or rate limit error
      const isQuotaError =
        error.message.includes("quota") ||
        error.message.includes("rate limit") ||
        error.message.includes("429") ||
        error.message.includes("Too Many Requests");

      if (isQuotaError) {
        // Switch to offline mode and use fallback response
        setIsOfflineMode(true);
        const fallbackResponse = getOfflineResponse(
          userMessage,
          selectedLanguage,
          personality
        );

        const llmMessage = {
          id: Date.now(),
          text: fallbackResponse.message,
          sender: "personA",
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, llmMessage]);
        setCurrentHint(fallbackResponse.hint);
        return; // Don't show error message, just use fallback
      }

      const errorMessage = {
        id: Date.now(),
        text:
          selectedLanguage === "russian"
            ? "Извините, у меня сейчас проблемы с ответом. Пожалуйста, попробуйте еще раз."
            : "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "personA",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setCurrentHint(
        selectedLanguage === "russian"
          ? "Попробуйте отправить сообщение еще раз."
          : "Try sending your message again."
      );
    } finally {
      setIsLoadingLLM(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    if (value.length > 0 && !isTyping) setIsTyping(true);
  };

  const checkResponse = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      text: trimmed,
      sender: "personB",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(false);
    sendToLLM(trimmed);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      checkResponse();
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3Cpath d='M20 20h10v10H20zM5 35h10v10H5zM35 5h10v10H35z' fill-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none"></div>
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur border-b border-slate-700/50 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Back"
              onClick={() => router.push("/")}
              className="p-2 -ml-2 mr-1 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
            {/^\/.+\.(png|jpg|jpeg|svg|gif|webp)$/i.test(contactAvatar) ? (
              <Image
                src={contactAvatar}
                alt={contactName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {contactAvatar?.length <= 3 ? contactAvatar : contactAvatar[0]}
              </div>
            )}
            <div>
              <h1 className="font-semibold text-white leading-5">
                {contactName}
                {isOfflineMode && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {uiText.offline[selectedLanguage]}
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-400">
                {uiText.conversationPractice[selectedLanguage]}
                {isOfflineMode && (
                  <span className="ml-1 text-orange-400">
                    (
                    {selectedLanguage === "russian"
                      ? "Автономный режим"
                      : "Local mode"}
                    )
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Language Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-300" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {uiText.languageSettings[selectedLanguage]}
                </SheetTitle>
                <SheetDescription>
                  {uiText.chooseLanguage[selectedLanguage]}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    setSelectedLanguage("english");
                    setIsSheetOpen(false);
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedLanguage === "english"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇺🇸</span>
                    <div>
                      <div className="font-medium">English</div>
                      <div className="text-sm text-gray-500">
                        {uiText.practiceEnglish[selectedLanguage]}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedLanguage("russian");
                    setIsSheetOpen(false);
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedLanguage === "russian"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇷🇺</span>
                    <div>
                      <div className="font-medium">Русский</div>
                      <div className="text-sm text-gray-500">
                        {uiText.practiceRussian[selectedLanguage]}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative">
        {isLoadingLLM && messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-slate-400">
              <TypingIndicator />
              {uiText.startingConversation[selectedLanguage]}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="flex">
            <div
              className={`flex ${
                message.sender === "personA" ? "justify-start" : "justify-end"
              } w-full`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
                  message.sender === "personA"
                    ? "bg-slate-700/80 text-slate-100 rounded-bl-md border border-slate-600/50 hover:bg-slate-700/90 cursor-pointer backdrop-blur"
                    : "bg-blue-600 text-white rounded-br-md shadow-blue-600/30"
                }`}
                onClick={() =>
                  message.sender === "personA" &&
                  toggleMessageExpansion(message.id, message.text)
                }
              >
                <p className="text-sm leading-relaxed">{message.text}</p>

                {message.sender === "personA" &&
                  expandedMessages.has(message.id) &&
                  messageTranslations[message.id] && (
                    <>
                      <div className="my-2"></div>
                      <p className="text-sm leading-relaxed text-slate-300 italic">
                        {messageTranslations[message.id]}
                      </p>
                    </>
                  )}
              </div>
            </div>
          </div>
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
      {/* Hint */}
      {currentHint && (
        <div className="mx-4 relative z-10">
          <div
            className="bg-blue-600/90 text-white rounded-t-2xl rounded-bl-2xl px-4 py-4 shadow-lg cursor-pointer hover:bg-blue-600 transition-colors backdrop-blur"
            onClick={toggleHintExpansion}
          >
            <p className="text-sm leading-relaxed">{currentHint}</p>

            {expandedHint && hintTranslation && (
              <>
                <div className="my-2"></div>
                <p className="text-sm leading-relaxed text-blue-100 italic">
                  {hintTranslation}
                </p>
              </>
            )}
          </div>

          {/* Bulb icon */}
          <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1 shadow-lg">
            <Lightbulb className="w-3 h-3 text-yellow-900" />
          </div>
        </div>
      )}
      {/* Input */}
      <div className="bg-slate-800/90 backdrop-blur px-4 py-4 relative z-10">
        <div className="flex items-end gap-3">
          {/* Emoji button */}
          <button className="p-2 text-slate-400 hover:text-slate-300 transition-colors mb-1">
            <Smile className="w-6 h-6" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={uiText.typeResponse[selectedLanguage]}
              className="w-full px-4 py-3 pr-12 bg-transparent text-slate-100 placeholder-slate-400 rounded-3xl resize-none max-h-36 focus:outline-none"
              rows="1"
              disabled={isLoadingLLM}
            />
          </div>

          <button
            onClick={checkResponse}
            disabled={!inputText.trim() || isLoadingLLM}
            className="text-blue-400 hover:text-blue-300 disabled:text-slate-600 disabled:cursor-not-allowed p-2 transition-colors duration-200 mb-1"
            aria-label="Send"
          >
            <Send className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
