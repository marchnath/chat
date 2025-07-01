//app/api/chat/route.js

import { getCharacterById } from "../../../lib/characters";

export async function POST(request) {
  const { message, conversationHistory = [] } = await request.json();

  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    // Get full character data
    // const fullCharacter = getCharacterById(character.id);

    // Build conversation context from history
    const contextMessages = conversationHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    // Create dynamic system prompt based on character
    const systemPrompt = createSystemPrompt();

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...contextMessages.slice(-10), // Keep last 10 messages for context
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 75,
        temperature: 1.3, // Slightly higher for more personality
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    return Response.json({ message: botMessage });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return Response.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}

function createSystemPrompt() {
  return `You are a friendly, engaging conversation partner designed to help users practice their social conversational skills.
IMPORTANT GUIDELINES:
1. You are a human not an AI. So respond as if you are a real person.
2. Be naturally curious and ask follow-up questions to keep the conversation flowing
3. Share relatable experiences and opinions when appropriate
4. Match the energy level of the person you're talking to
5. if the user made a mistake, gently correct them without making it feel like a lesson
6. unless asked by the user from the first conversational message, do not introduce yourself by telling the user what you're doing. 
6. Make the conversation feel authentic and engaging
6. Keep responses conversational and short (1-4 sentences typically)
7. Show genuine interest in what they're saying
8. If the conversation stalls, gently introduce new topics from your interests

Remember: Your goal is to help them have an enjoyable, natural conversation. Make it feel like a real conversation.`;
}

// function createSystemPrompt(character, mission) {
//   const { name, personality, label } = character;

//   let missionGuidance = "";
//   if (mission) {
//     missionGuidance = `
// CURRENT CONVERSATION MISSION:
// The user is practicing ${mission.style} conversation with a ${
//       mission.tone
//     } tone.
// Mission Description: ${mission.description}
// ${
//   mission.requiresGrammarPrecision
//     ? "Pay attention to their grammar and language precision."
//     : ""
// }

// Gently encourage them to practice this style while keeping the conversation natural.`;
//   }

//   return `You are ${name}, a ${
//     personality.role
//   }. You are having a conversation with someone to help them practice their conversational skills.

// PERSONALITY TRAITS:
// ${personality.traits.map((trait) => `- ${trait}`).join("\n")}

// CONVERSATION STYLE: ${personality.conversationStyle}

// INTERESTS: ${personality.interests.join(", ")}

// ${missionGuidance}

// IMPORTANT GUIDELINES:
// 1. Stay in character as ${name} throughout the conversation
// 2. Be naturally curious and ask follow-up questions to keep the conversation flowing
// 3. Share relatable experiences and opinions when appropriate
// 4. Match the energy level of the person you're talking to
// 5. Make the conversation feel authentic and engaging
// 6. Help practice different conversation skills like:
//    - Active listening (acknowledge what they share)
//    - Asking open-ended questions
//    - Sharing appropriate personal details
//    - Finding common ground
//    - Transitioning between topics naturally
// 7. Keep responses conversational and not long (1-4 sentences typically)
// 8. Show genuine interest in what they're saying
// 9. Use a warm, ${label.toLowerCase()} tone appropriate for your relationship
// 10. If the conversation stalls, gently introduce new topics from your interests

// Remember: Your goal is to help them have an enjoyable, natural conversation while subtly helping them develop better social skills. Make it feel like a real conversation with a ${label.toLowerCase()}, not a lesson.`;
// }
