import { NextResponse } from "next/server";
import {
  mapLanguageToLibreTranslateCode,
  translateWithLibreTranslate,
  extractWordsFromText,
} from "@/lib/libreTranslate";

// Function to translate a single word using LibreTranslate
async function translateWord(word, sourceLanguage, targetLanguage) {
  const sourceLang = mapLanguageToLibreTranslateCode(sourceLanguage);
  const targetLang = mapLanguageToLibreTranslateCode(targetLanguage);

  console.log(`Translating "${word}" from ${sourceLang} to ${targetLang}`);

  try {
    const translation = await translateWithLibreTranslate(
      word,
      sourceLang,
      targetLang
    );
    console.log(`Translation result: "${word}" -> "${translation}"`);

    // If translation is the same as original and languages are different,
    // it might be a proper noun or untranslatable word
    if (translation === word && sourceLang !== targetLang) {
      console.log(`No translation found for "${word}", keeping original`);
    }

    return translation || word;
  } catch (error) {
    console.error(`Error translating word "${word}":`, error.message);
    return word; // Return original word if translation fails
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

    // Extract words from the text
    const words = extractWordsFromText(text);
    console.log(`Extracted ${words.length} words:`, words.slice(0, 10));

    if (words.length === 0) {
      return NextResponse.json({ wordTranslations: [] });
    }

    // Translate each word
    const wordTranslations = [];

    // Process words in batches to avoid overwhelming the API
    const batchSize = 3; // Reduced batch size for better debugging
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}:`, batch);

      const batchPromises = batch.map(async (word) => {
        const translation = await translateWord(
          word,
          sourceLanguage,
          targetLanguage
        );
        return { word, translation };
      });

      const batchResults = await Promise.all(batchPromises);
      wordTranslations.push(...batchResults);

      // Add small delay between batches to be respectful to the API
      if (i + batchSize < words.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

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
