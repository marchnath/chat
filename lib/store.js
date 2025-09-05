import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_PROFILE } from "./constants";

const useProfileStore = create(
  persist(
    (set, get) => ({
      // Language preferences - use defaults from constants
      ...DEFAULT_PROFILE,

      // Hydration status
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Actions
      setNativeLanguage: (language) => set({ nativeLanguage: language }),
      setNativeProficiency: (proficiency) =>
        set({ nativeProficiency: proficiency }),
      setLearningLanguage: (language) => set({ learningLanguage: language }),
      setLearningProficiency: (proficiency) =>
        set({ learningProficiency: proficiency }),
      setTheme: (theme) => set({ theme }),

      // Batch update for profile
      updateProfile: (profile) => set(profile),

      // Initialize from localStorage (for migration)
      initializeFromLocalStorage: () => {
        try {
          const profileSettings = localStorage.getItem("profileSettings");
          if (profileSettings) {
            const settings = JSON.parse(profileSettings);
            set({
              nativeLanguage:
                settings.nativeLanguage || DEFAULT_PROFILE.nativeLanguage,
              nativeProficiency:
                settings.nativeProficiency || DEFAULT_PROFILE.nativeProficiency,
              learningLanguage:
                settings.learningLanguage || DEFAULT_PROFILE.learningLanguage,
              learningProficiency:
                settings.learningProficiency ||
                DEFAULT_PROFILE.learningProficiency,
              theme: settings.theme || DEFAULT_PROFILE.theme,
            });
            // Clean up old localStorage after migration
            localStorage.removeItem("profileSettings");
          }
        } catch (error) {
          console.error("Error migrating from localStorage:", error);
        }
      },
    }),
    {
      name: "profile-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        nativeLanguage: state.nativeLanguage,
        nativeProficiency: state.nativeProficiency,
        learningLanguage: state.learningLanguage,
        learningProficiency: state.learningProficiency,
        theme: state.theme,
      }),
    }
  )
);

// Helper functions that use the store state
export const getSelectedChatLanguage = () => {
  const learningLanguage = useProfileStore.getState().learningLanguage;
  return mapDisplayLanguageToCode(learningLanguage);
};

export const getNativeLanguageForTranslation = () => {
  const nativeLanguage = useProfileStore.getState().nativeLanguage;
  return mapDisplayLanguageToCode(nativeLanguage);
};

// Map display names to internal language codes
function mapDisplayLanguageToCode(language) {
  const languageMap = {
    spanish: "spanish",
    french: "french",
    german: "german",
    italian: "italian",
    portuguese: "portuguese",
    russian: "russian",
    japanese: "japanese",
    korean: "korean",
    chinese: "chinese",
    arabic: "arabic",
    english: "english",
  };

  const langLower = language.toLowerCase();
  return languageMap[langLower] || "english";
}

export default useProfileStore;
