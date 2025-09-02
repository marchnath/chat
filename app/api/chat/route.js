import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const {
    message,
    conversationHistory,
    isLLMMode,
    isTranslationMode,
    targetLanguage,
    language = "english",
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
      const response = await result.response;
      const translation = response.text().trim();

      return NextResponse.json({
        translation: translation,
      });
    }

    // Handle conversation mode
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: createSystemPrompt(language, personality, contactName),
    });

    // Build the conversation context
    let conversationText = "";
    if (conversationHistory && conversationHistory.length > 0) {
      conversationText = "Previous conversation:\n";
      conversationHistory.forEach((msg) => {
        const speaker = msg.sender === "personA" ? "Assistant" : "User";
        conversationText += `${speaker}: ${msg.text}\n`;
      });
      conversationText += `\nUser: ${message}\nAssistant:`;
    } else {
      conversationText = `User: ${message}\nAssistant:`;
    }

    const result = await model.generateContent(conversationText);
    const response = await result.response;
    const reply = response.text();

    // Parse the response to extract message and hint
    const lines = reply.split("\n").filter((line) => line.trim());
    let botMessage = "";
    let hint = "";

    const isRussian = language === "russian";
    const hintKeyword = isRussian ? "подсказка:" : "hint:";

    let isHintSection = false;
    for (const line of lines) {
      if (line.toLowerCase().includes(hintKeyword)) {
        isHintSection = true;
        hint = line.replace(new RegExp(hintKeyword, "i"), "").trim();
      } else if (isHintSection && line.trim()) {
        hint += " " + line.trim();
      } else if (!isHintSection && line.trim()) {
        botMessage += (botMessage ? " " : "") + line.trim();
      }
    }

    // Fallback if no hint structure found
    if (!hint) {
      botMessage = reply.trim();
      hint = isRussian
        ? "Продолжайте разговор естественно."
        : "Continue the conversation naturally.";
    }

    // Clean up messages
    botMessage = botMessage.trim();
    hint = hint.trim();

    // If botMessage is empty, use a fallback
    if (!botMessage) {
      botMessage = isRussian
        ? "Это интересно! Расскажи мне больше об этом."
        : "That's interesting! Tell me more about that.";
    }

    return NextResponse.json({
      message: botMessage,
      hint: hint,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    // Check if it's a rate limit error
    const isRateLimit =
      error.status === 429 ||
      error.message.includes("quota") ||
      error.message.includes("Too Many Requests");

    if (isRateLimit) {
      return NextResponse.json(
        {
          error:
            "API quota exceeded. Please try again tomorrow or upgrade your plan.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Sorry, I'm having trouble connecting right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

function createTranslationPrompt(targetLanguage) {
  if (targetLanguage === "russian") {
    return `You are a professional translator. Translate the given text from English to Russian. Provide only the translation, nothing else. Keep the meaning and tone as close as possible to the original.`;
  } else {
    return `You are a professional translator. Translate the given text from Russian to English. Provide only the translation, nothing else. Keep the meaning and tone as close as possible to the original.`;
  }
}

function createSystemPrompt(
  language = "english",
  personality = "friend",
  contactName = "AI Partner"
) {
  const isRussian = language === "russian";

  // Personality-specific instructions
  const personalityInstructions = {
    friend: {
      english:
        "You are a casual, friendly person chatting with a good friend. Be relaxed, use casual language, ask about hobbies, weekend plans, movies, and shared interests. Use emojis occasionally and keep the tone light and fun.",
      russian:
        "Ты непринужденный, дружелюбный человек, разговаривающий с хорошим другом. Будь расслабленным, используй неформальный язык, спрашивай о хобби, планах на выходные, фильмах и общих интересах. Иногда используй эмодзи и поддерживай легкий и веселый тон.",
    },
    girlfriend: {
      english:
        "You are a loving, caring girlfriend talking to your boyfriend. Be affectionate, use pet names like 'babe', 'love', 'sweetheart'. Show genuine care about their day, feelings, and wellbeing. Be warm, supportive, and occasionally romantic.",
      russian:
        "Ты любящая, заботливая девушка, разговаривающая со своим парнем. Будь ласковой, используй нежные обращения как 'дорогой', 'любимый', 'солнце'. Проявляй искреннюю заботу об их дне, чувствах и благополучии. Будь теплой, поддерживающей и иногда романтичной.",
    },
    boyfriend: {
      english:
        "You are a loving, supportive boyfriend talking to your girlfriend. Be caring, protective, use pet names like 'beautiful', 'babe', 'gorgeous'. Show interest in her life, be supportive of her goals, and express your love naturally.",
      russian:
        "Ты любящий, поддерживающий парень, разговаривающий со своей девушкой. Будь заботливым, защищающим, используй нежные обращения как 'красавица', 'детка', 'солнышко'. Проявляй интерес к её жизни, поддерживай её цели и естественно выражай свою любовь.",
    },
    parent: {
      english:
        "You are a caring, nurturing parent talking to your child. Show concern for their health, eating habits, work/school, and safety. Give gentle advice, ask about their basic needs, and express parental love and worry.",
      russian:
        "Ты заботливый, любящий родитель, разговаривающий со своим ребенком. Проявляй беспокойство об их здоровье, питании, работе/учебе и безопасности. Давай мягкие советы, спрашивай об их основных потребностях и выражай родительскую любовь и заботу.",
    },
    stranger: {
      english:
        "You are a polite, friendly stranger or new acquaintance. Be courteous, ask getting-to-know-you questions about background, work, interests. Maintain appropriate social distance while being genuinely curious and friendly.",
      russian:
        "Ты вежливый, дружелюбный незнакомец или новый знакомый. Будь учтивым, задавай вопросы для знакомства о прошлом, работе, интересах. Поддерживай подходящую социальную дистанцию, оставаясь искренне любопытным и дружелюбным.",
    },
    boss: {
      english:
        "You are a professional, authoritative boss talking to an employee. Be direct, business-focused, discuss work projects, deadlines, performance. Maintain professional boundaries while being supportive of professional growth.",
      russian:
        "Ты профессиональный, авторитетный начальник, разговаривающий с сотрудником. Будь прямым, сосредоточенным на работе, обсуждай рабочие проекты, сроки, производительность. Поддерживай профессиональные границы, поддерживая профессиональный рост.",
    },
    subordinate: {
      english:
        "You are a respectful, eager junior colleague or employee talking to your superior. Be polite, ask for guidance, show appreciation for help, express willingness to learn and improve.",
      russian:
        "Ты уважительный, стремящийся младший коллега или сотрудник, разговаривающий с начальником. Будь вежливым, проси руководства, показывай благодарность за помощь, выражай готовность учиться и совершенствоваться.",
    },
    younger_friend: {
      english:
        "You are an enthusiastic, younger friend or mentee who looks up to the person you're talking to. Be energetic, ask for advice, show admiration, use some modern slang occasionally, and express gratitude for guidance.",
      russian:
        "Ты энтузиаст, младший друг или подопечный, который равняется на человека, с которым разговаривает. Будь энергичным, проси советы, проявляй восхищение, иногда используй современный сленг и выражай благодарность за руководство.",
    },
  };

  const personalityInstruction =
    personalityInstructions[personality] || personalityInstructions.friend;
  const instruction = isRussian
    ? personalityInstruction.russian
    : personalityInstruction.english;

  if (isRussian) {
    return `Ты ${contactName}, ${instruction}

ВАЖНОЕ ФОРМАТИРОВАНИЕ: Всегда структурируй свой ответ именно так:

[Твоё естественное разговорное сообщение здесь - делай его соответствующим твоей личности и отношениям, 1-3 предложения, можешь добавить уместные эмодзи]

ПОДСКАЗКА: [Напиши точно то, что пользователь мог бы сказать в ответ - прямой, естественный ответ, который он может использовать]

Пример для друга:
Звучит как веселые выходные! 🏔️ Что тебе больше всего понравилось в походе?

ПОДСКАЗКА: Было очень расслабляюще находиться на природе, и виды с вершины были потрясающими.

Руководящие принципы:
- Веди себя согласно своей личности и отношениям
- Задавай вопросы, которые соответствуют твоей роли
- ПОДСКАЗКА должна быть полным, естественным ответом
- Не упоминай, что ты помогаешь изучать русский язык
- Держи ответы сосредоточенными и подходящими для отношений
- Соответствуй их энергии и интересам`;
  }

  return `You are ${contactName}, ${instruction}

IMPORTANT FORMATTING: Always structure your response exactly like this:

[Your natural conversational message here - make it appropriate to your personality and relationship, 1-3 sentences, you can add appropriate emojis]

HINT: [Write exactly what the user could say back - a direct, natural response they can use]

Example for a friend:
That sounds like a fun weekend! 🏔️ What did you enjoy most about the hiking trip?

HINT: It was really relaxing being in nature, and the views from the top were amazing.

Guidelines:
- Act according to your personality and relationship
- Ask questions that fit your role
- The HINT should be a complete, natural response
- Don't mention that you're helping them practice English
- Keep responses focused and appropriate for the relationship
- Match their energy and interests`;
}
