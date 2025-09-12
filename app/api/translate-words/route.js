import { NextResponse } from "next/server";
import {
  mapLanguageToLibreTranslateCode,
  translateWithLibreTranslate,
  extractWordsFromText,
} from "@/lib/libreTranslate";

// Optimized function to translate multiple words at once
async function translateWordsBatch(words, sourceLanguage, targetLanguage) {
  const sourceLang = mapLanguageToLibreTranslateCode(sourceLanguage);
  const targetLang = mapLanguageToLibreTranslateCode(targetLanguage);

  console.log(
    `Translating ${words.length} words from ${sourceLang} to ${targetLang}`
  );

  try {
    // Join words with a unique separator that's unlikely to be in translations
    const separator = " ||||| ";
    const combinedText = words.join(separator);

    console.log(
      `Combined text for translation: ${combinedText.substring(0, 200)}...`
    );

    const translatedText = await translateWithLibreTranslate(
      combinedText,
      sourceLang,
      targetLang
    );

    console.log(
      `Batch translation result: ${translatedText.substring(0, 200)}...`
    );

    // Split the translated text by the separator
    let translatedWords = translatedText.split(separator);

    // Handle cases where separator might have been translated or modified
    if (translatedWords.length !== words.length) {
      console.log(
        `Separator mismatch. Expected ${words.length} parts, got ${translatedWords.length}`
      );

      // Try alternative separators that might have been translated
      const altSeparators = [
        " ||||| ",
        " | | | | | ",
        " |||||",
        "||||| ",
        " |||| ",
        " ||||",
      ];

      for (const altSep of altSeparators) {
        const altSplit = translatedText.split(altSep);
        if (altSplit.length === words.length) {
          translatedWords = altSplit;
          console.log(`Found correct split with separator: "${altSep}"`);
          break;
        }
      }

      // If still no match, split by spaces and try to match count
      if (translatedWords.length !== words.length) {
        const spaceSplit = translatedText.split(/\s+/);
        if (spaceSplit.length >= words.length) {
          translatedWords = spaceSplit.slice(0, words.length);
          console.log(`Using space split fallback`);
        }
      }
    }

    // Create word-translation pairs
    const wordTranslations = words.map((word, index) => {
      let translation = translatedWords[index] || word;

      // Clean up the translation
      translation = translation.trim();

      // Remove any remaining separator artifacts
      translation = translation.replace(/\|+/g, "").trim();

      // If translation is empty or just separators, use original word
      if (!translation || translation === "") {
        translation = word;
      }

      // If translation is the same as original and languages are different,
      // it might be a proper noun or untranslatable word
      if (translation === word && sourceLang !== targetLang) {
        console.log(`No translation found for "${word}", keeping original`);
      }

      return {
        word,
        translation: translation || word,
      };
    });

    console.log(`Processed ${wordTranslations.length} word translations`);
    return wordTranslations;
  } catch (error) {
    console.error(`Error in batch translation:`, error.message);

    // Fallback: return words with original text if batch translation fails
    return words.map((word) => ({
      word,
      translation: word,
    }));
  }
}

export async function POST(request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    console.log(`Received translation request:`, {
      text: text.substring(0, 100) + "...",
      sourceLanguage,
      targetLanguage,
    });

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: text, sourceLanguage, targetLanguage",
        },
        { status: 400 }
      );
    }

    // Extract words from the text (improved to filter out emojis and non-words)
    const words = extractWordsFromText(text);
    console.log(`Extracted ${words.length} words:`, words.slice(0, 10));

    if (words.length === 0) {
      return NextResponse.json({ wordTranslations: [] });
    }

    // Use batch translation for efficiency
    const wordTranslations = await translateWordsBatch(
      words,
      sourceLanguage,
      targetLanguage
    );

    console.log(`Final word translations:`, wordTranslations.slice(0, 5));
    return NextResponse.json({ wordTranslations });
  } catch (error) {
    console.error("Error in translate-words API:", error);
    return NextResponse.json(
      { error: "Failed to translate words" },
      { status: 500 }
    );
  }
}
