# ModelScope Studio 部署指南

## 📦 部署准备

### 1. 确认文件
确保项目根目录包含以下文件：
- ✅ `Dockerfile` - Docker 构建配置
- ✅ `.dockerignore` - Docker 忽略文件
- ✅ `deploy_config.json` - ModelScope 部署配置
- ✅ `next.config.ts` - Next.js 配置（已启用 standalone 模式）

### 2. 环境变量配置
在 ModelScope Studio 控制台设置以下环境变量：
```
DEEPSEEK_API_KEY=你的DeepSeek API密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

## 🚀 部署步骤

### 方法一：通过 ModelScope 网页界面部署

1. **访问 ModelScope Studio**
   - 打开：https://studio.modelscope.cn
   - 登录你的账号

2. **创建新的创空间**
   - 点击「创建」或「+」按钮
   - 选择「从 Git 仓库导入」或「上传项目」

3. **配置部署**
   - 选择项目仓库或上传本地项目
   - SDK 类型选择：**Docker**
   - 端口设置：**7860**
   - 资源配置：**platform/2v-cpu-16g-mem**（免费）

4. **设置环境变量**
   - 在环境变量配置页面添加：
     - `DEEPSEEK_API_KEY`：你的 DeepSeek API 密钥
     - `DEEPSEEK_BASE_URL`：https://api.deepseek.com/v1

5. **启动部署**
   - 点击「部署」或「启动」按钮
   - 等待构建完成（首次构建可能需要 5-10 分钟）

### 方法二：通过 Git 仓库部署

1. **推送到 Git 仓库**
   ```bash
   git add .
   git commit -m "准备 ModelScope 部署"
   git push
   ```

2. **在 ModelScope Studio 导入**
   - 选择「从 Git 仓库导入」
   - 输入你的仓库地址
   - 配置同上

## 🌐 访问地址

部署成功后，你会获得一个类似这样的地址：
```
https://studio.modelscope.cn/studios/你的用户名/philosophy-roundtable
```

具体地址以 ModelScope Studio 控制台显示为准。

## ⚙️ 部署配置说明

### `deploy_config.json`
```json
{
  "$schema": "https://modelscope.cn/api/v1/studios/deploy_schema.json",
  "sdk_type": "docker",
  "resource_configuration": "platform/2v-cpu-16g-mem",
  "port": 7860
}
```

- **sdk_type**: `docker` - 使用容器化部署
- **port**: `7860` - ModelScope 默认端口
- **resource_configuration**: `platform/2v-cpu-16g-mem` - 免费资源配置（2核 CPU + 16G 内存）

### Dockerfile 说明
- 使用 Node.js 18 Alpine 基础镜像
- 多阶段构建优化镜像大小
- 自动暴露 7860 端口
- 使用非 root 用户运行（安全性）

## 🔍 故障排查

### 构建失败
1. 检查 `package.json` 中的依赖是否完整
2. 确认 `next.config.ts` 中 `output: 'standalone'` 已设置
3. 查看 ModelScope 构建日志

### 运行时错误
1. 检查环境变量是否正确配置
2. 确认 API Key 有效
3. 查看应用日志

### 无法访问
1. 检查端口是否为 7860
2. 确认部署状态为「运行中」
3. 等待 DNS 生效（可能需要几分钟）

## 📊 资源使用情况

- **CPU**: 2 核
- **内存**: 16 GB
- **费用**: 免费
- **适用场景**: 小型到中型 Web 应用

## 🎯 下一步

1. 完成部署后，访问你的创空间地址
2. 测试功能是否正常
3. 根据需要调整资源配置

---

**注意事项：**
- 免费资源可能会有限制，请关注 ModelScope 的使用政策
- API Key 请妥善保管，不要泄露
- 定期更新依赖以确保安全性
