import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { messages } = await req.json();

  const userOnlyMessages = messages
    .filter((msg) => msg.sender === "user")
    .map((msg) => msg.text)
    .join("\n");

  const prompt = `
You are a conversational communication coach. Give bullet-point feedback on how the user is doing in their conversation practice.

Goals:
- Speak with clarity (clear structure, precise wording)
- Be interesting (engaging tone, personality, stories)

Instructions:
- Start with a Clarity Score and Interest Score (1–10)
- Mention 1–2 things they did well
- Mention 1–2 areas to improve
- Provide one example of how they could rephrase a sentence or express something better

Here is the user's recent conversation input:
"""
${userOnlyMessages}
"""
`;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const feedback =
    data.choices?.[0]?.message?.content || "Could not generate feedback.";

  return NextResponse.json({ feedback });
}
