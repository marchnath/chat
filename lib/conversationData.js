// Translation dictionary for common words and phrases
export const translations = {
  // Basic greetings and responses - exact word translations
  hello: { russian: "здравствуйте", english: "hello" },
  hi: { russian: "привет", english: "hi" },
  hey: { russian: "эй", english: "hey" },
  morning: { russian: "утро", english: "morning" },
  afternoon: { russian: "день", english: "afternoon" },
  evening: { russian: "вечер", english: "evening" },
  good: { russian: "хорошо", english: "good" },
  bad: { russian: "плохо", english: "bad" },
  nice: { russian: "приятно", english: "nice" },
  meet: { russian: "встречать", english: "meet" },

  // Common questions and responses
  "how are you": { russian: "как дела", english: "how are you" },
  "i'm fine": { russian: "у меня всё хорошо", english: "i'm fine" },
  "thank you": { russian: "спасибо", english: "thank you" },
  please: { russian: "пожалуйста", english: "please" },
  yes: { russian: "да", english: "yes" },
  no: { russian: "нет", english: "no" },

  // Personal information
  "my name is": { russian: "меня зовут", english: "my name is" },
  "where are you from": { russian: "откуда вы", english: "where are you from" },
  "i'm from": { russian: "я из", english: "i'm from" },
  "what do you do": {
    russian: "чем вы занимаетесь",
    english: "what do you do",
  },
  "i work": { russian: "я работаю", english: "i work" },
  "i study": { russian: "я учусь", english: "i study" },
  "how old are you": { russian: "сколько вам лет", english: "how old are you" },
  "i am": { russian: "я", english: "i am" },
  "years old": { russian: "лет", english: "years old" },

  // Time and dates
  "what time is it": { russian: "который час", english: "what time is it" },
  today: { russian: "сегодня", english: "today" },
  tomorrow: { russian: "завтра", english: "tomorrow" },
  yesterday: { russian: "вчера", english: "yesterday" },

  // Weather
  weather: { russian: "погода", english: "weather" },
  hot: { russian: "жарко", english: "hot" },
  cold: { russian: "холодно", english: "cold" },
  warm: { russian: "тепло", english: "warm" },
  rain: { russian: "дождь", english: "rain" },
  snow: { russian: "снег", english: "snow" },
  sun: { russian: "солнце", english: "sun" },

  // Common nouns
  food: { russian: "еда", english: "food" },
  water: { russian: "вода", english: "water" },
  coffee: { russian: "кофе", english: "coffee" },
  tea: { russian: "чай", english: "tea" },
  breakfast: { russian: "завтрак", english: "breakfast" },
  lunch: { russian: "обед", english: "lunch" },
  dinner: { russian: "ужин", english: "dinner" },
  family: { russian: "семья", english: "family" },
  friend: { russian: "друг", english: "friend" },
  work: { russian: "работа", english: "work" },
  school: { russian: "школа", english: "school" },
  university: { russian: "университет", english: "university" },
  house: { russian: "дом", english: "house" },
  car: { russian: "машина", english: "car" },
  book: { russian: "книга", english: "book" },
  movie: { russian: "фильм", english: "movie" },
  music: { russian: "музыка", english: "music" },
  sport: { russian: "спорт", english: "sport" },
  travel: { russian: "путешествие", english: "travel" },
  hobby: { russian: "хобби", english: "hobby" },
};

// Comprehensive translation for common phrases and responses
export const phraseTranslations = {
  english: {
    // Conversation starters - exact translations
    "Hi!": "Привет!",
    "Hello!": "Здравствуйте!",
    "Hey there!": "Здорово!",
    "Good morning!": "Доброе утро!",
    "Good afternoon!": "Добрый день!",
    "Good evening!": "Добрый вечер!",
    "What's up?": "Как дела?",
    "How's it going?": "Как поживаете?",
    "How are you?": "Как вы?",
    "Nice to meet you!": "Приятно познакомиться!",
    "How are you today?": "Как дела сегодня?",
    "How's your day?": "Как ваш день?",
    "What's new?": "Что нового?",
    "How have you been?": "Как поживали?",
    "Hope you're doing well!": "Надеюсь, у вас все хорошо!",

    // Common system messages
    "Continue the conversation naturally.": "Продолжайте разговор естественно.",
    "Start the conversation by introducing yourself or asking a question!":
      "Начните разговор, представившись или задав вопрос!",
    "That's interesting! Tell me more about that.":
      "Это интересно! Расскажите мне больше об этом.",
    "Try sending your message again.":
      "Попробуйте отправить сообщение еще раз.",

    // Common conversation starters and responses
    "Hello! How are you today?": "Привет! Как дела сегодня?",
    "What did you do today?": "Что вы делали сегодня?",
    "Tell me about yourself.": "Расскажите мне о себе.",
    "What are your hobbies?": "Какие у вас хобби?",
    "How was your day?": "Как прошел ваш день?",

    // Fallback responses
    "That's really interesting! Can you tell me more about that?":
      "Это действительно интересно! Можете рассказать мне больше об этом?",
    "I love hearing about that! What else would you like to share?":
      "Мне нравится слышать об этом! Чем еще хотели бы поделиться?",
    "How fascinating! What do you think about it?":
      "Как увлекательно! Что вы думаете об этом?",
    "That sounds great! How did that make you feel?":
      "Звучит здорово! Как это заставило вас чувствовать?",
    "Wonderful! I'd love to know more details about that.":
      "Замечательно! Я хотел бы узнать больше подробностей об этом.",

    // Error messages
    "Sorry, I'm having trouble responding right now. Please try again.":
      "Извините, у меня сейчас проблемы с ответом. Пожалуйста, попробуйте еще раз.",
    "Translation unavailable": "Перевод недоступен",
    "API quota exceeded. Please try again tomorrow or upgrade your plan.":
      "Квота API превышена. Пожалуйста, попробуйте завтра или обновите план.",
  },
  russian: {
    // Conversation starters - exact translations
    "Привет!": "Hi!",
    "Здравствуйте!": "Hello!",
    "Здорово!": "Hey there!",
    "Доброе утро!": "Good morning!",
    "Добрый день!": "Good afternoon!",
    "Добрый вечер!": "Good evening!",
    "Как дела?": "What's up?",
    "Как поживаете?": "How's it going?",
    "Как вы?": "How are you?",
    "Приятно познакомиться!": "Nice to meet you!",
    "Как дела сегодня?": "How are you today?",
    "Как ваш день?": "How's your day?",
    "Что нового?": "What's new?",
    "Как поживали?": "How have you been?",
    "Надеюсь, у вас все хорошо!": "Hope you're doing well!",

    // Common system messages
    "Продолжайте разговор естественно.": "Continue the conversation naturally.",
    "Начните разговор, представившись или задав вопрос!":
      "Start the conversation by introducing yourself or asking a question!",
    "Это интересно! Расскажите мне больше об этом.":
      "That's interesting! Tell me more about that.",
    "Попробуйте отправить сообщение еще раз.":
      "Try sending your message again.",

    // Common conversation starters and responses
    "Привет! Как дела сегодня?": "Hello! How are you today?",
    "Что вы делали сегодня?": "What did you do today?",
    "Расскажите мне о себе.": "Tell me about yourself.",
    "Какие у вас хобби?": "What are your hobbies?",
    "Как прошел ваш день?": "How was your day?",

    // Fallback responses
    "Это действительно интересно! Можете рассказать мне больше об этом?":
      "That's really interesting! Can you tell me more about that?",
    "Мне нравится слышать об этом! Чем еще хотели бы поделиться?":
      "I love hearing about that! What else would you like to share?",
    "Как увлекательно! Что вы думаете об этом?":
      "How fascinating! What do you think about it?",
    "Звучит здорово! Как это заставило вас чувствовать?":
      "That sounds great! How did that make you feel?",
    "Замечательно! Я хотел бы узнать больше подробностей об этом.":
      "Wonderful! I'd love to know more details about that.",

    // Error messages
    "Извините, у меня сейчас проблемы с ответом. Пожалуйста, попробуйте еще раз.":
      "Sorry, I'm having trouble responding right now. Please try again.",
    "Перевод недоступен": "Translation unavailable",
    "Квота API превышена. Пожалуйста, попробуйте завтра или обновите план.":
      "API quota exceeded. Please try again tomorrow or upgrade your plan.",
  },
};

// Offline conversation responses with triggers
export const offlineResponses = {
  english: [
    {
      trigger: ["hello", "hi", "hey"],
      response: "Hello! 👋 Nice to meet you! What's your name?",
      hint: "Hi there! My name is [your name]. How are you today?",
    },
    {
      trigger: ["my name is", "i'm", "i am"],
      response: "Nice to meet you! 😊 How has your day been so far?",
      hint: "It's been good, thank you for asking. What about yours?",
    },
    {
      trigger: ["good", "fine", "great", "well"],
      response:
        "That's wonderful to hear! 🌟 What do you like to do in your free time?",
      hint: "I enjoy reading books and watching movies. I also like to go for walks.",
    },
    {
      trigger: ["work", "job", "career"],
      response:
        "That sounds really interesting! 💼 What's your favorite part about it?",
      hint: "I really enjoy the creative aspects and meeting new people.",
    },
    {
      trigger: ["weather", "day", "today"],
      response:
        "Yes, it's been quite nice! ☀️ Do you have any plans for the weekend?",
      hint: "I'm planning to visit some friends and maybe go to the park.",
    },
    {
      trigger: ["weekend", "plans", "free time"],
      response:
        "That sounds like fun! 🎉 I love spending time with friends too. What do you usually do together?",
      hint: "We usually watch movies, go out for dinner, or just chat and catch up.",
    },
    {
      trigger: ["family", "parents", "siblings"],
      response:
        "Family is so important! 👨‍👩‍👧‍👦 Tell me about your family. Do you have any siblings?",
      hint: "I have one sister and one brother. We're very close and spend a lot of time together.",
    },
    {
      trigger: ["study", "school", "university", "student"],
      response:
        "Education is fascinating! 📚 What are you studying? What's your favorite subject?",
      hint: "I'm studying computer science and I really enjoy programming and math.",
    },
    {
      trigger: ["travel", "vacation", "trip"],
      response:
        "I love talking about travel! ✈️ Where was the most interesting place you've been?",
      hint: "I went to Japan last year and it was absolutely amazing. The culture was so different.",
    },
    {
      trigger: ["food", "eat", "cooking", "restaurant"],
      response:
        "Food is one of life's great pleasures! 🍕 What's your favorite type of cuisine?",
      hint: "I love Italian food, especially pasta and pizza. I also enjoy trying new dishes.",
    },
  ],
  russian: [
    {
      trigger: ["привет", "здравствуйте", "здорово"],
      response: "Привет! 👋 Рад знакомству! Как вас зовут?",
      hint: "Привет! Меня зовут [ваше имя]. Как дела?",
    },
    {
      trigger: ["меня зовут", "я", "зовут"],
      response: "Приятно познакомиться! 😊 Как прошёл ваш день?",
      hint: "Хорошо, спасибо что спросили. А как ваш?",
    },
    {
      trigger: ["хорошо", "отлично", "прекрасно", "нормально"],
      response: "Замечательно! 🌟 Чем любите заниматься в свободное время?",
      hint: "Я люблю читать книги и смотреть фильмы. Ещё люблю гулять.",
    },
    {
      trigger: ["работа", "работаю", "профессия"],
      response:
        "Звучит очень интересно! 💼 Что вам больше всего нравится в работе?",
      hint: "Мне очень нравятся творческие аспекты и знакомство с новыми людьми.",
    },
    {
      trigger: ["погода", "день", "сегодня"],
      response: "Да, действительно хороший день! ☀️ Есть планы на выходные?",
      hint: "Планирую встретиться с друзьями и может быть пойти в парк.",
    },
    {
      trigger: ["выходные", "планы", "свободное время"],
      response:
        "Звучит здорово! 🎉 Я тоже люблю проводить время с друзьями. Что обычно делаете вместе?",
      hint: "Обычно смотрим фильмы, ходим в рестораны или просто болтаем и делимся новостями.",
    },
    {
      trigger: ["семья", "родители", "брат", "сестра"],
      response:
        "Семья очень важна! 👨‍👩‍👧‍👦 Расскажите о своей семье. Есть ли у вас братья или сёстры?",
      hint: "У меня есть одна сестра и один брат. Мы очень близки и много времени проводим вместе.",
    },
    {
      trigger: ["учёба", "школа", "университет", "студент"],
      response:
        "Образование увлекательно! 📚 Что изучаете? Какой ваш любимый предмет?",
      hint: "Я изучаю информатику и мне очень нравится программирование и математика.",
    },
    {
      trigger: ["путешествие", "отпуск", "поездка"],
      response:
        "Я люблю говорить о путешествиях! ✈️ Где было самое интересное место, которое вы посетили?",
      hint: "Я ездил в Японию в прошлом году, и это было потрясающе. Культура была очень отличной.",
    },
    {
      trigger: ["еда", "готовка", "ресторан"],
      response:
        "Еда - одно из величайших удовольствий жизни! 🍕 Какая ваша любимая кухня?",
      hint: "Я люблю итальянскую кухню, особенно пасту и пиццу. Также люблю пробовать новые блюда.",
    },
  ],
};

// Default responses when no triggers match
export const defaultResponse = {
  english: {
    response:
      "That's really interesting! 🤔 Could you tell me more about that?",
    hint: "I'd be happy to share more details about it with you.",
  },
  russian: {
    response:
      "Это действительно интересно! 🤔 Можете рассказать об этом подробнее?",
    hint: "Я с удовольствием поделюсь подробностями об этом.",
  },
};

// Fallback responses for when API is unavailable
export const fallbackResponses = {
  english: [
    "That's really interesting! Can you tell me more about that? 😊",
    "I love hearing about that! What else would you like to share?",
    "How fascinating! What do you think about it?",
    "That sounds great! How did that make you feel?",
    "Wonderful! I'd love to know more details about that.",
    "That's so cool! What inspired you to get into that? 🌟",
    "Amazing! How long have you been doing that?",
    "That sounds like a great experience! What was the best part?",
    "Interesting! Have you always enjoyed that?",
    "That's awesome! What would you recommend for someone just starting?",
  ],
  russian: [
    "Это действительно интересно! Можете рассказать мне больше об этом? 😊",
    "Мне нравится слышать об этом! Чем еще хотели бы поделиться?",
    "Как увлекательно! Что вы думаете об этом?",
    "Звучит здорово! Как это заставило вас чувствовать?",
    "Замечательно! Я хотел бы узнать больше подробностей об этом.",
    "Это так круто! Что вдохновило вас заняться этим? 🌟",
    "Потрясающе! Как долго вы этим занимаетесь?",
    "Звучит как отличный опыт! Что было самым лучшим?",
    "Интересно! Вам это всегда нравилось?",
    "Это потрясающе! Что бы вы посоветовали новичку?",
  ],
};

// Fallback hints for user responses
export const fallbackHints = {
  english: [
    "I think it was really exciting and I learned a lot from the experience.",
    "Well, it made me feel quite happy and I enjoyed every moment of it.",
    "Honestly, it was challenging but very rewarding in the end.",
    "It was a new experience for me and I found it quite interesting.",
    "I believe it helped me grow as a person and understand things better.",
    "Actually, it started as a hobby but now I'm really passionate about it.",
    "I've been doing it for about two years now and I love every minute.",
    "The best part was probably meeting so many amazing people along the way.",
    "Yes, I've always been drawn to creative and challenging activities.",
    "I'd suggest starting small and not being afraid to make mistakes at first.",
  ],
  russian: [
    "Я думаю, это было очень увлекательно, и я многому научился из этого опыта.",
    "Ну, это сделало меня довольно счастливым, и я наслаждался каждым моментом.",
    "Честно говоря, это было сложно, но очень полезно в конце концов.",
    "Это был новый опыт для меня, и я нашел его довольно интересным.",
    "Я считаю, что это помогло мне расти как личности и лучше понимать вещи.",
    "На самом деле, это началось как хобби, но теперь я действительно увлечен этим.",
    "Я занимаюсь этим уже около двух лет и люблю каждую минуту.",
    "Лучшей частью было, наверное, знакомство с таким количеством замечательных людей.",
    "Да, меня всегда привлекала творческая и сложная деятельность.",
    "Я бы посоветовал начинать с малого и не бояться сначала делать ошибки.",
  ],
};

// UI text translations
export const uiText = {
  offline: {
    english: "Offline Mode",
    russian: "Офлайн режим",
  },
  clickToTranslate: {
    english: "Click to translate",
    russian: "Нажми для перевода",
  },
  thinking: {
    english: "Thinking...",
    russian: "Думаю...",
  },
  startingConversation: {
    english: "Starting conversation...",
    russian: "Начинаем разговор...",
  },
  typeResponse: {
    english: "Type your response...",
    russian: "Напишите ваш ответ...",
  },
  conversationPractice: {
    english: "Conversation practice",
    russian: "Практика разговоров",
  },
  languageSettings: {
    english: "Language Settings",
    russian: "Настройки языка",
  },
  chooseLanguage: {
    english: "Choose your learning language",
    russian: "Выберите язык для изучения",
  },
  practiceEnglish: {
    english: "Practice English conversation",
    russian: "Practice English conversation",
  },
  practiceRussian: {
    english: "Практика русского языка",
    russian: "Практика русского языка",
  },
};

// Helper function to get a random fallback response
export const getRandomFallbackResponse = (language) => {
  const responses = fallbackResponses[language] || fallbackResponses.english;
  const hints = fallbackHints[language] || fallbackHints.english;
  const randomIndex = Math.floor(Math.random() * responses.length);

  return {
    message: responses[randomIndex],
    hint: hints[randomIndex],
  };
};

// Helper function to get offline response based on user input
export const getOfflineResponse = (
  userMessage,
  language,
  personality = "friend"
) => {
  const lowerMessage = userMessage.toLowerCase();
  const responses = offlineResponses[language] || offlineResponses.english;

  for (const responseData of responses) {
    for (const trigger of responseData.trigger) {
      if (lowerMessage.includes(trigger.toLowerCase())) {
        return {
          message: responseData.response,
          hint: responseData.hint,
        };
      }
    }
  }

  // Return personality-specific default response if no trigger matches
  const defaultLang = language === "russian" ? "russian" : "english";
  const personalityDefaults = getPersonalityDefaults(personality, defaultLang);
  return personalityDefaults || defaultResponse[defaultLang];
};

// Get personality-specific default responses
const getPersonalityDefaults = (personality, language) => {
  const defaults = {
    friend: {
      english: {
        response: "That's cool! 😊 Tell me more about that!",
        hint: "Yeah, it's really interesting and I enjoy it a lot.",
      },
      russian: {
        response: "Это круто! 😊 Расскажи мне больше об этом!",
        hint: "Да, это действительно интересно, и мне это очень нравится.",
      },
    },
    girlfriend: {
      english: {
        response:
          "Aww, that sounds lovely babe! 💕 How did that make you feel?",
        hint: "It made me really happy, and I was thinking of you the whole time.",
      },
      russian: {
        response: "Ой, это звучит мило, дорогой! 💕 Как ты себя чувствовал?",
        hint: "Это сделало меня очень счастливой, и я думала о тебе все время.",
      },
    },
    boyfriend: {
      english: {
        response: "That's awesome, beautiful! 😍 I'm proud of you!",
        hint: "Thank you so much, love! Your support means everything to me.",
      },
      russian: {
        response: "Это потрясающе, красавица! 😍 Я горжусь тобой!",
        hint: "Спасибо тебе большое, любимый! Твоя поддержка значит для меня все.",
      },
    },
    parent: {
      english: {
        response:
          "That's good to hear, honey! 🤗 Make sure you're taking care of yourself!",
        hint: "Don't worry, I'm eating well and getting enough sleep.",
      },
      russian: {
        response:
          "Приятно слышать, дорогой! 🤗 Убедись, что ты заботишься о себе!",
        hint: "Не волнуйся, я хорошо питаюсь и достаточно сплю.",
      },
    },
    stranger: {
      english: {
        response: "That's interesting! Nice to learn something new about you.",
        hint: "Yes, it's something I've been doing for a while now.",
      },
      russian: {
        response: "Это интересно! Приятно узнать что-то новое о вас.",
        hint: "Да, этим я занимаюсь уже некоторое время.",
      },
    },
    boss: {
      english: {
        response: "Good work. Keep me updated on your progress.",
        hint: "Absolutely, I'll send you a status report by end of day.",
      },
      russian: {
        response: "Хорошая работа. Держите меня в курсе вашего прогресса.",
        hint: "Конечно, я пришлю вам отчет о статусе к концу дня.",
      },
    },
    subordinate: {
      english: {
        response:
          "Thank you for sharing that! Could you give me some guidance on this?",
        hint: "Sure, I'd be happy to help. What specifically do you need assistance with?",
      },
      russian: {
        response:
          "Спасибо, что поделились! Можете дать мне совет по этому поводу?",
        hint: "Конечно, я буду рад помочь. В чем конкретно вам нужна помощь?",
      },
    },
    younger_friend: {
      english: {
        response:
          "Wow, that's so cool! 🌟 You're amazing! What should I do in that situation?",
        hint: "Well, from my experience, I'd suggest taking it step by step.",
      },
      russian: {
        response:
          "Вау, это так круто! 🌟 Ты потрясающий! Что мне делать в такой ситуации?",
        hint: "Ну, из моего опыта, я бы посоветовал действовать пошагово.",
      },
    },
  };

  return defaults[personality]?.[language];
};

// Helper function for local translation
export const translateLocally = (text, targetLanguage) => {
  const trimmedText = text.trim();

  // Try exact match in phraseTranslations first - this is the most accurate
  const currentLang = targetLanguage === "russian" ? "english" : "russian";
  if (
    phraseTranslations[currentLang] &&
    phraseTranslations[currentLang][trimmedText]
  ) {
    return phraseTranslations[currentLang][trimmedText];
  }

  // Try exact match in basic translations (case-insensitive for single words)
  const lowerText = trimmedText.toLowerCase();
  if (translations[lowerText]) {
    return translations[lowerText][targetLanguage] || trimmedText;
  }

  // Only try partial matches for longer phrases (more than 2 words)
  const wordCount = trimmedText.split(" ").length;
  if (wordCount > 2) {
    for (const [key, value] of Object.entries(
      phraseTranslations[currentLang] || {}
    )) {
      if (trimmedText.includes(key) || key.includes(trimmedText)) {
        return value;
      }
    }
  }

  // If no good translation found, indicate unavailability
  const unavailableText =
    targetLanguage === "russian"
      ? " (перевод недоступен)"
      : " (translation unavailable)";
  return trimmedText + unavailableText;
};

// Conversation starters for different languages
export const conversationStarters = {
  english: [
    "Hi!",
    "Hello!",
    "Hey there!",
    "Good morning!",
    "Good afternoon!",
    "Good evening!",
    "What's up?",
    "How's it going?",
    "How are you?",
    "Nice to meet you!",
    "How are you today?",
    "How's your day?",
    "What's new?",
    "How have you been?",
    "Hope you're doing well!",
  ],
  russian: [
    "Привет!",
    "Здравствуйте!",
    "Здорово!",
    "Доброе утро!",
    "Добрый день!",
    "Добрый вечер!",
    "Как дела?",
    "Как поживаете?",
    "Как вы?",
    "Приятно познакомиться!",
    "Как дела сегодня?",
    "Как ваш день?",
    "Что нового?",
    "Как поживали?",
    "Надеюсь, у вас все хорошо!",
  ],
};

// Get initial hint based on language - returns a random conversation starter
export const getInitialHint = (language) => {
  const starters =
    conversationStarters[language] || conversationStarters.english;
  const randomIndex = Math.floor(Math.random() * starters.length);
  return starters[randomIndex];
};
