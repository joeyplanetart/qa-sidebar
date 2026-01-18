# Supabase URL Configuration 配置步骤

## 🎯 重要：Supabase 也需要配置 Chrome 扩展 Redirect URL

### 步骤 1：打开 Supabase Dashboard

1. 访问：https://app.supabase.com
2. 选择你的项目：`jtwdubvfnadvyzqjxirq`

### 步骤 2：进入 URL Configuration

1. 左侧菜单：**Authentication** 
2. 点击：**URL Configuration**

### 步骤 3：添加 Redirect URLs

在 **Redirect URLs** 部分，确保包含以下 URL（每个 URL 一行）：

```
https://amnpeighpmpnmglhjhkpdmkehckaaamb.chromiumapp.org/
http://localhost:5173
```

**注意**：
- 第一个是 Chrome 扩展的回调地址（必需）
- 第二个是本地开发地址（可选）

### 步骤 4：配置 Site URL

**Site URL** 设置为：
```
https://amnpeighpmpnmglhjhkpdmkehckaaamb.chromiumapp.org/
```

### 步骤 5：保存配置

点击页面底部的 **Save** 按钮

---

## 📋 完整配置清单

### Slack API (已完成 ✅)
- [x] OAuth & Permissions → Redirect URLs
  - `https://jtwdubvfnadvyzqjxirq.supabase.co/auth/v1/callback`
  - `https://amnpeighpmpnmglhjhkpdmkehckaaamb.chromiumapp.org/`
- [x] Scopes: `users:read`, `users:read.email`

### Supabase Dashboard (需要配置 ⚠️)
- [ ] Authentication → Providers → Slack (已启用 ✅)
  - Client ID 和 Secret 已配置 ✅
- [ ] **Authentication → URL Configuration**
  - [ ] Redirect URLs 包含 Chrome 扩展地址
  - [ ] Site URL 配置正确

---

## 🔍 为什么两边都需要配置？

```
用户点击 Slack 登录
  ↓
Chrome 扩展调用 Supabase API
  ↓
Supabase 生成 Slack OAuth URL (需要知道回调地址)
  ↓
跳转到 Slack 授权页面
  ↓
用户授权
  ↓
Slack → 重定向到 Supabase
  ↓
Supabase 处理 token
  ↓
Supabase → 重定向到 Chrome 扩展 (需要在 Supabase 白名单中)
  ↓
Chrome 扩展接收 token
  ↓
登录成功
```

**两个配置的作用**：
1. **Slack API**: 允许回调到 Supabase 和 Chrome 扩展
2. **Supabase**: 允许 Supabase 重定向到 Chrome 扩展（安全白名单）

---

## 🧪 配置完成后的测试步骤

1. 保存 Supabase 配置
2. 打开 `chrome://extensions/`
3. 重新加载 QA Sider 扩展
4. 打开扩展，点击 Slack 登录
5. 应该能正常弹出 Slack 授权页面

---

## ❓ 如果还有错误

配置完 Supabase 后，如果还有错误，请提供：
1. Supabase URL Configuration 的截图
2. 新的控制台错误日志
3. 错误发生在哪个步骤（[步骤 X/5]）
