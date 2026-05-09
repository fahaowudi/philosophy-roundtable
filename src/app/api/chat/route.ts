import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

import { getPhaseTask } from "@/lib/ai/prompts";
import { DiscussionPhase, Message, Philosopher } from "@/types/discussion";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
});

type ChatRequestBody = {
  philosopher: Pick<Philosopher, "id" | "name" | "systemPrompt">;
  topic: string;
  phase: DiscussionPhase;
  history: Message[];
};

export async function POST(req: NextRequest) {
  try {
    const { philosopher, topic, phase, history } =
      (await req.json()) as ChatRequestBody;

    if (!philosopher?.systemPrompt || !topic || !Array.isArray(history)) {
      return NextResponse.json({ error: "请求参数不完整" }, { status: 400 });
    }

    const recentHistory = history
      .filter((message) => message.phase !== "narrator")
      .slice(-3)
      .map((message) => ({
        role: "user" as const,
        content: message.isUser
          ? `用户: ${message.content}`
          : `${message.philosopherName}: ${message.content}`,
      }));

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: philosopher.systemPrompt,
        },
        {
          role: "system",
          content: `当前任务：${getPhaseTask(phase, topic)}`,
        },
        ...recentHistory,
      ],
      temperature: 0.8,
      max_tokens: 320,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content?.trim() || "",
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate response",
      },
      { status: 500 },
    );
  }
}
