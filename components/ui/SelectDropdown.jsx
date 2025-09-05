"use client";

import { ChevronDown } from "lucide-react";

export default function SelectDropdown({
  value,
  onChange,
  options,
  label,
  theme,
  className = "",
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-xs opacity-70">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 rounded-lg appearance-none cursor-pointer focus:outline-none ring-1 ${
            theme === "dark"
              ? "bg-white/5 ring-white/10 hover:bg-white/10"
              : "bg-white ring-gray-200 hover:bg-gray-50"
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 pointer-events-none" />
      </div>
    </div>
  );
}
