import translate from "google-translate-api-x";

// LibreTranslate utility functions
export const LIBRETRANSLATE_LANGUAGES = {
  english: "en",
  spanish: "es",
  french: "fr",
  german: "de",
  italian: "it",
  portuguese: "pt",
  russian: "ru",
  japanese: "ja",
  korean: "ko",
  chinese: "zh",
  arabic: "ar",
};

export function mapLanguageToLibreTranslateCode(language) {
  return LIBRETRANSLATE_LANGUAGES[language?.toLowerCase()] || "en";
}

export async function translateWithLibreTranslate(
  text,
  sourceLang,
  targetLang
) {
  console.log(
    `Attempting to translate: "${text}" from ${sourceLang} to ${targetLang}`
  );

  try {
    // First, try Google Translate API (unofficial)
    const result = await translate(text, { from: sourceLang, to: targetLang });
    console.log(`Google Translate result:`, result);

    if (result && result.text && result.text !== text) {
      console.log(`Google Translate success: "${text}" -> "${result.text}"`);
      return result.text;
    }

    throw new Error("Google Translate returned same text or empty result");
  } catch (error) {
    console.log(
      "Google Translate failed, trying LibreTranslate:",
      error.message
    );

    try {
      // Fallback to LibreTranslate (though it requires API key)
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: "text",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`LibreTranslate API error: ${errorData.error}`);
      }

      const data = await response.json();
      console.log(`LibreTranslate API response:`, data);

      if (data.translatedText && data.translatedText !== text) {
        return data.translatedText;
      }

      throw new Error("LibreTranslate returned same text");
    } catch (libreError) {
      console.log(
        "LibreTranslate also failed, using enhanced dictionary:",
        libreError.message
      );

      // Final fallback to our enhanced dictionary
      return getEnhancedMockTranslation(text, sourceLang, targetLang);
    }
  }
}

// Simple fallback function for when all translation services fail
function getEnhancedMockTranslation(text, sourceLang, targetLang) {
  // Check if this is a batch translation (contains separator)
  const separator = " ||||| ";
  if (text.includes(separator)) {
    const words = text.split(separator);
    const translatedWords = words.map((word) =>
      getEnhancedMockTranslation(word.trim(), sourceLang, targetLang)
    );
    return translatedWords.join(separator);
  }

  // If no translation service is available, indicate it's untranslatable
  console.log(`No translation service available for: ${text}`);
  return `[${text}]`; // Wrap in brackets to show it's untranslated
}

export function extractWordsFromText(text, maxWords = 50) {
  // More comprehensive word extraction that filters out emojis and non-words
  return text
    .replace(/[.,!?;:"'()[\]{}\-–—¿¡]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter((word) => {
      // Filter out emojis, numbers, and very short words
      const emojiRegex =
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      const isEmoji = emojiRegex.test(word);
      const isOnlyNumbers = /^\d+$/.test(word);
      const hasLetters = /[a-zA-Zа-яА-Я\u00C0-\u017F\u0100-\u024F]/u.test(word);
      const isValidLength = word.length > 1;

      return !isEmoji && !isOnlyNumbers && hasLetters && isValidLength;
    })
    .map((word) => word.toLowerCase())
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
    .slice(0, maxWords); // Limit to prevent API overload
}
