# 哲学圆桌会 - 项目状态

> **最后更新**: 2026-05-10

## 已完成功能

### 核心功能

- 话题选择（热门话题 + 自定义输入）
- 5 位哲学家选择（苏格拉底、康德、孔子、尼采、老子）
- 哲学家介绍页（了解每位思想家的背景与核心理念）
- 6 轮 3 阶段圆桌讨论（定义 → 辩论 → 总结）
- AI 旁白总结（定期自动插入）
- 用户参与讨论（每轮结束后发言或跳过）
- 对话历史保存（localStorage，最多 20 条，支持回放）
- AI 分享卡片（提炼每位哲学家核心观点，生成精美分享图 + 二维码）
- 版本更新公告弹窗（新功能通知，localStorage 记录已读）

### UI/UX

- 玻璃拟态设计（shadcn/ui + TailwindCSS v4）
- Framer Motion 动画
- 哲学家肖像头像（PNG 格式）
- Landing Page 营销页 + 联系开发者信息
- 响应式布局
- Cloudflare Web Analytics

### 技术架构

- Next.js 16 + React 19 + TypeScript
- DeepSeek API (deepseek-chat) AI 集成
- Cloudflare Pages 部署 (GitHub Actions CI/CD)

## 待开发功能

- [ ] 更多哲学家角色
- [ ] 语音 TTS 输出

## 技术栈

| 技术        | 版本/说明              |
| ----------- | ---------------------- |
| Next.js     | 16 (App Router)        |
| React       | 19                     |
| TypeScript  | 5                      |
| TailwindCSS | v4                     |
| AI 模型     | DeepSeek deepseek-chat |
| 截图生成    | html2canvas-pro        |
| 二维码      | qrcode.react           |
| 部署        | Cloudflare Pages       |

## 部署信息

- **平台**: Cloudflare Pages
- **CI/CD**: GitHub Actions (push to main 自动部署)
- **生产地址**: https://philosophy-roundtable.1417541455.workers.dev
- **仓库**: https://github.com/fahaowudi/philosophy-roundtable
