"use client";

import { Play, Square, Loader2, Volume2 } from "lucide-react";
import React from "react";

/**
 * Reusable small circular Text-To-Speech toggle button.
 * Shows loading spinner, play icon, or stop icon based on state.
 * Appears subtly and fades in on parent group hover.
 */
export default function TTSButton({
  isSpeaking,
  isLoading,
  onClick,
  labelPlay = "Play audio",
  labelStop = "Stop audio",
  className = "",
  variant = "default",
  size = "sm",
}) {
  const baseSizes = {
    sm: "w-7 h-7 text-[11px]",
    md: "w-8 h-8 text-xs",
  };

  const variantClasses = {
    default:
      "bg-slate-900/30 text-slate-200 border border-white/10 hover:bg-slate-900/50 focus-visible:ring-2 focus-visible:ring-slate-300/40",
    ai: "bg-slate-800/40 text-slate-200 border border-slate-500/30 hover:bg-slate-700/60 focus-visible:ring-2 focus-visible:ring-slate-400/40",
    user: "bg-blue-700/40 text-blue-50 border border-blue-400/30 hover:bg-blue-600/60 focus-visible:ring-2 focus-visible:ring-blue-300/40",
    hint: "bg-blue-800/40 text-blue-100 border border-blue-400/30 hover:bg-blue-700/60 focus-visible:ring-2 focus-visible:ring-blue-300/40",
  };

  const currentLabel = isSpeaking ? labelStop : labelPlay;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={currentLabel}
      aria-pressed={isSpeaking}
      disabled={isLoading}
      className={`relative inline-flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 group/button overflow-hidden ${
        baseSizes[size]
      } ${variantClasses[variant] || variantClasses.default} ${className} ${
        isSpeaking ? "ring-2 ring-current/40 animate-pulse" : ""
      } ${isLoading ? "opacity-80" : ""}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isSpeaking ? (
        <Square className="w-3.5 h-3.5" />
      ) : (
        <Play className="w-3.5 h-3.5 translate-x-[1px]" />
      )}
      <span className="sr-only">{currentLabel}</span>
      {/* Decorative subtle radial highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity"
      />
    </button>
  );
}
