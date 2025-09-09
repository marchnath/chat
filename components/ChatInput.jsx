"use client";

import { Send, Smile } from "lucide-react";
import { useState, useRef } from "react";

export default function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Type your response...",
}) {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-transparent px-4 py-4 relative z-10">
      <div className="flex items-end gap-3">
        <button className="p-2 text-slate-400 hover:text-slate-300 transition-colors mb-1">
          <Smile className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 bg-transparent text-slate-100 placeholder-slate-400 rounded-3xl resize-none max-h-36 focus:outline-none"
            rows="1"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading}
          className="text-blue-400 hover:text-blue-300 disabled:text-slate-600 disabled:cursor-not-allowed p-2 transition-colors duration-200 mb-1"
          aria-label="Send"
        >
          <Send className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
