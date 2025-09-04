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
  },
  {
    id: 2,
    name: "Sofia",
    avatar: "/avatars/avatar3.png",
    last: "Missing you! How was your day? 💕",
    time: "11:45",
    personality: "girlfriend",
    description: "Romantic partner (girlfriend)",
  },
  {
    id: 3,
    name: "Alex",
    avatar: "/avatars/avatar2.png",
    last: "Can't wait to see you tonight! 😍",
    time: "10:20",
    personality: "boyfriend",
    description: "Romantic partner (boyfriend)",
  },
  {
    id: 4,
    name: "Mom",
    avatar: "/avatars/avatar4.png",
    last: "Did you eat lunch? Call me! 📞",
    time: "Yesterday",
    personality: "parent",
    description: "Caring parent",
  },
  {
    id: 5,
    name: "Jordan",
    avatar: "/avatars/avatar5.png",
    last: "Nice meeting you earlier!",
    time: "Mon",
    personality: "stranger",
    description: "New acquaintance",
  },
  {
    id: 6,
    name: "Mr. Johnson",
    avatar: "/avatars/avatar6.png",
    last: "Meeting at 3 PM. Be prepared.",
    time: "Mon",
    personality: "boss",
    description: "Work supervisor",
  },
  {
    id: 7,
    name: "Sam",
    avatar: "/avatars/avatar7.png",
    last: "Thanks for the help today! 🙏",
    time: "Sun",
    personality: "subordinate",
    description: "Junior colleague",
  },
  {
    id: 8,
    name: "Emma",
    avatar: "/avatars/avatar8.png",
    last: "You're the best mentor ever! ✨",
    time: "Sat",
    personality: "younger_friend",
    description: "Younger friend/mentee",
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
        "¿Tienes planes divertidos?",
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
    girlfriend: {
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
    boyfriend: {
      english: [
        "Hey gorgeous!",
        "Hi babe!",
        "How's my girl?",
        "Hey beautiful!",
      ],
      spanish: [
        "¡Hola preciosa!",
        "¡Hola nena!",
        "¿Cómo está mi chica?",
        "¡Hola hermosa!",
      ],
      french: [
        "Salut ma belle !",
        "Salut bébé !",
        "Comment va ma fille ?",
        "Salut magnifique !",
      ],
      german: [
        "Hey Schönheit!",
        "Hallo Schatz!",
        "Wie geht's meinem Mädchen?",
        "Hey Wunderschöne!",
      ],
      italian: [
        "Ciao bellissima!",
        "Ciao tesoro!",
        "Come sta la mia ragazza?",
        "Ciao bella!",
      ],
      portuguese: [
        "Oi linda!",
        "Oi gata!",
        "Como está minha garota?",
        "Oi princesa!",
      ],
      russian: [
        "Привет, красавица!",
        "Привет, детка!",
        "Как дела, любимая?",
        "Привет, солнышко!",
      ],
      japanese: [
        "こんにちは、美しい人！",
        "こんにちは、ベイビー！",
        "僕の女の子、元気？",
        "こんにちは、きれいな人！",
      ],
      korean: [
        "안녕 예쁜이!",
        "안녕 자기야!",
        "내 여자친구 어떻게 지내?",
        "안녕 미인!",
      ],
      chinese: ["嗨美女！", "嗨宝贝！", "我的女孩怎么样？", "嗨漂亮的！"],
      arabic: [
        "مرحبا جميلتي!",
        "مرحبا حبيبتي!",
        "كيف فتاتي؟",
        "مرحبا يا جميلة!",
      ],
    },
    parent: {
      english: [
        "Hi honey! Did you eat?",
        "Hello sweetie!",
        "How are you feeling?",
        "Call me back!",
      ],
      spanish: [
        "¡Hola cariño! ¿Ya comiste?",
        "¡Hola mi amor!",
        "¿Cómo te sientes?",
        "¡Llámame!",
      ],
      french: [
        "Salut chéri ! As-tu mangé ?",
        "Salut ma puce !",
        "Comment te sens-tu ?",
        "Rappelle-moi !",
      ],
      german: [
        "Hallo Schatz! Hast du gegessen?",
        "Hallo mein Süßer!",
        "Wie fühlst du dich?",
        "Ruf mich zurück!",
      ],
      italian: [
        "Ciao tesoro! Hai mangiato?",
        "Ciao caro!",
        "Come ti senti?",
        "Richiamami!",
      ],
      portuguese: [
        "Oi querido! Você comeu?",
        "Oi docinho!",
        "Como você está se sentindo?",
        "Me ligue de volta!",
      ],
      russian: [
        "Привет, дорогой! Ты ел?",
        "Привет, солнышко!",
        "Как самочувствие?",
        "Перезвони!",
      ],
      japanese: [
        "こんにちは、お疲れ様！食べた？",
        "こんにちは、スイートハート！",
        "体調はどう？",
        "電話して！",
      ],
      korean: [
        "안녕 자기야! 밥 먹었어?",
        "안녕 사랑!",
        "몸은 어때?",
        "다시 전화해!",
      ],
      chinese: [
        "嗨宝贝！你吃了吗？",
        "你好甜心！",
        "你感觉怎么样？",
        "给我回电话！",
      ],
      arabic: [
        "مرحبا عزيزي! هل أكلت؟",
        "مرحبا يا حلو!",
        "كيف تشعر؟",
        "اتصل بي مرة أخرى!",
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
    boss: {
      english: [
        "Good morning!",
        "I need an update.",
        "How's the project?",
        "Meeting at 3 PM.",
      ],
      spanish: [
        "¡Buenos días!",
        "Necesito una actualización.",
        "¿Cómo va el proyecto?",
        "Reunión a las 3 PM.",
      ],
      french: [
        "Bonjour !",
        "J'ai besoin d'une mise à jour.",
        "Comment va le projet ?",
        "Réunion à 15h.",
      ],
      german: [
        "Guten Morgen!",
        "Ich brauche ein Update.",
        "Wie läuft das Projekt?",
        "Meeting um 15 Uhr.",
      ],
      italian: [
        "Buongiorno!",
        "Ho bisogno di un aggiornamento.",
        "Come va il progetto?",
        "Riunione alle 15:00.",
      ],
      portuguese: [
        "Bom dia!",
        "Preciso de uma atualização.",
        "Como está o projeto?",
        "Reunião às 15h.",
      ],
      russian: [
        "Доброе утро!",
        "Нужен отчет.",
        "Как проект?",
        "Встреча в 15:00.",
      ],
      japanese: [
        "おはようございます！",
        "アップデートが必要です。",
        "プロジェクトの調子はどうですか？",
        "午後3時にミーティングです。",
      ],
      korean: [
        "좋은 아침!",
        "업데이트가 필요합니다.",
        "프로젝트는 어떻게 되고 있나요?",
        "오후 3시에 회의입니다.",
      ],
      chinese: [
        "早上好！",
        "我需要一个更新。",
        "项目怎么样？",
        "下午3点开会。",
      ],
      arabic: [
        "صباح الخير!",
        "أحتاج تحديثاً.",
        "كيف المشروع؟",
        "اجتماع في الساعة 3 مساءً.",
      ],
    },
    subordinate: {
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
    younger_friend: {
      english: [
        "Hiii! You're amazing!",
        "Hey! Got any advice?",
        "What's up?!",
        "You're so cool!",
      ],
      spanish: [
        "¡Holaaa! ¡Eres increíble!",
        "¡Oye! ¿Tienes algún consejo?",
        "¡¿Qué tal?!",
        "¡Eres genial!",
      ],
      french: [
        "Salut ! Tu es formidable !",
        "Hey ! Des conseils ?",
        "Quoi de neuf ?!",
        "Tu es si cool !",
      ],
      german: [
        "Hiii! Du bist fantastisch!",
        "Hey! Hast du einen Rat?",
        "Was geht?!",
        "Du bist so cool!",
      ],
      italian: [
        "Ciaoo! Sei fantastico!",
        "Ehi! Hai qualche consiglio?",
        "Che fai?!",
        "Sei così figo!",
      ],
      portuguese: [
        "Oiii! Você é incrível!",
        "Oi! Tem algum conselho?",
        "E aí?!",
        "Você é demais!",
      ],
      russian: [
        "Приветик! Ты лучший!",
        "Привет! Есть совет?",
        "Как дела?!",
        "Ты такой крутой!",
      ],
      japanese: [
        "こんにちは！あなたは素晴らしい！",
        "ねえ！何かアドバイスある？",
        "元気？！",
        "あなたってクール！",
      ],
      korean: [
        "안녕! 너 정말 대단해!",
        "야! 조언 있어?",
        "뭐해?!",
        "너 정말 멋져!",
      ],
      chinese: [
        "嗨！你太棒了！",
        "嘿！有什么建议吗？",
        "怎么样？！",
        "你太酷了！",
      ],
      arabic: [
        "مرحباً! أنت رائع!",
        "مرحبا! عندك نصيحة؟",
        "ما الأخبار؟!",
        "أنت رائع جداً!",
      ],
    },
  };

  const personalityStarters = starters[personality] || starters.friend;
  const languageStarters =
    personalityStarters[language] || personalityStarters.english;

  return languageStarters[Math.floor(Math.random() * languageStarters.length)];
};
