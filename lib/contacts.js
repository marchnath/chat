// Contact profiles with different personalities and relationship dynamics
export const contacts = [
  {
    id: 1,
    name: "Bond",
    avatar: "/avatars/avatar1.png",
    last: "Shaken, not stirred. 🍸",
    personality: "spouse",
  },
  {
    id: 2,
    name: "Connect",
    avatar: "/avatars/avatar2.png",
    last: "Let's make meaningful connections! 🤝",
    personality: "friend",
  },
  {
    id: 3,
    name: "Gossip",
    avatar: "/avatars/avatar3.png",
    last: "Guess what I just heard! 🕵️",
    personality: "stranger",
  },
  {
    id: 4,
    name: "Sell",
    avatar: "/avatars/avatar4.png",
    last: "This offer is too good to miss! 🤑",
    personality: "colleague",
  },
  {
    id: 5,
    name: "Debate",
    avatar: "/avatars/avatar5.png",
    last: "Let's dive into the pros and cons. ⚖️",
    personality: "client",
  },
  {
    id: 6,
    name: "Question",
    avatar: "/avatars/avatar0.png",
    last: "I was wondering about something... 🤔",
    personality: "neutral",
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
      spanish: [
        "¡Hola! ¿Cómo va todo?",
        "¿Qué tal?",
        "¿Cómo estuvo tu día?",
        "¿Tienes plans divertidos?",
      ],
      french: [
        "Salut ! Comment ça va ?",
        "Quoi de neuf ?",
        "Comment s'est passée ta journée ?",
        "Des projets amusants ?",
      ],
      german: [
        "Hey! Wie läuft's?",
        "Was geht?",
        "Wie war dein Tag?",
        "Lustige Pläne?",
      ],
      italian: [
        "Ciao! Come va?",
        "Che fai?",
        "Com'è stata la giornata?",
        "Hai programmi divertenti?",
      ],
      portuguese: [
        "Oi! Como vai?",
        "E aí?",
        "Como foi seu dia?",
        "Tem planos legais?",
      ],
      russian: [
        "Привет! Как дела?",
        "Что нового?",
        "Как прошел день?",
        "Есть планы?",
      ],
      japanese: [
        "こんにちは！調子はどう？",
        "何してる？",
        "今日はどうだった？",
        "楽しい予定ある？",
      ],
      korean: [
        "안녕! 어떻게 지내?",
        "뭐해?",
        "오늘 어땠어?",
        "재미있는 계획 있어?",
      ],
      chinese: [
        "嗨！你好吗？",
        "在做什么？",
        "你今天怎么样？",
        "有什么有趣的计划吗？",
      ],
      arabic: [
        "مرحبا! كيف الأحوال؟",
        "ما الأخبار؟",
        "كيف كان يومك؟",
        "هل لديك خطط ممتعة؟",
      ],
    },
    spouse: {
      english: [
        "Hi babe! Miss you!",
        "Hey love, how are you?",
        "Hi sweetheart!",
        "Hey beautiful!",
      ],
      spanish: [
        "¡Hola amor! ¡Te extraño!",
        "Hola cariño, ¿cómo estás?",
        "¡Hola corazón!",
        "¡Hola guapo!",
      ],
      french: [
        "Salut chéri ! Tu me manques !",
        "Salut mon amour, comment vas-tu ?",
        "Salut mon cœur !",
        "Salut beau gosse !",
      ],
      german: [
        "Hallo Schatz! Vermisse dich!",
        "Hey Liebling, wie geht's?",
        "Hallo mein Süßer!",
        "Hey Schöner!",
      ],
      italian: [
        "Ciao amore! Mi manchi!",
        "Ciao tesoro, come stai?",
        "Ciao dolcezza!",
        "Ciao bella!",
      ],
      portuguese: [
        "Oi amor! Estou com saudades!",
        "Oi querido, como você está?",
        "Oi docinho!",
        "Oi lindo!",
      ],
      russian: [
        "Привет, дорогой! Скучаю!",
        "Привет, любимый!",
        "Как дела, милый?",
        "Привет, солнце!",
      ],
      japanese: [
        "こんにちは、愛しい人！会いたい！",
        "愛してる、元気？",
        "こんにちは、ハニー！",
        "こんにちは、素敵な人！",
      ],
      korean: [
        "안녕 자기야! 보고싶어!",
        "안녕 사랑, 어떻게 지내?",
        "안녕 달링!",
        "안녕 멋쟁이!",
      ],
      chinese: [
        "嗨宝贝！想你了！",
        "嗨亲爱的，你怎么样？",
        "嗨甜心！",
        "嗨帅哥！",
      ],
      arabic: [
        "مرحبا حبيبي! أشتاق إليك!",
        "مرحبا عزيزي، كيف حالك؟",
        "مرحبا يا عسل!",
        "مرحبا يا وسيم!",
      ],
    },
    stranger: {
      english: [
        "Hello! Nice to meet you!",
        "Hi there!",
        "Good to see you!",
        "How do you do?",
      ],
      spanish: [
        "¡Hola! ¡Mucho gusto!",
        "¡Hola!",
        "¡Qué bueno verte!",
        "¿Cómo está usted?",
      ],
      french: [
        "Bonjour ! Enchanté !",
        "Salut !",
        "Ravi de vous voir !",
        "Comment allez-vous ?",
      ],
      german: [
        "Hallo! Freut mich!",
        "Hallo da!",
        "Schön Sie zu sehen!",
        "Wie geht es Ihnen?",
      ],
      italian: [
        "Salve! Piacere di conoscerti!",
        "Ciao!",
        "Bello vederti!",
        "Come va?",
      ],
      portuguese: [
        "Olá! Prazer em conhecê-lo!",
        "Oi!",
        "Bom te ver!",
        "Como vai?",
      ],
      russian: [
        "Здравствуйте! Приятно познакомиться!",
        "Привет!",
        "Рад видеть!",
        "Как поживаете?",
      ],
      japanese: [
        "こんにちは！はじめまして！",
        "こんにちは！",
        "お会いできてよかった！",
        "いかがですか？",
      ],
      korean: [
        "안녕하세요! 만나서 반가워요!",
        "안녕하세요!",
        "만나서 좋네요!",
        "어떻게 지내세요?",
      ],
      chinese: ["你好！很高兴见到你！", "你好！", "很高兴见到你！", "你好吗？"],
      arabic: ["مرحبا! سعيد بلقائك!", "مرحبا!", "من الجيد رؤيتك!", "كيف حالك؟"],
    },
    colleague: {
      english: [
        "Good morning! Need any help?",
        "Thanks for your guidance!",
        "Could you review this?",
        "I have a question.",
      ],
      spanish: [
        "¡Buenos días! ¿Necesita ayuda?",
        "¡Gracias por su orientación!",
        "¿Podría revisar esto?",
        "Tengo una pregunta.",
      ],
      french: [
        "Bonjour ! Besoin d'aide ?",
        "Merci pour vos conseils !",
        "Pourriez-vous examiner ceci ?",
        "J'ai une question.",
      ],
      german: [
        "Guten Morgen! Brauchen Sie Hilfe?",
        "Danke für Ihre Führung!",
        "Könnten Sie das überprüfen?",
        "Ich habe eine Frage.",
      ],
      italian: [
        "Buongiorno! Serve aiuto?",
        "Grazie per la guida!",
        "Potresti rivedere questo?",
        "Ho una domanda.",
      ],
      portuguese: [
        "Bom dia! Precisa de ajuda?",
        "Obrigado pela orientação!",
        "Poderia revisar isto?",
        "Tenho uma pergunta.",
      ],
      russian: [
        "Доброе утро! Нужна помощь?",
        "Спасибо за помощь!",
        "Можете проверить?",
        "У меня вопрос.",
      ],
      japanese: [
        "おはようございます！何かお手伝いしましょうか？",
        "指導ありがとうございます！",
        "これを確認していただけますか？",
        "質問があります。",
      ],
      korean: [
        "좋은 아침! 도움이 필요하신가요?",
        "지도해 주셔서 감사합니다!",
        "이것을 검토해 주실 수 있나요?",
        "질문이 있습니다.",
      ],
      chinese: [
        "早上好！需要帮助吗？",
        "谢谢您的指导！",
        "您能看看这个吗？",
        "我有个问题。",
      ],
      arabic: [
        "صباح الخير! تحتاج مساعدة؟",
        "شكراً لتوجيهك!",
        "هل يمكنك مراجعة هذا؟",
        "لدي سؤال.",
      ],
    },
    client: {
      english: [
        "Good morning!",
        "I need an update.",
        "How's the project?",
        "Let's discuss the proposal.",
      ],
      spanish: [
        "¡Buenos días!",
        "Necesito una actualización.",
        "¿Cómo va el proyecto?",
        "Hablemos de la propuesta.",
      ],
      french: [
        "Bonjour !",
        "J'ai besoin d'une mise à jour.",
        "Comment va le projet ?",
        "Discutons de la proposition.",
      ],
      german: [
        "Guten Morgen!",
        "Ich brauche ein Update.",
        "Wie läuft das Projekt?",
        "Lassen Sie uns über den Vorschlag sprechen.",
      ],
      italian: [
        "Buongiorno!",
        "Ho bisogno di un aggiornamento.",
        "Come va il progetto?",
        "Parliamo della proposta.",
      ],
      portuguese: [
        "Bom dia!",
        "Preciso de uma atualização.",
        "Como está o projeto?",
        "Vamos discutir a proposta.",
      ],
      russian: [
        "Доброе утро!",
        "Нужен отчет.",
        "Как проект?",
        "Обсудим предложение.",
      ],
      japanese: [
        "おはようございます！",
        "アップデートが必要です。",
        "プロジェクトの調子はどうですか？",
        "提案について話しましょう。",
      ],
      korean: [
        "좋은 아침!",
        "업데이트가 필요합니다.",
        "프로젝트는 어떻게 되고 있나요?",
        "제안에 대해 얘기해봅시다.",
      ],
      chinese: [
        "早上好！",
        "我需要一个更新。",
        "项目怎么样？",
        "我们讨论一下提案吧。",
      ],
      arabic: [
        "صباح الخير!",
        "أحتاج تحديثاً.",
        "كيف المشروع؟",
        "دعونا نناقش الاقتراح.",
      ],
    },
  };

  const personalityStarters = starters[personality] || starters.friend;
  const languageStarters =
    personalityStarters[language] || personalityStarters.english;

  return languageStarters[Math.floor(Math.random() * languageStarters.length)];
};
