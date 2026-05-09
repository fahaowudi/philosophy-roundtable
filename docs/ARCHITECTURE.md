# 哲学圆桌会 - 系统架构

> **最后更新**: 2026-05-10

---

## 技术栈

| 层级 | 技术                         | 说明                   |
| ---- | ---------------------------- | ---------------------- |
| 框架 | Next.js 16 (App Router)      | React 19 + TypeScript  |
| UI   | shadcn/ui + TailwindCSS v4   | 玻璃拟态主题           |
| 动画 | Framer Motion                | 消息、过渡动画         |
| AI   | DeepSeek API (deepseek-chat) | 通过 OpenAI SDK 调用   |
| 部署 | Cloudflare Pages             | @opennextjs/cloudflare |
| 分析 | Cloudflare Web Analytics     | beacon.min.js          |

---

## 系统架构

```
浏览器
  │
  ├─ / (Landing Page) ─ 静态营销页
  └─ /app ──────────── 应用主界面 (AppContent)
       │
       ├─ TopicInput ──────── 话题选择
       ├─ PhilosopherSelector ─ 哲学家选择 (1-5位)
       └─ DiscussionFlow ──── 讨论流程核心
            │
            ├─ POST /api/chat ──── 生成哲学家回复
            ├─ POST /api/narrator ─ 生成旁白总结
            ├─ POST /api/summary ── 生成讨论总结（分享卡片用）
            ├─ UserInput ──────── 用户参与讨论
            └─ ShareCard ───────── 生成分享图 (html2canvas)

  Landing Page (/)
       ├─ UpdateNotice ─────── 版本更新公告弹窗
       └─ Footer ────────────── 联系开发者信息
```

---

## 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts         # 哲学家对话 API (DeepSeek)
│   │   ├── narrator/route.ts     # 旁白总结 API
│   │   └── summary/route.ts      # 讨论总结 API (分享卡片用)
│   ├── layout.tsx                # 根布局 (含 Cloudflare Analytics)
│   ├── page.tsx                  # Landing Page
│   └── app/page.tsx              # 应用入口
├── components/
│   ├── ui/                       # shadcn/ui 基础组件
│   ├── landing/                  # 落地页组件 (Hero, Footer 等)
│   ├── DiscussionFlow.tsx        # 讨论流程控制 (核心)
│   ├── DialogueBubble.tsx        # 对话气泡
│   ├── UserInput.tsx             # 用户发言输入
│   ├── ShareCard.tsx             # 分享卡片 (html2canvas + QR code)
│   ├── UpdateNotice.tsx          # 版本更新公告弹窗
│   ├── PhaseIndicator.tsx        # 阶段进度指示
│   ├── ContinuePrompt.tsx        # 继续提示
│   ├── PhilosopherCard.tsx       # 哲学家卡片
│   ├── PhilosopherSelector.tsx   # 选择器
│   ├── PhilosopherIntro.tsx      # 哲学家介绍
│   ├── TopicInput.tsx            # 话题输入
│   ├── HistoryList.tsx           # 历史列表
│   ├── HistoryDetail.tsx         # 历史详情回放
│   └── AppContent.tsx            # 应用状态管理 (步骤向导)
├── hooks/
│   └── useMessageSound.ts        # 消息通知音效 (Web Audio API)
├── lib/
│   ├── ai/
│   │   ├── philosophers.ts       # 5 位哲学家定义
│   │   └── prompts.ts            # Prompt 模板
│   └── storage.ts                # localStorage 持久化 (最多 20 条)
└── types/
    ├── discussion.ts             # Message, Discussion, Philosopher
    └── history.ts                # DiscussionHistory
```

---

## 数据模型

### Philosopher

```typescript
interface Philosopher {
  id: string; // 'socrates' | 'kant' | 'confucius' | 'nietzsche' | 'laozi'
  name: string; // 显示名
  era: string; // 年代
  avatar: string; // emoji
  image: string; // PNG 头像路径
  color: string; // Tailwind 色类
  systemPrompt: string; // 角色指令
  coreIdeas: string[]; // 核心思想
  quotes: string[]; // 名言
  bio: string; // 生平
}
```

### Message

```typescript
interface Message {
  id: string;
  philosopherId: string; // 'narrator' | 'user' | 哲学家 id
  philosopherName: string; // 'AI 旁白' | '你' | 哲学家名
  content: string;
  timestamp: Date;
  phase: "defining" | "debating" | "concluding" | "narrator";
  replyTo?: string;
  replyToName?: string;
  isUser?: boolean; // 用户消息标记
}
```

---

## 讨论流程

```
选话题 → 选哲学家 → 点击开始
                          │
              ┌───────────┴───────────┐
              │  Round Robin (6 轮)    │
              │                       │
              │  defining (0-1轮)     │
              │  debating (2-3轮)     │
              │  concluding (4-5轮)   │
              │                       │
              │  每轮:                │
              │  1. 哲学家轮流发言    │
              │  2. 检查旁白插入      │
              │  3. 检查阶段转换      │
              │  4. 用户输入/跳过     │
              └───────────┬───────────┘
                          │
                     讨论结束 → 收束总结 → 保存
```

**轮次控制**: `MAX_ROUNDS = 6`，每位哲学家每轮发言一次。旁白间隔 = `max(philosophers.length * 2, 4)` 条非旁白消息。

**用户参与**: 每轮结束后暂停，用户可输入观点或跳过。用户消息作为上下文传入下一轮，哲学家会回应引用。

---

## API

### POST /api/chat

生成哲学家回复。

```typescript
// Request
{
  philosopher: { id, name, systemPrompt },
  topic: string,
  phase: 'defining' | 'debating' | 'concluding',
  history: Message[]
}

// Response
{ content: string }
```

DeepSeek `deepseek-chat` 模型，temperature 0.8，max_tokens 320。上下文取最近 3 条非旁白消息。

### POST /api/narrator

生成旁白总结。

```typescript
// Request
{ messages: Message[], topic: string }

// Response
{ content: string }
```

temperature 0.7，max_tokens 200。总结控制在 80 字以内。

### POST /api/summary

生成讨论总结（用于分享卡片）。

```typescript
// Request
{ topic: string, messages: Message[], philosophers: { id, name }[] }

// Response
{
  philosophers: [{ id: string, name: string, summary: string }],
  conclusion: string
}
```

temperature 0.6，max_tokens 800。为每位哲学家提炼核心观点，语气符合人设。

---

## 部署

- **平台**: Cloudflare Pages
- **工具**: @opennextjs/cloudflare
- **CI**: GitHub Actions (push to main 自动部署)
- **生产地址**: https://philosophy-roundtable.1417541455.workers.dev
- **环境变量**: DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL (配置在 Cloudflare Worker secrets)

---

## 数据持久化

仅客户端 localStorage，键 `philosophy-discussions`，最多存储 20 条讨论记录。支持浏览历史、查看详情、删除。
