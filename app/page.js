"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, User, Sun, ChevronDown, Search, Plus } from "lucide-react";
import { contacts } from "@/lib/contacts";

export default function HomePage() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [nativeProficiency, setNativeProficiency] = useState("Native");
  const [learningLanguage, setLearningLanguage] = useState("Russian");
  const [learningProficiency, setLearningProficiency] = useState("Beginner");
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  // Filters and favorites removed per design update

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Japanese",
    "Korean",
    "Chinese",
    "Arabic",
  ];
  const proficiencyLevels = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper-Intermediate",
    "Advanced",
    "Native",
  ];

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("profileSettings");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.nativeLanguage) setNativeLanguage(saved.nativeLanguage);
        if (saved.nativeProficiency)
          setNativeProficiency(saved.nativeProficiency);
        if (saved.learningLanguage) setLearningLanguage(saved.learningLanguage);
        if (saved.learningProficiency)
          setLearningProficiency(saved.learningProficiency);
        if (saved.theme) setTheme(saved.theme);
      }
      const uiRaw = localStorage.getItem("homeUI");
      if (uiRaw) {
        const ui = JSON.parse(uiRaw);
        if (ui.searchQuery) setSearchQuery(ui.searchQuery);
      }
    } catch {}
  }, []);

  // Persist preferences
  useEffect(() => {
    const settings = {
      nativeLanguage,
      nativeProficiency,
      learningLanguage,
      learningProficiency,
      theme,
    };
    try {
      localStorage.setItem("profileSettings", JSON.stringify(settings));
    } catch {}
  }, [
    nativeLanguage,
    nativeProficiency,
    learningLanguage,
    learningProficiency,
    theme,
  ]);

  // Persist simple home UI prefs
  useEffect(() => {
    try {
      localStorage.setItem("homeUI", JSON.stringify({ searchQuery }));
    } catch {}
  }, [searchQuery]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = contacts.filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.last.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
      );
    });
    return list.sort((a, b) => a.id - b.id);
  }, [searchQuery]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

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
      {/* Profile Sidebar Overlay */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleProfile}
        />
      )}

      {/* Profile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 sm:w-96 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100 ring-white/10"
            : "bg-white text-gray-900 ring-gray-200"
        } transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ring-1 rounded-r-2xl overflow-hidden ${
          isProfileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 overflow-y-auto">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white ring-2 ring-white/20">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-5">Ishaku</h3>
                  <p className="text-xs opacity-70">ishaklumarch@gmail.com</p>
                </div>
              </div>
              <button
                onClick={toggleProfile}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="mb-6">
              <div
                className={`flex items-center justify-between p-4 rounded-xl ring-1 ${
                  theme === "dark"
                    ? "bg-white/5 ring-white/10"
                    : "bg-white ring-gray-200"
                }`}
              >
                <span className="font-medium">Theme</span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition ring-1 ${
                    theme === "dark"
                      ? "bg-white/10 ring-white/15"
                      : "bg-gray-100 ring-gray-300 hover:bg-gray-200"
                  }`}
                  aria-label="Toggle theme"
                >
                  <span className="absolute left-2 text-[10px] uppercase tracking-wide opacity-70">
                    {theme === "light" ? "Light" : "Dark"}
                  </span>
                  <span
                    className={`absolute right-1 top-1 h-6 w-6 rounded-full bg-white text-gray-700 grid place-items-center shadow transition-transform ${
                      theme === "dark" ? "-translate-x-8" : "translate-x-0"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>

            {/* Languages */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Languages</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs opacity-70">Native</label>
                  <div className="relative">
                    <select
                      value={nativeLanguage}
                      onChange={(e) => setNativeLanguage(e.target.value)}
                      className={`w-full p-3 rounded-lg appearance-none cursor-pointer focus:outline-none ring-1 ${
                        theme === "dark"
                          ? "bg-white/5 ring-white/10 hover:bg-white/10"
                          : "bg-white ring-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs opacity-70">Proficiency</label>
                  <div className="relative">
                    <select
                      value={nativeProficiency}
                      onChange={(e) => setNativeProficiency(e.target.value)}
                      className={`w-full p-3 rounded-lg appearance-none cursor-pointer focus:outline-none ring-1 ${
                        theme === "dark"
                          ? "bg-white/5 ring-white/10 hover:bg-white/10"
                          : "bg-white ring-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {proficiencyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-1">
                  <label className="text-xs opacity-70">Learning</label>
                  <div className="relative">
                    <select
                      value={learningLanguage}
                      onChange={(e) => setLearningLanguage(e.target.value)}
                      className={`w-full p-3 rounded-lg appearance-none cursor-pointer focus:outline-none ring-1 ${
                        theme === "dark"
                          ? "bg-white/5 ring-white/10 hover:bg-white/10"
                          : "bg-white ring-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs opacity-70">Proficiency</label>
                  <div className="relative">
                    <select
                      value={learningProficiency}
                      onChange={(e) => setLearningProficiency(e.target.value)}
                      className={`w-full p-3 rounded-lg appearance-none cursor-pointer focus:outline-none ring-1 ${
                        theme === "dark"
                          ? "bg-white/5 ring-white/10 hover:bg-white/10"
                          : "bg-white ring-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {proficiencyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 pb-28">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleProfile}
              aria-label="Menu"
              className={
                "p-2 rounded-lg transition-colors " +
                (theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100")
              }
            >
              <Menu
                className={
                  "w-5 h-5 " +
                  (theme === "dark" ? "text-gray-300" : "text-gray-600")
                }
              />
            </button>
            <h1
              className={
                "text-2xl font-semibold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 " +
                (theme === "dark" ? "text-white" : "text-gray-900")
              }
            >
              Textipal
            </h1>
          </div>
          {/* Search moved into header */}
          <div className="flex items-center gap-2">
            <div className="relative w-40 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={
                  "w-full pl-9 pr-8 py-2 rounded-xl text-sm outline-none ring-1 transition-colors " +
                  (theme === "dark"
                    ? "bg-white/5 ring-white/10 text-gray-100 placeholder:text-gray-400 focus:ring-purple-500/40"
                    : "bg-white ring-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-purple-200")
                }
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>
        {/* Removed hero and filter tags; search is in header */}

        {/* Conversations */}
        <ul className={"space-y-2 " + (theme === "dark" ? "" : "")}>
          {filteredContacts.map((c, idx) => (
            <li
              key={c.id}
              className="group cursor-pointer animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${80 + idx * 50}ms` }}
              onClick={() =>
                router.push(
                  `/chat?name=${encodeURIComponent(
                    c.name
                  )}&avatar=${encodeURIComponent(c.avatar)}`
                )
              }
            >
              <div
                className={
                  "flex items-center gap-3 p-3 rounded-2xl ring-1 transition-colors shadow-sm " +
                  (theme === "dark"
                    ? "bg-white/5 ring-white/10 hover:bg-white/10"
                    : "bg-white ring-gray-200 hover:bg-gray-50")
                }
              >
                <div className="relative">
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p
                        className={
                          "font-medium truncate " +
                          (theme === "dark" ? "text-white" : "text-gray-900")
                        }
                      >
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate capitalize">
                        {c.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">
                      {c.time}
                    </span>
                  </div>
                  <p
                    className={
                      "text-sm truncate transition-colors " +
                      (theme === "dark"
                        ? "text-gray-300 group-hover:text-gray-200"
                        : "text-gray-600 group-hover:text-gray-700")
                    }
                  >
                    {c.last}
                  </p>
                </div>

                {/* Star/favorite removed */}
              </div>
            </li>
          ))}
          {filteredContacts.length === 0 && (
            <li>
              <div
                className={
                  "p-6 text-center rounded-2xl ring-1 " +
                  (theme === "dark"
                    ? "ring-white/10 bg-white/5"
                    : "ring-gray-200 bg-white")
                }
              >
                <p className="text-sm text-gray-500">No conversations found.</p>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() =>
          router.push("/chat?name=Pal&avatar=/avatars/avatar0.png")
        }
        aria-label="New chat"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-4 rounded-2xl text-white bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg hover:from-purple-700 hover:to-pink-600 focus:outline-none"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
