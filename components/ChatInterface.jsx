"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, MoreVertical, ArrowLeft, Lightbulb, Smile } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getInitialHint } from "@/lib/conversationData";
import { getContactByName, getPersonalityStarters } from "@/lib/contacts";
import useProfileStore, {
  getSelectedChatLanguage,
  getNativeLanguageForTranslation,
} from "@/lib/store";

export default function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const contactName = searchParams.get("name") || "Pal";
  const contactAvatar = searchParams.get("avatar") || "/avatars/avatar0.png";

  // Get contact personality information
  const contact = getContactByName(contactName);
  const personality = contact?.personality || "friend";

  // Use Zustand store for language preferences
  const { _hasHydrated, learningLanguage, learningProficiency } =
    useProfileStore();

  // Wait for hydration before getting language to avoid hydration mismatch
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [initialHint, setInitialHint] = useState("");

  // Update language when store is hydrated or when learning language changes
  useEffect(() => {
    if (_hasHydrated) {
      const language = getSelectedChatLanguage();
      setSelectedLanguage(language);
      // Generate initial hint with correct language after hydration
      const hint = getPersonalityStarters(personality, language);
      setInitialHint(hint);
    }
  }, [_hasHydrated, learningLanguage, learningProficiency, personality]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingLLM, setIsLoadingLLM] = useState(false);
  const [currentHint, setCurrentHint] = useState("");
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [expandedHint, setExpandedHint] = useState(false);
  const [messageTranslations, setMessageTranslations] = useState({});
  const [hintTranslation, setHintTranslation] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial hint and keep it visible
  useEffect(() => {
    if (initialHint) {
      setCurrentHint(initialHint);
      // Clear hint translation when language/hint changes
      setHintTranslation("");
      setExpandedHint(false);

      // Pre-load translation for initial hint
      const loadInitialHintTranslation = async () => {
        if (initialHint) {
          const nativeLanguage = getNativeLanguageForTranslation();
          const translation = await translateText(initialHint, nativeLanguage);
          setHintTranslation(translation);
        }
      };

      loadInitialHintTranslation();
    }
  }, [initialHint]);

  // Reset expansion states and translations when language changes
  useEffect(() => {
    setExpandedMessages(new Set());
    setExpandedHint(false);
    setMessageTranslations({});
    setHintTranslation("");
  }, [selectedLanguage]);

  const translateText = async (text, targetLanguage) => {
    try {
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
      return text;
    }
  };

  const toggleMessageExpansion = async (messageId, messageText) => {
    const newExpandedMessages = new Set(expandedMessages);

    if (expandedMessages.has(messageId)) {
      newExpandedMessages.delete(messageId);
    } else {
      newExpandedMessages.add(messageId);
      // Only fetch translation if not already stored (for older messages or fallback)
      if (!messageTranslations[messageId]) {
        const nativeLanguage = getNativeLanguageForTranslation();
        const translation = await translateText(messageText, nativeLanguage);
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
      // Only fetch translation if not already provided by the API
      const nativeLanguage = getNativeLanguageForTranslation();
      const translation = await translateText(currentHint, nativeLanguage);
      setHintTranslation(translation);
    }
    setExpandedHint(!expandedHint);
  };

  const sendToLLM = async (userMessage) => {
    setIsLoadingLLM(true);
    try {
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
          proficiencyLevel: learningProficiency,
          personality: personality,
          contactName: contactName,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const llmMessage = {
        id: Date.now(),
        text: data.message,
        sender: "personA",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, llmMessage]);

      // Store the translation if provided
      if (data.messageTranslation) {
        setMessageTranslations((prev) => ({
          ...prev,
          [llmMessage.id]: data.messageTranslation,
        }));
      }

      const newHint =
        data.hint ||
        (selectedLanguage === "russian"
          ? "Продолжайте разговор естественно."
          : "Continue the conversation naturally.");

      setCurrentHint(newHint);

      // Store hint translation if provided
      if (data.hintTranslation) {
        setHintTranslation(data.hintTranslation);
      } else {
        // Clear previous hint translation if no new one
        setHintTranslation("");
      }
    } catch (error) {
      console.error("Error calling LLM:", error);

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
              </h1>
              <p className="text-xs text-slate-400">Conversation practice</p>
            </div>
          </div>

          {/* Decorative Menu Button */}
          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

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
              placeholder="Type your response..."
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
