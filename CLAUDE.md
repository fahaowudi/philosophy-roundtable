# CLAUDE.md

## 项目

哲学圆桌会 — 沉浸式哲学多角色对话平台。用户选择话题和哲学家，参与 AI 驱动的圆桌讨论。

## 技术栈

- Next.js 16 + React 19 + TypeScript
- TailwindCSS v4 (玻璃拟态主题: `glass`, `glass-strong`, `shadow-glass`)
- DeepSeek API (deepseek-chat)，通过 OpenAI SDK 调用
- Framer Motion 动画
- Cloudflare Pages 部署 (GitHub Actions CI/CD)

## 环境变量

```
DEEPSEEK_API_KEY=xxx
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

## 关键路径

- 讨论流程核心: `src/components/DiscussionFlow.tsx` (MAX_ROUNDS=6, 3 阶段)
- 哲学家定义: `src/lib/ai/philosophers.ts` (5 位)
- Prompt 模板: `src/lib/ai/prompts.ts`
- API 路由: `src/app/api/chat/route.ts`, `src/app/api/narrator/route.ts`, `src/app/api/summary/route.ts`
- 历史持久化: `src/lib/storage.ts` (localStorage, 20 条上限)
- 应用状态管理: `src/app/app/AppContent.tsx` (步骤向导)
- 用户输入: `src/components/UserInput.tsx`
- 分享卡片: `src/components/ShareCard.tsx` (html2canvas + QR code)
- 更新公告: `src/components/UpdateNotice.tsx` (localStorage 记录已读)
- 历史记录: `src/components/HistoryList.tsx`, `src/components/HistoryDetail.tsx`
- 哲学家介绍: `src/components/PhilosopherIntro.tsx`

## 部署

push main → GitHub Actions → Cloudflare Pages。约 60 秒完成。

## 约定

- 安装依赖用 `npm ci --legacy-peer-deps`
- 组件风格: 玻璃拟态 (`glass-strong`), 圆角 `rounded-2xl` / `rounded-[2rem]`
- 所有 UI 文案中文，代码标识符英文
