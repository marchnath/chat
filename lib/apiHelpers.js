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

// Conversational mode descriptions
export const CONVERSATIONAL_MODE_DESCRIPTIONS = {
  Bond: "romantic, flirtatious bonding mode. Focus on building romantic connection through playful teasing, compliments, and intimate conversation. Use warm, charming language with subtle romantic undertones",
  Connect:
    "meaningful connection-building mode. Focus on creating deep, authentic connections through thoughtful questions, active listening, and finding common ground. Encourage vulnerability and genuine sharing",
  Gossip:
    "casual, fun gossip mode. Focus on sharing interesting stories, asking about drama or exciting news, and engaging in light social commentary. Be curious and enthusiastic about personal details",
  Sell: "persuasive selling mode. Focus on presenting ideas convincingly, highlighting benefits, addressing concerns, and motivating action. Use confident, enthusiastic language that builds trust and urgency",
  Debate:
    "intellectual debate mode. Focus on exploring different perspectives, challenging ideas constructively, presenting logical arguments, and encouraging critical thinking. Be respectful but intellectually stimulating",
  Question:
    "curious inquiry mode. Focus on asking thoughtful questions, seeking to understand deeply, and encouraging detailed explanations. Be genuinely interested and help the person explore their thoughts",
};

export function getConversationalModeDescription(contactName) {
  return (
    CONVERSATIONAL_MODE_DESCRIPTIONS[contactName] ||
    CONVERSATIONAL_MODE_DESCRIPTIONS.Connect
  );
}
