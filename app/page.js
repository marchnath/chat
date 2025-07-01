"use client";

import { useState, useRef, useEffect } from "react";
import { Smile, ChevronDown, MessageSquare } from "lucide-react";
import { characters, getRandomConversationStarter } from "../lib/characters";
import { conversationMissions } from "../lib/missions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(characters[0]);
  const [currentMission, setCurrentMission] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with a random mission and conversation starter
  // useEffect(() => {
  //   const randomMission =
  //     conversationMissions[
  //       Math.floor(Math.random() * conversationMissions.length)
  //     ];
  //   setCurrentMission(randomMission);

  // const missionIntro = {
  //   id: 0,
  //   text: `Today I'll be evaluating your ${randomMission.style.toLowerCase()} conversation skills. I'll be looking at how well you maintain a ${randomMission.tone.toLowerCase()} tone and ${randomMission.description.toLowerCase()} Let's practice!`,
  //   sender: "bot",
  //   timestamp: new Date().toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }),
  // };

  //   const initialMessage = {
  //     id: 1,
  //     text: getRandomConversationStarter(activeCharacter.id),
  //     sender: "bot",
  //     timestamp: new Date().toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //   };
  //   // !!add missonIntero and initialMessage to messages state if needed
  //   setMessages([initialMessage]);
  // }, []);

  // const handleCharacterSelect = (character) => {
  //   setActiveCharacter(character);
  //   setIsDropdownOpen(false);

  // Get a new random mission for the new character
  // const randomMission =
  //   conversationMissions[
  //     Math.floor(Math.random() * conversationMissions.length)
  //   ];
  // setCurrentMission(randomMission);

  // Reset conversation with new character's mission intro and random starter
  // const missionIntro = {
  //   id: Date.now(),
  //   text: `Today I'll be evaluating your ${randomMission.style.toLowerCase()} conversation skills. I'll be looking at how well you maintain a ${randomMission.tone.toLowerCase()} tone and ${randomMission.description.toLowerCase()} Let's practice!`,
  //   sender: "bot",
  //   timestamp: new Date().toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }),
  // };

  // const newMessage = {
  //   id: Date.now() + 1,
  //   text: "",
  //   sender: "bot",
  //   timestamp: new Date().toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }),
  // };

  //   setMessages([missionIntro, newMessage]);
  // };

  const getFeedback = async () => {
    if (messages.length < 3) {
      setFeedback(
        "Please have a longer conversation before requesting feedback."
      );
      return;
    }

    setIsFeedbackLoading(true);
    setIsSheetOpen(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.filter((msg) => msg.id !== 0), // Exclude mission intro
          character: activeCharacter,
          mission: currentMission,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error getting feedback:", error);
      setFeedback(
        "Sorry, I couldn't generate feedback right now. Please try again later."
      );
    } finally {
      setIsFeedbackLoading(false);
    }
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
          mission: currentMission,
          conversationHistory: messages.slice(-10),
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
          {currentMission && (
            <div className="mt-2 px-3 py-1 bg-blue-50 rounded-full">
              <p className="text-xs text-blue-700 font-medium">
                Mission: {currentMission.style} ({currentMission.tone})
              </p>
            </div>
          )}
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
                  : message.id === 0
                  ? "bg-blue-50 text-blue-800 rounded-bl-md border border-blue-200"
                  : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user"
                    ? "text-emerald-100"
                    : message.id === 0
                    ? "text-blue-600"
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

      {/* Feedback Button */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button
            onClick={getFeedback}
            className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200 z-10"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Conversation Feedback</SheetTitle>
            <SheetDescription>
              Here's how you performed in your{" "}
              {currentMission?.style.toLowerCase()} conversation:
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 overflow-auto  px-4">
            {isFeedbackLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {feedback}
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
