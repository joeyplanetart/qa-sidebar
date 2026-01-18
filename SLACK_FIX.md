# Slack 登录错误修复

## 问题
Error: Authorization page could not be loaded.

## 原因
Slack API 的 Redirect URLs 配置不完整，缺少 Chrome 扩展的回调地址。

## 解决步骤

### 1. 获取 Chrome 扩展 ID
从控制台日志中可以看到：
```
Chrome Extension ID: amnpeighpmpnmglhjhkpdmkehckaaamb
```

### 2. 在 Slack API 添加 Redirect URL

访问 Slack API：https://api.slack.com/apps

进入你的 QA Sider 应用 → OAuth & Permissions → Redirect URLs

**添加第二个 Redirect URL：**
```
https://amnpeighpmpnmglhjhkpdmkehckaaamb.chromiumapp.org/
```

**完整的 Redirect URLs 应该有两个：**
1. `https://jtwdubvfnadvyzqjxirq.supabase.co/auth/v1/callback`
2. `https://amnpeighpmpnmglhjhkpdmkehckaaamb.chromiumapp.org/`

### 3. 保存配置

点击 "Add" → 点击 "Save URLs"

### 4. 测试登录

重新打开扩展，点击 Slack 登录，应该可以正常弹出授权页面。

---

## 为什么需要两个 URL？

1. **Supabase URL**: Supabase 处理 OAuth 流程
2. **Chrome Extension URL**: Chrome Identity API 接收最终的回调

Chrome 扩展的 OAuth 流程：
```
用户点击登录
  ↓
Supabase 生成 OAuth URL
  ↓
跳转到 Slack 授权页面
  ↓
用户授权
  ↓
Slack 重定向到 Supabase
  ↓
Supabase 处理并重定向到 Chrome 扩展 ← 这里需要第二个 URL
  ↓
Chrome 扩展接收 token
  ↓
登录成功
```

---

## 检查清单

- [x] Supabase 已启用 Slack Provider
- [x] Client ID 和 Secret 已配置
- [x] Slack Scopes 已添加 (users:read, users:read.email)
- [ ] ⚠️ Slack Redirect URLs 需要添加 Chrome 扩展 URL
- [ ] 保存后测试登录

---

## 额外提示

如果修改后仍然有问题，尝试：
1. 清除浏览器缓存
2. 重新加载 Chrome 扩展
3. 检查控制台是否还有其他错误
