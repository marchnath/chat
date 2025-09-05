"use client";

import { X, User, Sun } from "lucide-react";
import { LANGUAGES, PROFICIENCY_LEVELS } from "@/lib/constants";
import SelectDropdown from "@/components/ui/SelectDropdown";

export default function ProfileSidebar({
  isOpen,
  onClose,
  theme,
  profile,
  onProfileChange,
}) {
  const toggleTheme = () => {
    onProfileChange({
      ...profile,
      theme: theme === "light" ? "dark" : "light",
    });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 sm:w-96 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100 ring-white/10"
            : "bg-white text-gray-900 ring-gray-200"
        } transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ring-1 rounded-r-2xl overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 overflow-y-auto">
            {/* Header */}
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
                onClick={onClose}
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

            {/* Language Settings */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Languages</h4>
              <div className="grid grid-cols-2 gap-3">
                <SelectDropdown
                  label="Native"
                  value={profile.nativeLanguage}
                  onChange={(value) =>
                    onProfileChange({ ...profile, nativeLanguage: value })
                  }
                  options={LANGUAGES}
                  theme={theme}
                />
                <SelectDropdown
                  label="Proficiency"
                  value={profile.nativeProficiency}
                  onChange={(value) =>
                    onProfileChange({ ...profile, nativeProficiency: value })
                  }
                  options={PROFICIENCY_LEVELS}
                  theme={theme}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <SelectDropdown
                  label="Learning"
                  value={profile.learningLanguage}
                  onChange={(value) =>
                    onProfileChange({ ...profile, learningLanguage: value })
                  }
                  options={LANGUAGES}
                  theme={theme}
                />
                <SelectDropdown
                  label="Proficiency"
                  value={profile.learningProficiency}
                  onChange={(value) =>
                    onProfileChange({ ...profile, learningProficiency: value })
                  }
                  options={PROFICIENCY_LEVELS}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
