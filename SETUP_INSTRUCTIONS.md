# 快速设置指南

本项目需要配置 Google OAuth 凭据才能正常使用登录功能。

## ⚠️ 重要：首次使用前必读

代码库中**不包含** OAuth 凭据（出于安全考虑）。您需要按照以下步骤配置：

## 快速开始

### 1. 配置 manifest.json

打开 `manifest.json` 文件，找到第 18 行：

```json
"client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

将其替换为您的 Google OAuth Client ID。

💡 **提示**：如果您没有 Client ID，请参考 `GOOGLE_OAUTH_SETUP.md` 创建一个。

### 2. 配置 Supabase

确保在 Supabase Dashboard 中：
1. 已启用 Google OAuth Provider
2. 已输入 Client ID 和 Client Secret

### 3. 配置环境变量

创建 `.env` 文件：

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. 构建和测试

```bash
npm install
npm run build
```

然后在 Chrome 中加载扩展（`chrome://extensions/` → 加载 `dist` 目录）。

## 详细文档

- 📖 [OAUTH_CONFIG.md](./OAUTH_CONFIG.md) - 完整的 OAuth 配置说明
- 🔧 [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - 如何创建 Google OAuth 凭据
- 🧪 [TESTING_OAUTH.md](./TESTING_OAUTH.md) - 如何测试登录功能

## 为什么凭据不在代码库中？

出于安全最佳实践：
- ❌ 不要在公开代码库中提交 OAuth Client Secret
- ⚠️ Client ID 虽然相对安全，但也应该由用户自行配置
- ✅ 每个开发者/部署环境应使用独立的凭据

## 需要帮助？

如果遇到配置问题，请查看：
1. [OAUTH_CONFIG.md](./OAUTH_CONFIG.md) 中的故障排除部分
2. Chrome DevTools Console 中的错误日志
3. Supabase Dashboard 中的 Auth 日志

---

**注意**：配置完成后，不要将包含真实凭据的文件提交到 Git！
