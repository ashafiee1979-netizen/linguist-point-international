import { NextResponse } from "next/server";
import {
  KNOWLEDGE_SYSTEM_PROMPT,
  generateLocalAssistantResponse,
} from "@/lib/chat-knowledge";

export const dynamic = "force-dynamic";

// Basic in-memory rate limiting map for public endpoint
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 30;

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + 60_000 });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }

  entry.count++;
  return false;
}

interface IncomingMessage {
  role?: unknown;
  content?: unknown;
}

interface ChatRequestBody {
  messages?: IncomingMessage[];
  prompt?: unknown;
}

export async function POST(req: Request) {
  try {
    // 1. Rate limiting by IP
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many chat requests. Please slow down." },
        { status: 429 }
      );
    }

    let body: ChatRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    // 2. Validate and bound prompt length
    const rawPrompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    let userPrompt = rawPrompt;

    // 3. Strict validation & sanitization of conversation history
    const sanitizedHistory: Array<{ role: "user" | "assistant"; content: string }> = [];

    if (Array.isArray(body.messages)) {
      // Limit conversation history to maximum 15 messages to prevent context-stuffing
      const trimmedMessages = body.messages.slice(-15);

      for (const msg of trimmedMessages) {
        if (!msg || typeof msg !== "object") continue;

        // Strictly enforce permitted roles only: "user" | "assistant"
        const role = msg.role === "assistant" ? "assistant" : msg.role === "user" ? "user" : null;
        if (!role) continue; // Discard invalid or injected roles (e.g., "system")

        if (typeof msg.content === "string") {
          const content = msg.content.trim().substring(0, 1000); // Bound individual message length
          if (content.length > 0) {
            sanitizedHistory.push({ role, content });
          }
        }
      }

      if (!userPrompt && sanitizedHistory.length > 0) {
        const lastMsg = sanitizedHistory[sanitizedHistory.length - 1];
        if (lastMsg.role === "user") {
          userPrompt = lastMsg.content;
        }
      }
    }

    if (!userPrompt) {
      return NextResponse.json(
        { error: "A valid prompt is required." },
        { status: 400 }
      );
    }

    if (userPrompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt exceeds maximum allowed length of 1000 characters." },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    // 4. If OpenAI API key is configured, forward sanitized history to gpt-4o-mini
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
              ...sanitizedHistory,
            ],
            temperature: 0.3,
            max_tokens: 350,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.choices?.[0]?.message?.content || "";
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

    // 5. Default Zero-Setup Knowledge & Conversion Engine
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
