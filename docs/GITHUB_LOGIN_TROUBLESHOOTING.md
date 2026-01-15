# GitHub 登录问题排查指南

## 常见错误：Authorization page could not be loaded

这个错误通常由以下几个原因导致。请按照顺序检查：

---

## ✅ 检查清单

### 1. **manifest.json 配置**

确保 `manifest.json` 包含必要的权限：

```json
{
  "permissions": [
    "identity",
    "storage"
  ],
  "host_permissions": [
    "https://*.supabase.co/*",
    "https://github.com/*",
    "https://*.github.com/*",
    "https://*.chromiumapp.org/*"
  ]
}
```

**重要**：修改 manifest.json 后必须：
1. 重新构建扩展：`npm run build`
2. 在 `chrome://extensions/` 页面点击"重新加载"按钮
3. 完全关闭并重新打开 sidePanel

---

### 2. **Supabase GitHub OAuth 配置**

#### 2.1 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   ```
   Application name: QA SidePanel
   Homepage URL: https://your-project.supabase.co
   Authorization callback URL: https://your-project.supabase.co/auth/v1/callback
   ```
4. 获取 **Client ID** 和 **Client Secret**

#### 2.2 在 Supabase 配置

1. 打开 Supabase Dashboard: https://app.supabase.com
2. 选择你的项目
3. 导航到 **Authentication** → **Providers**
4. 找到 **GitHub** 并启用
5. 填入 Client ID 和 Client Secret
6. 点击 **Save**

---

### 3. **Redirect URL 配置**

#### 3.1 获取扩展 ID

在 Chrome 地址栏输入：`chrome://extensions/`

找到 "QA sidePanel" 扩展，复制扩展 ID，例如：
```
ampeighpmonglhjhkpdekhchaaaanb
```

#### 3.2 在 Supabase 添加 Redirect URL

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. 在 **Redirect URLs** 中添加：
   ```
   https://ampeighpmonglhjhkpdekhchaaaanb.chromiumapp.org/
   ```
   （替换为你的扩展 ID）

3. 点击 **Save**

#### 3.3 更新 GitHub OAuth App

⚠️ **重要**：GitHub OAuth App 的回调 URL 必须完全匹配

1. 回到 https://github.com/settings/developers
2. 选择你的 OAuth App
3. 更新 **Authorization callback URL**：
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

**注意**：
- Supabase 会自动处理重定向到 Chrome 扩展
- GitHub OAuth App 的回调 URL 应该指向 Supabase，不是扩展 ID

---

### 4. **网络和 VPN 配置**

#### 4.1 确认网络可访问

打开浏览器控制台，测试以下 URL 是否可访问：

```javascript
// 测试 GitHub
fetch('https://github.com').then(r => console.log('GitHub:', r.status))

// 测试 Supabase
fetch('https://your-project.supabase.co').then(r => console.log('Supabase:', r.status))
```

#### 4.2 VPN 设置

如果使用 VPN：
- ✅ 确保 VPN 已连接
- ✅ 尝试访问 https://github.com 确认能访问
- ✅ 检查 VPN 是否支持 WebSocket（某些 OAuth 流程需要）
- ✅ 尝试切换不同的 VPN 服务器

---

### 5. **Chrome 扩展权限**

确保扩展有必要的权限：

1. 打开 `chrome://extensions/`
2. 找到 "QA sidePanel"
3. 点击"详细信息"
4. 检查"网站权限"部分
5. 如果看到警告，点击"允许"

---

### 6. **清除缓存和重试**

有时候缓存会导致问题：

```bash
# 1. 清除浏览器缓存
Chrome → 设置 → 隐私和安全 → 清除浏览数据

# 2. 重新构建扩展
npm run build

# 3. 在 chrome://extensions/ 重新加载扩展

# 4. 重启 Chrome 浏览器
```

---

## 🔍 调试步骤

### 查看控制台日志

1. 打开 sidePanel
2. 右键点击 → "检查"（打开开发者工具）
3. 点击"Console"标签
4. 点击 GitHub 登录按钮
5. 查看详细的错误信息

你应该看到类似这样的日志：

```
🚀 [步骤 1/5] 开始 GitHub OAuth 登录流程...
📍 Chrome Extension ID: ampeighpmonglhjhkpdekhchaaaanb
🔗 Redirect URL: https://ampeighpmonglhjhkpdekhchaaaanb.chromiumapp.org/
📡 [步骤 2/5] 从 Supabase 获取 OAuth URL...
```

### 常见错误信息及解决方案

#### ❌ "redirect_uri_mismatch"

**原因**：Redirect URL 配置不匹配

**解决**：
1. 检查 Supabase 的 Redirect URLs 配置
2. 确认扩展 ID 正确
3. 确保 URL 末尾有斜杠 `/`

#### ❌ "Authorization page could not be loaded"

**原因**：
- manifest.json 缺少 GitHub 域名权限
- 网络无法访问 GitHub
- Supabase OAuth URL 错误

**解决**：
1. 检查 manifest.json 的 host_permissions
2. 测试 GitHub 网络连接
3. 验证 Supabase 配置

#### ❌ "未能从重定向 URL 获取 access token"

**原因**：OAuth 流程完成，但 token 获取失败

**解决**：
1. 检查 Supabase 的 GitHub Provider 配置
2. 确认 Client ID 和 Client Secret 正确
3. 重新生成 GitHub OAuth App 的 Secret

---

## 📋 完整配置检查表

在尝试登录前，确认以下所有项目：

- [ ] manifest.json 包含 `identity` 权限
- [ ] manifest.json 包含 GitHub 域名的 host_permissions
- [ ] 已重新构建扩展（npm run build）
- [ ] 已在 chrome://extensions/ 重新加载扩展
- [ ] GitHub OAuth App 已创建
- [ ] Supabase GitHub Provider 已启用并配置
- [ ] Supabase Redirect URLs 包含扩展 ID
- [ ] VPN 已连接（如需要）
- [ ] 可以访问 github.com
- [ ] 已清除浏览器缓存

---

## 🧪 测试步骤

1. **测试基础网络**：
   ```javascript
   fetch('https://api.github.com').then(r => r.json()).then(console.log)
   ```

2. **查看扩展 ID**：
   ```javascript
   console.log('Extension ID:', chrome.runtime.id)
   ```

3. **测试 Supabase 连接**：
   打开浏览器控制台，在你的扩展中运行：
   ```javascript
   import { supabase } from './services/supabase'
   supabase.auth.getSession().then(console.log)
   ```

---

## 🆘 仍然无法解决？

如果以上步骤都完成了还是无法登录：

1. **检查 Supabase Logs**：
   - Supabase Dashboard → Logs → Auth Logs
   - 查看是否有错误信息

2. **尝试邮箱登录**：
   - 先使用邮箱登录测试 Supabase 连接是否正常
   - 如果邮箱登录成功，说明问题在 GitHub OAuth 配置

3. **重新创建 OAuth App**：
   - 删除现有的 GitHub OAuth App
   - 重新创建一个新的
   - 更新 Supabase 配置

4. **检查 Chrome 版本**：
   - 确保使用最新版本的 Chrome
   - Chrome Identity API 在旧版本可能有问题

---

## 📞 获取帮助

如果问题依然存在，请提供以下信息：

1. Chrome 版本
2. 扩展 ID
3. 完整的控制台错误日志
4. Supabase Auth Logs 截图
5. 是否可以访问 github.com

---

## 💡 最佳实践建议

1. **开发环境**：
   - 使用 localhost 测试时，GitHub OAuth 可能有限制
   - 建议发布为非公开扩展进行测试

2. **生产环境**：
   - 正式发布前在 Chrome Web Store 创建非公开版本
   - 获取正式的扩展 ID
   - 使用正式 ID 更新所有配置

3. **安全性**：
   - 不要在代码中硬编码 Client Secret
   - 定期轮换 GitHub OAuth Secret
   - 监控 Supabase Auth Logs

---

## 🔗 相关资源

- [Supabase GitHub Auth 文档](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Chrome Identity API 文档](https://developer.chrome.com/docs/extensions/reference/identity/)
- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
