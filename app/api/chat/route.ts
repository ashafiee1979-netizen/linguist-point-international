import { NextResponse } from "next/server";
import {
  KNOWLEDGE_SYSTEM_PROMPT,
  generateLocalAssistantResponse,
  type ChatAction,
} from "@/lib/chat-knowledge";

export const dynamic = "force-dynamic";

interface ChatRequestBody {
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const userPrompt = body.prompt || (body.messages && body.messages[body.messages.length - 1]?.content) || "";

    if (!userPrompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    // 1. If OpenAI API key is configured, use OpenAI gpt-4o-mini
    if (openaiApiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: KNOWLEDGE_SYSTEM_PROMPT },
              ...(body.messages || [{ role: "user", content: userPrompt }]),
            ],
            temperature: 0.3,
            max_tokens: 350,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.choices?.[0]?.message?.content || "";
          
          // Generate appropriate action based on user query
          const localFallback = generateLocalAssistantResponse(userPrompt);

          return NextResponse.json({
            text: replyText,
            action: localFallback.action,
            source: "llm",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (llmErr) {
        console.warn("External LLM call failed or timed out, using knowledge engine:", llmErr);
      }
    }

    // 2. Default Zero-Setup Knowledge & Conversion Engine
    const result = generateLocalAssistantResponse(userPrompt);

    return NextResponse.json({
      text: result.text,
      action: result.action,
      source: "knowledge-engine",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Unable to process chat request." },
      { status: 500 }
    );
  }
}
