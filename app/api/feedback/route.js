export async function POST(request) {
  const { messages, character, mission } = await request.json();

  if (!messages || messages.length === 0) {
    return Response.json({ error: "Messages are required" }, { status: 400 });
  }

  try {
    // Build conversation for analysis
    const conversationText = messages
      .map(
        (msg) =>
          `${msg.sender === "user" ? "User" : character.name}: ${msg.text}`
      )
      .join("\n");

    const systemPrompt = `You are an expert conversation coach providing detailed feedback on a practice conversation.

MISSION DETAILS:
- Style: ${mission.style}
- Tone: ${mission.tone}
- Description: ${mission.description}
- Grammar Focus: ${mission.requiresGrammarPrecision ? "Yes" : "No"}

CHARACTER CONTEXT:
- The user was practicing with ${character.name}, a ${character.label}
- Character personality: ${
      character.personality?.traits?.join(", ") || "Friendly and supportive"
    }

PROVIDE FEEDBACK ON:
1. Mission Achievement: How well did the user achieve the ${
      mission.style
    } conversation style?
2. Tone Consistency: Did they maintain the required ${mission.tone} tone?
3. Conversation Skills: Active listening, question asking, topic transitions
4. Grammar & Language: ${
      mission.requiresGrammarPrecision
        ? "Detailed grammar analysis"
        : "Basic language use"
    }
5. Specific Improvements: What could they do better?
6. Alternative Responses: Suggest 1-2 better ways they could have responded to key moments

Keep feedback:
- Constructive and encouraging
- Specific with examples from the conversation
- Actionable with clear next steps
- Around 200-300 words
- Direct and honest but supportive

Format as natural paragraphs, not bullet points.`;

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
          {
            role: "user",
            content: `Please analyze this conversation and provide feedback:\n\n${conversationText}`,
          },
        ],
        max_tokens: 400,
        temperature: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const feedback = data.choices[0].message.content;

    return Response.json({ feedback });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return Response.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
