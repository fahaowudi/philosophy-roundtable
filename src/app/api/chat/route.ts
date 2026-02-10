import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// 使用 DeepSeek API
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function POST(req: NextRequest) {
  try {
    const {
      philosopher,
      topic,
      phase,
      history,
    }: {
      philosopher: any;
      topic: string;
      phase: 'defining' | 'debating' | 'concluding';
      history: any[];
    } = await req.json();

    // 构建上下文
    const recentHistory = history.slice(-3).map((msg: any) => ({
      role: 'user' as const,
      content: `${msg.philosopherName}: ${msg.content}`,
    }));

    // 添加当前任务
    const phaseTask = {
      role: 'system' as const,
      content: `当前任务: ${
        phase === 'defining'
          ? `请对"${topic}"这个问题进行初步的定义和概念澄清。不要直接给出答案，而是先探讨问题的本质和涉及的核心概念。`
          : phase === 'debating'
          ? `现在进入观点交锋阶段。请回应其他哲学家的观点，提出自己的看法，可以质疑、补充或发展已有的讨论。保持思辨的深度。`
          : `讨论接近尾声，请总结你对"${topic}"的核心见解，提供启发性的思考方向，而不是标准答案。`
      }`,
    };

    // 调用 DeepSeek API
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: philosopher.systemPrompt,
        },
        phaseTask,
        ...recentHistory,
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ content: response });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
