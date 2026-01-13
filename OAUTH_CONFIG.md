# OAuth 配置说明

## 重要提示

为了安全起见，OAuth 凭据不包含在代码库中。您需要配置自己的 Google OAuth 凭据。

## 配置步骤

### 1. 获取 Google OAuth 凭据

如果您还没有 Google OAuth 凭据，请按照 `GOOGLE_OAUTH_SETUP.md` 中的说明创建。

### 2. 配置 manifest.json

打开 `manifest.json` 文件，找到 `oauth2` 部分：

```json
"oauth2": {
  "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ]
}
```

将 `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` 替换为您从 Google Cloud Console 获取的 Client ID。

**注意**：不要将包含真实 Client ID 的 manifest.json 提交到公开的代码库。

### 3. 配置 Supabase

1. 登录 Supabase Dashboard
2. 进入 Authentication → Providers
3. 启用 Google
4. 输入您的 Google OAuth Client ID
5. 输入您的 Google OAuth Client Secret
6. 保存

### 4. 配置环境变量

创建 `.env` 文件（如果还没有）：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 本地开发

配置完成后，运行：

```bash
npm run build
```

然后在 Chrome 浏览器中：
1. 访问 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 目录

## 安全建议

### Client ID vs Client Secret

- **Client ID**：相对安全，可以在客户端代码中使用（Chrome 扩展用户可以看到）
- **Client Secret**：绝对敏感，只能在服务器端使用，永远不要包含在客户端代码中

对于 Chrome 扩展：
- Client ID 配置在 `manifest.json` 中（必需）
- Client Secret 配置在 Supabase 中（安全）

### Git 配置

为了避免意外提交敏感信息：

1. 确保 `.env` 在 `.gitignore` 中
2. 不要提交包含真实 Client ID 的 `manifest.json`
3. 使用 `manifest.template.json` 作为参考

## 团队协作

如果您在团队中工作：

1. 每个开发者配置自己的 Google OAuth 凭据（用于开发）
2. 生产环境使用单独的 OAuth 凭据
3. 通过安全渠道（如密码管理器）共享凭据
4. 不要通过 Git、邮件或即时通讯工具发送凭据

## 故障排除

### 问题：登录时提示 "Invalid Client ID"

**解决方案**：
1. 检查 `manifest.json` 中的 Client ID 是否正确
2. 确认 Client ID 来自正确的 Google Cloud Console 项目
3. 验证 OAuth 同意屏幕已配置

### 问题：GitHub 阻止 push（检测到敏感信息）

**解决方案**：
1. 确保使用占位符（`YOUR_GOOGLE_CLIENT_ID`）而不是真实的 Client ID
2. 使用 `git reset` 移除包含敏感信息的提交
3. 重新创建不包含敏感信息的提交

## 参考资料

- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - Google OAuth 设置指南
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 设置指南
- [TESTING_OAUTH.md](./TESTING_OAUTH.md) - OAuth 测试指南

## 需要帮助？

如果您在配置过程中遇到问题：

1. 查看错误日志（Chrome DevTools Console）
2. 检查 Supabase Dashboard 中的日志
3. 验证所有配置步骤都已完成
4. 参考官方文档：
   - [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
   - [Supabase Auth](https://supabase.com/docs/guides/auth)
   - [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
