import {
  getLanguageName,
  getProficiencyGuidance,
  getPersonalityDescription,
} from "./apiHelpers";

// System prompt creation
export function createSystemPrompt(
  language,
  proficiencyLevel,
  personality,
  contactName
) {
  const responseLanguage = getLanguageName(language);
  const personalityDesc = getPersonalityDescription(personality);
  const proficiencyGuidance = getProficiencyGuidance(proficiencyLevel);

  return `You are ${contactName}, ${personalityDesc}

CRITICAL: Respond in ${responseLanguage} language.

PROFICIENCY LEVEL: The user is at ${proficiencyLevel} level in ${responseLanguage}.
${proficiencyGuidance}

MESSAGE LENGTH: Keep ALL messages SHORT and conversational (1-2 sentences max), like normal chat messages. The proficiency level should only affect WORD CHOICE and COMPLEXITY, not message length.

RESPONSE FORMAT:
[Your short, natural message]

HINT: [User's likely short response]

EXAMPLE:
Hey! How are you? What are you up to today? 😊

HINT: Hi! I'm doing well, thanks. Working today, planning to watch a movie tonight.

RULES:
- Always include "HINT:" in every response
- Keep messages SHORT like normal chat (1-2 sentences)
- Adjust VOCABULARY complexity based on proficiency level, not length
- Hint should be a brief, natural response a real person would give
- Ask questions appropriate to your personality
- Don't mention language learning
- Use appropriate vocabulary for the user's level`;
}

// Translation prompts
export function createTranslationPrompt(targetLanguage) {
  const target = getLanguageName(targetLanguage);
  return `Translate to ${target}. Provide only the translation, keeping meaning and tone intact.`;
}

export function createBatchTranslationPrompt(sourceLanguage, targetLanguage) {
  const source = getLanguageName(sourceLanguage);
  const target = getLanguageName(targetLanguage);

  return `Translate from ${source} to ${target}. Format:
MESSAGE: [translation1]
HINT: [translation2]
Keep meaning and tone intact.`;
}

// Response parsing
export function parseResponse(reply) {
  const lines = reply.split("\n").filter((line) => line.trim());
  let botMessage = "";
  let hint = "";
  let isHintSection = false;

  const hintKeywords = ["hint:", "подсказка:", "suggerimento:"];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const hasHintKeyword = hintKeywords.some((keyword) =>
      lowerLine.includes(keyword)
    );

    if (hasHintKeyword) {
      isHintSection = true;
      let hintText = line;
      hintKeywords.forEach((keyword) => {
        hintText = hintText.replace(new RegExp(keyword, "i"), "").trim();
      });
      hint = hintText;
    } else if (isHintSection && line.trim()) {
      hint += " " + line.trim();
    } else if (!isHintSection && line.trim()) {
      botMessage += (botMessage ? " " : "") + line.trim();
    }
  }

  // Fallback if no message
  if (!botMessage.trim()) {
    botMessage = "That's interesting! Tell me more about that.";
  }

  return { message: botMessage.trim(), hint: hint.trim() };
}

export function parseBatchTranslationResponse(response) {
  const lines = response.split("\n");
  let messageTranslation = "";
  let hintTranslation = "";

  for (const line of lines) {
    if (line.startsWith("MESSAGE:")) {
      messageTranslation = line.replace("MESSAGE:", "").trim();
    } else if (line.startsWith("HINT:")) {
      hintTranslation = line.replace("HINT:", "").trim();
    }
  }

  return { messageTranslation, hintTranslation };
}
