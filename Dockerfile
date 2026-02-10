# 使用官方 Node.js 18 镜像作为基础
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 禁用遥测，设置构建环境变量
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 构建 Next.js 应用
RUN npm run build

# 生产运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口（ModelScope 默认端口）
EXPOSE 7860

ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
