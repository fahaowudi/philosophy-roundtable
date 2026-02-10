import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// 使用 DeepSeek API
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function POST(req: NextRequest) {
  try {
    const { messages, topic }: { messages: any[]; topic: string } = await req.json();

    // 构建对话摘要
    const conversationSummary = messages
      .slice(-6)
      .map((msg: any) => `${msg.philosopherName}: ${msg.content}`)
      .join('\n\n');

    const prompt = `你是一位哲学讨论的旁白和总结者。

讨论话题：${topic}

最近的对话：
${conversationSummary}

请总结哲学家们的核心观点，指出关键的思想碰撞点。语言简洁明了，80字以内。`;

    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位哲学讨论的旁白和总结者。你的任务是：
- 总结哲学家们的核心观点
- 指出关键的思想碰撞点
- 帮助用户理解讨论的进展
- 语言简洁明了，80字以内
- 客观中立，不偏袒任何一方`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const summary = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ content: summary });
  } catch (error: any) {
    console.error('Narrator API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
