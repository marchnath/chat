import { API_MODES } from "../constants";

// Service for handling all chat API interactions
class ChatService {
  static async sendMessage({
    message,
    conversationHistory = [],
    language = "english",
    nativeLanguage = "english",
    proficiencyLevel = "intermediate",
    personality = "friend",
    contactName = "AI Partner",
  }) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        conversationHistory: conversationHistory.filter(
          (msg) => msg.sender !== "system"
        ),
        [API_MODES.LLM]: true,
        language,
        nativeLanguage,
        proficiencyLevel,
        personality,
        contactName,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    return {
      message: data.message,
      hint: data.hint,
      messageTranslation: data.messageTranslation,
      hintTranslation: data.hintTranslation,
    };
  }

  static async translateText(text, targetLanguage) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        conversationHistory: [],
        [API_MODES.TRANSLATION]: true,
        targetLanguage,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.translation || text;
  }
}

export default ChatService;
