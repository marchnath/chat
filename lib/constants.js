// Language and proficiency constants
export const LANGUAGES = [
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

export const PROFICIENCY_LEVELS = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced",
  "Native",
];

// Theme constants
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// API constants
export const API_MODES = {
  LLM: "isLLMMode",
  TRANSLATION: "isTranslationMode",
};

// Message sender types
export const MESSAGE_SENDERS = {
  PERSON_A: "personA", // AI/Contact
  PERSON_B: "personB", // User
  SYSTEM: "system",
};

// Animation delays for staggered effects
export const ANIMATION_DELAYS = {
  BASE: 80,
  INCREMENT: 50,
};

// Default profile settings
export const DEFAULT_PROFILE = {
  nativeLanguage: "English",
  nativeProficiency: "Native",
  learningLanguage: "Russian",
  learningProficiency: "Beginner",
  theme: THEMES.DARK,
  // User personalization additions
  avatarUrl: "/avatars/avatar0.png",
  displayName: "You",
  streakDays: 3, // simple placeholder streak count
};

// Speech API language codes (BCP-47) for supported display languages
// Keys are lowercase display names, values are locale codes used by Web Speech APIs
export const SPEECH_LANG_CODE_MAP = {
  english: "en-US",
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  portuguese: "pt-PT",
  russian: "ru-RU",
  japanese: "ja-JP",
  korean: "ko-KR",
  chinese: "zh-CN",
  arabic: "ar-SA",
};
