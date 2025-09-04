import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export async function POST(req) {
  const {
    message,
    conversationHistory,
    isLLMMode,
    isTranslationMode,
    targetLanguage,
    language = "english",
    proficiencyLevel = "intermediate",
    personality = "friend",
    contactName = "AI Partner",
  } = await req.json();

  if (!isLLMMode && !isTranslationMode) {
    return NextResponse.json({ error: "No valid mode specified" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Try Gemini first, fallback to DeepSeek on rate limits
    try {
      return await callGeminiAPI({
        message,
        conversationHistory,
        isTranslationMode,
        targetLanguage,
        language,
        proficiencyLevel,
        personality,
        contactName,
      });
    } catch (geminiError) {
      console.log("Gemini API failed:", geminiError.message);

      const isRateLimit =
        geminiError.status === 429 ||
        geminiError.message.includes("quota") ||
        geminiError.message.includes("Too Many Requests") ||
        geminiError.message.includes("Resource has been exhausted");

      if (isRateLimit && process.env.DEEPSEEK_API_KEY) {
        console.log("Falling back to DeepSeek API...");
        return await callDeepSeekAPI({
          message,
          conversationHistory,
          isTranslationMode,
          targetLanguage,
          language,
          proficiencyLevel,
          personality,
          contactName,
        });
      }

      throw geminiError;
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error:
          "Sorry, I'm having trouble connecting right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

async function callGeminiAPI({
  message,
  conversationHistory,
  isTranslationMode,
  targetLanguage,
  language,
  proficiencyLevel,
  personality,
  contactName,
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Handle translation mode
  if (isTranslationMode) {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: createTranslationPrompt(targetLanguage),
    });

    const result = await model.generateContent(
      `Translate this text: "${message}"`
    );
    const translation = result.response.text().trim();

    return NextResponse.json({ translation });
  }

  // Handle conversation mode
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: createSystemPrompt(
      language,
      proficiencyLevel,
      personality,
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

  return await processResponse(reply, language);
}

async function callDeepSeekAPI({
  message,
  conversationHistory,
  isTranslationMode,
  targetLanguage,
  language,
  proficiencyLevel,
  personality,
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
    return NextResponse.json({ translation });
  }

  // Handle conversation mode
  const messages = [
    {
      role: "system",
      content: createSystemPrompt(
        language,
        proficiencyLevel,
        personality,
        contactName
      ),
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
  return await processResponse(reply, language);
}

async function processResponse(reply, language) {
  const { message: botMessage, hint } = parseResponse(reply);

  // Generate translations for both message and hint
  let messageTranslation = "";
  let hintTranslation = "";

  if (language !== "english") {
    try {
      const translations = await getBatchTranslations(
        botMessage,
        hint,
        language
      );
      messageTranslation = translations.messageTranslation;
      hintTranslation = translations.hintTranslation;
    } catch (error) {
      console.error("Translation error:", error);
    }
  }

  return NextResponse.json({
    message: botMessage,
    hint: hint,
    messageTranslation,
    hintTranslation,
  });
}

function parseResponse(reply) {
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

async function getBatchTranslations(message, hint, currentLanguage) {
  const batchText = `MESSAGE: ${message}\nHINT: ${hint}`;

  try {
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: createBatchTranslationPrompt(currentLanguage),
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
          content: createBatchTranslationPrompt(currentLanguage),
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

function createBatchTranslationPrompt(sourceLanguage) {
  const languageMap = {
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

  const source = languageMap[sourceLanguage] || "English";

  return `Translate from ${source} to English. Format:
MESSAGE: [translation1]
HINT: [translation2]
Keep meaning and tone intact.`;
}

function parseBatchTranslationResponse(response) {
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

function createTranslationPrompt(targetLanguage) {
  const languageMap = {
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

  const target = languageMap[targetLanguage] || "English";
  return `Translate to ${target}. Provide only the translation, keeping meaning and tone intact.`;
}

function createSystemPrompt(
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

function getProficiencyGuidance(proficiencyLevel) {
  const proficiencyMap = {
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

  return proficiencyMap[proficiencyLevel] || proficiencyMap["Intermediate"];
}

function getLanguageName(language) {
  const languageNames = {
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
  return languageNames[language] || "English";
}

function getPersonalityDescription(personality) {
  const personalities = {
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

  return personalities[personality] || personalities.friend;
}
