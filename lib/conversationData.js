// Conversation starters with exact translations across languages
export const conversationStarters = [
  {
    id: 1,
    translations: {
      english: "Hello! How are you today?",
      spanish: "¡Hola! ¿Cómo estás hoy?",
      french: "Salut! Comment allez-vous aujourd'hui?",
      german: "Hallo! Wie geht es Ihnen heute?",
      italian: "Ciao! Come stai oggi?",
      portuguese: "Olá! Como você está hoje?",
      russian: "Привет! Как дела сегодня?",
      japanese: "こんにちは！今日はお元気ですか？",
      korean: "안녕하세요! 오늘 어떻게 지내세요?",
      chinese: "你好！你今天怎么样？",
      arabic: "مرحبا! كيف حالك اليوم؟",
    },
  },
  {
    id: 2,
    translations: {
      english: "What's new with you?",
      spanish: "¿Qué hay de nuevo contigo?",
      french: "Quoi de neuf avec vous?",
      german: "Was gibt's Neues bei Ihnen?",
      italian: "Cosa c'è di nuovo con te?",
      portuguese: "O que há de novo com você?",
      russian: "Что у вас нового?",
      japanese: "何か新しいことはありますか？",
      korean: "무슨 새로운 일이 있나요?",
      chinese: "你有什么新鲜事吗？",
      arabic: "ما الجديد معك؟",
    },
  },
  {
    id: 3,
    translations: {
      english: "Nice to meet you!",
      spanish: "¡Mucho gusto conocerte!",
      french: "Enchanté de vous rencontrer!",
      german: "Freut mich, Sie kennenzulernen!",
      italian: "Piacere di conoscerti!",
      portuguese: "Prazer em conhecê-lo!",
      russian: "Приятно познакомиться!",
      japanese: "はじめまして、よろしくお願いします！",
      korean: "만나서 반가워요!",
      chinese: "很高兴认识你！",
      arabic: "سعيد بلقائك!",
    },
  },
  {
    id: 4,
    translations: {
      english: "How has your day been?",
      spanish: "¿Cómo ha estado tu día?",
      french: "Comment s'est passée votre journée?",
      german: "Wie war Ihr Tag?",
      italian: "Com'è andata la tua giornata?",
      portuguese: "Como foi o seu dia?",
      russian: "Как прошел ваш день?",
      japanese: "今日はいかがでしたか？",
      korean: "오늘 하루 어떠셨나요?",
      chinese: "你今天过得怎么样？",
      arabic: "كيف كان يومك؟",
    },
  },
  {
    id: 5,
    translations: {
      english: "I hope you're doing well!",
      spanish: "¡Espero que estés bien!",
      french: "J'espère que vous allez bien!",
      german: "Ich hoffe, es geht Ihnen gut!",
      italian: "Spero che tu stia bene!",
      portuguese: "Espero que você esteja bem!",
      russian: "Надеюсь, у вас все хорошо!",
      japanese: "お元気でいらっしゃることを願っています！",
      korean: "잘 지내고 계시길 바랍니다!",
      chinese: "希望你一切都好！",
      arabic: "أتمنى أن تكون بخير!",
    },
  },
];

// Get initial hint based on language - returns a random conversation starter
export const getInitialHint = (language) => {
  // Default to english if language not found
  const targetLanguage = language || "english";

  // Get a random conversation starter from the 5 available
  const randomIndex = Math.floor(Math.random() * conversationStarters.length);
  const selectedStarter = conversationStarters[randomIndex];

  // Return the translation for the selected language, fallback to english
  return (
    selectedStarter.translations[targetLanguage] ||
    selectedStarter.translations.english
  );
};

// Get translation of a specific text to a target language from our predefined starters
export const getHintTranslation = (hintText, targetLanguage) => {
  // Find the conversation starter that matches the hint text
  for (const starter of conversationStarters) {
    // Check if any of the translations match the hint text
    for (const [lang, translation] of Object.entries(starter.translations)) {
      if (translation === hintText) {
        // Found the matching starter, return the translation in target language
        return (
          starter.translations[targetLanguage] || starter.translations.english
        );
      }
    }
  }

  // If no match found, return null (will use API translation as fallback)
  return null;
};
