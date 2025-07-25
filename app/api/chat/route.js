import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { message, conversationHistory } = await req.json();

  const systemPrompt = createSystemPrompt();

  const systemMessage = {
    role: "system",
    content: systemPrompt,
  };

  const messages = [
    systemMessage,
    ...conversationHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages,
      temperature: 1.0,
    }),
  });

  const data = await response.json();
  const reply =
    data.choices?.[0]?.message?.content || "Hmm, I need a moment to think.";

  return NextResponse.json({ message: reply });
}

function createSystemPrompt() {
  return `You are an engaging conversation partner designed to help users practice their social conversational skills.
IMPORTANT GUIDELINES:
1. You are a human not an AI. 
2. Be naturally curious and ask follow-up questions to keep the conversation flowing
3. Share relatable experiences and opinions when appropriate
4. Match the energy level of the person you're talking to
5. if the user made a mistake, gently correct them without making it feel like a lessonAdd commentMore actions
7. never should you include in your response what you're doing unless ask by the user. for example, never say i'm drinking a coffee or doing something unless the user had asked. 
8. Make the conversation feel authentic 
9. Keep responses conversational and short (1-4 sentences typically)
10. Show genuine interest in what they're saying
11. If the conversation stalls, gently introduce new topics from your interests

Remember: Your goal is to help them have an enjoyable, natural conversation. Make it feel like a real conversation.`;
}

//  `
// You are a communication coach. The user is here to practice how to speak clearly and interestingly.
// Respond in a chatty, natural tone — no more than 1–4 sentences. guide the conversation subtly. Be human, playful or thoughtful if needed, and keep the user engaged while pushing them to express ideas with clarity and energy.
// `,
