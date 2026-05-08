import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

import { NARRATOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { Message } from "@/types/discussion";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
});

type NarratorRequestBody = {
  messages: Message[];
  topic: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages, topic } = (await req.json()) as NarratorRequestBody;

    if (!topic || !Array.isArray(messages)) {
      return NextResponse.json({ error: "请求参数不完整" }, { status: 400 });
    }

    const conversationSummary = messages
      .filter((message) => message.phase !== "narrator")
      .slice(-6)
      .map((message) => `${message.philosopherName}: ${message.content}`)
      .join("\n\n");

    const prompt = [
      `讨论话题：${topic}`,
      "最近的讨论片段：",
      conversationSummary || "（暂无讨论内容）",
      "请总结哲学家们最近的核心分歧、共识或推进点，控制在 80 字以内。",
    ].join("\n\n");

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: NARRATOR_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content?.trim() || "",
    });
  } catch (error: unknown) {
    console.error("Narrator API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate summary",
      },
      { status: 500 }
    );
  }
}
