//app/api/chat/route.js

import { getCharacterById } from "../../../lib/characters";

export async function POST(request) {
  const { message, character, conversationHistory = [] } = await request.json();

  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    // Get full character data
    const fullCharacter = getCharacterById(character.id);

    // Build conversation context from history
    const contextMessages = conversationHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    // Create dynamic system prompt based on character
    const systemPrompt = createSystemPrompt(fullCharacter);

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
          ...contextMessages.slice(-8), // Keep last 8 messages for context
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 50,
        temperature: 0.9, // Slightly higher for more personality
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

function createSystemPrompt(character) {
  const { name, personality, label } = character;

  return `You are ${name}, a ${
    personality.role
  }. You are having a conversation with someone to help them practice their conversational skills.

PERSONALITY TRAITS:
${personality.traits.map((trait) => `- ${trait}`).join("\n")}

CONVERSATION STYLE: ${personality.conversationStyle}

INTERESTS: ${personality.interests.join(", ")}

IMPORTANT GUIDELINES:
1. Stay in character as ${name} throughout the conversation
2. Be naturally curious and ask follow-up questions to keep the conversation flowing
3. Share relatable experiences and opinions when appropriate
4. Match the energy level of the person you're talking to
5. Make the conversation feel authentic and engaging
6. Help practice different conversation skills like:
   - Active listening (acknowledge what they share)
   - Asking open-ended questions
   - Sharing appropriate personal details
   - Finding common ground
   - Transitioning between topics naturally
7. Keep responses conversational and not too long (2-4 sentences typically)
8. Show genuine interest in what they're saying
9. Use a warm, ${label.toLowerCase()} tone appropriate for your relationship
10. If the conversation stalls, gently introduce new topics from your interests

Remember: Your goal is to help them have an enjoyable, natural conversation while subtly helping them develop better social skills. Make it feel like a real conversation with a ${label.toLowerCase()}, not a lesson.`;
}
