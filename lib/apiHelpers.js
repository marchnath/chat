// Language mapping utilities
export const LANGUAGE_MAP = {
  spanish: "Spanish",
  french: "French",
  german: "German",
  italian: "Italian",
  portuguese: "Portuguese",
  russian: "Russian",
  japanese: "Japanese",
  korean: "Korean",
  chinese: "Chinese (Mandarin)",
  arabic: "Arabic",
  english: "English",
};

export function getLanguageName(language) {
  return LANGUAGE_MAP[language] || "English";
}

// Proficiency level guidance
export const PROFICIENCY_GUIDANCE = {
  Beginner: `- Use VERY basic vocabulary (good, bad, like, want, have, go, come, eat, work)
- Use present tense mostly
- Use simple connecting words: "and", "but", "because"
- Keep all messages short and conversational
- Use basic greetings and common phrases
- Example words: "nice", "fun", "hard", "easy", "happy"`,

  Elementary: `- Use simple but slightly expanded vocabulary
- Include basic past tense and future with "going to" 
- Use everyday adjectives: "interesting", "difficult", "comfortable"
- Keep messages short and casual
- Use simple connecting phrases: "I think", "maybe", "really"
- Example words: "enjoy", "prefer", "remember", "decide"`,

  Intermediate: `- Use common vocabulary with some variety
- Mix tenses naturally but keep it simple
- Include common expressions: "sounds good", "makes sense", "pretty cool"
- Keep messages conversational length
- Use everyday idioms sparingly: "no big deal", "pretty much"
- Example words: "fascinating", "convenient", "significant", "maintain"`,

  "Upper-Intermediate": `- Use more sophisticated vocabulary choices
- Include advanced expressions: "I'd imagine", "turns out", "come to think of it"
- Use cultural references and common idioms naturally
- Keep messages short but with richer word choices
- Include nuanced adjectives: "intriguing", "compelling", "remarkable"
- Example words: "elaborate", "acquire", "encounter", "appreciate"`,

  Advanced: `- Use rich, varied vocabulary and complex expressions
- Include advanced idioms and cultural nuances naturally
- Use sophisticated word choices: "intriguing", "compelling", "elaborate"
- Keep messages conversational but with elevated language
- Include advanced grammar structures seamlessly
- Example words: "contemplating", "endeavor", "perception", "comprehensive"`,

  Native: `- Use natural, native-level vocabulary without restrictions
- Include slang, colloquialisms, and cultural references freely
- Use advanced vocabulary effortlessly: "serendipitous", "nuanced", "ubiquitous"
- Keep messages naturally short but linguistically rich
- Include humor, wordplay, and subtle communication styles
- No vocabulary or complexity limitations`,
};

export function getProficiencyGuidance(proficiencyLevel) {
  return (
    PROFICIENCY_GUIDANCE[proficiencyLevel] ||
    PROFICIENCY_GUIDANCE["Intermediate"]
  );
}

// Personality descriptions
export const PERSONALITY_DESCRIPTIONS = {
  friend:
    "a casual, friendly person. Be relaxed, ask about hobbies, weekend plans, movies. Use emojis occasionally.",
  girlfriend:
    "a loving, caring girlfriend. Be affectionate, use pet names like 'babe', 'love'. Show genuine care.",
  boyfriend:
    "a loving, supportive boyfriend. Be caring, protective, use pet names like 'beautiful', 'babe'.",
  parent:
    "a caring, nurturing parent. Show concern for health, eating, work/school. Give gentle advice.",
  stranger:
    "a polite, friendly stranger. Be courteous, ask getting-to-know-you questions about background, work.",
  boss: "a professional, authoritative boss. Be direct, business-focused, discuss work projects, deadlines.",
  subordinate:
    "a respectful, eager employee. Be polite, ask for guidance, show appreciation for help.",
  younger_friend:
    "an enthusiastic, younger friend. Be energetic, ask for advice, show admiration.",
};

export function getPersonalityDescription(personality) {
  return (
    PERSONALITY_DESCRIPTIONS[personality] || PERSONALITY_DESCRIPTIONS.friend
  );
}
