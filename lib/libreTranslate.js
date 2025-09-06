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

// Enhanced mock translation function with more comprehensive translations
function getEnhancedMockTranslation(word, sourceLang, targetLang) {
  const mockTranslations = {
    "ru-en": {
      // Common greetings and phrases
      привет: "hello",
      здравствуйте: "hello (formal)",
      пока: "bye",
      до: "to/until",
      свидания: "meeting",

      // Question words and common verbs
      как: "how",
      что: "what",
      где: "where",
      когда: "when",
      почему: "why",
      кто: "who",
      дела: "things/affairs",
      меня: "me",
      тебя: "you (accusative)",
      его: "him/his",
      её: "her",
      нас: "us",
      вас: "you (accusative/genitive)",
      их: "them/their",
      мне: "to me",
      тебе: "to you",
      ему: "to him",
      ей: "to her",
      нам: "to us",
      вам: "to you (formal)",
      им: "to them",
      зовут: "call/name",
      я: "I",
      ты: "you",
      он: "he",
      она: "she",
      мы: "we",
      вы: "you (formal)",
      они: "they",

      // Verbs (past tense and present)
      был: "was",
      была: "was",
      было: "was",
      были: "were",
      есть: "is/to eat",
      буду: "will be",
      будет: "will be",
      будут: "will be",
      делать: "to do",
      делаю: "I do",
      делает: "does",
      сделать: "to make",
      идти: "to go",
      иду: "I go",
      идет: "goes",
      говорить: "to speak",
      говорю: "I speak",
      говорит: "speaks",
      знать: "to know",
      знаю: "I know",
      знает: "knows",
      любить: "to love",
      люблю: "I love",
      любит: "loves",
      жить: "to live",
      живу: "I live",
      живет: "lives",
      работать: "to work",
      работаю: "I work",
      работает: "works",
      учиться: "to study",
      учусь: "I study",
      учится: "studies",
      читать: "to read",
      читаю: "I read",
      читает: "reads",
      писать: "to write",
      пишу: "I write",
      пишет: "writes",

      // Adjectives
      хороший: "good",
      хорошая: "good",
      хорошее: "good",
      хорошие: "good",
      хорошо: "good/well",
      плохой: "bad",
      плохая: "bad",
      плохое: "bad",
      плохие: "bad",
      плохо: "bad/badly",
      большой: "big",
      большая: "big",
      большое: "big",
      большие: "big",
      маленький: "small",
      маленькая: "small",
      маленькое: "small",
      маленькие: "small",
      красивый: "beautiful",
      красивая: "beautiful",
      красивое: "beautiful",
      красивые: "beautiful",
      умный: "smart",
      умная: "smart",
      умное: "smart",
      умные: "smart",
      новый: "new",
      новая: "new",
      новое: "new",
      новые: "new",
      нового: "new (genitive)",
      новой: "new (genitive/dative)",
      новую: "new (accusative)",
      новым: "new (instrumental)",
      новых: "new (genitive plural)",
      старый: "old",
      старая: "old",
      старое: "old",
      старые: "old",
      молодой: "young",
      молодая: "young",
      молодое: "young",
      молодые: "young",
      интересный: "interesting",
      интересная: "interesting",
      интересное: "interesting",
      интересные: "interesting",

      // Common words
      да: "yes",
      нет: "no",
      спасибо: "thank you",
      пожалуйста: "please/you're welcome",
      извините: "excuse me/sorry",
      очень: "very",
      много: "much/many",
      мало: "little/few",
      всё: "everything",
      все: "everyone",
      ничего: "nothing",
      никто: "nobody",
      может: "maybe/can",
      можно: "possible/may",
      нужно: "necessary/need",
      должен: "must/should",
      должна: "must/should",
      должно: "must/should",
      должны: "must/should",
      хочу: "I want",
      хочет: "wants",
      хотят: "want",
      понимать: "to understand",
      понимаю: "I understand",
      понимает: "understands",

      // Nouns
      дом: "house",
      квартира: "apartment",
      работа: "work",
      школа: "school",
      университет: "university",
      семья: "family",
      друг: "friend",
      подруга: "friend (female)",
      мама: "mom",
      папа: "dad",
      сын: "son",
      дочь: "daughter",
      брат: "brother",
      сестра: "sister",
      время: "time",
      день: "day",
      неделя: "week",
      месяц: "month",
      год: "year",
      утро: "morning",
      вечер: "evening",
      ночь: "night",
      сегодня: "today",
      вчера: "yesterday",
      завтра: "tomorrow",
      вода: "water",
      еда: "food",
      хлеб: "bread",
      мясо: "meat",
      рыба: "fish",
      молоко: "milk",
      чай: "tea",
      кофе: "coffee",
      книга: "book",
      стол: "table",
      стул: "chair",
      кровать: "bed",
      машина: "car",
      автобус: "bus",
      поезд: "train",
      самолет: "airplane",
      деньги: "money",
      рубль: "ruble",
      доллар: "dollar",
      город: "city",
      страна: "country",
      мир: "world/peace",
      земля: "earth/land",
      небо: "sky",
      солнце: "sun",
      луна: "moon",
      звезда: "star",
      погода: "weather",
      дождь: "rain",
      снег: "snow",
      ветер: "wind",

      // Numbers
      один: "one",
      одна: "one",
      одно: "one",
      два: "two",
      две: "two",
      три: "three",
      четыре: "four",
      пять: "five",
      шесть: "six",
      семь: "seven",
      восемь: "eight",
      девять: "nine",
      десять: "ten",

      // Prepositions and conjunctions
      в: "in/to",
      на: "on/at",
      с: "with/from",
      у: "at/by",
      за: "behind/for",
      под: "under",
      над: "above",
      между: "between",
      около: "near",
      через: "through/across",
      без: "without",
      для: "for",
      о: "about",
      про: "about",
      и: "and",
      а: "but/and",
      но: "but",
      или: "or",
      если: "if",
      что: "that/what",
      как: "how/as",
      когда: "when",
      где: "where",
      куда: "where to",
      откуда: "from where",
      почему: "why",
    },
    "es-en": {
      hola: "hello",
      adiós: "goodbye",
      como: "how",
      estas: "are",
      que: "what",
      donde: "where",
      cuando: "when",
      porque: "because",
      bien: "good/well",
      mal: "bad/badly",
      si: "yes",
      no: "no",
      gracias: "thank you",
      por: "for",
      favor: "favor",
      casa: "house",
      trabajo: "work",
      tiempo: "time",
      día: "day",
      noche: "night",
      agua: "water",
      comida: "food",
      amor: "love",
      saber: "to know",
      ir: "to go",
      hablar: "to speak",
    },
    "fr-en": {
      bonjour: "hello",
      "au revoir": "goodbye",
      comment: "how",
      allez: "go",
      vous: "you",
      que: "what",
      où: "where",
      quand: "when",
      pourquoi: "why",
      bien: "good/well",
      mal: "bad/badly",
      oui: "yes",
      non: "no",
      merci: "thank you",
      maison: "house",
      travail: "work",
      temps: "time",
      jour: "day",
      nuit: "night",
      eau: "water",
      nourriture: "food",
      amour: "love",
      savoir: "to know",
      aller: "to go",
      parler: "to speak",
    },
    "de-en": {
      hallo: "hello",
      "auf wiedersehen": "goodbye",
      wie: "how",
      was: "what",
      wo: "where",
      wann: "when",
      warum: "why",
      gut: "good",
      schlecht: "bad",
      ja: "yes",
      nein: "no",
      danke: "thank you",
      haus: "house",
      arbeit: "work",
      zeit: "time",
      tag: "day",
      nacht: "night",
      wasser: "water",
      essen: "food",
      liebe: "love",
      wissen: "to know",
      gehen: "to go",
      sprechen: "to speak",
    },
  };

  const key = `${sourceLang}-${targetLang}`;
  const translation = mockTranslations[key]?.[word.toLowerCase()];

  if (translation) {
    console.log(`Using enhanced mock translation: ${word} -> ${translation}`);
    return translation;
  }

  // If no translation found, try our dictionary as a last resort
  const dictionaryTranslation = mockTranslations[key]?.[word.toLowerCase()];
  if (dictionaryTranslation) {
    console.log(
      `Using dictionary fallback: ${word} -> ${dictionaryTranslation}`
    );
    return dictionaryTranslation;
  }

  // If no translation available anywhere, indicate it's untranslatable
  console.log(`No translation available for: ${word}`);
  return `[${word}]`; // Wrap in brackets to show it's untranslated
}

export function extractWordsFromText(text, maxWords = 50) {
  // Remove punctuation and split by spaces
  return text
    .replace(/[.,!?;:"'()[\]{}\-–—¿¡]/g, " ") // Include Spanish question marks
    .split(/\s+/)
    .filter((word) => word.length > 1) // Only words with more than 1 character
    .map((word) => word.toLowerCase())
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
    .slice(0, maxWords); // Limit to prevent API overload
}
