import { translate } from "@vitalets/google-translate-api";

// Language code mapping for Google Translate
const LANGUAGE_CODES = {
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

/**
 * Get Google Translate language code from language name
 */
function getLanguageCode(language) {
  const normalizedLanguage = language.toLowerCase();
  return LANGUAGE_CODES[normalizedLanguage] || normalizedLanguage;
}

/**
 * Translate text using Google Translate API
 */
export async function translateText(text, sourceLanguage, targetLanguage) {
  try {
    const sourceLangCode = getLanguageCode(sourceLanguage);
    const targetLangCode = getLanguageCode(targetLanguage);

    const result = await translate(text, {
      from: sourceLangCode,
      to: targetLangCode,
      fetchOptions: {
        agent: null, // This helps with some network issues
      },
    });

    return result.text;
  } catch (error) {
    console.error("Google Translate API error:", error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

/**
 * Translate multiple texts in batch
 */
export async function translateBatch(texts, sourceLanguage, targetLanguage) {
  try {
    const sourceLangCode = getLanguageCode(sourceLanguage);
    const targetLangCode = getLanguageCode(targetLanguage);

    const translations = await Promise.all(
      texts.map(async (text) => {
        if (!text || text.trim() === "") {
          return "";
        }

        const result = await translate(text, {
          from: sourceLangCode,
          to: targetLangCode,
          fetchOptions: {
            agent: null,
          },
        });
        return result.text;
      })
    );

    return translations;
  } catch (error) {
    console.error("Google Translate batch API error:", error);
    throw new Error(`Batch translation failed: ${error.message}`);
  }
}

/**
 * Get batch translations for message and hint
 */
export async function getBatchTranslations(
  message,
  hint,
  sourceLanguage,
  targetLanguage
) {
  try {
    const textsToTranslate = [message, hint].filter(
      (text) => text && text.trim() !== ""
    );
    const translations = await translateBatch(
      textsToTranslate,
      sourceLanguage,
      targetLanguage
    );

    return {
      messageTranslation: message ? translations[0] || "" : "",
      hintTranslation: hint
        ? translations[textsToTranslate.length === 2 ? 1 : 0] || ""
        : "",
    };
  } catch (error) {
    console.error("Batch translation error:", error);
    return {
      messageTranslation: "",
      hintTranslation: "",
    };
  }
}
