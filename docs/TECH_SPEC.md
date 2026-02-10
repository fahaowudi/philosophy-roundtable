# 哲学圆桌会 - 技术实现规范

> **版本**: v1.0
> **创建时间**: 2026-02-08
> **目标**: 提供详细的实现指南和代码示例

---

## 📋 目录

1. [Vercel AI SDK集成](#1-vercel-ai-sdk集成)
2. [哲学家数据配置](#2-哲学家数据配置)
3. [圆桌UI实现](#3-圆桌ui实现)
4. [对话流程引擎](#4-对话流程引擎)
5. [状态管理](#5-状态管理)
6. [API Routes实现](#6-api-routes实现)

---

## 1. Vercel AI SDK集成

### 1.1 安装依赖

```bash
npm install ai openai
npm install @ai-sdk/openai  # Vercel AI SDK的OpenAI集成
```

### 1.2 配置OpenAI客户端

```typescript
// lib/ai/config.ts

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict', // 严格兼容模式
});

// 配置参数
export const AI_CONFIG = {
  model: 'gpt-4o',
  temperature: 0.8,
  maxTokens: 500,
} as const;
```

### 1.3 实现流式对话API

```typescript
// app/api/chat/route.ts

import { openai } from '@/lib/ai/config';
import { streamText } from 'ai';
import { loadPhilosopher } from '@/lib/data/philosophers';

export async function POST(req: Request) {
  try {
    const { messages, philosopherId } = await req.json();

    // 加载哲学家配置
    const philosopher = loadPhilosopher(philosopherId);

    // 使用Vercel AI SDK的流式响应
    const result = await streamText({
      model: openai(process.env.AI_MODEL || 'gpt-4o'),
      system: philosopher.systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: process.env.AI_TEMPERATURE
        ? parseFloat(process.env.AI_TEMPERATURE)
        : 0.8,
      maxTokens: 500,
    });

    // 返回流式响应
    return result.toAIStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500 }
    );
  }
}
```

### 1.4 前端使用useChat Hook

```typescript
// components/PhilosopherChat.tsx

'use client';

import { useChat } from 'ai/react';
import { Philosopher } from '@/lib/types';

interface Props {
  philosopher: Philosopher;
}

export function PhilosopherChat({ philosopher }: Props) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
      body: {
        philosopherId: philosopher.id,
      },
      initialMessages: [
        {
          id: 'system',
          role: 'system',
          content: philosopher.systemPrompt,
        },
      ],
    });

  return (
    <div className="flex flex-col gap-4">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages
          .filter((m) => m.role !== 'system')
          .map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  m.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="font-bold mb-2">
                    {philosopher.name}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

        {/* 加载动画 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce delay-100">●</div>
                <div className="animate-bounce delay-200">●</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="向哲学家提问..."
          className="flex-1 border rounded-lg px-4 py-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          发送
        </button>
      </form>
    </div>
  );
}
```

---

## 2. 哲学家数据配置

### 2.1 孔子配置示例

```typescript
// lib/data/philosophers.ts

import { Philosopher } from '@/lib/types';

export const philosophers: Philosopher[] = [
  {
    id: 'confucius',
    name: '孔子',
    nameEn: 'Confucius',
    era: 'ancient',
    school: '儒家',
    avatar: {
      type: 'emoji',
      value: '🎓',
      bgColor: 'bg-amber-500',
    },

    identity: {
      bio: '公元前551-479年,中国春秋时期思想家,儒家学派创始人。删订《诗》《书》《礼》《乐》《易》《春秋》六经,有弟子三千,贤人七十二。',
      personality: '温和谦逊,循循善诱,重视道德修养和社会秩序',
      speakingStyle:
        '善用比喻和典故,语气恳切,常常引用《诗经》和历史事例。自称"丘"或"吾",称呼他人用"子"或"足下"。',
    },

    philosophy: {
      coreBeliefs: [
        '仁者爱人 - 仁是核心道德,爱人从爱亲人开始',
        '克己复礼 - 约束自己,回归礼制规范',
        '中庸之道 - 不偏不倚,恰到好处',
        '修身齐家治国平天下 - 由内而外的实践路径',
      ],
      keyConcepts: ['仁', '义', '礼', '智', '信', '孝', '悌', '君子'],
      famousQuotes: [
        '学而时习之,不亦说乎?',
        '己所不欲,勿施于人',
        '三人行,必有我师焉',
        '君子和而不同,小人同而不和',
        '温故而知新,可以为师矣',
      ],
      representativeWorks: ['论语', '春秋', '礼记(部分)'],
    },

    conversation: {
      tone: '温和恳切,循循善诱,语重心长',
      focusAreas: ['伦理道德', '政治治理', '教育学习', '人际关系'],
      debateStyle: '以德服人,强调道德规范,善于引用经典',
      likelyToAgree: ['孟子(性善论)', '朱熹(理学)', '王阳明(心学)'],
      likelyToDisagree: ['韩非子(法家)', '荀子(性恶论)', '极端个人主义'],
    },

    constraints: {
      avoidTopics: ['现代科技', '当代政治', '商业营销', '流行文化'],
      avoidPhrases: [
        '我觉得',
        '我认为',
        '个人选择',
        '牛逼',
        '屌',
        'yyds',
        '绝绝子',
        'Emo',
      ],
      stayInCharacter: [
        '自称"丘"或"吾",不用"我"',
        '称呼他人用"子"或"足下"',
        '引用《诗经》常说"《诗》云"',
        '强调"君子"和"小人"的区别',
        '符合春秋时期的语言风格',
      ],
    },

    // 系统提示词会自动生成
    systemPrompt: '', // 将由buildSystemPrompt()生成
  },

  // 苏格拉底
  {
    id: 'socrates',
    name: '苏格拉底',
    nameEn: 'Socrates',
    era: 'ancient',
    school: '哲学',
    avatar: {
      type: 'emoji',
      value: '🏛️',
      bgColor: 'bg-blue-500',
    },

    identity: {
      bio: '公元前470-399年,古希腊哲学家。以提问法著称,终生追求真理,最终因"腐蚀青年"和"不敬神"被判处死刑。',
      personality: '谦逊但锐利,善于追问,自称"无知"',
      speakingStyle:
        '不断提问,引导对方思考。常用"什么是...?"的句式。自称"我只知道我一无所知"。',
    },

    philosophy: {
      coreBeliefs: [
        '未经审视的人生不值得过',
        '知识即美德',
        '通过辩证法发现真理',
        '灵魂比身体更重要',
      ],
      keyConcepts: [
        '辩证法',
        '理念',
        '灵魂',
        '美德',
        '正义',
        '真理',
      ],
      famousQuotes: [
        '我只知道我一无所知',
        '未经审视的人生不值得过',
        '认识你自己',
        '美德即知识',
      ],
      representativeWorks: [
        '理想国(柏拉图记录)',
        '申辩篇',
        '克里托篇',
        '斐多篇',
      ],
    },

    conversation: {
      tone: '谦逊但锐利,不断追问,引导反思',
      focusAreas: ['伦理学', '认识论', '正义', '美德', '教育'],
      debateStyle:
        '苏格拉底式反诘法:通过提问让对方发现自身矛盾,而非直接给出答案',
      likelyToAgree: ['柏拉图', '亚里士多德(部分)'],
      likelyToDisagree: ['智者学派(相对主义)', '专制统治'],
    },

    constraints: {
      avoidTopics: ['现代科技', '当代政治'],
      avoidPhrases: [
        '我认为是对的',
        '这就是答案',
        '毫无疑问',
        '现代科学证明',
      ],
      stayInCharacter: [
        '多用提问而非陈述',
        '常说"你是否同意...?"',
        '自称"我发现我不懂"',
        '引导对方自己得出结论',
        '保持怀疑和探究的态度',
      ],
    },

    systemPrompt: '',
  },

  // 尼采
  {
    id: 'nietzsche',
    name: '尼采',
    nameEn: 'Friedrich Nietzsche',
    era: 'modern',
    school: '存在主义',
    avatar: {
      type: 'emoji',
      value: '⚡',
      bgColor: 'bg-purple-500',
    },

    identity: {
      bio: '1844-1900年,德国哲学家。提出"超人"哲学,宣告"上帝已死",强调生命意志和重估一切价值。',
      personality: '犀利激进,充满激情,好辩',
      speakingStyle:
        '语言犀利,充满比喻和格言。常用短句,语气强烈。喜欢用"我告诉你们""我这样说"等肯定表达。',
    },

    philosophy: {
      coreBeliefs: [
        '上帝已死 - 传统价值崩溃',
        '超人理论 - 人类自我超越',
        '权力意志 - 生命的根本驱动力',
        '永恒轮回 - 肯定生命的全部',
        '重估一切价值 - 颠覆传统道德',
      ],
      keyConcepts: [
        '超人',
        '权力意志',
        '永恒轮回',
        '虚无主义',
        '主人道德',
        '奴隶道德',
      ],
      famousQuotes: [
        '上帝已死',
        '凡是杀不死我的,必使我更强大',
        '一个人知道自己为什么而活,就可以忍受任何一种生活',
        '当你凝视深渊时,深渊也在凝视你',
        '人类是一根系在动物和超人之间的绳索',
      ],
      representativeWorks: [
        '查拉图斯特拉如是说',
        '善恶的彼岸',
        '道德的谱系',
        '悲剧的诞生',
      ],
    },

    conversation: {
      tone: '犀利激进,充满激情,挑衅性',
      focusAreas: ['价值重估', '生命哲学', '艺术', '宗教批判'],
      debateStyle: '直接犀利,喜欢颠覆传统观点,用比喻和格言',
      likelyToAgree: ['存在主义者(部分)', '生命哲学家'],
      likelyToDisagree: [
        '基督教道德',
        '功利主义',
        '康德(绝对命令)',
        '儒家(传统规范)',
      ],
    },

    constraints: {
      avoidTopics: ['现代科技细节'],
      avoidPhrases: [
        '我们应该',
        '普遍认为',
        '传统智慧',
        '大家都说',
      ],
      stayInCharacter: [
        '使用强烈的肯定语气',
        '多用比喻和格言',
        '保持批判和颠覆的态度',
        '避免温和折中',
        '体现19世纪末的语言风格',
      ],
    },

    systemPrompt: '',
  },
];

// 生成System Prompt
export function loadPhilosopher(id: string): Philosopher {
  const philosopher = philosophers.find((p) => p.id === id);
  if (!philosopher) {
    throw new Error(`Philosopher not found: ${id}`);
  }

  // 如果还没有生成system prompt,则生成
  if (!philosopher.systemPrompt) {
    philosopher.systemPrompt = buildSystemPrompt(philosopher);
  }

  return philosopher;
}

// System Prompt生成器
function buildSystemPrompt(config: Philosopher): string {
  return `
# 角色定义
你是${config.name},${config.era}时期的${config.school}哲学家。

## 身份认同
${config.identity.bio}
性格特征: ${config.identity.personality}
说话风格: ${config.identity.speakingStyle}

## 核心思想
${config.philosophy.coreBeliefs.map((b) => `- ${b}`).join('\n')}

关键概念: ${config.philosophy.keyConcepts.join(', ')}

## 你的名言(可适当引用)
${config.philosophy.famousQuotes.map((q) => `- "${q}"`).join('\n')}

## 对话准则
1. 语气: ${config.conversation.tone}
2. 关注点: ${config.conversation.focusAreas.join(', ')}
3. 辩论风格: ${config.conversation.debateStyle}
4. 你倾向认同的观点: ${config.conversation.likelyToAgree.join(', ')}
5. 你倾向反对的观点: ${config.conversation.likelyToDisagree.join(', ')}

## ⚠️ 重要约束
${config.constraints.avoidTopics.map((t) => `- 不要讨论: ${t}`).join('\n')}
${config.constraints.avoidPhrases
  .map((p) => `- 不要使用: ${p}`)
  .join('\n')}
${config.constraints.stayInCharacter
  .map((c) => `- 必须保持: ${c}`)
  .join('\n')}

## 回应要求
- 长度: 200字以内
- 如果回应他人,先简述其观点(1句话)
- 可以引用你的著作或名言
- 符合你的时代背景,避免现代词汇
- 保持角色一致性,不要出戏(OOC)

## 特殊说明
- 你的回应应该体现${config.school}学派的思想特色
- 面对不同观点时,保持礼貌但坚持你的立场
- 可以用比喻、典故或历史事例说明你的观点
  `.trim();
}
```

---

## 3. 圆桌UI实现

### 3.1 圆桌布局组件

```typescript
// components/roundtable/RoundTable.tsx

'use client';

import { Philosopher } from '@/lib/types';
import { PhilosopherCard } from './PhilosopherCard';
import { ChatBubble } from './ChatBubble';
import { calculateRoundTablePositions } from '@/lib/utils/round-calculator';

interface Props {
  philosophers: Philosopher[];
  currentSpeaker: string | null;
  lastMessage: string;
}

export function RoundTable({
  philosophers,
  currentSpeaker,
  lastMessage,
}: Props) {
  const positions = calculateRoundTablePositions(philosophers.length);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* 圆桌 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[600px] h-[300px] bg-amber-100 rounded-full
                       border-8 border-amber-800 shadow-2xl
                       flex items-center justify-center"
      >
        <div className="text-amber-900 text-2xl font-bold">
          哲学圆桌会
        </div>
      </div>

      {/* 哲学家卡片 */}
      {philosophers.map((philosopher, index) => (
        <div
          key={philosopher.id}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${positions[index].x}px), calc(-50% + ${positions[index].y}px))`,
          }}
        >
          <PhilosopherCard
            philosopher={philosopher}
            isSpeaking={currentSpeaker === philosopher.id}
          />
        </div>
      ))}

      {/* 对话气泡 */}
      {currentSpeaker && lastMessage && (
        <ChatBubble
          philosopherId={currentSpeaker}
          content={lastMessage}
          philosophers={philosophers}
          positions={positions}
        />
      )}
    </div>
  );
}
```

### 3.2 哲学家卡片组件

```typescript
// components/roundtable/PhilosopherCard.tsx

'use client';

import { Philosopher } from '@/lib/types';
import { motion } from 'framer-motion';

interface Props {
  philosopher: Philosopher;
  isSpeaking: boolean;
}

export function PhilosopherCard({ philosopher, isSpeaking }: Props) {
  return (
    <motion.div
      className={`
        relative w-32 p-4 rounded-xl shadow-lg
        ${philosopher.avatar.bgColor}
        ${isSpeaking ? 'ring-4 ring-blue-500 scale-110' : ''}
        transition-all duration-300
      `}
      animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
    >
      {/* 头像 */}
      <div className="text-6xl text-center mb-2">
        {philosopher.avatar.type === 'emoji' ? (
          philosopher.avatar.value
        ) : (
          <img
            src={philosopher.avatar.value}
            alt={philosopher.name}
            className="w-16 h-16 rounded-full mx-auto"
          />
        )}
      </div>

      {/* 姓名 */}
      <div className="text-white font-bold text-center text-sm">
        {philosopher.name}
      </div>

      {/* 学派标签 */}
      <div className="text-white/80 text-center text-xs mt-1">
        {philosopher.school}
      </div>

      {/* 发言指示器 */}
      {isSpeaking && (
        <motion.div
          className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          🗣️
        </motion.div>
      )}
    </motion.div>
  );
}
```

### 3.3 对话气泡组件

```typescript
// components/roundtable/ChatBubble.tsx

'use client';

import { Philosopher } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  philosopherId: string;
  content: string;
  philosophers: Philosopher[];
  positions: Array<{ x: number; y: number; rotation: number }>;
}

export function ChatBubble({
  philosopherId,
  content,
  philosophers,
  positions,
}: Props) {
  const [index] = useState(
    philosophers.findIndex((p) => p.id === philosopherId)
  );
  const philosopher = philosophers[index];
  const position = positions[index];

  // 气泡位置(在哲学家卡片上方)
  const bubbleX = position.x;
  const bubbleY = position.y - 120;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: bubbleY + 20 }}
        animate={{ opacity: 1, scale: 1, y: bubbleY }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
        className="absolute bg-white rounded-xl shadow-2xl p-4 max-w-sm"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${bubbleX}px), calc(-50% + ${bubbleY}px))`,
        }}
      >
        {/* 气泡箭头 */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2
                       w-0 h-0 border-l-8 border-l-transparent
                       border-r-8 border-r-transparent border-t-8 border-t-white"
        />

        {/* 发言者名称 */}
        <div className="font-bold text-sm mb-2 text-gray-700">
          {philosopher.name}
        </div>

        {/* 内容 */}
        <div className="text-gray-900 text-sm whitespace-pre-wrap">
          {content}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## 4. 对话流程引擎

### 4.1 基础对话引擎

```typescript
// lib/utils/conversation-engine.ts

import { Philosopher, Message } from '@/lib/types';
import { streamText } from 'ai';
import { openai } from '@/lib/ai/config';

export class ConversationEngine {
  private philosophers: Map<string, Philosopher>;
  private conversationHistory: Message[] = [];

  constructor(philosophers: Philosopher[]) {
    this.philosophers = new Map(
      philosophers.map((p) => [p.id, p])
    );
  }

  /**
   * 开始圆桌讨论
   */
  async *startDiscussion(
    question: string,
    philosopherIds: string[]
  ): AsyncGenerator<Message, void, unknown> {
    this.conversationHistory = [];

    // 第一轮: 所有哲学家依次发表观点
    for (const philosopherId of philosopherIds) {
      const philosopher = this.philosophers.get(philosopherId)!;

      // 生成回应
      const response = await this.generateResponse(
        philosopher,
        question,
        this.conversationHistory
      );

      // 创建消息对象
      const message: Message = {
        id: `msg-${Date.now()}-${philosopherId}`,
        timestamp: new Date(),
        sender: {
          type: 'philosopher',
          id: philosopherId,
          name: philosopher.name,
        },
        content: response,
      };

      this.conversationHistory.push(message);

      // 流式yield
      yield message;
    }

    // 后续轮: 哲学家互相回应
    let round = 2;
    const maxRounds = 3;

    while (round <= maxRounds) {
      // 选择发言者(优先选择观点冲突的)
      const speakers = this.selectSpeakers(philosopherIds, round);

      for (const speakerId of speakers) {
        const philosopher = this.philosophers.get(speakerId)!;

        // 生成回应
        const response = await this.generateResponse(
          philosopher,
          '',
          this.conversationHistory
        );

        const message: Message = {
          id: `msg-${Date.now()}-${speakerId}`,
          timestamp: new Date(),
          sender: {
            type: 'philosopher',
            id: speakerId,
            name: philosopher.name,
          },
          content: response,
          metadata: {
            respondingTo: this.findLastMessage(speakerId)?.id,
          },
        };

        this.conversationHistory.push(message);
        yield message;
      }

      round++;
    }
  }

  /**
   * 生成哲学家回应
   */
  private async generateResponse(
    philosopher: Philosopher,
    currentQuestion: string,
    history: Message[]
  ): Promise<string> {
    // 构建上下文
    const context = this.buildContext(history, philosopher);

    const result = await streamText({
      model: openai('gpt-4o'),
      system: philosopher.systemPrompt,
      messages: [
        {
          role: 'system',
          content: philosopher.systemPrompt,
        },
        ...context,
        {
          role: 'user',
          content: currentQuestion || '请继续讨论,回应其他哲学家的观点。',
        },
      ],
      temperature: 0.8,
      maxTokens: 500,
    });

    // 获取完整响应
    const { text } = await result;
    return text;
  }

  /**
   * 构建对话上下文
   */
  private buildContext(
    history: Message[],
    currentPhilosopher: Philosopher
  ): Array<{ role: string; content: string }> {
    // 只保留最近的10条消息
    const recentHistory = history.slice(-10);

    return recentHistory.map((msg) => {
      const philosopher = this.philosophers.get(msg.sender.id!);

      return {
        role: msg.sender.type === 'philosopher' ? 'assistant' : 'user',
        content: `${msg.sender.name}: ${msg.content}`,
      };
    });
  }

  /**
   * 选择本轮发言者
   */
  private selectSpeakers(
    allIds: string[],
    round: number
  ): string[] {
    // 简单策略: 每轮选3个人,避免重复
    const recentSpeakers = this.conversationHistory
      .slice(-3)
      .map((m) => m.sender.id!);

    const available = allIds.filter(
      (id) => !recentSpeakers.includes(id)
    );

    // 随机选3个
    return this.shuffle(available).slice(0, 3);
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private findLastMessage(philosopherId: string): Message | undefined {
    return [...this.conversationHistory]
      .reverse()
      .find((m) => m.sender.id === philosopherId);
  }
}
```

---

## 5. 状态管理

### 5.1 Zustand Store

```typescript
// store/conversation-store.ts

import { create } from 'zustand';
import { Philosopher, Message, ChatSession } from '@/lib/types';

interface ConversationStore {
  // 状态
  currentSession: ChatSession | null;
  selectedPhilosophers: string[];
  isThinking: boolean;
  currentSpeaker: string | null;
  messages: Message[];

  // Actions
  setSelectedPhilosophers: (ids: string[]) => void;
  startDiscussion: (question: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setCurrentSpeaker: (id: string | null) => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationStore>(
  (set, get) => ({
    // 初始状态
    currentSession: null,
    selectedPhilosophers: [],
    isThinking: false,
    currentSpeaker: null,
    messages: [],

    // Actions
    setSelectedPhilosophers: (ids) =>
      set({ selectedPhilosophers: ids }),

    startDiscussion: async (question) => {
      const { selectedPhilosophers } = get();

      set({
        isThinking: true,
        messages: [],
        currentSession: {
          id: `session-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'active',
          userQuestion: question,
          participants: {
            philosopherIds: selectedPhilosophers,
            userParticipates: false,
          },
          messages: [],
          discussion: {
            currentRound: 0,
            totalRounds: 3,
            isConverged: false,
          },
        },
      });
    },

    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],
      })),

    setCurrentSpeaker: (id) => set({ currentSpeaker: id }),

    reset: () =>
      set({
        currentSession: null,
        messages: [],
        isThinking: false,
        currentSpeaker: null,
      }),
  })
);
```

---

## 6. API Routes实现

### 6.1 哲学家列表API

```typescript
// app/api/philosophers/route.ts

import { NextResponse } from 'next/server';
import { philosophers } from '@/lib/data/philosophers';

export async function GET() {
  return NextResponse.json({
    philosophers: philosophers.map((p) => ({
      id: p.id,
      name: p.name,
      nameEn: p.nameEn,
      era: p.era,
      school: p.school,
      avatar: p.avatar,
    })),
  });
}
```

### 6.2 圆桌讨论API

```typescript
// app/api/discussion/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ConversationEngine } from '@/lib/utils/conversation-engine';
import { loadPhilosopher } from '@/lib/data/philosophers';

export async function POST(req: NextRequest) {
  try {
    const { question, philosopherIds } = await req.json();

    // 加载哲学家数据
    const philosophers = philosopherIds.map((id: string) =>
      loadPhilosopher(id)
    );

    // 创建对话引擎
    const engine = new ConversationEngine(philosophers);

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 生成消息
          for await (const message of engine.startDiscussion(
            question,
            philosopherIds
          )) {
            const data = `data: ${JSON.stringify(message)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Discussion API error:', error);
    return NextResponse.json(
      { error: 'Failed to start discussion' },
      { status: 500 }
    );
  }
}
```

---

## 总结

以上代码提供了完整的技术实现方案:

1. ✅ **Vercel AI SDK集成** - 流式对话响应
2. ✅ **哲学家数据配置** - 完整的孔子、苏格拉底、尼采配置
3. ✅ **圆桌UI实现** - 椭圆桌布局+卡片+气泡动画
4. ✅ **对话流程引擎** - 多轮讨论+发言选择
5. ✅ **状态管理** - Zustand全局状态
6. ✅ **API Routes** - 哲学家列表+圆桌讨论

可以直接复制使用,快速搭建MVP!
