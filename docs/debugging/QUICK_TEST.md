# 快速测试登录功能

## 准备工作

### 1. 重新加载扩展

1. 访问 `chrome://extensions/`
2. 找到 "QA sidePanel"
3. 点击刷新按钮 🔄
4. 确保扩展已启用

### 2. 打开 DevTools

1. 右键点击任意网页
2. 打开侧边栏（或点击扩展图标）
3. 右键点击侧边栏区域
4. 选择 "检查" 或 "Inspect"
5. 打开 Console 标签页

## 测试步骤

### 步骤 1：点击登录

点击 "使用 Google 账号登录" 按钮

### 步骤 2：查看 Console 日志

您应该看到类似的日志：

```
用户点击了登录按钮
🚀 [步骤 1/5] 开始 Google OAuth 登录流程...
📍 Chrome Extension ID: abcdefghijklmnop
🔗 Redirect URL: https://abcdefghijklmnop.chromiumapp.org/
📡 [步骤 2/5] 从 Supabase 获取 OAuth URL...
```

## 可能的情况

### ✅ 情况 A：成功（最理想）

**看到的日志**：
```
✅ OAuth URL 获取成功: https://...
🌐 [步骤 3/5] 启动 OAuth 认证窗口...
✅ 收到重定向 URL: https://...
🔑 [步骤 4/5] 提取认证令牌...
✅ 成功获取 access token
💾 [步骤 5/5] 设置 Supabase 会话...
✅ Supabase 会话设置成功!
👤 用户信息: {...}
🎉 登录完成！
```

**结果**：登录成功！您应该能看到用户信息。

---

### ❌ 情况 B：卡在步骤 1/5

**日志停在**：
```
🚀 [步骤 1/5] 开始 Google OAuth 登录流程...
```

**问题**：代码没有继续执行

**原因**：
1. Chrome Identity API 不可用
2. 权限配置错误

**解决方案**：
1. 检查 `dist/manifest.json` 是否包含 `"identity"` 权限
2. 确保 `oauth2.client_id` 已配置

**在 Console 运行**：
```javascript
// 测试 Chrome Identity API
console.log('Chrome Identity:', chrome.identity);
console.log('Redirect URL:', chrome.identity.getRedirectURL());
```

---

### ❌ 情况 C：步骤 2/5 失败

**看到的日志**：
```
📡 [步骤 2/5] 从 Supabase 获取 OAuth URL...
❌ Supabase OAuth 错误: {...}
```

**问题**：无法从 Supabase 获取 OAuth URL

**原因**：
1. Supabase 环境变量未配置
2. Supabase 中未启用 Google OAuth
3. 网络问题

**解决方案**：

1. **检查环境变量**（在 Console 运行）：
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置');
```

2. **检查 Supabase 配置**：
   - 登录 Supabase Dashboard
   - Authentication → Providers
   - 确保 Google 已启用
   - 确认 Client ID 和 Secret 已填写

3. **测试 Supabase 连接**（在 Console 运行）：
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { skipBrowserRedirect: true, redirectTo: 'https://example.com' }
});
console.log('Data:', data);
console.log('Error:', error);
```

---

### ❌ 情况 D：步骤 3/5 失败

**看到的日志**：
```
🌐 [步骤 3/5] 启动 OAuth 认证窗口...
❌ launchWebAuthFlow 错误: {...}
```

**问题**：OAuth 窗口无法启动或用户取消

**原因**：
1. Google OAuth 配置中缺少 Redirect URI
2. 用户取消了登录
3. 浏览器阻止了弹窗

**解决方案**：

1. **获取并配置 Redirect URI**：

在 Console 中运行：
```javascript
console.log('需要配置的 Redirect URI:', chrome.identity.getRedirectURL());
```

复制输出的 URL（类似 `https://abcdefghijklmnop.chromiumapp.org/`）

2. **在 Google Cloud Console 配置**：
   - 打开 [Google Cloud Console](https://console.cloud.google.com/)
   - 找到您的 OAuth 客户端
   - 在 "授权的重定向 URI" 中添加上面的 URL
   - 保存

3. **在 Supabase 配置**：
   - 打开 Supabase Dashboard
   - Authentication → URL Configuration
   - 在 "Redirect URLs" 中添加上面的 URL
   - 保存

---

### ❌ 情况 E：步骤 4/5 失败

**看到的日志**：
```
🔑 [步骤 4/5] 提取认证令牌...
❌ 未找到 access_token
```

**问题**：重定向 URL 中没有 token

**原因**：OAuth 流程配置不完整

**解决方案**：

查看 Console 中的 "URL 参数" 日志，可能会看到 `error` 和 `error_description`。

常见错误：
- `redirect_uri_mismatch`: Redirect URI 配置不匹配
- `access_denied`: 用户拒绝授权
- `invalid_client`: Client ID 或 Secret 错误

---

## 配置检查清单

在开始测试前，确保：

### Google Cloud Console
- [ ] OAuth 客户端已创建
- [ ] Client ID 和 Secret 已记录
- [ ] 授权的 JavaScript 来源包含：`chrome-extension://YOUR_EXTENSION_ID`
- [ ] 授权的重定向 URI 包含：
  - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
  - Chrome Identity Redirect URL（从 Console 获取）

### Supabase Dashboard
- [ ] Google OAuth Provider 已启用
- [ ] Client ID 已填写
- [ ] Client Secret 已填写
- [ ] Redirect URLs 包含 Chrome Identity Redirect URL

### 本地配置
- [ ] `.env` 文件存在且包含正确的值
- [ ] `manifest.json` 中的 `client_id` 已配置
- [ ] 已运行 `npm run build`
- [ ] 已在 Chrome 中刷新扩展

## 获取帮助

如果仍然无法解决，请提供：

1. **Console 中的完整日志**（从点击登录到报错）
2. **Chrome Extension ID**（从 `chrome://extensions/` 获取）
3. **chrome.identity.getRedirectURL() 的输出**
4. **错误发生在哪个步骤**

这些信息将帮助快速定位问题！
