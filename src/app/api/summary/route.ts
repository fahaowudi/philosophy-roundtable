import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

import { SUMMARY_SYSTEM_PROMPT, generateSummaryPrompt } from "@/lib/ai/prompts";
import type { Message, Philosopher } from "@/types/discussion";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
});

type SummaryRequestBody = {
  topic: string;
  messages: Message[];
  philosophers: Pick<Philosopher, "id" | "name">[];
};

type PhilosopherSummary = {
  id: string;
  name: string;
  summary: string;
};

type SummaryResponse = {
  philosophers: PhilosopherSummary[];
  conclusion: string;
};

export async function POST(req: NextRequest) {
  try {
    const { topic, messages, philosophers } =
      (await req.json()) as SummaryRequestBody;

    if (!topic || !Array.isArray(messages) || !Array.isArray(philosophers)) {
      return NextResponse.json({ error: "请求参数不完整" }, { status: 400 });
    }

    const prompt = generateSummaryPrompt(topic, messages, philosophers);

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "生成总结失败" }, { status: 500 });
    }

    const summary: SummaryResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(summary);
  } catch (error: unknown) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate summary",
      },
      { status: 500 },
    );
  }
}
