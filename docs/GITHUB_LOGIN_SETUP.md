# GitHub 登录配置指南

本文档说明如何配置 GitHub OAuth 登录功能。

## 📋 前置条件

- Supabase 项目
- Chrome 扩展已发布或已获取扩展 ID

## 🔧 配置步骤

### 1. 在 GitHub 创建 OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: `QA SidePanel` (或你的应用名称)
   - **Homepage URL**: `https://your-project.supabase.co`
   - **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`
     
     > 💡 将 `your-project` 替换为你的 Supabase 项目引用 ID

4. 点击 "Register application"
5. 复制生成的 **Client ID**
6. 点击 "Generate a new client secret" 并复制 **Client Secret**

### 2. 在 Supabase 配置 GitHub Provider

1. 访问你的 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 导航到 **Authentication** > **Providers**
4. 找到 **GitHub** 并启用它
5. 填写配置：
   - **Client ID**: 粘贴从 GitHub 复制的 Client ID
   - **Client Secret**: 粘贴从 GitHub 复制的 Client Secret
6. 点击 "Save"

### 3. 配置 Chrome 扩展 Redirect URL

#### 3.1 获取扩展 ID

- **已发布扩展**: 在 Chrome Web Store 可以找到
- **开发中扩展**: 在 `chrome://extensions/` 页面查看

#### 3.2 添加 Redirect URL 到 Supabase

1. 在 Supabase Dashboard，导航到 **Authentication** > **URL Configuration**
2. 在 **Redirect URLs** 部分，添加：
   ```
   https://<extension-id>.chromiumapp.org/
   ```
   将 `<extension-id>` 替换为你的扩展 ID

3. 点击 "Save"

#### 3.3 更新 GitHub OAuth App

1. 回到 [GitHub Developer Settings](https://github.com/settings/developers)
2. 选择你创建的 OAuth App
3. 在 **Authorization callback URL** 中添加：
   ```
   https://<extension-id>.chromiumapp.org/
   ```
   
   > ⚠️ 注意：GitHub 只允许一个回调 URL，你可能需要：
   > - 为开发和生产创建两个不同的 OAuth App
   > - 或使用通配符（如果 GitHub 支持）

4. 点击 "Update application"

### 4. 更新 manifest.json

确保你的 `manifest.json` 包含必要的权限：

```json
{
  "permissions": [
    "identity",
    "storage"
  ],
  "oauth2": {
    "client_id": "YOUR_EXTENSION_ID.apps.googleusercontent.com",
    "scopes": ["openid", "email", "profile"]
  }
}
```

## 🧪 测试

1. 重新加载扩展
2. 点击登录页面的 "使用 GitHub 账号登录" 按钮
3. 应该会打开 GitHub 授权页面
4. 授权后，应该自动登录到应用

## ❓ 常见问题

### Q: 出现 "redirect_uri_mismatch" 错误

**A**: 检查以下内容：
- Supabase 中的 Redirect URL 配置是否正确
- GitHub OAuth App 的回调 URL 是否包含扩展 ID
- 扩展 ID 是否正确（注意大小写）

### Q: 授权后没有自动登录

**A**: 
1. 打开浏览器控制台查看错误信息
2. 检查 Supabase 项目的 Authentication logs
3. 确认 Client ID 和 Client Secret 配置正确

### Q: 开发和生产环境如何处理？

**A**: 建议创建两个 GitHub OAuth App：
- `QA SidePanel (Dev)` - 用于开发
- `QA SidePanel (Prod)` - 用于生产

每个使用不同的扩展 ID 作为回调 URL。

## 🔐 安全建议

1. **永远不要提交** Client Secret 到代码仓库
2. 使用环境变量管理敏感信息
3. 定期轮换 Client Secret
4. 在 GitHub OAuth App 中限制应用权限范围

## 📚 参考资料

- [Supabase GitHub Auth 文档](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)

## 🆘 需要帮助？

如果遇到问题，请检查：
1. 浏览器控制台的错误信息
2. Supabase Dashboard 的 Authentication Logs
3. GitHub OAuth App 的设置
