# 🚀 哲学圆桌会 - 启动指南

## 📋 项目概述

**哲学圆桌会** 是一个沉浸式哲学对话平台，让用户通过旁听多位哲学家的圆桌讨论，获得对日常问题和哲学概念的深度思考启发。

## ✨ 核心特性

- 🎭 **5 位经典哲学家** - 苏格拉底、康德、孔子、尼采、老子
- 💭 **沉浸式对话体验** - 旁听哲学家之间的辩论和交流
- 🔄 **三阶段讨论** - 定义 → 辩论 → 总结
- 📖 **AI 旁白总结** - 每 3 轮自动生成讨论总结
- 🎨 **现代化 UI** - shadcn/ui + TailwindCSS + Framer Motion

## ⚡ 快速开始

### 1️⃣ 安装依赖

```bash
cd philosophy-roundtable
npm install
```

### 2️⃣ 配置 OpenAI API Key

创建 `.env.local` 文件：

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

获取 API Key: https://platform.openai.com/api-keys

### 3️⃣ 启动开发服务器

```bash
npm run dev
```

### 4️⃣ 打开浏览器

访问 http://localhost:3000

## 🎮 使用流程

```
1️⃣ 选择话题
   ├── 热门话题（一键选择）
   └── 自定义问题

2️⃣ 选择哲学家
   ├── 推荐阵容（苏格拉底、康德、孔子）
   └── 自选组合（1-5 位）

3️⃣ 开始讨论
   ├── 点击"开始讨论"
   ├── 观看哲学家轮流发言
   └── 每 3 轮有 AI 旁白总结

4️⃣ 获得启发
   └── 对话结束后查看见解总结
```

## 🏗️ 技术架构

```
用户界面 (Next.js 14)
    ↓
DiscussionFlow 组件
    ↓
API Routes
    ├─ /api/chat       # 生成哲学家回复
    └─ /api/narrator   # 生成旁白总结
    ↓
OpenAI API (GPT-4o-mini)
```

## 📁 关键文件

| 文件 | 说明 |
|------|------|
| `src/app/page.tsx` | 主页面，流程控制 |
| `src/components/DiscussionFlow.tsx` | 讨论流程核心逻辑 |
| `src/lib/ai/philosophers.ts` | 哲学家角色定义 |
| `src/app/api/chat/route.ts` | 对话 API |
| `src/app/api/narrator/route.ts` | 旁白 API |

## 🎨 自定义

### 添加新哲学家

编辑 `src/lib/ai/philosophers.ts`:

```typescript
{
  id: 'new-philosopher',
  name: '哲学家名字',
  era: '年代',
  avatar: '🎭',
  color: 'bg-blue-500',
  coreIdeas: ['核心思想1', '核心思想2'],
  quotes: ['名言1'],
  systemPrompt: `你的 system prompt...`,
}
```

### 修改讨论轮数

编辑 `src/components/DiscussionFlow.tsx`:

```typescript
const MAX_ROUNDS = 6; // 改成你想要的轮数
```

### 调整 AI 参数

编辑 `src/app/api/chat/route.ts`:

```typescript
temperature: 0.8,  // 0-1，越高越有创造性
max_tokens: 300,   // 最大回复长度
```

## 🚀 部署

### Vercel (推荐)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 其他平台

本项目是标准 Next.js 应用，可部署到任何支持的平台。

## 💰 成本

- **单次对话**: ~$0.003 (3 位哲学家 × 6 轮)
- **月度运营**: ~$3 (1000 次对话)
- **模型**: GPT-4o-mini (高性价比)

## 📚 文档

- `README.md` - 项目说明
- `SETUP.md` - 详细设置指南
- `PROJECT_STATUS.md` - 项目完成状态

## 🎯 下一步

### 功能扩展
- [ ] 用户参与讨论
- [ ] 对话历史保存
- [ ] 语音 TTS 输出
- [ ] 更多哲学家角色

### 技术优化
- [ ] 引入向量数据库（RAG）
- [ ] 使用 AutoGen 框架
- [ ] 对话图谱可视化

## 🐛 常见问题

**Q: API 调用失败？**
- 检查 `.env.local` 文件
- 确认 API Key 正确
- 检查 OpenAI 账号余额

**Q: 端口被占用？**
```bash
npm run dev -- -p 3001
```

**Q: 样式错乱？**
```bash
rm -rf .next
npm run dev
```

## 🎉 享受哲学之旅！

---

Made with ❤️ for Philosophy Lovers
