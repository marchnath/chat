"use client";

import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";
import { IoFootstepsSharp } from "react-icons/io5";
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
          messages: messages,
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
      {/* Header with Active Character Avatar */}
      <div className="p-4 ">
        <div className="flex flex-col items-center">
          <div className="w-30 h-30 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <Smile className={`w-24 h-24 text-emerald-500`} />
          </div>
          <h2 className="text-lg font-semibold text-gray-700"></h2>
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
            className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200 z-10"
          >
            <IoFootstepsSharp className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Conversation Feedback</SheetTitle>
            <SheetDescription>
              Here's how you performed in your conversation:
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
