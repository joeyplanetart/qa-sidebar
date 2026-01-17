# Twitter/X 登录配置指南

## 📋 概述

本文档说明如何配置 Twitter/X OAuth 登录功能，允许用户使用 Twitter/X 账号登录 QA Sider。

---

## 🔧 配置步骤

### 1. 在 Twitter Developer Portal 创建应用

1. **访问 Twitter Developer Portal**
   - 打开 https://developer.twitter.com/en/portal/dashboard
   - 使用您的 Twitter账号登录

2. **创建新项目**
   - 点击 "Projects & Apps" → "Overview"
   - 点击 "+ Create Project"
   - 填写项目名称（例如：QA Sider）
   - 选择用例（例如：Making a bot）
   - 填写项目描述

3. **创建 App**
   - 在项目中点击 "+ Add App"
   - 选择 "Production" 环境
   - 填写 App 名称（例如：QA Sider Extension）
   - 保存 API Key 和 API Secret（后续需要）

4. **配置 App 设置**
   - 进入 App 设置页面
   - 点击 "Set up" User authentication settings

5. **配置 OAuth 2.0**
   - **Type of App**: Web App
   - **App permissions**: Read
   - **Callback URLs**: 
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - **Website URL**: 您的网站 URL
   - 保存设置

6. **获取 Client ID 和 Client Secret**
   - 在 OAuth 2.0 Client ID and Client Secret 部分
   - 复制 `Client ID` 和 `Client Secret`
   - **重要**：立即保存 Client Secret，刷新页面后将无法再次查看

---

### 2. 在 Supabase 配置 Twitter Provider

1. **打开 Supabase Dashboard**
   - 访问 https://app.supabase.com
   - 选择您的项目

2. **配置 Twitter Provider**
   - 进入 `Authentication` → `Providers`
   - 找到 `Twitter` 并启用
   - 填写配置：
     ```
     Client ID: [从 Twitter Developer Portal 获取的 Client ID]
     Client Secret: [从 Twitter Developer Portal 获取的 Client Secret]
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
     "https://twitter.com/*",
     "https://*.twitter.com/*",
     "https://x.com/*",
     "https://*.x.com/*",
     "https://api.twitter.com/*"
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
   - 在登录页面找到 "使用 Twitter/X 账号登录" 按钮

### 2. 点击登录
   - 会弹出 Twitter OAuth 授权窗口
   - 使用您的 Twitter账号登录
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
1. 确认 Supabase Redirect URLs 配置正确
2. 确认使用正确的 Chrome 扩展 ID
3. 检查 manifest.json 的 host_permissions

### 问题 2：OAuth 返回错误

**可能原因**：
- Client ID 或 Client Secret 错误
- Twitter App 未激活
- 回调 URL 不匹配

**解决方案**：
1. 重新检查 Supabase 中的 Client ID 和 Secret
2. 确认 Twitter App 状态为 Active
3. 确认所有回调 URL 完全匹配

### 问题 3：登录成功但无法获取用户信息

**可能原因**：
- Token 解析失败
- Supabase session 设置失败

**解决方案**：
1. 打开浏览器控制台查看详细错误
2. 检查 Supabase 项目是否正常运行
3. 验证 Twitter OAuth 权限设置

---

## 📊 调试信息

登录过程会在控制台输出详细日志：

```
🚀 [步骤 1/5] 开始 Twitter/X OAuth 登录流程...
📡 [步骤 2/5] 从 Supabase 获取 OAuth URL...
🌐 [步骤 3/5] 启动 OAuth 认证窗口...
🔑 [步骤 4/5] 提取认证令牌...
💾 [步骤 5/5] 设置 Supabase 会话...
🎉 Twitter/X 登录完成！
```

如果遇到错误，日志会显示：
```
❌ Twitter/X Identity 登录失败: [错误信息]
```

---

## 🔐 安全注意事项

1. **保护密钥**
   - 永远不要将 Client Secret 提交到代码库
   - 使用环境变量或 Supabase 管理密钥

2. **权限最小化**
   - 只请求必要的 Twitter 权限（Read）
   - 不要请求过度权限

3. **HTTPS 要求**
   - 所有 OAuth 回调必须使用 HTTPS
   - Chrome 扩展使用 chromiumapp.org 协议

---

## 📝 相关文档

- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)

---

## ✅ 配置检查清单

- [ ] Twitter Developer Portal 创建应用
- [ ] 获取 Client ID 和 Client Secret
- [ ] 配置 Twitter OAuth 回调 URL
- [ ] Supabase 启用 Twitter Provider
- [ ] Supabase 配置 Client ID 和 Secret
- [ ] Supabase 添加 Chrome 扩展 Redirect URL
- [ ] manifest.json 包含 Twitter 域名权限
- [ ] 重新构建并加载扩展
- [ ] 测试登录流程
- [ ] 验证用户信息显示

---

完成以上所有步骤后，用户即可使用 Twitter/X 账号登录 QA Sider！
