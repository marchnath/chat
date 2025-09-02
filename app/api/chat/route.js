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

    // Try Gemini first
    try {
      return await callGeminiAPI({
        message,
        conversationHistory,
        isLLMMode,
        isTranslationMode,
        targetLanguage,
        language,
        personality,
        contactName,
      });
    } catch (geminiError) {
      console.log("Gemini API failed:", geminiError.message);

      // Check if it's a rate limit error
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
          isLLMMode,
          isTranslationMode,
          targetLanguage,
          language,
          personality,
          contactName,
        });
      }

      // Re-throw if it's not a rate limit error or no DeepSeek key
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
  isLLMMode,
  isTranslationMode,
  targetLanguage,
  language,
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

  return processResponseWithTranslations(reply, language);
}

async function callDeepSeekAPI({
  message,
  conversationHistory,
  isLLMMode,
  isTranslationMode,
  targetLanguage,
  language,
  personality,
  contactName,
}) {
  const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  // Handle translation mode
  if (isTranslationMode) {
    const translationPrompt = createTranslationPrompt(targetLanguage);

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: translationPrompt },
        { role: "user", content: `Translate this text: "${message}"` },
      ],
      temperature: 0.3,
    });

    const translation = completion.choices[0].message.content.trim();
    return NextResponse.json({
      translation: translation,
    });
  }

  // Handle conversation mode
  const systemPrompt = createSystemPrompt(language, personality, contactName);

  // Build conversation messages
  const messages = [{ role: "system", content: systemPrompt }];

  if (conversationHistory && conversationHistory.length > 0) {
    conversationHistory.forEach((msg) => {
      const role = msg.sender === "personA" ? "assistant" : "user";
      messages.push({ role: role, content: msg.text });
    });
  }

  messages.push({ role: "user", content: message });

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  const reply = completion.choices[0].message.content;
  return processResponseWithTranslations(reply, language);
}

async function processResponseWithTranslations(reply, language) {
  // Parse the response to extract message and hint
  const lines = reply.split("\n").filter((line) => line.trim());
  let botMessage = "";
  let hint = "";

  const isRussian = language === "russian";
  const isItalian = language === "italian";

  let hintKeywords;
  if (isRussian) {
    hintKeywords = ["подсказка:", "подсказка :", "подсказка"];
  } else if (isItalian) {
    hintKeywords = ["suggerimento:", "suggerimento :", "suggerimento"];
  } else {
    hintKeywords = ["hint:", "hint :", "hint"];
  }

  let isHintSection = false;
  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Check if this line contains any hint keyword
    const hasHintKeyword = hintKeywords.some((keyword) =>
      lowerLine.includes(keyword.toLowerCase())
    );

    if (hasHintKeyword) {
      isHintSection = true;
      // Extract hint text after the keyword
      let hintText = line;
      for (const keyword of hintKeywords) {
        const regex = new RegExp(keyword, "i");
        hintText = hintText.replace(regex, "").trim();
      }
      hint = hintText;
    } else if (isHintSection && line.trim()) {
      hint += " " + line.trim();
    } else if (!isHintSection && line.trim()) {
      botMessage += (botMessage ? " " : "") + line.trim();
    }
  }

  // Clean up messages
  botMessage = botMessage.trim();
  hint = hint.trim();

  // If botMessage is empty, use a fallback
  if (!botMessage) {
    if (isRussian) {
      botMessage = "Это интересно! Расскажи мне больше об этом.";
    } else if (isItalian) {
      botMessage = "È interessante! Dimmi di più.";
    } else {
      botMessage = "That's interesting! Tell me more about that.";
    }
  }

  // Generate a meaningful hint if none was provided or if it's too generic
  if (
    !hint ||
    hint.toLowerCase().includes("continue the conversation") ||
    hint.toLowerCase().includes("продолжайте разговор") ||
    hint.toLowerCase().includes("continua la conversazione")
  ) {
    // Generate a contextual hint using the LLM instead of predefined responses
    try {
      hint = await generateLLMHint(
        botMessage,
        language,
        personality,
        contactName
      );
    } catch (error) {
      console.error("Error generating LLM hint:", error);
      // No fallback - keep hint empty if LLM fails
      hint = "";
    }
  }

  // Generate translations for both message and hint in a single call for efficiency
  let messageTranslation = "";
  let hintTranslation = "";

  try {
    const translations = await getBatchTranslations(botMessage, hint, language);
    messageTranslation = translations.messageTranslation;
    hintTranslation = translations.hintTranslation;
  } catch (error) {
    console.error("Translation error:", error);
    // If translation fails, provide empty strings
    messageTranslation = "";
    hintTranslation = "";
  }

  return NextResponse.json({
    message: botMessage,
    hint: hint,
    messageTranslation: messageTranslation,
    hintTranslation: hintTranslation,
  });
}

// Helper function to generate contextual hints using LLM
async function generateLLMHint(message, language, personality, contactName) {
  const isRussian = language === "russian";
  const isItalian = language === "italian";

  let hintPrompt;
  if (isRussian) {
    hintPrompt = `Ты помощник для изучения языка. Твоя задача - создать естественный ответ, который пользователь мог бы дать на это сообщение: "${message}"

Создай краткий, естественный ответ (1-2 предложения) как если бы ты был человеком, отвечающим на это сообщение в разговоре. Ответ должен соответствовать контексту и быть подходящим для личности "${personality}".

Предоставь только ответ, ничего больше.`;
  } else if (isItalian) {
    hintPrompt = `Sei un assistente per l'apprendimento delle lingue. Il tuo compito è creare una risposta naturale che un utente potrebbe dare a questo messaggio: "${message}"

Crea una risposta breve e naturale (1-2 frasi) come se fossi una persona che risponde a questo messaggio in una conversazione. La risposta dovrebbe adattarsi al contesto ed essere appropriata per la personalità "${personality}".

Fornisci solo la risposta, nient'altro.`;
  } else {
    hintPrompt = `You are a language learning assistant. Your task is to create a natural response that a user might give to this message: "${message}"

Create a short, natural response (1-2 sentences) as if you were a person replying to this message in a conversation. The response should fit the context and be appropriate for the "${personality}" personality.

Provide only the response, nothing else.`;
  }

  try {
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: hintPrompt,
      });

      const result = await model.generateContent("Generate hint response");
      const response = await result.response;
      return response.text().trim();
    }
  } catch (error) {
    console.log("Gemini hint generation failed, trying DeepSeek...");
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
        { role: "system", content: hintPrompt },
        { role: "user", content: "Generate hint response" },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return completion.choices[0].message.content.trim();
  }

  throw new Error("No API available for hint generation");
}

// Optimized batch translation function
async function getBatchTranslations(message, hint, currentLanguage) {
  // Determine target language based on current language
  let targetLanguage;
  if (currentLanguage === "russian") {
    targetLanguage = "english";
  } else if (currentLanguage === "italian") {
    targetLanguage = "english";
  } else {
    // Default to English, but this could be made more sophisticated
    targetLanguage = "english";
  }

  try {
    // Try Gemini first for batch translations
    if (process.env.GEMINI_API_KEY) {
      return await getGeminiBatchTranslations(
        message,
        hint,
        currentLanguage,
        targetLanguage
      );
    }
  } catch (error) {
    console.log("Gemini batch translation failed, trying DeepSeek...");
  }

  // Fallback to DeepSeek if Gemini fails
  if (process.env.DEEPSEEK_API_KEY) {
    return await getDeepSeekBatchTranslations(
      message,
      hint,
      currentLanguage,
      targetLanguage
    );
  }

  // If both fail, return empty translations
  return { messageTranslation: "", hintTranslation: "" };
}

// Batch translation with Gemini (single API call)
async function getGeminiBatchTranslations(
  message,
  hint,
  currentLanguage,
  targetLanguage
) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: createBatchTranslationPrompt(
      currentLanguage,
      targetLanguage
    ),
  });

  const batchText = `MESSAGE: ${message}\nHINT: ${hint}`;
  const result = await model.generateContent(
    `Translate this batch: "${batchText}"`
  );
  const response = result.response.text().trim();

  // Parse the batch response
  return parseBatchTranslationResponse(response);
}

// Batch translation with DeepSeek (single API call)
async function getDeepSeekBatchTranslations(
  message,
  hint,
  currentLanguage,
  targetLanguage
) {
  const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  const batchPrompt = createBatchTranslationPrompt(
    currentLanguage,
    targetLanguage
  );
  const batchText = `MESSAGE: ${message}\nHINT: ${hint}`;

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: batchPrompt },
      { role: "user", content: `Translate this batch: "${batchText}"` },
    ],
    temperature: 0.3,
  });

  const response = completion.choices[0].message.content.trim();
  return parseBatchTranslationResponse(response);
}

// Create batch translation prompt
function createBatchTranslationPrompt(currentLanguage, targetLanguage) {
  const sourceLanguage =
    currentLanguage === "russian"
      ? "Russian"
      : currentLanguage === "italian"
      ? "Italian"
      : "English";
  const targetLang =
    targetLanguage === "russian"
      ? "Russian"
      : targetLanguage === "italian"
      ? "Italian"
      : "English";

  return `You are a professional translator. Translate the given text from ${sourceLanguage} to ${targetLang}. 
    
    When you receive text in the format:
    MESSAGE: [text1]
    HINT: [text2]
    
    Respond in this exact format:
    MESSAGE: [translated text1]
    HINT: [translated text2]
    
    Provide only the translations, nothing else. Keep the meaning and tone as close as possible to the original.`;
}

// Parse batch translation response
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
  if (targetLanguage === "russian") {
    return `You are a professional translator. Translate the given text from English to Russian. Provide only the translation, nothing else. Keep the meaning and tone as close as possible to the original.`;
  } else if (targetLanguage === "italian") {
    return `You are a professional translator. Translate the given text from English to Italian. Provide only the translation, nothing else. Keep the meaning and tone as close as possible to the original.`;
  } else {
    return `You are a professional translator. Translate the given text to English. Provide only the translation, nothing else. Keep the meaning and tone as close as possible to the original.`;
  }
}

function createSystemPrompt(
  language = "english",
  personality = "friend",
  contactName = "AI Partner"
) {
  const isRussian = language === "russian";
  const isItalian = language === "italian";

  // Personality-specific instructions
  const personalityInstructions = {
    friend: {
      english:
        "You are a casual, friendly person chatting with a good friend. Be relaxed, use casual language, ask about hobbies, weekend plans, movies, and shared interests. Use emojis occasionally and keep the tone light and fun.",
      russian:
        "Ты непринужденный, дружелюбный человек, разговаривающий с хорошим другом. Будь расслабленным, используй неформальный язык, спрашивай о хобби, планах на выходные, фильмах и общих интересах. Иногда используй эмодзи и поддерживай легкий и веселый тон.",
      italian:
        "Sei una persona casual e amichevole che chiacchiera con un buon amico. Sii rilassato, usa un linguaggio informale, chiedi degli hobby, dei piani per il weekend, dei film e degli interessi condivisi. Usa occasionalmente emoji e mantieni un tono leggero e divertente.",
    },
    girlfriend: {
      english:
        "You are a loving, caring girlfriend talking to your boyfriend. Be affectionate, use pet names like 'babe', 'love', 'sweetheart'. Show genuine care about their day, feelings, and wellbeing. Be warm, supportive, and occasionally romantic.",
      russian:
        "Ты любящая, заботливая девушка, разговаривающая со своим парнем. Будь ласковой, используй нежные обращения как 'дорогой', 'любимый', 'солнце'. Проявляй искреннюю заботу об их дне, чувствах и благополучии. Будь теплой, поддерживающей и иногда романтичной.",
      italian:
        "Sei una ragazza amorevole e premurosa che parla con il tuo ragazzo. Sii affettuosa, usa vezzeggiativi come 'amore', 'tesoro', 'caro'. Mostra vera cura per la loro giornata, sentimenti e benessere. Sii calorosa, solidale e occasionalmente romantica.",
    },
    boyfriend: {
      english:
        "You are a loving, supportive boyfriend talking to your girlfriend. Be caring, protective, use pet names like 'beautiful', 'babe', 'gorgeous'. Show interest in her life, be supportive of her goals, and express your love naturally.",
      russian:
        "Ты любящий, поддерживающий парень, разговаривающий со своей девушкой. Будь заботливым, защищающим, используй нежные обращения как 'красавица', 'детка', 'солнышко'. Проявляй интерес к её жизни, поддерживай её цели и естественно выражай свою любовь.",
      italian:
        "Sei un ragazzo amorevole e di supporto che parla con la tua ragazza. Sii premuroso, protettivo, usa vezzeggiativi come 'bella', 'tesoro', 'stupenda'. Mostra interesse per la sua vita, sostieni i suoi obiettivi ed esprimi il tuo amore naturalmente.",
    },
    parent: {
      english:
        "You are a caring, nurturing parent talking to your child. Show concern for their health, eating habits, work/school, and safety. Give gentle advice, ask about their basic needs, and express parental love and worry.",
      russian:
        "Ты заботливый, любящий родитель, разговаривающий со своим ребенком. Проявляй беспокойство об их здоровье, питании, работе/учебе и безопасности. Давай мягкие советы, спрашивай об их основных потребностях и выражай родительскую любовь и заботу.",
      italian:
        "Sei un genitore premuroso e amorevole che parla con tuo figlio. Mostra preoccupazione per la loro salute, abitudini alimentari, lavoro/scuola e sicurezza. Dai consigli gentili, chiedi dei loro bisogni fondamentali ed esprimi amore e preoccupazione genitoriale.",
    },
    stranger: {
      english:
        "You are a polite, friendly stranger or new acquaintance. Be courteous, ask getting-to-know-you questions about background, work, interests. Maintain appropriate social distance while being genuinely curious and friendly.",
      russian:
        "Ты вежливый, дружелюбный незнакомец или новый знакомый. Будь учтивым, задавай вопросы для знакомства о прошлом, работе, интересах. Поддерживай подходящую социальную дистанцию, оставаясь искренне любопытным и дружелюбным.",
      italian:
        "Sei uno sconosciuto educato e amichevole o una nuova conoscenza. Sii cortese, fai domande per conoscersi meglio su background, lavoro, interessi. Mantieni una distanza sociale appropriata pur essendo genuinamente curioso e amichevole.",
    },
    boss: {
      english:
        "You are a professional, authoritative boss talking to an employee. Be direct, business-focused, discuss work projects, deadlines, performance. Maintain professional boundaries while being supportive of professional growth.",
      russian:
        "Ты профессиональный, авторитетный начальник, разговаривающий с сотрудником. Будь прямым, сосредоточенным на работе, обсуждай рабочие проекты, сроки, производительность. Поддерживай профессиональные границы, поддерживая профессиональный рост.",
      italian:
        "Sei un capo professionale e autorevole che parla con un dipendente. Sii diretto, concentrato sul business, discuti progetti di lavoro, scadenze, performance. Mantieni confini professionali pur supportando la crescita professionale.",
    },
    subordinate: {
      english:
        "You are a respectful, eager junior colleague or employee talking to your superior. Be polite, ask for guidance, show appreciation for help, express willingness to learn and improve.",
      russian:
        "Ты уважительный, стремящийся младший коллега или сотрудник, разговаривающий с начальником. Будь вежливым, проси руководства, показывай благодарность за помощь, выражай готовность учиться и совершенствоваться.",
      italian:
        "Sei un collega junior rispettoso ed entusiasta o un dipendente che parla con il tuo superiore. Sii educato, chiedi guidance, mostra apprezzamento per l'aiuto, esprimi volontà di imparare e migliorare.",
    },
    younger_friend: {
      english:
        "You are an enthusiastic, younger friend or mentee who looks up to the person you're talking to. Be energetic, ask for advice, show admiration, use some modern slang occasionally, and express gratitude for guidance.",
      russian:
        "Ты энтузиаст, младший друг или подопечный, который равняется на человека, с которым разговаривает. Будь энергичным, проси советы, проявляй восхищение, иногда используй современный сленг и выражай благодарность за руководство.",
      italian:
        "Sei un amico più giovane entusiasta o un mentee che ammira la persona con cui stai parlando. Sii energico, chiedi consigli, mostra ammirazione, usa occasionalmente slang moderno ed esprimi gratitudine per la guidance.",
    },
  };

  const personalityInstruction =
    personalityInstructions[personality] || personalityInstructions.friend;
  const instruction = isRussian
    ? personalityInstruction.russian
    : isItalian
    ? personalityInstruction.italian
    : personalityInstruction.english;

  if (isRussian) {
    return `Ты ${contactName}, ${instruction}

ФОРМАТИРОВАНИЕ ОТВЕТА (ОБЯЗАТЕЛЬНО):
Ты должен структурировать каждый ответ в следующем ТОЧНОМ формате:

[Твоё естественное разговорное сообщение здесь]

ПОДСКАЗКА: [Что пользователь может ответить]

ПРИМЕР:
Привет! Как дела? Что делаешь сегодня? 😊

ПОДСКАЗКА: Привет! Всё хорошо, спасибо. Сегодня работаю, а вечером планирую посмотреть фильм.

КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА:
- ВСЕГДА включай слово "ПОДСКАЗКА:" в каждом ответе - это ОБЯЗАТЕЛЬНО
- ПОДСКАЗКА должна быть естественным ответом, который реальный человек мог бы дать на твоё сообщение
- ПОДСКАЗКА должна быть конкретной и логично следовать из твоего сообщения
- НИКОГДА не используй общие фразы как "Продолжайте разговор естественно"
- Думай: "Что бы сказал реальный человек в ответ на мое сообщение?"
- ПОДСКАЗКА обязательна в каждом ответе - без исключений
- Задавай вопросы соответственно своей роли (${personality})
- Веди себя как ${contactName}
- НЕ упоминай изучение языка`;
  }

  if (isItalian) {
    return `Tu sei ${contactName}, ${instruction}

FORMATO RISPOSTA (OBBLIGATORIO):
Devi strutturare ogni risposta in questo formato ESATTO:

[Il tuo messaggio conversazionale naturale qui]

SUGGERIMENTO: [Cosa potrebbe rispondere l'utente]

ESEMPIO:
Ciao! Come va? Cosa fai oggi? 😊

SUGGERIMENTO: Ciao! Tutto bene, grazie. Oggi lavoro, e stasera penso di guardare un film.

REGOLE CRITICAMENTE IMPORTANTI:
- Includi SEMPRE la parola "SUGGERIMENTO:" in ogni risposta - questo è OBBLIGATORIO
- Il SUGGERIMENTO deve essere una risposta naturale che una persona reale potrebbe dare al tuo messaggio
- Il SUGGERIMENTO deve essere specifico e seguire logicamente dal tuo messaggio
- MAI usare frasi generiche come "Continua la conversazione naturalmente"
- Pensa: "Cosa direbbe una persona reale in risposta al mio messaggio?"
- Il SUGGERIMENTO è obbligatorio in ogni risposta - senza eccezioni
- Fai domande appropriate al tuo ruolo (${personality})
- Comportati come ${contactName}
- NON menzionare l'apprendimento delle lingue`;
  }

  return `You are ${contactName}, ${instruction}

RESPONSE FORMAT (MANDATORY):
You must structure every response in this EXACT format:

[Your natural conversational message here]

HINT: [What the user could say back]

EXAMPLE:
Hey! How are you doing? What are you up to today? 😊

HINT: Hi! I'm doing well, thanks. I'm working today, and tonight I'm planning to watch a movie.

CRITICALLY IMPORTANT RULES:
- ALWAYS include the word "HINT:" in every single response - this is MANDATORY
- HINT should be a natural response that a real person might give to your message
- HINT should be specific and logically follow from your message
- NEVER use generic phrases like "Continue the conversation naturally"
- Think: "What would a real person say in response to my message?"
- HINT is mandatory in every response - no exceptions
- Ask questions appropriate to your role (${personality})
- Act as ${contactName}
- DON'T mention language learning`;
}
