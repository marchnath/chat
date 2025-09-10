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

// Conversation partner personalities (global selection)
export const PERSONALITIES = [
  "lover",
  "friend",
  "stranger",
  "colleague",
  "client",
];

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
  personality: "friend", // default global chat personality
};
