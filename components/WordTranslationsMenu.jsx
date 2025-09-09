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

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isVisible) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-label="Word translations"
      className={`fixed top-1/2 -translate-y-1/2 z-50 w-60 max-h-[60vh]
        ${position === "right" ? "right-4" : "left-4"}
        rounded-2xl shadow-2xl backdrop-blur-xl
        bg-slate-900/85 border border-white/10 ring-1 ring-white/10
        overflow-hidden isolate
        animate-[fadeIn_120ms_ease-out]
        transition-all duration-200`}
      style={{ WebkitBackdropFilter: "blur(18px)" }}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-white/5">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Words
          </span>
          <span className="text-[10px] text-slate-400">
            {sourceLanguage} → {targetLanguage}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close translations menu"
          className="w-6 h-6 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <span className="text-xs leading-none">×</span>
        </button>
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-blue-500/30 blur-2xl"
        />
      </div>
      {/* Content */}
      <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/70 scrollbar-track-transparent">
        {isLoading && (
          <div className="flex items-center gap-2 p-4 text-[11px] text-slate-300 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading words…</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-xs">
            <p className="text-red-400 font-medium mb-1">{error}</p>
            <button
              onClick={fetchWordTranslations}
              className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-dotted"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && wordTranslations.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400">
            No words found
          </div>
        )}

        {!isLoading && !error && wordTranslations.length > 0 && (
          <ul className="px-2 py-2 flex flex-col gap-1.5">
            {wordTranslations.map((item, index) => {
              const untranslated =
                item.translation.startsWith("[") &&
                item.translation.endsWith("]");
              const unchanged = item.translation === item.word;
              return (
                <li
                  key={index}
                  className="group relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-[11px] backdrop-blur-sm"
                >
                  <span className="font-semibold text-slate-100 truncate max-w-[40%]">
                    {item.word}
                  </span>
                  <span className="text-slate-500/70">→</span>
                  <span
                    className={
                      "ml-auto font-medium text-right truncate max-w-[50%] " +
                      (untranslated
                        ? "text-slate-400 italic"
                        : unchanged
                        ? "text-amber-300"
                        : "text-blue-200")
                    }
                    title={item.translation}
                  >
                    {item.translation}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
