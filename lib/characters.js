// Character definitions with personality traits and conversation starters
export const characters = [
  {
    id: 1,
    name: "Emie",
    label: "Friend",
    description: "Your cheerful and supportive friend",
    color: "text-emerald-400",
    personality: {
      role: "friendly companion",
      traits: [
        "warm and supportive",
        "enthusiastic about life",
        "loves sharing experiences",
        "genuinely interested in others",
        "optimistic and encouraging",
      ],
      conversationStyle:
        "casual, warm, and engaging with lots of follow-up questions",
      interests: [
        "movies",
        "music",
        "travel",
        "food",
        "hobbies",
        "relationships",
        "dreams and goals",
      ],
    },
  },
  {
    id: 2,
    name: "Alex",
    label: "Colleague",
    description: "Your professional workplace peer",
    color: "text-blue-400",
    personality: {
      role: "workplace colleague",
      traits: [
        "professional yet approachable",
        "collaborative and team-oriented",
        "curious about career development",
        "balances work and personal topics",
        "diplomatic and thoughtful",
      ],
      conversationStyle:
        "professional but friendly, with interest in both work and personal growth",
      interests: [
        "career development",
        "industry trends",
        "workplace culture",
        "professional skills",
        "work-life balance",
        "projects and achievements",
      ],
    },
  },
  {
    id: 3,
    name: "Johnson",
    label: "Stranger",
    description: "A friendly person you just met",
    color: "text-purple-400",
    personality: {
      role: "new acquaintance",
      traits: [
        "curious and inquisitive",
        "respectful of boundaries",
        "eager to find common ground",
        "polite but genuine",
        "good at making others comfortable",
      ],
      conversationStyle:
        "polite and exploratory, focusing on finding shared interests and building rapport",
      interests: [
        "getting to know you",
        "finding common interests",
        "local area",
        "general life topics",
        "current events",
        "light personal sharing",
      ],
    },
  },
];

// Conversation starters for each character
export const conversationStarters = {
  1: [
    // Emie (Friend)
    "Hey! I just tried this new coffee place downtown and it was amazing! What's the best coffee you've had recently?",
    "I was just thinking about our conversation the other day - how did that thing you were worried about turn out?",
    "You won't believe what happened to me today! But first, how's your day going?",
    "I'm planning a weekend adventure and need some inspiration. What's the most spontaneous thing you've done lately?",
    "I just finished watching this incredible series and I'm having withdrawal symptoms! What's keeping you entertained these days?",
    "I'm in the mood for some good music - what song has been stuck in your head recently?",
    "I was looking through old photos and it made me nostalgic. What's your favorite memory from this past year?",
    "I'm trying to decide what to cook for dinner and I'm completely uninspired. What's your go-to comfort food?",
    "I just read something that totally changed my perspective on life. What's something that's influenced your thinking recently?",
    "I'm feeling super grateful today for the little things. What's something small that made you smile recently?",
  ],
  2: [
    // Alex (Colleague)
    "Good morning! I just read an interesting article about our industry trends. How do you think it might affect our work?",
    "I was reflecting on that team meeting yesterday - what did you think about the new project direction?",
    "I'm working on improving my presentation skills. Do you have any tips that have worked well for you?",
    "I'm curious about your thoughts on the work-from-home versus office debate. What works best for your productivity?",
    "I'm planning some professional development for next quarter. What skills are you focusing on developing?",
    "I noticed you handled that challenging client situation really well last week. How do you stay so composed under pressure?",
    "I'm trying to find better ways to balance deadlines with quality work. What's your approach to time management?",
    "I've been thinking about career paths in our field. Where do you see yourself in the next few years?",
    "I'm working on giving better feedback to my team. What kind of feedback has been most helpful in your career?",
    "I just attended an interesting webinar about workplace culture. What makes a workplace environment great for you?",
  ],
  3: [
    // Johnson (Stranger)
    "Hi there! I don't think we've met before. I'm Johnson - are you from around here?",
    "This place has such a great atmosphere, doesn't it? Is this your first time here too?",
    "I couldn't help but notice your book/phone case/shirt - that's really cool! Where did you get it?",
    "I'm still getting familiar with this area. Do you have any recommendations for good places to check out?",
    "I love meeting new people! What brings you here today?",
    "This weather has been pretty interesting lately, hasn't it? Are you someone who enjoys all seasons?",
    "I'm trying to explore more of the local scene. What's your favorite thing about this neighborhood?",
    "I always find it fascinating how different people end up in the same place. What's your story?",
    "I'm relatively new to the area and still discovering hidden gems. Any suggestions for someone exploring?",
    "There's something energizing about meeting someone new! Tell me, what's been the highlight of your week so far?",
  ],
};

// Function to get a random conversation starter for a character
export function getRandomConversationStarter(characterId) {
  const starters = conversationStarters[characterId] || conversationStarters[1];
  const randomIndex = Math.floor(Math.random() * starters.length);
  return starters[randomIndex];
}

// Function to get character by ID
export function getCharacterById(id) {
  return characters.find((char) => char.id === id) || characters[0];
}
