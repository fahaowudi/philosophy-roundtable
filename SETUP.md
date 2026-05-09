# 快速设置指南

## 1. 安装依赖

```bash
npm install
```

## 2. 配置 DeepSeek API Key

### 获取 API Key

1. 访问 https://platform.deepseek.com/api_keys
2. 登录或注册 DeepSeek 账号
3. 创建 API Key
4. 复制生成的 API Key

### 配置环境变量

创建 `.env.local` 文件：

```bash
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

## 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 4. 测试功能

1. 选择一个热门话题或输入自己的问题
2. 选择哲学家（默认推荐：苏格拉底、康德、孔子）
3. 点击"开始讨论"
4. 观看哲学家们的圆桌讨论，每轮结束后可以发言参与

## 常见问题

### Q: API 调用失败？

检查：

- `.env.local` 文件是否在项目根目录
- API Key 是否正确复制（没有多余空格）
- DeepSeek 账号是否有余额

### Q: 页面样式错乱？

删除 `.next` 文件夹并重新启动：

```bash
rm -rf .next
npm run dev
```

### Q: 端口 3000 被占用？

指定其他端口：

```bash
npm run dev -- -p 3001
```

## 部署到 Cloudflare Pages

项目通过 GitHub Actions 自动部署。推送 main 分支即可触发。

环境变量在 Cloudflare Worker 中配置：

- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`

## 开发建议

### 添加新的哲学家

编辑 `src/lib/ai/philosophers.ts`，添加新的哲学家对象：

```typescript
{
  id: 'new-philosopher',
  name: '哲学家名字',
  era: '年代',
  avatar: '🎭',
  image: '/philosophers/new-philosopher.png',
  color: 'bg-blue-500',
  coreIdeas: ['核心思想1', '核心思想2'],
  quotes: ['名言1', '名言2'],
  bio: '生平简介...',
  systemPrompt: `你的 system prompt...`,
}
```

### 修改对话轮数

编辑 `src/components/DiscussionFlow.tsx`：

```typescript
const MAX_ROUNDS = 6; // 修改这个值
```

### 调整 AI 参数

编辑 `src/app/api/chat/route.ts`：

```typescript
temperature: 0.8,  // 创造性（0-1）
max_tokens: 300,   // 最大回复长度
```

---

🎉 享受哲学之旅！
