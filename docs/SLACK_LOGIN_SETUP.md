# Slack 登录配置指南

## 📋 概述

本文档说明如何配置 Slack OAuth 登录功能，允许用户使用 Slack 账号登录 QA Sider。

---

## 🔧 配置步骤

### 1. 在 Slack API 创建应用

1. **访问 Slack API 网站**
   - 打开 https://api.slack.com/apps
   - 使用您的 Slack 账号登录

2. **创建新应用**
   - 点击 "Create New App"
   - 选择 "From scratch"
   - 填写应用名称（例如：QA Sider）
   - 选择开发 Workspace
   - 点击 "Create App"

3. **配置 OAuth & Permissions**
   - 在左侧菜单点击 "OAuth & Permissions"
   - 滚动到 "Redirect URLs" 部分
   - 点击 "Add New Redirect URL"
   - 添加以下 URL：
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - 点击 "Add"
   - 点击 "Save URLs"

4. **配置 Scopes（权限范围）**
   - 在同一页面滚动到 "Scopes" 部分
   - 在 "User Token Scopes" 下添加以下权限：
     - `users:read` - 查看用户信息
     - `users:read.email` - 查看用户邮箱
   - 点击 "Save Changes"

5. **获取 Client ID 和 Client Secret**
   - 在左侧菜单点击 "Basic Information"
   - 滚动到 "App Credentials" 部分
   - 复制 `Client ID`
   - 点击 "Show" 并复制 `Client Secret`
   - **重要**：妥善保存 Client Secret

6. **安装应用到 Workspace（可选）**
   - 在左侧菜单点击 "Install App"
   - 点击 "Install to Workspace"
   - 授权应用访问权限
   - 这一步用于测试，不影响用户登录

---

### 2. 在 Supabase 配置 Slack Provider

1. **打开 Supabase Dashboard**
   - 访问 https://app.supabase.com
   - 选择您的项目

2. **配置 Slack Provider**
   - 进入 `Authentication` → `Providers`
   - 找到 `Slack` 并启用
   - 填写配置：
     ```
     Client ID: [从 Slack API 获取的 Client ID]
     Client Secret: [从 Slack API 获取的 Client Secret]
     ```

3. **配置 Redirect URLs**
   - 在 `Authentication` → `URL Configuration`
   - 确保 Redirect URLs 包含：
     ```
     https://[您的 Chrome 扩展 ID].chromiumapp.org/
     ```
   - 获取 Chrome 扩展 ID 方法：
     - 打开 `chrome://extensions/`
     - 找到 QA Sider 扩展
     - 复制扩展 ID

4. **保存配置**
   - 点击 Save 保存所有更改

---

### 3. 更新 Chrome 扩展配置

1. **manifest.json 已包含必要权限**
   ```json
   "host_permissions": [
     "https://slack.com/*",
     "https://*.slack.com/*",
     "https://api.slack.com/*"
   ]
   ```

2. **重新构建扩展**
   ```bash
   npm run build
   ```

3. **重新加载扩展**
   - 打开 `chrome://extensions/`
   - 找到 QA Sider
   - 点击 "重新加载" 按钮

---

## 🧪 测试登录

### 1. 打开登录页面
   - 点击扩展图标
   - 在登录页面找到 "使用 Slack 账号登录" 按钮

### 2. 点击登录
   - 会弹出 Slack OAuth 授权窗口
   - 选择您要使用的 Workspace
   - 使用您的 Slack 账号登录
   - 授权应用访问权限

### 3. 验证登录
   - 授权后会自动跳转回扩展
   - 检查是否显示用户信息
   - 测试保存和同步功能

---

## 🔍 故障排除

### 问题 1：授权页面无法加载

**可能原因**：
- Redirect URL 配置错误
- Chrome 扩展 ID 不匹配
- manifest.json 缺少必要权限

**解决方案**：
1. 确认 Slack 和 Supabase Redirect URLs 配置正确
2. 确认使用正确的 Chrome 扩展 ID
3. 检查 manifest.json 的 host_permissions

### 问题 2：OAuth 返回错误

**可能原因**：
- Client ID 或 Client Secret 错误
- Slack App 权限配置不正确
- 回调 URL 不匹配

**解决方案**：
1. 重新检查 Supabase 中的 Client ID 和 Secret
2. 确认 Slack App 已添加必要的 User Token Scopes
3. 确认所有回调 URL 完全匹配

### 问题 3：登录成功但无法获取用户信息

**可能原因**：
- Slack App 缺少 `users:read.email` 权限
- Token 解析失败
- Supabase session 设置失败

**解决方案**：
1. 检查 Slack App 是否添加了 `users:read.email` scope
2. 打开浏览器控制台查看详细错误
3. 检查 Supabase 项目是否正常运行

### 问题 4：提示 "invalid_scope"

**可能原因**：
- Slack App 配置的 Scopes 与请求的不匹配

**解决方案**：
1. 确保在 Slack API 的 "OAuth & Permissions" 中添加了：
   - `users:read`
   - `users:read.email`
2. 保存后重新安装应用到 Workspace
3. 清除浏览器缓存后重试

---

## 📊 调试信息

登录过程会在控制台输出详细日志：

```
🚀 [步骤 1/5] 开始 Slack OAuth 登录流程...
📡 [步骤 2/5] 从 Supabase 获取 OAuth URL...
🌐 [步骤 3/5] 启动 OAuth 认证窗口...
🔑 [步骤 4/5] 提取认证令牌...
💾 [步骤 5/5] 设置 Supabase 会话...
🎉 Slack 登录完成！
```

如果遇到错误，日志会显示：
```
❌ Slack Identity 登录失败: [错误信息]
```

---

## 🔐 安全注意事项

1. **保护密钥**
   - 永远不要将 Client Secret 提交到代码库
   - 使用环境变量或 Supabase 管理密钥

2. **权限最小化**
   - 只请求必要的 Slack 权限
   - `users:read` 和 `users:read.email` 对于基本登录已足够

3. **HTTPS 要求**
   - 所有 OAuth 回调必须使用 HTTPS
   - Chrome 扩展使用 chromiumapp.org 协议

4. **Workspace 隔离**
   - 每个 Workspace 需要单独安装应用
   - 用户只能使用已安装应用的 Workspace 登录

---

## 📝 Slack OAuth Scopes 说明

### User Token Scopes（用户令牌权限）

| Scope | 说明 | 必需性 |
|-------|------|--------|
| `users:read` | 查看用户基本信息 | ✅ 必需 |
| `users:read.email` | 查看用户邮箱地址 | ✅ 必需 |
| `users:read.profile` | 查看用户详细资料 | ⚪ 可选 |

---

## 📝 相关文档

- [Slack API Documentation](https://api.slack.com/docs)
- [Slack OAuth Guide](https://api.slack.com/authentication/oauth-v2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)

---

## ✅ 配置检查清单

- [ ] Slack API 创建应用
- [ ] 获取 Client ID 和 Client Secret
- [ ] 配置 Slack OAuth 回调 URL
- [ ] 添加必要的 User Token Scopes（users:read, users:read.email）
- [ ] Supabase 启用 Slack Provider
- [ ] Supabase 配置 Client ID 和 Secret
- [ ] Supabase 添加 Chrome 扩展 Redirect URL
- [ ] manifest.json 包含 Slack 域名权限
- [ ] 重新构建并加载扩展
- [ ] 测试登录流程
- [ ] 验证用户信息显示

---

## 💡 提示

1. **Workspace 选择**
   - 登录时用户可以选择任何已安装该应用的 Workspace
   - 建议在开发阶段创建测试 Workspace

2. **多个 Workspace**
   - 如果应用需要在多个 Workspace 中使用
   - 需要在每个 Workspace 单独安装

3. **应用分发**
   - 开发完成后可以提交到 Slack App Directory
   - 公开分发需要通过 Slack 审核

---

完成以上所有步骤后，用户即可使用 Slack 账号登录 QA Sider！
