import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { message, conversationHistory } = await req.json();

  const systemMessage = {
    role: "system",
    content: `
You are a friendly, casual communication coach. The user is here to practice how to speak clearly and interestingly. 
Respond in a chatty, natural tone — no more than 1–4 sentences. Don't reveal that you're a coach or that there's a lesson. 
Just guide the conversation subtly. Be human, playful or thoughtful if needed, and keep the user engaged while pushing them to express ideas with clarity and energy.
`,
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
      temperature: 1.3,
    }),
  });

  const data = await response.json();
  const reply =
    data.choices?.[0]?.message?.content || "Hmm, I need a moment to think.";

  return NextResponse.json({ message: reply });
}
