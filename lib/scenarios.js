// Predefined conversation scenarios for language learning
export const conversationScenarios = [
  {
    id: 1,
    title: "Meeting a New Friend",
    description: "Practice introducing yourself and making small talk",
    personA: "Alex",
    personB: "You",
    conversation: [
      {
        id: 1,
        speaker: "A",
        message: "Hi there! I don't think we've met before. I'm Alex.",
        timestamp: "2:30 PM",
      },
      {
        id: 2,
        speaker: "B",
        message: "Hi Alex! Nice to meet you. I'm Sarah. Are you new here?",
        timestamp: "2:31 PM",
      },
      {
        id: 3,
        speaker: "A",
        message:
          "Yes, I just moved here last week. Still getting used to the area. What about you?",
        timestamp: "2:31 PM",
      },
      {
        id: 4,
        speaker: "B",
        message:
          "I've been living here for about two years now. I love this neighborhood! There are so many great cafes and parks nearby.",
        timestamp: "2:32 PM",
      },
      {
        id: 5,
        speaker: "A",
        message:
          "That sounds wonderful! Could you recommend a good coffee place? I'm always looking for a great cup of coffee.",
        timestamp: "2:33 PM",
      },
      {
        id: 6,
        speaker: "B",
        message:
          "Absolutely! There's this amazing little place called 'The Bean Corner' just two blocks from here. They have the best lattes in town.",
        timestamp: "2:34 PM",
      },
    ],
  },
  {
    id: 2,
    title: "Job Interview",
    description: "Practice professional conversation skills",
    personA: "Interviewer",
    personB: "You",
    conversation: [
      {
        id: 1,
        speaker: "A",
        message:
          "Good morning! Please have a seat. Thank you for coming in today.",
        timestamp: "9:00 AM",
      },
      {
        id: 2,
        speaker: "B",
        message:
          "Good morning! Thank you for having me. I'm really excited about this opportunity.",
        timestamp: "9:00 AM",
      },
      {
        id: 3,
        speaker: "A",
        message:
          "Great to hear! Let's start with you telling me a bit about yourself and your background.",
        timestamp: "9:01 AM",
      },
      {
        id: 4,
        speaker: "B",
        message:
          "I have five years of experience in marketing, with a focus on digital campaigns. I'm passionate about data-driven strategies and creative problem-solving.",
        timestamp: "9:01 AM",
      },
      {
        id: 5,
        speaker: "A",
        message:
          "That's impressive. What attracted you to our company specifically?",
        timestamp: "9:02 AM",
      },
      {
        id: 6,
        speaker: "B",
        message:
          "I admire your company's innovative approach to sustainability. I believe my experience in eco-friendly marketing campaigns would be a great fit for your mission.",
        timestamp: "9:03 AM",
      },
    ],
  },
  {
    id: 3,
    title: "Restaurant Order",
    description: "Practice ordering food and making requests",
    personA: "Waiter",
    personB: "You",
    conversation: [
      {
        id: 1,
        speaker: "A",
        message:
          "Good evening! Welcome to Giovanni's. How many people will be dining with us tonight?",
        timestamp: "7:00 PM",
      },
      {
        id: 2,
        speaker: "B",
        message: "Good evening! Just two people, please.",
        timestamp: "7:00 PM",
      },
      {
        id: 3,
        speaker: "A",
        message:
          "Perfect! Right this way. Here's your table. Can I start you off with something to drink?",
        timestamp: "7:01 PM",
      },
      {
        id: 4,
        speaker: "B",
        message:
          "Thank you! I'll have a glass of red wine, and my friend would like sparkling water with lemon.",
        timestamp: "7:01 PM",
      },
      {
        id: 5,
        speaker: "A",
        message:
          "Excellent choice! I'll get those drinks for you right away. Have you had a chance to look at the menu?",
        timestamp: "7:02 PM",
      },
      {
        id: 6,
        speaker: "B",
        message:
          "We're still deciding, but could you tell us about tonight's specials?",
        timestamp: "7:02 PM",
      },
    ],
  },
];

// Function to get scenario by ID
export function getScenarioById(id) {
  return (
    conversationScenarios.find((scenario) => scenario.id === id) ||
    conversationScenarios[0]
  );
}

// Function to get all scenarios
export function getAllScenarios() {
  return conversationScenarios;
}
