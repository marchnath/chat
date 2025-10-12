import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import {
  createSystemPrompt,
  createTranslationPrompt,
  createBatchTranslationPrompt,
  parseResponse,
  parseBatchTranslationResponse,
} from "./apiPrompts";

export async function callGeminiAPI({
  message,
  conversationHistory,
  isTranslationMode,
  targetLanguage,
  language,
  nativeLanguage,
  proficiencyLevel,
  contactName,
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Handle translation mode
  if (isTranslationMode) {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: createTranslationPrompt(targetLanguage),
    });

    const result = await model.generateContent(
      `Translate this text: "${message}"`
    );
    const translation = result.response.text().trim();

    return { translation };
  }

  // Handle conversation mode
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: createSystemPrompt(
      language,
      proficiencyLevel,
      contactName
    ),
  });

  // Build conversation context
  const messages = [];
  if (conversationHistory && conversationHistory.length > 0) {
    conversationHistory.forEach((msg) => {
      messages.push(
        `${msg.sender === "personA" ? "Assistant" : "User"}: ${msg.text}`
      );
    });
  }
  messages.push(`User: ${message}`);

  const conversationText = messages.join("\n") + "\nAssistant:";
  const result = await model.generateContent(conversationText);
  const reply = result.response.text();

  return parseResponse(reply);
}

export async function callDeepSeekAPI({
  message,
  conversationHistory,
  isTranslationMode,
  targetLanguage,
  language,
  nativeLanguage,
  proficiencyLevel,
  contactName,
}) {
  const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  // Handle translation mode
  if (isTranslationMode) {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: createTranslationPrompt(targetLanguage) },
        { role: "user", content: `Translate this text: "${message}"` },
      ],
      temperature: 0.3,
    });

    const translation = completion.choices[0].message.content.trim();
    return { translation };
  }

  // Handle conversation mode
  const messages = [
    {
      role: "system",
      content: createSystemPrompt(language, proficiencyLevel, contactName),
    },
  ];

  if (conversationHistory && conversationHistory.length > 0) {
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.sender === "personA" ? "assistant" : "user",
        content: msg.text,
      });
    });
  }

  messages.push({ role: "user", content: message });

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  const reply = completion.choices[0].message.content;
  return parseResponse(reply);
}

export async function getBatchTranslations(
  message,
  hint,
  sourceLanguage,
  targetLanguage
) {
  const batchText = `MESSAGE: ${message}\nHINT: ${hint}`;

  try {
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: createBatchTranslationPrompt(
          sourceLanguage,
          targetLanguage
        ),
      });

      const result = await model.generateContent(
        `Translate this batch: "${batchText}"`
      );
      const response = result.response.text().trim();
      return parseBatchTranslationResponse(response);
    }
  } catch (error) {
    console.log("Gemini batch translation failed, trying DeepSeek...");
  }

  // Fallback to DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    const openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: createBatchTranslationPrompt(sourceLanguage, targetLanguage),
        },
        { role: "user", content: `Translate this batch: "${batchText}"` },
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content.trim();
    return parseBatchTranslationResponse(response);
  }

  return { messageTranslation: "", hintTranslation: "" };
}

export async function getWordTranslations(
  text,
  sourceLanguage,
  targetLanguage
) {
  try {
    const response = await fetch("/api/translate-words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch word translations");
    }

    const data = await response.json();
    return data.wordTranslations || [];
  } catch (error) {
    console.error("Error getting word translations:", error);
    return [];
  }
}
