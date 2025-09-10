import { NextRequest, NextResponse } from "next/server";
import {
  callGeminiAPI,
  callDeepSeekAPI,
  getBatchTranslations,
} from "@/lib/apiClients";

export async function POST(req) {
  const {
    message,
    conversationHistory,
    isLLMMode,
    isTranslationMode,
    targetLanguage,
    language = "english",
    nativeLanguage = "english",
    proficiencyLevel = "intermediate",
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
      const result = await callGeminiAPI({
        message,
        conversationHistory,
        isTranslationMode,
        targetLanguage,
        language,
        nativeLanguage,
        proficiencyLevel,
        contactName,
      });

      if (isTranslationMode) {
        return NextResponse.json(result);
      }

      return await processConversationResponse(
        result,
        language,
        nativeLanguage
      );
    } catch (geminiError) {
      console.log("Gemini API failed:", geminiError.message);

      const isRateLimit =
        geminiError.status === 429 ||
        geminiError.message.includes("quota") ||
        geminiError.message.includes("Too Many Requests") ||
        geminiError.message.includes("Resource has been exhausted");

      if (isRateLimit && process.env.DEEPSEEK_API_KEY) {
        console.log("Falling back to DeepSeek API...");

        const result = await callDeepSeekAPI({
          message,
          conversationHistory,
          isTranslationMode,
          targetLanguage,
          language,
          nativeLanguage,
          proficiencyLevel,
          contactName,
        });

        if (isTranslationMode) {
          return NextResponse.json(result);
        }

        return await processConversationResponse(
          result,
          language,
          nativeLanguage
        );
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

async function processConversationResponse(
  response,
  language,
  nativeLanguage = "english"
) {
  const { message: botMessage, hint } = response;

  // Generate translations for both message and hint
  let messageTranslation = "";
  let hintTranslation = "";

  // Always generate translations when there's a valid native language and it's different from the learning language
  // This allows click-to-translate functionality regardless of whether native language is English
  if (nativeLanguage && nativeLanguage !== language) {
    try {
      const translations = await getBatchTranslations(
        botMessage,
        hint,
        language,
        nativeLanguage
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
