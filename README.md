# 哲学圆桌会 (Philosophy Roundtable)

一个沉浸式哲学对话平台，让用户通过旁听多位哲学家的圆桌讨论，获得对日常问题和哲学概念的深度思考启发。

## ✨ 特性

- 🎭 **多角色对话** - 邀请多位哲学家围绕你的问题展开讨论
- 💭 **沉浸式体验** - 旁听哲学家之间的对话和辩论
- 🌍 **东西方哲学家** - 包含苏格拉底、康德、孔子、尼采、老子等经典哲学家
- 🎯 **启发式输出** - 不是给标准答案，而是激发你思考
- 📖 **AI 旁白总结** - 每 3 轮对话自动生成总结，帮助理解讨论进展

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件：

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

获取 OpenAI API Key: https://platform.openai.com/api-keys

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📦 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 组件**: shadcn/ui + TailwindCSS
- **AI 集成**: OpenAI API (GPT-4o-mini)
- **动画**: Framer Motion
- **图标**: Lucide React

## 🏗️ 项目结构

```
philosophy-roundtable/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── chat/          # 对话 API
│   │   │   └── narrator/      # 旁白总结 API
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # React 组件
│   │   ├── ui/               # shadcn/ui 基础组件
│   │   ├── PhilosopherCard.tsx
│   │   ├── DialogueBubble.tsx
│   │   ├── TopicInput.tsx
│   │   ├── PhilosopherSelector.tsx
│   │   └── DiscussionFlow.tsx
│   ├── lib/                  # 工具函数和配置
│   │   └── ai/
│   │       ├── philosophers.ts  # 哲学家 System Prompts
│   │       └── prompts.ts      # Prompt 模板
│   └── types/                # TypeScript 类型定义
│       └── discussion.ts
├── .env.local
└── package.json
```

## 🎨 使用流程

1. **选择话题** - 从热门话题中选择或输入自己的问题
2. **选择哲学家** - 选择 1-5 位哲学家参与讨论
3. **开始讨论** - 哲学家们将轮流发表见解
4. **获得启发** - 通过对话和旁白总结，获得深度思考

## 💰 成本估算

使用 GPT-4o-mini 模型：

- 单次对话（3 位哲学家 × 6 轮）：约 $0.003
- 月度运营（1000 次对话）：约 $3

## 🚀 部署

### Vercel 部署（推荐）

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 其他平台

本项目是标准的 Next.js 应用，可部署到任何支持 Next.js 的平台。

## 📝 开发计划

- [x] 基础对话功能
- [x] 多角色轮换机制
- [x] AI 旁白总结
- [x] 响应式 UI
- [ ] 用户参与讨论功能
- [x] 对话历史保存
- [ ] 更多哲学家角色
- [ ] 语音 TTS 输出

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ for Philosophy Lovers
