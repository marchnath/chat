"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Flame,
  ArrowLeft,
  Camera,
  Sparkles,
  Sun,
  Moon,
  Languages,
  ChevronDown,
} from "lucide-react";
import useProfileStore from "@/lib/store";
import { LANGUAGES, PROFICIENCY_LEVELS } from "@/lib/constants";

// Reusable pill button
function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none ring-1 ` +
        (active
          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-600/30 ring-white/20 scale-105"
          : "bg-white/5 backdrop-blur text-gray-300 hover:text-white hover:bg-white/10 ring-white/10")
      }
    >
      {children}
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const {
    nativeLanguage,
    nativeProficiency,
    learningLanguage,
    learningProficiency,
    theme,
    avatarUrl,
    displayName,
    streakDays,
    setNativeLanguage,
    setNativeProficiency,
    setLearningLanguage,
    setLearningProficiency,
    setTheme,
    setAvatarUrl,
    setDisplayName,
  } = useProfileStore();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const containerGrad =
    theme === "dark"
      ? "from-slate-950 via-slate-900 to-slate-950"
      : "from-white via-sky-50 to-blue-50";

  const [openDrawer, setOpenDrawer] = useState(null); // 'native' | 'learning' | null
  const toggleDrawer = (which) =>
    setOpenDrawer((prev) => (prev === which ? null : which));

  return (
    <div
      className={
        `min-h-screen w-full bg-gradient-to-b ${containerGrad} relative text-sm ` +
        (theme === "dark" ? "text-gray-200" : "text-gray-800")
      }
    >
      {/* Ambient blobs (blue toned) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-10 w-96 h-96 rounded-full bg-gradient-to-br from-sky-600/30 to-blue-600/30 blur-3xl opacity-40" />
        <div className="absolute top-1/3 -left-10 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500/25 to-cyan-500/25 blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-6 pb-24">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-3 rounded-2xl ring-1 ring-white/10 bg-white/5 hover:bg-white/10 backdrop-blur text-sky-200 hover:text-white shadow-md transition"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <section className="grid md:grid-cols-[320px_1fr] gap-10 items-start">
          {/* Left card */}
          <div
            className={
              `relative rounded-3xl p-6 md:p-8 backdrop-blur-xl border overflow-hidden group ` +
              (theme === "dark"
                ? "bg-white/5 border-white/10 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.6)]"
                : "bg-white/80 border-white/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]")
            }
          >
            <div
              aria-hidden
              className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-gradient-to-br from-sky-500/40 to-blue-600/40 blur-3xl opacity-40 group-hover:opacity-60 transition"
            />
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div className="w-40 h-40 rounded-3xl overflow-hidden ring-4 ring-sky-400/30 shadow-lg shadow-sky-600/30 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 flex items-center justify-center">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName || "Avatar"}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Sparkles className="w-10 h-10 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-600/40 hover:scale-105 transition"
                  aria-label="Change avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={
                  `w-full text-center font-extrabold tracking-tight text-2xl bg-transparent focus:outline-none rounded-xl px-2 py-1 ` +
                  (theme === "dark"
                    ? "text-white placeholder:text-gray-500"
                    : "text-gray-900 placeholder:text-gray-500")
                }
                placeholder="Your name"
              />
              <p className="mt-2 text-xs uppercase tracking-wider font-medium opacity-60 flex items-center gap-1">
                <Languages className="w-3 h-3" />
                Language Explorer
              </p>

              <div className="mt-6 w-full flex flex-col gap-4 text-left">
                <button
                  onClick={() => toggleDrawer("native")}
                  className="group flex items-center justify-between rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition text-left"
                  aria-expanded={openDrawer === "native"}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                      Native
                    </p>
                    <div className="text-base font-semibold">
                      {nativeLanguage}
                    </div>
                    <div className="text-xs opacity-60">
                      {nativeProficiency}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDrawer === "native" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => toggleDrawer("learning")}
                  className="group flex items-center justify-between rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition text-left"
                  aria-expanded={openDrawer === "learning"}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                      Learning
                    </p>
                    <div className="text-base font-semibold">
                      {learningLanguage}
                    </div>
                    <div className="text-xs opacity-60">
                      {learningProficiency}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDrawer === "learning" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right side - drawers & other sections */}
          <div className="space-y-12">
            <div className="space-y-6">
              {openDrawer === "native" && (
                <div className="rounded-3xl p-6 backdrop-blur-xl border border-white/10 bg-white/5 animate-in fade-in slide-in-from-top-2">
                  <h3 className="font-bold mb-3 text-xs uppercase tracking-wider text-sky-300">
                    Edit Native Language
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {LANGUAGES.map((lang) => (
                      <Pill
                        key={lang}
                        active={lang === nativeLanguage}
                        onClick={() => setNativeLanguage(lang)}
                      >
                        {lang}
                      </Pill>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PROFICIENCY_LEVELS.map((lvl) => (
                      <Pill
                        key={lvl}
                        active={lvl === nativeProficiency}
                        onClick={() => setNativeProficiency(lvl)}
                      >
                        {lvl}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
              {openDrawer === "learning" && (
                <div className="rounded-3xl p-6 backdrop-blur-xl border border-white/10 bg-white/5 animate-in fade-in slide-in-from-top-2">
                  <h3 className="font-bold mb-3 text-xs uppercase tracking-wider text-sky-300">
                    Edit Learning Language
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {LANGUAGES.map((lang) => (
                      <Pill
                        key={lang}
                        active={lang === learningLanguage}
                        onClick={() => setLearningLanguage(lang)}
                      >
                        {lang}
                      </Pill>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PROFICIENCY_LEVELS.map((lvl) => (
                      <Pill
                        key={lvl}
                        active={lvl === learningProficiency}
                        onClick={() => setLearningProficiency(lvl)}
                      >
                        {lvl}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-extrabold tracking-tight mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 animate-pulse" />
                Activity & Progress
              </h2>
              <div className="grid sm:grid-cols-3 gap-5">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-700/40">
                  <p className="text-xs uppercase font-bold opacity-80 tracking-wider mb-1">
                    Streak
                  </p>
                  <p className="text-3xl font-extrabold leading-none flex items-center gap-1">
                    <Flame className="w-7 h-7" /> {streakDays}
                  </p>
                </div>
                <div className="rounded-2xl p-4 backdrop-blur bg-white/5 ring-1 ring-white/10 flex flex-col">
                  <p className="text-xs uppercase font-bold opacity-60 tracking-wider mb-1">
                    Words today
                  </p>
                  <p className="text-3xl font-extrabold leading-none">48</p>
                  <p className="text-[10px] mt-1 font-medium opacity-60">
                    Approx tokens
                  </p>
                </div>
                <div className="rounded-2xl p-4 backdrop-blur bg-white/5 ring-1 ring-white/10 flex flex-col">
                  <p className="text-xs uppercase font-bold opacity-60 tracking-wider mb-1">
                    Chats
                  </p>
                  <p className="text-3xl font-extrabold leading-none">12</p>
                  <p className="text-[10px] mt-1 font-medium opacity-60">
                    Sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
