"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import { contacts } from "@/lib/contacts";
import useProfileStore from "@/lib/store";
import ProfileSidebar from "@/components/ProfileSidebar";
import ContactList from "@/components/ContactList";

export default function HomePage() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
        profile={currentProfile}
        onProfileChange={handleProfileChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-36">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsProfileOpen(true)}
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
                "text-3xl sm:text-4xl font-extrabold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 drop-shadow " +
                (theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600")
              }
            >
              Textipal
            </h1>
          </div>
        </header>

        <ContactList contacts={contacts} theme={theme} />
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
