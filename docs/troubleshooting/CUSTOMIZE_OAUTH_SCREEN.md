# 自定义 Google OAuth 登录界面

## 当前问题

登录时显示 "continue to jtwdubvfnadvyzqjxirq.supabase.co"，看起来不够专业。

## 解决方案

在 Google Cloud Console 配置 OAuth 同意屏幕，自定义应用名称和信息。

## 配置步骤

### 1. 打开 Google Cloud Console

访问：https://console.cloud.google.com/

### 2. 选择您的项目

在顶部选择包含 OAuth 客户端的项目

### 3. 进入 OAuth 同意屏幕配置

1. 在左侧菜单中，点击 **"API 和服务"**
2. 点击 **"OAuth 同意屏幕"**

### 4. 配置同意屏幕

#### 基本信息

| 字段 | 建议值 | 说明 |
|------|--------|------|
| **应用名称** | `QA sidePanel` 或 `内容管理器` | 用户在登录时看到的名称 |
| **用户支持电子邮件** | 您的邮箱 | 必填 |
| **应用徽标** | （可选）上传 logo | 显示在登录页面顶部 |
| **应用首页** | （可选）您的网站 | 如 https://github.com/your-repo |
| **应用隐私权政策链接** | （可选） | 正式发布时需要 |
| **应用服务条款链接** | （可选） | 正式发布时需要 |

#### 授权网域

添加：
- `supabase.co`

#### 开发者联系信息

填写您的邮箱地址

### 5. 配置范围（Scopes）

点击 **"添加或移除范围"**，确保包含：

- ✅ `.../auth/userinfo.email`
- ✅ `.../auth/userinfo.profile`

### 6. 测试用户（如果是测试模式）

如果应用处于"测试"状态：
1. 点击 **"添加用户"**
2. 添加您的 Google 账号邮箱
3. 只有添加的用户才能登录

### 7. 保存并发布

1. 检查所有配置
2. 点击 **"保存"**
3. 如果准备好，可以点击 **"发布应用"**

## 效果对比

### 配置前
```
Choose an account
to continue to jtwdubvfnadvyzqjxirq.supabase.co
```

### 配置后
```
Choose an account
to continue to QA sidePanel
```

或者，如果上传了 logo：

```
[您的 Logo]
QA sidePanel
Choose an account
```

## 发布状态说明

### 测试模式（默认）
- ✅ 适合开发和个人使用
- ⚠️ 只有添加的测试用户可以登录
- ⚠️ 每次登录都会显示"未经验证"警告
- 无需审核

### 生产模式（发布后）
- ✅ 任何人都可以登录
- ✅ 不会显示"未经验证"警告
- ⚠️ 需要 Google 审核（可能需要数天）
- ⚠️ 需要隐私政策和服务条款

## 推荐配置（个人/内部使用）

如果只是个人使用或团队内部使用，建议：

1. **保持测试模式**
2. **配置应用名称和 logo**
3. **添加需要使用的 Google 账号作为测试用户**

这样可以：
- ✅ 快速完成配置
- ✅ 界面看起来专业
- ✅ 无需等待审核
- ✅ 符合个人/内部使用场景

## 快速配置（最小化步骤）

如果只想快速改善登录界面：

### 必填项
1. **应用名称**：`QA sidePanel`
2. **用户支持电子邮件**：您的邮箱
3. **开发者联系信息**：您的邮箱
4. **授权网域**：`supabase.co`

### 可选但推荐
5. **应用徽标**：上传一个 120x120 的图片
6. **测试用户**：添加您的 Google 账号

保存后，重新登录即可看到变化！

## 注意事项

### 1. 配置生效时间
- 通常配置保存后立即生效
- 有时可能需要几分钟
- 如果没有变化，清除浏览器缓存后重试

### 2. "未经验证的应用"警告
测试模式下，用户首次登录时会看到：
```
Google hasn't verified this app
```

这是正常的，点击 "继续" 即可。要移除这个警告：
- 选项 1：发布应用（需要审核）
- 选项 2：只添加信任的测试用户

### 3. 测试用户限制
测试模式下：
- 最多可添加 100 个测试用户
- 只有这些用户可以登录
- 足够个人和小团队使用

## 完整配置示例

```
应用信息：
├── 应用名称: QA sidePanel
├── 应用徽标: [上传 logo.png]
├── 用户支持电子邮件: joey@example.com
└── 开发者联系信息: joey@example.com

授权网域：
└── supabase.co

范围：
├── .../auth/userinfo.email
└── .../auth/userinfo.profile

测试用户：
├── joey@example.com
└── teammate@example.com
```

## 更新后的登录流程

配置完成后，用户登录时会看到：

1. **第一次登录**：
   ```
   [QA sidePanel Logo]
   QA sidePanel wants to access your Google Account
   
   This will allow QA sidePanel to:
   - View your email address
   - See your personal info
   
   [取消] [继续]
   ```

2. **后续登录**：
   ```
   Choose an account
   to continue to QA sidePanel
   
   [用户列表]
   ```

更简洁、更专业！

## 故障排除

### 问题：配置后仍显示 Supabase URL

**解决方案**：
1. 清除浏览器缓存
2. 在 Chrome 扩展中退出并重新登录
3. 等待 5-10 分钟后重试

### 问题：显示"Google hasn't verified this app"

**这是正常的**（测试模式下）
- 点击 "Advanced" → "Go to QA sidePanel (unsafe)"
- 或者发布应用以移除警告

### 问题：提示"Access blocked"

**原因**：当前 Google 账号不在测试用户列表中

**解决方案**：
1. 在 OAuth 同意屏幕添加该账号为测试用户
2. 或者切换到已添加的 Google 账号

## 总结

配置 OAuth 同意屏幕可以：
- ✅ 显示自定义的应用名称
- ✅ 添加应用 logo
- ✅ 提供更专业的用户体验
- ✅ 控制谁可以访问应用（测试模式）

只需 5-10 分钟的配置时间，即可大幅提升登录界面的专业度！
