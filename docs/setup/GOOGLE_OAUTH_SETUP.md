# Google OAuth 配置指南

## 步骤 1: 在 Google Cloud Console 创建 OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API**：
   - 导航到 "API和服务" → "库"
   - 搜索 "Google+ API"
   - 点击 "启用"

4. 创建 OAuth 凭据：
   - 导航到 "API和服务" → "凭据"
   - 点击 "创建凭据" → "OAuth 客户端 ID"
   - 应用类型：**Web 应用**
   - 名称：QA Sider（或任意名称）

5. 配置授权重定向 URI：
   ```
   https://jtwdubvfnadvyzqjxirq.supabase.co/auth/v1/callback
   ```
   
6. 点击 "创建"
7. **保存 Client ID 和 Client Secret**（下一步需要）

## 步骤 2: 在 Supabase 中配置 Google Provider

1. 访问：https://supabase.com/dashboard/project/jtwdubvfnadvyzqjxirq/auth/providers

2. 找到 **Google** 提供商

3. 点击右侧的展开按钮或编辑图标

4. 启用 Google Provider：
   - 切换开关到 **ON**

5. 填入 Google OAuth 凭据：
   - **Client ID (for OAuth)**: 粘贴从 Google Cloud Console 获取的 Client ID
   - **Client Secret (for OAuth)**: 粘贴从 Google Cloud Console 获取的 Client Secret

6. 其他设置保持默认

7. 点击 **Save** 保存

## 步骤 3: 配置 Chrome Extension 回调 URL

1. 在 Supabase Dashboard，导航到：
   **Authentication** → **URL Configuration**

2. 在 **Redirect URLs** 部分，添加：
   ```
   http://localhost:5173/*
   chrome-extension://*
   ```
   
   注意：具体的 Chrome Extension ID 会在加载扩展后获得，格式类似：
   ```
   chrome-extension://abcdefghijklmnopqrstuvwxyz/
   ```

3. 点击 **Save**

## 步骤 4: 重新构建并测试

1. 确保 `.env` 文件已创建（见主配置）

2. 重新构建项目：
   ```bash
   cd /Users/joey/qa_sider
   npm run build
   ```

3. 在 Chrome 中加载扩展：
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 目录

4. 测试登录：
   - 点击扩展图标
   - 点击"使用 Google 账号登录"
   - 应该会打开 Google 登录页面
   - 选择账号并授权

## 常见问题

### Q: OAuth 错误 "redirect_uri_mismatch"
**解决**：
- 确保 Google Cloud Console 中的回调 URL 与 Supabase 提供的完全一致
- 检查是否有多余的空格或字符

### Q: 登录后回到扩展，但未登录成功
**解决**：
- 在 Supabase URL Configuration 中添加 Chrome Extension 的回调 URL
- 格式：`chrome-extension://你的扩展ID/`

### Q: 如何获取 Chrome Extension ID？
**解决**：
- 在 `chrome://extensions/` 页面
- 找到你的扩展
- 在扩展名称下方可以看到 ID（一串字母）

### Q: 仍然无法登录
**解决**：
1. 打开 Chrome DevTools（F12）
2. 查看 Console 标签的错误信息
3. 检查 Network 标签的网络请求
4. 在 Supabase Dashboard → Authentication → Logs 查看日志

## 验证配置

配置完成后，在 Supabase Dashboard 检查：

1. **Authentication** → **Users**：登录成功后应该能看到用户
2. **Table Editor** → **contents**：创建内容后应该能看到记录
3. **Authentication** → **Logs**：可以查看登录日志

## 快速测试

```bash
# 确保在项目目录
cd /Users/joey/qa_sider

# 重新构建
npm run build

# 在 Chrome 中重新加载扩展
# 然后测试登录和创建内容
```

## 完整配置清单

- [x] Supabase 项目已创建
- [x] 数据库表已创建（contents）
- [x] Row Level Security 已启用
- [x] 安全策略已配置
- [x] .env 文件已创建
- [ ] Google OAuth 应用已创建
- [ ] Supabase Google Provider 已配置
- [ ] Chrome Extension 已加载
- [ ] 登录功能测试通过
- [ ] 内容创建功能测试通过

---

配置完成后就可以开始使用了！🎉
