# 快速设置指南

## 1. 安装依赖

```bash
npm install
```

## 2. 配置 OpenAI API Key

### 获取 API Key

1. 访问 https://platform.openai.com/api-keys
2. 登录或注册 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制生成的 API Key

### 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，将你的 API Key 粘贴进去：

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
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
4. 观看哲学家们的圆桌讨论

## 常见问题

### Q: API 调用失败？

检查：
- `.env.local` 文件是否在项目根目录
- API Key 是否正确复制（没有多余空格）
- OpenAI 账号是否有余额

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

## 部署到 Vercel

### 方法 1: 通过 Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

在部署过程中，Vercel 会要求输入环境变量 `OPENAI_API_KEY`。

### 方法 2: 通过 GitHub

1. 将代码推送到 GitHub
2. 访问 https://vercel.com/new
3. 导入你的 GitHub 仓库
4. 在环境变量中添加 `OPENAI_API_KEY`
5. 点击 "Deploy"

## 开发建议

### 添加新的哲学家

编辑 `src/lib/ai/philosophers.ts`，添加新的哲学家对象：

```typescript
{
  id: 'new-philosopher',
  name: '哲学家名字',
  era: '年代',
  avatar: '🎭',
  color: 'bg-blue-500',
  coreIdeas: ['核心思想1', '核心思想2'],
  quotes: ['名言1', '名言2'],
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
