// Centralized gradient mappings for personalities to keep UI consistent
// with ContactList and chat interface components.
export const personalityGradients = {
  spouse: "from-pink-500 to-rose-500",
  friend: "from-indigo-500 to-purple-500",
  stranger: "from-teal-500 to-emerald-500",
  colleague: "from-amber-500 to-orange-500",
  client: "from-sky-500 to-cyan-500",
  neutral: "from-slate-500 to-slate-600", // neutral quick chat
};

export function getPersonalityGradient(personality) {
  // Fallback to friend if unknown, but allow explicit neutral mapping
  return personalityGradients[personality] || personalityGradients.friend;
}
