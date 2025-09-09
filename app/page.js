"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Removed Activity icon in favor of custom tongue icon
// Replace custom tongue icon on home header with a dumbbell + notification badge
import { Dumbbell } from "lucide-react";
import Image from "next/image";
import { contacts } from "@/lib/contacts";
import useProfileStore from "@/lib/store";
import ContactList from "@/components/ContactList";

export default function HomePage() {
  const router = useRouter();

  // Use Zustand store for profile settings
  const {
    nativeLanguage,
    nativeProficiency,
    learningLanguage,
    learningProficiency,
    theme,
    setNativeLanguage,
    setNativeProficiency,
    setLearningLanguage,
    setLearningProficiency,
    setTheme,
    initializeFromLocalStorage,
    _hasHydrated,
  } = useProfileStore();

  // Initialize from localStorage on mount (for migration)
  useEffect(() => {
    initializeFromLocalStorage();
  }, [initializeFromLocalStorage]);

  const handleProfileChange = (newProfile) => {
    setNativeLanguage(newProfile.nativeLanguage);
    setNativeProficiency(newProfile.nativeProficiency);
    setLearningLanguage(newProfile.learningLanguage);
    setLearningProficiency(newProfile.learningProficiency);
    setTheme(newProfile.theme);
  };

  const currentProfile = {
    nativeLanguage,
    nativeProficiency,
    learningLanguage,
    learningProficiency,
    theme,
  };

  return (
    <div
      className={
        "min-h-screen relative " +
        (theme === "dark"
          ? "bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100"
          : "bg-gradient-to-b from-white to-gray-100 text-gray-900")
      }
    >
      {/* Decorative gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(60% 60% at 50% 50%, rgba(168,85,247,0.25), rgba(236,72,153,0.15) 60%, transparent)"
              : "radial-gradient(60% 60% at 50% 50%, rgba(168,85,247,0.3), rgba(236,72,153,0.2) 60%, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-36">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/profile")}
              aria-label="Open profile"
              className="group w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-400/40 shadow-md shadow-blue-600/30 hover:shadow-lg hover:-translate-y-0.5 transition relative bg-slate-800/50"
            >
              <span>I</span>
            </button>
            <h1
              className={
                "text-3xl sm:text-4xl font-extrabold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 drop-shadow " +
                (theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-blue-600 to-indigo-600")
              }
            >
              Textipal
            </h1>
          </div>
          <button
            onClick={() => router.push("/custom-exercise")}
            aria-label="Open custom exercise (1 new)"
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/20 backdrop-blur  border-white/10 shadow-sm shadow-slate-900/40 transition text-slate-200 hover:text-white"
          >
            <Dumbbell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 text-[10px] font-bold px-1  rounded-full bg-rose-600 text-white shadow ring-2 ring-slate-900">
              1
            </span>
            <span className="sr-only">1 new custom exercise update</span>
          </button>
        </header>

        <ContactList contacts={contacts} theme={theme} />
      </div>

      {/* Quick chat now available as a neutral contact (id:6) instead of FAB */}
    </div>
  );
}
