"use client";

import { Lightbulb } from "lucide-react";

export default function HintBubble({
  hint,
  translation,
  isExpanded,
  onToggle,
}) {
  if (!hint) return null;

  return (
    <div className="mx-4 relative z-10">
      <div
        className="bg-blue-600/90 text-white rounded-t-2xl rounded-bl-2xl px-4 py-4 shadow-lg cursor-pointer hover:bg-blue-600 transition-colors backdrop-blur"
        onClick={onToggle}
      >
        <p className="text-sm leading-relaxed">{hint}</p>

        {isExpanded && translation && (
          <>
            <div className="my-2"></div>
            <p className="text-sm leading-relaxed text-blue-100 italic">
              {translation}
            </p>
          </>
        )}
      </div>

      {/* Bulb icon */}
      <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1 shadow-lg">
        <Lightbulb className="w-3 h-3 text-yellow-900" />
      </div>
    </div>
  );
}
