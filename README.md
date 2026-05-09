# 哲学圆桌会 (Philosophy Roundtable)

一个沉浸式哲学对话平台，让用户参与多位哲学家的圆桌讨论，获得对日常问题和哲学概念的深度思考启发。

## ✨ 特性

- 🎭 **多角色对话** - 邀请多位哲学家围绕你的问题展开讨论
- 💭 **沉浸式体验** - 旁听哲学家之间的对话和辩论
- 🗣️ **用户参与** - 每轮结束后可以发言，哲学家会回应你的观点
- 🌍 **东西方哲学家** - 包含苏格拉底、康德、孔子、尼采、老子等经典哲学家
- 🎯 **启发式输出** - 不是给标准答案，而是激发你思考
- 📖 **AI 旁白总结** - 每 N 轮对话自动生成总结，帮助理解讨论进展
- 💾 **对话历史** - 保存讨论记录，支持浏览和回放
- 🖼️ **分享卡片** - AI 提炼讨论精华，生成精美分享图，一键传播
- 📢 **版本更新** - 新功能公告弹窗，及时了解最新变化

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
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

获取 DeepSeek API Key: https://platform.deepseek.com/api_keys

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📦 技术栈

- **框架**: Next.js 16 (App Router) + React 19
- **UI 组件**: shadcn/ui + TailwindCSS v4
- **AI 集成**: DeepSeek API (deepseek-chat)
- **动画**: Framer Motion
- **部署**: Cloudflare Pages
- **截图**: html2canvas-pro
- **二维码**: qrcode.react
- **图标**: Lucide React

## 🏗️ 项目结构

```
philosophy-roundtable/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── chat/          # 对话 API
│   │   │   ├── narrator/      # 旁白总结 API
│   │   │   └── summary/       # 讨论总结 API (分享卡片)
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing Page
│   │   └── app/page.tsx       # 应用入口
│   ├── components/            # React 组件
│   │   ├── ui/               # shadcn/ui 基础组件
│   │   ├── landing/          # 落地页组件 (Hero, Footer)
│   │   ├── DiscussionFlow.tsx
│   │   ├── DialogueBubble.tsx
│   │   ├── UserInput.tsx
│   │   ├── ShareCard.tsx
│   │   ├── UpdateNotice.tsx
│   │   ├── HistoryList.tsx
│   │   ├── HistoryDetail.tsx
│   │   ├── PhilosopherIntro.tsx
│   │   ├── PhilosopherSelector.tsx
│   │   └── TopicInput.tsx
│   ├── lib/                  # 工具函数和配置
│   │   ├── ai/
│   │   │   ├── philosophers.ts  # 哲学家 System Prompts
│   │   │   └── prompts.ts      # Prompt 模板
│   │   └── storage.ts          # localStorage 持久化
│   └── types/                # TypeScript 类型定义
│       ├── discussion.ts
│       └── history.ts
├── .env.local
└── package.json
```

## 🎨 使用流程

1. **选择话题** - 从热门话题中选择或输入自己的问题
2. **选择哲学家** - 选择 1-5 位哲学家参与讨论
3. **开始讨论** - 哲学家们将轮流发表见解
4. **参与对话** - 每轮结束后可以发言或跳过
5. **获得启发** - 通过对话和旁白总结，获得深度思考

## 💰 成本估算

使用 DeepSeek (deepseek-chat) 模型：

- 单次对话（3 位哲学家 × 6 轮）：约 ¥0.01
- 月度运营（1000 次对话）：约 ¥10

## 🚀 部署

### Cloudflare Pages（当前）

项目通过 GitHub Actions 自动部署到 Cloudflare Pages。推送 main 分支即可触发。

### Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 📝 开发计划

- [x] 基础对话功能
- [x] 多角色轮换机制
- [x] AI 旁白总结
- [x] 响应式 UI
- [x] 用户参与讨论功能
- [x] 对话历史保存
- [x] AI 分享卡片
- [x] 哲学家介绍页
- [x] 版本更新公告
- [ ] 更多哲学家角色
- [ ] 语音 TTS 输出

### 近期更新 (2026-05)

- AI 分享卡片 — 提炼每位哲学家核心观点，生成精美分享图 + 二维码
- 历史记录升级 — 卡片展示观点摘要，详情页支持分享
- 哲学家介绍页 — 了解每位思想家的背景与核心理念
- 用户参与讨论 — 每轮结束后可以发言，哲学家会回应
- 版本更新公告 — 首次访问展示新功能

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ for Philosophy Lovers
