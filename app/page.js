"use client";

import { useState, useRef, useEffect } from "react";
import { Smile, ChevronDown, User } from "lucide-react";
import { characters, getRandomConversationStarter } from "../lib/characters";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(characters[0]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with a random conversation starter for the default character
  useEffect(() => {
    const initialMessage = {
      id: 1,
      text: getRandomConversationStarter(activeCharacter.id),
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([initialMessage]);
  }, []);

  const handleCharacterSelect = (character) => {
    setActiveCharacter(character);
    setIsDropdownOpen(false);

    // Reset conversation with new character's random starter
    const newMessage = {
      id: Date.now(),
      text: getRandomConversationStarter(character.id),
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([newMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          character: activeCharacter,
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.message,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Character Dropdown */}
      <div className="fixed top-4 left-4 z-10">
        <div className="">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onMouseEnter={() => setIsDropdownOpen(true)}
            className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
          >
            <Smile className={`w-6 h-6 ${activeCharacter.color}`} />
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-48 py-2"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {characters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => handleCharacterSelect(character)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                    activeCharacter.id === character.id ? "bg-gray-50" : ""
                  }`}
                >
                  <Smile className={`w-6 h-6 ${character.color}`} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {character.name}
                    </p>
                    <p className="text-sm text-gray-500">{character.label}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header with Active Character Avatar */}
      <div className="p-4 ">
        <div className="flex flex-col items-center">
          <div className="w-30 h-30 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <Smile className={`w-24 h-24 ${activeCharacter.color}`} />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            {activeCharacter.name}
          </h2>
          <p className="text-sm text-gray-500">{activeCharacter.description}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                message.sender === "user"
                  ? "bg-emerald-500 text-white rounded-br-md"
                  : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user"
                    ? "text-emerald-100"
                    : "text-gray-500"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 border bg-white border-gray-300 rounded-full resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows="1"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white p-3 rounded-full transition-colors duration-200 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
