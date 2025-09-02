import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useProfileStore = create(
  persist(
    (set, get) => ({
      // Language preferences
      nativeLanguage: "English",
      nativeProficiency: "Native",
      learningLanguage: "Russian",
      learningProficiency: "Beginner",
      theme: "dark",

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

      // Initialize from localStorage (for migration)
      initializeFromLocalStorage: () => {
        try {
          const profileSettings = localStorage.getItem("profileSettings");
          if (profileSettings) {
            const settings = JSON.parse(profileSettings);
            set({
              nativeLanguage: settings.nativeLanguage || "English",
              nativeProficiency: settings.nativeProficiency || "Native",
              learningLanguage: settings.learningLanguage || "Russian",
              learningProficiency: settings.learningProficiency || "Beginner",
              theme: settings.theme || "dark",
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
  const langLower = learningLanguage.toLowerCase();
  if (langLower === "russian") return "russian";
  if (langLower === "italian") return "italian";
  return "english";
};

export const getNativeLanguageForTranslation = () => {
  const nativeLanguage = useProfileStore.getState().nativeLanguage;
  const langLower = nativeLanguage.toLowerCase();
  if (langLower === "russian") return "russian";
  if (langLower === "italian") return "italian";
  return "english";
};

export default useProfileStore;
