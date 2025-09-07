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
      role="dialog"
      aria-label="Word translations"
      className={`fixed top-1/2 -translate-y-1/2 z-50 w-48 max-h-56
        ${position === "right" ? "right-4" : "left-4"}
        rounded-lg shadow-xl backdrop-blur-xl
        bg-slate-900/80 ring-1 ring-slate-300/20 border border-slate-700/20
        overflow-hidden
        animate-[fadeIn_120ms_ease-out]
        transition-all duration-200
        hover:ring-slate-300/30`}
      style={{ WebkitBackdropFilter: "blur(16px)" }}
    >
      {/* Content */}
      <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-transparent">
        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading…</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-center text-xs">
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={fetchWordTranslations}
              className="mt-1 text-blue-400 hover:text-blue-300 transition-colors underline decoration-dotted"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && wordTranslations.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No words found
          </div>
        )}

        {!isLoading && !error && wordTranslations.length > 0 && (
          <ul className="p-1 divide-y divide-slate-700/30">
            {wordTranslations.map((item, index) => {
              const untranslated =
                item.translation.startsWith("[") &&
                item.translation.endsWith("]");
              const unchanged = item.translation === item.word;
              return (
                <li
                  key={index}
                  className="group flex items-start gap-2 px-2 py-1.5 text-[11px] leading-tight hover:bg-slate-800/60 rounded-sm transition-colors"
                >
                  <span className="text-slate-300 font-medium truncate max-w-[40%]">
                    {item.word}
                  </span>
                  <span className="text-slate-500/70">→</span>
                  <span
                    className={
                      "ml-auto font-semibold text-right truncate max-w-[50%] " +
                      (untranslated
                        ? "text-slate-500 italic"
                        : unchanged
                        ? "text-amber-300"
                        : "text-slate-100")
                    }
                    title={item.translation}
                  >
                    {item.translation}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
