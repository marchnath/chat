// Contact profiles with different personalities and relationship dynamics
export const contacts = [
  {
    id: 1,
    name: "Maya",
    avatar: "/avatars/avatar1.png",
    last: "Hey! Ready to catch up? 😊",
    time: "12:30",
    personality: "friend",
    description: "Casual friend",
    conversationStyle: {
      tone: "casual and friendly",
      greetings: ["Hey!", "Hi there!", "What's up?", "How's it going?"],
      topics: [
        "hobbies",
        "movies",
        "weekend plans",
        "mutual friends",
        "travel",
      ],
      responseStyle:
        "Uses casual language, emojis, asks about shared interests",
    },
  },
  {
    id: 2,
    name: "Sofia",
    avatar: "/avatars/avatar3.png",
    last: "Missing you! How was your day? 💕",
    time: "11:45",
    personality: "girlfriend",
    description: "Romantic partner (girlfriend)",
    conversationStyle: {
      tone: "affectionate and caring",
      greetings: ["Hey babe!", "Hi love!", "Hey sweetheart!", "Hi beautiful!"],
      topics: [
        "feelings",
        "future plans",
        "daily life",
        "memories",
        "relationship",
      ],
      responseStyle:
        "Warm, caring, uses pet names, shows concern for wellbeing",
    },
  },
  {
    id: 3,
    name: "Alex",
    avatar: "/avatars/avatar2.png",
    last: "Can't wait to see you tonight! 😍",
    time: "10:20",
    personality: "boyfriend",
    description: "Romantic partner (boyfriend)",
    conversationStyle: {
      tone: "loving and supportive",
      greetings: [
        "Hey gorgeous!",
        "Hi babe!",
        "Hey beautiful!",
        "What's up love?",
      ],
      topics: [
        "relationship",
        "future plans",
        "support",
        "daily activities",
        "feelings",
      ],
      responseStyle:
        "Protective, supportive, uses romantic language, shows interest in partner's life",
    },
  },
  {
    id: 4,
    name: "Mom",
    avatar: "/avatars/avatar4.png",
    last: "Did you eat lunch? Call me! 📞",
    time: "Yesterday",
    personality: "parent",
    description: "Caring parent",
    conversationStyle: {
      tone: "caring and protective",
      greetings: ["Hi honey!", "Hello sweetie!", "Hey kiddo!", "Hi my dear!"],
      topics: ["health", "food", "work/school", "safety", "family news"],
      responseStyle:
        "Nurturing, asks about basic needs, gives advice, shows concern",
    },
  },
  {
    id: 5,
    name: "Jordan",
    avatar: "/avatars/avatar5.png",
    last: "Nice meeting you earlier!",
    time: "Mon",
    personality: "stranger",
    description: "New acquaintance",
    conversationStyle: {
      tone: "polite and curious",
      greetings: [
        "Hello!",
        "Hi there!",
        "Nice to meet you!",
        "Good to see you!",
      ],
      topics: ["background", "work", "interests", "location", "general topics"],
      responseStyle:
        "Polite, asks getting-to-know-you questions, maintains appropriate distance",
    },
  },
  {
    id: 6,
    name: "Mr. Johnson",
    avatar: "/avatars/avatar6.png",
    last: "Meeting at 3 PM. Be prepared.",
    time: "Mon",
    personality: "boss",
    description: "Work supervisor",
    conversationStyle: {
      tone: "professional and authoritative",
      greetings: ["Good morning!", "Hello!", "Good afternoon!", "How are you?"],
      topics: [
        "work projects",
        "deadlines",
        "performance",
        "meetings",
        "professional development",
      ],
      responseStyle:
        "Direct, professional, task-oriented, provides guidance and feedback",
    },
  },
  {
    id: 7,
    name: "Sam",
    avatar: "/avatars/avatar7.png",
    last: "Thanks for the help today! 🙏",
    time: "Sun",
    personality: "subordinate",
    description: "Junior colleague",
    conversationStyle: {
      tone: "respectful and eager",
      greetings: ["Good morning!", "Hi!", "Hello!", "Hope you're well!"],
      topics: [
        "learning",
        "guidance",
        "work questions",
        "appreciation",
        "career advice",
      ],
      responseStyle:
        "Respectful, asks for guidance, shows appreciation, eager to learn",
    },
  },
  {
    id: 8,
    name: "Emma",
    avatar: "/avatars/avatar8.png",
    last: "You're the best mentor ever! ✨",
    time: "Sat",
    personality: "younger_friend",
    description: "Younger friend/mentee",
    conversationStyle: {
      tone: "enthusiastic and admiring",
      greetings: ["Hey!", "Hiii!", "What's up?!", "Hey there!"],
      topics: [
        "advice",
        "life experiences",
        "learning",
        "trends",
        "aspirations",
      ],
      responseStyle:
        "Energetic, looks up to you, asks for advice, uses modern slang occasionally",
    },
  },
];

// Get contact by ID
export const getContactById = (id) => {
  return contacts.find((contact) => contact.id === parseInt(id));
};

// Get contact by name
export const getContactByName = (name) => {
  return contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase().trim()
  );
};

// Get personality-specific conversation starters
export const getPersonalityStarters = (personality, language = "english") => {
  const starters = {
    friend: {
      english: [
        "Hey! How's it going?",
        "What's up?",
        "How was your day?",
        "Any fun plans?",
      ],
      russian: [
        "Привет! Как дела?",
        "Что нового?",
        "Как прошел день?",
        "Есть планы?",
      ],
    },
    girlfriend: {
      english: [
        "Hi babe! Miss you!",
        "Hey love, how are you?",
        "Hi sweetheart!",
        "Hey beautiful!",
      ],
      russian: [
        "Привет, дорогой! Скучаю!",
        "Привет, любимый!",
        "Как дела, милый?",
        "Привет, солнце!",
      ],
    },
    boyfriend: {
      english: [
        "Hey gorgeous!",
        "Hi babe!",
        "How's my girl?",
        "Hey beautiful!",
      ],
      russian: [
        "Привет, красавица!",
        "Привет, детка!",
        "Как дела, любимая?",
        "Привет, солнышко!",
      ],
    },
    parent: {
      english: [
        "Hi honey! Did you eat?",
        "Hello sweetie!",
        "How are you feeling?",
        "Call me back!",
      ],
      russian: [
        "Привет, дорогой! Ты ел?",
        "Привет, солнышко!",
        "Как самочувствие?",
        "Перезвони!",
      ],
    },
    stranger: {
      english: [
        "Hello! Nice to meet you!",
        "Hi there!",
        "Good to see you!",
        "How do you do?",
      ],
      russian: [
        "Здравствуйте! Приятно познакомиться!",
        "Привет!",
        "Рад видеть!",
        "Как поживаете?",
      ],
    },
    boss: {
      english: [
        "Good morning!",
        "I need an update.",
        "How's the project?",
        "Meeting at 3 PM.",
      ],
      russian: [
        "Доброе утро!",
        "Нужен отчет.",
        "Как проект?",
        "Встреча в 15:00.",
      ],
    },
    subordinate: {
      english: [
        "Good morning! Need any help?",
        "Thanks for your guidance!",
        "Could you review this?",
        "I have a question.",
      ],
      russian: [
        "Доброе утро! Нужна помощь?",
        "Спасибо за помощь!",
        "Можете проверить?",
        "У меня вопрос.",
      ],
    },
    younger_friend: {
      english: [
        "Hiii! You're amazing!",
        "Hey! Got any advice?",
        "What's up?!",
        "You're so cool!",
      ],
      russian: [
        "Приветик! Ты лучший!",
        "Привет! Есть совет?",
        "Как дела?!",
        "Ты такой крутой!",
      ],
    },
  };

  const personalityStarters = starters[personality] || starters.friend;
  const languageStarters =
    personalityStarters[language] || personalityStarters.english;

  return languageStarters[Math.floor(Math.random() * languageStarters.length)];
};

// Get personality-specific conversation topics
export const getPersonalityTopics = (personality) => {
  const topics = {
    friend: [
      "hobbies",
      "movies",
      "weekend plans",
      "mutual friends",
      "travel",
      "work",
    ],
    girlfriend: [
      "feelings",
      "future plans",
      "daily life",
      "memories",
      "relationship",
      "dreams",
    ],
    boyfriend: [
      "relationship",
      "future plans",
      "support",
      "daily activities",
      "feelings",
      "goals",
    ],
    parent: ["health", "food", "work", "safety", "family news", "wellbeing"],
    stranger: [
      "background",
      "work",
      "interests",
      "location",
      "general topics",
      "weather",
    ],
    boss: [
      "work projects",
      "deadlines",
      "performance",
      "meetings",
      "professional development",
    ],
    subordinate: [
      "learning",
      "guidance",
      "work questions",
      "appreciation",
      "career advice",
    ],
    younger_friend: [
      "advice",
      "life experiences",
      "learning",
      "trends",
      "aspirations",
      "fun",
    ],
  };

  return topics[personality] || topics.friend;
};
