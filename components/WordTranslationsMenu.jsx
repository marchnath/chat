"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function WordTranslationsMenu({
  text,
  sourceLanguage,
  targetLanguage,
  isVisible,
  onClose,
  position = "right", // "right" or "left"
}) {
  const [wordTranslations, setWordTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    if (isVisible && text && sourceLanguage && targetLanguage) {
      fetchWordTranslations();
    }
  }, [isVisible, text, sourceLanguage, targetLanguage]);

  // Handle clicking outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  const fetchWordTranslations = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/translate-words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch word translations");
      }

      const data = await response.json();
      setWordTranslations(data.wordTranslations || []);
    } catch (err) {
      console.error("Error fetching word translations:", err);
      setError("Failed to load word translations");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed top-1/2 transform -translate-y-1/2 z-50 w-44 max-h-48 bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-md shadow-xl ${
        position === "right" ? "right-4" : "left-4"
      }`}
    >
      {/* Content - No header, direct content */}
      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {/* {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400 mr-2" />
            <span className="text-slate-400 text-xs">Loading...</span>
          </div>
        )} */}

        {error && (
          <div className="p-3 text-center">
            <p className="text-red-400 text-xs">{error}</p>
            <button
              onClick={fetchWordTranslations}
              className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && wordTranslations.length === 0 && (
          <div className="p-3 text-center">
            <p className="text-slate-400 text-xs">No words found</p>
          </div>
        )}

        {!isLoading && !error && wordTranslations.length > 0 && (
          <div className="p-1">
            {wordTranslations.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-2 py-1.5 hover:bg-slate-700/50 rounded-sm transition-colors text-xs"
              >
                <span className="text-slate-200 font-medium min-w-0 flex-shrink-0">
                  {item.word}
                </span>
                <span className="text-slate-400 mx-2 flex-shrink-0">:</span>
                <span
                  className={`font-semibold min-w-0 flex-1 text-right ${
                    item.translation.startsWith("[") &&
                    item.translation.endsWith("]")
                      ? "text-slate-500 italic" // Style for untranslated words
                      : item.translation === item.word
                      ? "text-yellow-400" // Style for words that didn't change
                      : "text-slate-100" // Style for successfully translated words
                  }`}
                >
                  {item.translation}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
