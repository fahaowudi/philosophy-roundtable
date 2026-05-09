# 哲学圆桌会 - 启动指南

## 项目概述

哲学圆桌会是一个沉浸式哲学对话平台，用户可以选择话题和哲学家，参与多角色的圆桌讨论。

## 核心特性

- 5 位经典哲学家 - 苏格拉底、康德、孔子、尼采、老子
- 用户参与讨论 - 每轮结束后可以发言，哲学家会回应
- 三阶段讨论 - 定义 → 辩论 → 总结
- AI 旁白总结 - 定期自动生成讨论总结
- 对话历史 - 保存讨论记录，支持浏览和回放
- 玻璃拟态 UI - shadcn/ui + TailwindCSS + Framer Motion

## 快速开始

```bash
npm install
```

创建 `.env.local` 文件：

```bash
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

获取 API Key: https://platform.deepseek.com/api_keys

```bash
npm run dev
```

访问 http://localhost:3000

## 使用流程

1. 选择话题（热门话题或自定义问题）
2. 选择哲学家（1-5 位）
3. 点击"开始讨论"，哲学家轮流发言
4. 每轮结束后可以输入观点或跳过
5. 讨论结束后可保存对话记录

## 技术架构

```
Next.js 16 + React 19
    ↓
DiscussionFlow 组件 (讨论流程控制)
    ↓
API Routes (DeepSeek API)
    ├─ /api/chat       # 哲学家回复
    ├─ /api/narrator   # 旁白总结
    └─ /api/summary    # 讨论总结 (分享卡片)
```

部署: Cloudflare Pages (GitHub Actions 自动部署)

## 关键文件

| 文件                                  | 说明                    |
| ------------------------------------- | ----------------------- |
| `src/app/app/AppContent.tsx`          | 应用状态管理 (步骤向导) |
| `src/components/DiscussionFlow.tsx`   | 讨论流程核心逻辑        |
| `src/components/UserInput.tsx`        | 用户发言输入            |
| `src/components/ShareCard.tsx`        | 分享卡片 (html2canvas)  |
| `src/components/UpdateNotice.tsx`     | 版本更新公告            |
| `src/components/HistoryList.tsx`      | 历史记录列表            |
| `src/components/HistoryDetail.tsx`    | 历史详情回放            |
| `src/components/PhilosopherIntro.tsx` | 哲学家介绍页            |
| `src/lib/ai/philosophers.ts`          | 哲学家角色定义          |
| `src/lib/ai/prompts.ts`               | Prompt 模板             |
| `src/lib/storage.ts`                  | localStorage 持久化     |
| `src/app/api/chat/route.ts`           | 对话 API                |
| `src/app/api/narrator/route.ts`       | 旁白 API                |
| `src/app/api/summary/route.ts`        | 讨论总结 API            |

## 文档

- `README.md` - 项目说明
- `SETUP.md` - 详细设置指南
- `docs/ARCHITECTURE.md` - 系统架构

## 待开发功能

- [ ] 更多哲学家角色
- [ ] 语音 TTS 输出

## 常见问题

**Q: API 调用失败？**

- 检查 `.env.local` 文件
- 确认 DEEPSEEK_API_KEY 正确
- 检查 DeepSeek 账号余额

**Q: 端口被占用？**

```bash
npm run dev -- -p 3001
```
