# OAuth 登录测试指南

## 问题原因

之前使用的 `chrome.identity.getAuthToken()` 方法只能获取已经授权的 token，无法启动新的 OAuth 流程。

## 修复方案

改用 `chrome.identity.launchWebAuthFlow()` 方法，这是 Chrome 扩展中进行 OAuth 登录的标准方式。

### 新的登录流程

1. 调用 Supabase 的 `signInWithOAuth()` 获取授权 URL
2. 使用 `launchWebAuthFlow()` 打开 Google 登录页面
3. 用户授权后，从重定向 URL 中提取 tokens
4. 使用 `setSession()` 设置 Supabase 会话

## 如何测试

### 1. 重新构建扩展

```bash
npm run build
```

### 2. 重新加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 找到 "QA sidePanel" 扩展
4. 点击刷新按钮 🔄

### 3. 测试登录

1. **打开侧边栏**
   - 点击扩展图标或右键点击任意网页 → 打开侧边栏

2. **点击登录**
   - 应该会弹出一个新的 Google 登录窗口
   - 如果已经登录 Google，会显示授权确认页面
   - 如果未登录，会先要求登录

3. **授权**
   - 点击"允许"或"Continue"授权访问
   - 窗口会自动关闭
   - 返回扩展，应该能看到您的用户信息

### 4. 验证登录成功

登录成功后，您应该能看到：
- 用户头像（如果有）
- 用户名称
- 用户邮箱
- "登出"按钮

### 5. 测试数据同步

1. 创建一些内容（代码、SQL、文本）
2. 刷新页面或重新打开扩展
3. 验证数据仍然存在（说明已同步到 Supabase）

## 调试技巧

### 查看 Console 日志

1. 右键点击扩展侧边栏
2. 选择"检查"或"Inspect"
3. 打开 Console 标签页
4. 点击登录按钮，查看日志输出

### 预期的日志输出

```
开始 Google OAuth 登录流程...
OAuth URL: https://...
Redirect URL: https://...
收到重定向 URL: https://...
成功获取 access token
Supabase 会话设置成功: {...}
```

### 常见错误及解决方案

#### 错误 1: "launchWebAuthFlow 错误"
**可能原因**：
- 用户取消了登录
- 网络问题
- OAuth 配置错误

**解决方案**：
- 重试登录
- 检查网络连接
- 查看详细错误信息

#### 错误 2: "未能从重定向 URL 获取 access token"
**可能原因**：
- Supabase OAuth 配置不正确
- 重定向 URL 格式错误

**解决方案**：
1. 检查 Supabase 项目设置
2. 确认 Google OAuth 已启用
3. 验证 Client ID 和 Secret 正确

#### 错误 3: "设置会话失败"
**可能原因**：
- Token 无效
- Supabase 连接问题

**解决方案**：
- 检查 .env 文件中的 Supabase 配置
- 验证网络连接

## Supabase 配置检查清单

确保在 Supabase 项目中完成以下配置：

### 1. 启用 Google Provider
- [ ] 打开 Supabase Dashboard
- [ ] 进入 Authentication → Providers
- [ ] 启用 Google
- [ ] 输入从 Google Cloud Console 获取的 Client ID
- [ ] 输入从 Google Cloud Console 获取的 Client Secret
- [ ] 保存

### 2. 配置 Redirect URLs
在 Google Cloud Console 的 OAuth 客户端配置中，添加：
- `https://<your-project-ref>.supabase.co/auth/v1/callback`
- Chrome 扩展的 redirect URL（自动生成）

### 3. 环境变量
确保 `.env` 文件包含：
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 成功标志

✅ 点击登录后弹出 Google 登录窗口
✅ 授权后窗口自动关闭
✅ 显示用户信息（头像、名称、邮箱）
✅ 创建的内容会同步到云端
✅ 刷新后数据仍然存在
✅ 可以正常登出

## 下一步

如果登录成功，您可以：
1. 开始使用扩展保存代码片段
2. 测试搜索和过滤功能
3. 验证数据在不同设备间同步（需要在其他设备安装）
4. 测试本地模式（点击"稍后登录"）

## 需要帮助？

如果遇到问题：
1. 查看 Console 中的错误日志
2. 截图错误信息
3. 记录重现步骤
4. 检查 Supabase Dashboard 中的日志

---

**重要提示**：每次修改代码后，都需要：
1. 运行 `npm run build`
2. 在 `chrome://extensions/` 中刷新扩展
3. 重新打开侧边栏测试
