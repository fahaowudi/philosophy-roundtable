# 哲学圆桌会 - 系统架构设计文档

> **版本**: v1.0
> **创建时间**: 2026-02-08
> **项目类型**: 黑客松项目 (48小时开发周期)
> **目标**: 构建多哲学家圆桌讨论的Web应用

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈选择](#技术栈选择)
3. [系统架构](#系统架构)
4. [数据结构设计](#数据结构设计)
5. [对话流程控制](#对话流程控制)
6. [核心算法](#核心算法)
7. [开发规范](#开发规范)
8. [部署方案](#部署方案)

---

## 1. 项目概述

### 1.1 核心功能

用户提出哲学问题 → 多位哲学家围坐圆桌展开讨论 → 实时展示观点碰撞和思想交锋

### 1.2 关键特性

- ✅ **多角色对话** - 3-5位AI哲学家同时参与讨论
- ✅ **流式响应** - 实时展示思考过程
- ✅ **观点互动** - 哲学家互相回应、质疑、补充
- ✅ **角色真实性** - 保持哲学家思想一致性和语言风格
- ✅ **可视化圆桌** - 椭圆桌布局+动态对话气泡

### 1.3 MVP范围

**必须实现**:
- 3位哲学家(孔子、苏格拉底、尼采)
- 基础圆桌讨论界面
- 流式对话响应
- 轮流发言机制
- 用户可参与讨论

**可选扩展**:
- 哲学家选择器(8-12位)
- 话题建议系统
- 对话导出功能
- 哲学概念解释卡片

---

## 2. 技术栈选择

### 2.1 前端技术栈

```yaml
框架: Next.js 14 (App Router)
理由:
  - 全栈框架,减少前后端分离的复杂度
  - 内置API Routes,快速开发
  - 服务端渲染,SEO友好
  - 与Vercel深度集成,部署简单

UI库: shadcn/ui + TailwindCSS
理由:
  - 现代美观的设计系统
  - 组件直接复制到项目中,完全可控
  - TypeScript原生支持
  - 可定制性强

状态管理: Zustand
理由:
  - 轻量级(1kb),适合实时对话场景
  - 简单的API,学习成本低
  - 支持中间件和持久化

AI集成: Vercel AI SDK (ai sdk)
理由:
  - 开箱即用的流式响应
  - 自动处理SSE/WebSocket
  - TypeScript类型安全
  - 与Next.js无缝集成
```

### 2.2 后端技术栈

```yaml
运行时: Node.js (Next.js API Routes)
AI模型: OpenAI GPT-4o
理由:
  - 多模态能力(未来可扩展)
  - 性价比高($5/1M tokens)
  - 角色扮演能力强
  - 中文支持优秀

编排框架: 自定义协调器 (暂不使用AutoGen)
理由:
  - MVP阶段简单场景足够
  - 减少依赖和复杂度
  - 更灵活的控制逻辑
  - 后续可平滑升级到AutoGen

数据存储:
  - 静态JSON文件(哲学家配置)
  - Vercel KV(Redis可选,用于对话历史缓存)
  - 浏览器localStorage(用户偏好)
```

### 2.3 部署方案

```yaml
平台: Vercel
理由:
  - 与Next.js深度集成
  - 零配置部署
  - 自动HTTPS和CDN
  - 免费额度足够黑客松演示
```

---

## 3. 系统架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                     用户层 (Browser)                      │
├─────────────────────────────────────────────────────────┤
│  🎨 UI组件              📊 Zustand Store    🔄 SSE        │
│  - RoundTable          - conversationState  - 流式监听   │
│  - PhilosopherCard     - messages          - 实时更新    │
│  - ChatBubble          - currentSpeaker                 │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP POST
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  API层 (Next.js API Routes)              │
├─────────────────────────────────────────────────────────┤
│  🎯 POST /api/chat      📝 GET /api/philosophers         │
│  - 流式响应             - 角色列表                       │
│  - philosopherId参数    - 话题建议                       │
│  - Vercel AI SDK                                        │
└──────────────────────┬──────────────────────────────────┘
                       │ OpenAI API
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    AI服务层 (OpenAI)                      │
├─────────────────────────────────────────────────────────┤
│  🤖 GPT-4o             📚 上下文管理                      │
│  - 角色扮演             - System Prompt                  │
│  - 对话生成             - 消息历史                       │
│  - 观点交互             - Temperature: 0.8               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    数据层 (Storage)                       │
├─────────────────────────────────────────────────────────┤
│  💾 JSON文件           📖 Static Data                    │
│  - philosophers.ts     - 哲学家配置                      │
│  - topics.ts           - 话题库                          │
│  🗄️ Vercel KV          💾 Browser Storage                │
│  - 对话历史缓存        - localStorage                     │
└─────────────────────────────────────────────────────────┘
```

### 3.2 目录结构

```
philosophy-roundtable/
├── app/
│   ├── page.tsx                          # 主页(话题选择)
│   ├── roundtable/
│   │   └── page.tsx                      # 圆桌讨论页面
│   ├── layout.tsx                        # 根布局
│   └── api/
│       ├── chat/
│       │   └── route.ts                 # Vercel AI SDK流式对话
│       └── philosophers/
│           └── route.ts                 # 哲学家列表API
│
├── components/
│   ├── ui/                              # shadcn/ui组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── roundtable/
│   │   ├── RoundTable.tsx               # 椭圆桌布局
│   │   ├── PhilosopherCard.tsx          # 哲学家卡片
│   │   ├── ChatBubble.tsx               # 对话气泡
│   │   └── DiscussionHistory.tsx        # 对话历史侧边栏
│   └── home/
│       ├── TopicSelector.tsx            # 话题选择器
│       └── PhilosopherSelector.tsx     # 哲学家选择器
│
├── lib/
│   ├── data/
│   │   ├── philosophers.ts              # 哲学家配置数据
│   │   └── topics.ts                    # 推荐话题
│   ├── prompts/
│   │   ├── philosopher-template.ts      # System Prompt生成器
│   │   ├── prompts.ts                   # 各哲学家提示词
│   │   └── moderator.ts                 # 主持人提示词
│   ├── utils/
│   │   ├── conversation-engine.ts       # 对话编排引擎
│   │   ├── round-calculator.ts          # 圆桌位置计算
│   │   └── message-formatter.ts         # 消息格式化
│   └── types.ts                         # TypeScript类型定义
│
├── hooks/
│   ├── use-roundtable.ts                # 圆桌讨论状态管理
│   └── use-philosophers.ts              # 哲学家数据管理
│
├── store/
│   └── conversation-store.ts            # Zustand全局状态
│
└── public/
    ├── avatars/                         # 哲学家头像
    └── icons/                           # 图标资源
```

---

## 4. 数据结构设计

### 4.1 哲学家配置 (Philosopher)

```typescript
// lib/types.ts

interface Philosopher {
  // 基础信息
  id: string;                           // 唯一标识 'confucius'
  name: string;                         // 姓名 '孔子'
  nameEn?: string;                      // 英文名 'Confucius'
  era: Era;                             // 时代
  school: string;                       // 学派 '儒家'
  avatar: AvatarConfig;                 // 头像配置

  // 身份认同
  identity: {
    bio: string;                        // 生平简介
    personality: string;                // 性格特征
    speakingStyle: string;              // 说话风格
  };

  // 哲学思想
  philosophy: {
    coreBeliefs: string[];              // 核心信念
    keyConcepts: string[];              // 关键概念
    famousQuotes: string[];             // 名言
    representativeWorks: string[];      // 代表作
  };

  // 对话特征
  conversation: {
    tone: string;                       // 语气
    focusAreas: string[];               // 关注领域
    debateStyle: string;                // 辩论风格
    likelyToAgree: string[];            // 倾向认同的观点
    likelyToDisagree: string[];         // 倾向反对的观点
  };

  // 约束条件
  constraints: {
    avoidTopics: string[];              // 避免的话题
    avoidPhrases: string[];             # 避免的词汇
    stayInCharacter: string[];          # 角色保持要求
  };

  // 系统提示词
  systemPrompt: string;                 // 完整的system prompt
}

type Era =
  | 'ancient'      // 古代(公元前-500年)
  | 'medieval'     // 中世纪(500-1500年)
  | 'modern'       // 近现代(1500-1900年)
  | 'contemporary' // 当代(1900-至今)
  ;

interface AvatarConfig {
  type: 'emoji' | 'image' | 'initials';
  value: string;                        // emoji: '🎓', image: '/avatars/confucius.png'
  bgColor: string;                      // 背景色 'bg-amber-500'
}
```

### 4.2 对话会话 (ChatSession)

```typescript
interface ChatSession {
  id: string;                           // 会话ID
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived';

  // 用户输入
  userQuestion: string;                 // 用户的原始问题

  // 参与者
  participants: {
    philosopherIds: string[];           // 参与讨论的哲学家ID列表
    userParticipates: boolean;          // 用户是否参与讨论
  };

  // 对话内容
  messages: Message[];                  // 所有消息(按时间顺序)

  // 讨论元数据
  discussion: {
    currentRound: number;               // 当前轮次
    totalRounds: number;                // 总轮数
    isConverged: boolean;               // 是否达成共识
    summary?: string;                   // 讨论总结
  };
}

interface Message {
  id: string;
  timestamp: Date;

  // 发送者
  sender: {
    type: 'user' | 'philosopher' | 'moderator';
    id?: string;                        // philosopherId
    name: string;                       // 显示名称
  };

  // 内容
  content: string;                      // 消息文本
  metadata?: {
    respondingTo?: string;              // 回应的消息ID
    concepts?: string[];                // 提到的哲学概念
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
}
```

### 4.3 实时状态 (ConversationState)

```typescript
// Zustand store状态结构

interface ConversationStore {
  // 当前会话
  currentSession: ChatSession | null;

  // 实时状态
  currentState: {
    isThinking: boolean;                // 是否有哲学家正在思考
    currentSpeaker: string | null;      // 当前发言者ID
    phase: 'idle' | 'initial' | 'debate' | 'conclusion';
  };

  // UI状态
  ui: {
    selectedPhilosophers: string[];     // 已选择的哲学家
    showHistory: boolean;               // 是否显示历史侧边栏
    highlightedPhilosopher: string | null; // 高亮的哲学家
  };

  // Actions
  actions: {
    startDiscussion: (question: string, philosopherIds: string[]) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    endDiscussion: () => void;
    selectPhilosophers: (ids: string[]) => void;
  };
}
```

---

## 5. 对话流程控制

### 5.1 讨论流程状态机

```
                    [开始]
                      │
                      ▼
            ┌─────────────────┐
            │  INITIAL: 初始   │ ← 用户提出问题
            │  观点阐述阶段     │
            └────────┬─────────┘
                     │
         每位哲学家依次发言
                     │
                     ▼
            ┌─────────────────┐
            │  DEBATE: 辩论    │ ← 观点互动
            │  互相回应阶段     │
            └────────┬─────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    观点冲突激烈              达成共识
         │                       │
         ▼                       ▼
    继续下一轮            ┌─────────────┐
         │                │  CONCLUSION │
         └───────────────▶│  总结阶段    │
                          └──────┬──────┘
                                 │
                                 ▼
                            [结束]
```

### 5.2 轮次控制算法

```typescript
// lib/utils/conversation-engine.ts

class ConversationEngine {
  private readonly MAX_ROUNDS = 3;
  private readonly SPEAKERS_PER_ROUND = 3;

  async startDiscussion(
    question: string,
    philosopherIds: string[]
  ): Promise<AsyncIterable<Message>> {
    const session = this.createSession(question, philosopherIds);

    // 阶段1: 初始观点
    await this.runInitialRound(session);

    // 阶段2: 辩论
    for (let round = 2; round <= this.MAX_ROUNDS; round++) {
      const shouldContinue = await this.runDebateRound(session, round);
      if (!shouldContinue) break;
    }

    // 阶段3: 总结
    await this.generateConclusion(session);

    return session.messages;
  }

  private async runInitialRound(session: ChatSession): Promise<void> {
    // 所有人依次发表初始观点
    for (const philosopherId of session.participants.philosopherIds) {
      const message = await this.getInitialResponse(
        philosopherId,
        session.userQuestion
      );
      session.messages.push(message);
    }
  }

  private async runDebateRound(
    session: ChatSession,
    roundNumber: number
  ): Promise<boolean> {
    // 选择本轮发言者(优先选择观点冲突的)
    const speakers = this.selectSpeakers(session);

    // 依次发言
    for (const speakerId of speakers) {
      const message = await this.getDebateResponse(
        speakerId,
        session.messages
      );
      session.messages.push(message);
    }

    // 检查是否应该继续
    return await this.shouldContinueDiscussion(session);
  }

  private selectSpeakers(session: ChatSession): string[] {
    // 策略:
    // 1. 轮换发言(避免某人连续发言)
    // 2. 优先选择观点对立的哲学家
    // 3. 平衡发言次数

    const recentSpeakers = this.getRecentSpeakers(session.messages, 3);
    const allSpeakers = session.participants.philosopherIds;

    // 过滤掉最近发过言的
    const available = allSpeakers.filter(id => !recentSpeakers.includes(id));

    // 如果可用人数不足,从全部人中随机选
    if (available.length < this.SPEAKERS_PER_ROUND) {
      return this.shuffle(allSpeakers).slice(0, this.SPEAKERS_PER_ROUND);
    }

    return this.shuffle(available).slice(0, this.SPEAKERS_PER_ROUND);
  }

  private async shouldContinueDiscussion(session: ChatSession): Promise<boolean> {
    // 检查条件:
    // 1. 是否达成共识
    // 2. 观点是否开始重复
    // 3. 是否有人提出新视角

    const lastMessages = session.messages.slice(-5);
    const analysis = await this.analyzeDiscussion(lastMessages);

    return !analysis.isConverged && !analysis.isRepetitive;
  }
}
```

---

## 6. 核心算法

### 6.1 圆桌位置计算算法

```typescript
// lib/utils/round-calculator.ts

interface Position {
  x: number;        // 横坐标
  y: number;        // 纵坐标
  rotation: number; // 旋转角度(度)
}

/**
 * 计算椭圆桌上的哲学家位置
 * @param count 哲学家数量
 * @param width 桌子宽度
 * @param height 桌子高度
 */
function calculateRoundTablePositions(
  count: number,
  width: number = 600,
  height: number = 300
): Position[] {
  const positions: Position[] = [];
  const radiusX = width / 2;
  const radiusY = height / 2;

  for (let i = 0; i < count; i++) {
    // 计算角度(从顶部开始,顺时针)
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;

    // 椭圆参数方程
    positions.push({
      x: radiusX * Math.cos(angle),
      y: radiusY * Math.sin(angle),
      // 旋转角度让卡片朝向圆心
      rotation: (angle * 180) / Math.PI + 90
    });
  }

  return positions;
}
```

### 6.2 System Prompt生成算法

```typescript
// lib/prompts/philosopher-template.ts

function buildSystemPrompt(config: Philosopher): string {
  return `
# 角色定义
你是${config.name},${config.era}时期的${config.school}哲学家。

## 身份认同
${config.identity.bio}
性格特征: ${config.identity.personality}
说话风格: ${config.identity.speakingStyle}

## 核心思想
${config.philosophy.coreBeliefs.map(b => `- ${b}`).join('\n')}

关键概念: ${config.philosophy.keyConcepts.join(', ')}

## 你的名言(可适当引用)
${config.philosophy.famousQuotes.map(q => `- "${q}"`).join('\n')}

## 对话准则
1. 语气: ${config.conversation.tone}
2. 关注点: ${config.conversation.focusAreas.join(', ')}
3. 辩论风格: ${config.conversation.debateStyle}
4. 你倾向认同的观点: ${config.conversation.likelyToAgree.join(', ')}
5. 你倾向反对的观点: ${config.conversation.likelyToDisagree.join(', ')}

## ⚠️ 重要约束
${config.constraints.avoidTopics.map(t => `- 不要讨论: ${t}`).join('\n')}
${config.constraints.avoidPhrases.map(p => `- 不要使用: ${p}`).join('\n')}
${config.constraints.stayInCharacter.map(c => `- 必须保持: ${c}`).join('\n')}

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

### 6.3 角色一致性验证算法

```typescript
// lib/utils/consistency-validator.ts

/**
 * 验证AI回应是否符合哲学家角色
 * 使用轻量级模型快速检查
 */
async function validatePhilosophicalConsistency(
  philosopher: Philosopher,
  response: string
): Promise<{ isValid: boolean; reason?: string }> {
  // 使用gpt-4o-mini降低成本
  const validator = new OpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0
  });

  const prompt = `
你是哲学文本验证专家。请检查以下回应是否符合该哲学家的思想体系。

哲学家: ${philosopher.name}
核心思想: ${philosopher.philosophy.coreBeliefs.join(', ')}
关键概念: ${philosopher.philosophy.keyConcepts.join(', ')}

回应内容:
"""
${response}
"""

检查项:
1. 是否符合该哲学家的核心思想?
2. 是否体现了该哲学家的关注领域?
3. 语言风格是否匹配?
4. 是否有明显的时代错乱或OOC(Out Of Character)?

请回答:
- 如果符合: 只返回 "VALID"
- 如果不符合: 返回 "INVALID: [简述原因]"
`;

  const result = await validator.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100
  });

  const content = result.choices[0].message.content || '';

  if (content.startsWith('VALID')) {
    return { isValid: true };
  } else {
    const reason = content.replace('INVALID:', '').trim();
    return { isValid: false, reason };
  }
}
```

---

## 7. 开发规范

### 7.1 代码风格

```yaml
TypeScript规范:
  - 严格模式: strict: true
  - 所有函数必须有返回类型
  - 禁止使用any(特殊情况用unknown)
  - 接口优先于类型别名

命名规范:
  - 组件: PascalCase (RoundTable.tsx)
  - 工具函数: camelCase (calculatePosition)
  - 常量: UPPER_SNAKE_CASE (MAX_ROUNDS)
  - 类型/接口: PascalCase (Philosopher)
  - 私有方法: _camelCase (_validateInput)

文件组织:
  - 一个组件一个文件
  - 相关工具函数放在同一目录
  - 类型定义集中到types.ts
```

### 7.2 Git提交规范

```bash
# 提交信息格式
<type>(<scope>): <subject>

# type类型
feat:     新功能
fix:      Bug修复
refactor: 重构
style:    代码格式(不影响功能)
docs:     文档更新
test:     测试相关
chore:    构建/工具相关

# 示例
feat(roundtable): 实现椭圆桌布局算法
fix(chat): 修复流式响应中断问题
docs(readme): 更新部署说明
```

### 7.3 性能优化原则

```yaml
前端优化:
  - 使用React.memo避免不必要的重渲染
  - 虚拟滚动处理长对话历史
  - 懒加载哲学家头像图片
  - 使用CSS transform而非left/top动画

API优化:
  - 流式响应提升用户体验
  - 对话历史超过10轮自动摘要
  - 缓存常见哲学概念解释
  - 使用Edge Runtime降低冷启动

AI优化:
  - temperature: 0.8平衡创造性和一致性
  - max_tokens: 500控制成本
  - 使用gpt-4o-mini做验证
  - 并行请求多个哲学家(而非串行)
```

---

## 8. 部署方案

### 8.1 环境变量配置

```bash
# .env.local
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.8

# 可选: Vercel KV(对话历史缓存)
KV_URL=xxx
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx

# 可选: 分析和监控
NEXT_PUBLIC_GA_ID=xxx
```

### 8.2 Vercel部署配置

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

### 8.3 部署检查清单

- [ ] 环境变量已配置
- [ ] .gitignore包含敏感文件
- [ ] 构建成功(npm run build)
- [ ] 本地测试通过
- [ ] 哲学家数据完整
- [ ] System Prompt已验证
- [ ] 流式响应正常工作
- [ ] 移动端响应式测试
- [ ] 性能测试(首屏<3s)
- [ ] 成本估算(免费额度内)

---

## 9. 扩展性考虑

### 9.1 未来可扩展功能

1. **多语言支持** - 哲学家用各自语言风格表达(孔子用文言,康德用德语风格)
2. **知识图谱** - 可视化展示哲学家的思想关联
3. **用户参与** - 用户可以点赞观点,影响哲学家后续发言
4. **跨时空对话** - 当代哲学家评价古代思想
5. **辩论模式** - 两位哲学家围绕特定主题深度辩论
6. **教育模式** - 带着学习目标进行对话,结束后生成知识卡片
7. **社区分享** - 分享精彩对话片段,允许评论

### 9.2 技术升级路径

```
MVP (当前)
  ↓
AutoGen集成 (更强大的多智能体编排)
  ↓
向量数据库 (Pinecone/Weaviate - 精准的知识检索)
  ↓
微调模型 (Fine-tuning - 更准确的角色扮演)
  ↓
多模态 (展示哲学家画像、相关书籍封面)
```

---

## 10. 参考资源

### 10.1 技术文档

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [OpenAI API](https://platform.openai.com/docs)

### 10.2 哲学资源

- [斯坦福哲学百科全书](https://plato.stanford.edu)
- [互联网哲学百科全书](https://iep.utm.edu)
- [中国哲学书电子化计划](https://ctext.org)

### 10.3 相关项目

- [speaking_with_plato](https://github.com/IgorWounds/speaking_with_plato)
- [Character.AI](https://character.ai)
- [AutoGen](https://microsoft.github.io/autogen)

---

**文档版本**: v1.0
**最后更新**: 2026-02-08
**维护者**: Architecture Team
