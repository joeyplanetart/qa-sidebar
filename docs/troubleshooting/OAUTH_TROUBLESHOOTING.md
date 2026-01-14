# OAuth 登录问题排查

## 当前问题

错误信息：`Authorization page could not be loaded.`

这是 Chrome `launchWebAuthFlow` API 返回的错误，表示无法加载 OAuth 授权页面。

## 已完成的配置 ✅

### Supabase
- ✅ Site URL: `https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/`
- ✅ Redirect URLs: `https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/`
- ✅ Google OAuth Provider 已启用
- ✅ Client ID 和 Secret 已配置

### Google Cloud Console
- ✅ OAuth 2.0 Client ID 已创建
- ✅ Authorized redirect URIs 已添加
- ✅ OAuth consent screen 已配置 (应用名称: qa sider)

### Chrome 扩展
- ✅ manifest.json 权限正确
- ✅ 已移除不必要的 oauth2 配置
- ✅ 代码逻辑正确

## 🔍 可能的原因

### 1. 配置生效延迟

**最可能的原因！**

Google Cloud Console 的配置更改需要时间生效：
- 通常：5-10 分钟
- 有时：最多几小时

**解决方案**：
- ⏰ 等待 **10-15 分钟**
- 然后重新测试

### 2. Google OAuth Client 类型问题

如果 OAuth 客户端是 "Web application" 类型，可能不完全兼容 Chrome 扩展。

**检查步骤**：
1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. API 和服务 → Credentials
3. 查看 OAuth 2.0 Client ID 的类型

**如果显示 "Web application"**：
- 这是正确的类型
- 但确保配置了所有必要的 Redirect URIs

### 3. Chrome 扩展 ID 变化

如果重新安装了扩展，Extension ID 会变化。

**当前 Extension ID**: `amnpeighmpmnglhjhkpdmkehckaaaamb`

**检查方法**：
1. 访问 `chrome://extensions/`
2. 查看扩展的 ID
3. 确认与配置中的 ID 一致

**如果 ID 不同**：
- 需要用新的 ID 更新所有配置
- Google Cloud Console
- Supabase
- 代码中的任何硬编码值

### 4. 网络或防火墙问题

**可能性**：
- 公司网络限制
- 防火墙阻止 OAuth 请求
- VPN 干扰

**测试方法**：
- 尝试不同的网络环境
- 暂时关闭 VPN
- 检查防火墙设置

### 5. Chrome 浏览器问题

**可能性**：
- Chrome 版本过旧
- 浏览器缓存问题
- 扩展权限被阻止

**解决方案**：
```bash
# 清除 Chrome 缓存
1. 设置 → 隐私和安全 → 清除浏览数据
2. 选择"缓存的图片和文件"
3. 清除

# 检查 Chrome 版本
chrome://settings/help
```

## 🔧 调试步骤

### 步骤 1: 验证配置生效

**等待 15 分钟后重试**

如果还是失败，继续下一步。

### 步骤 2: 检查 OAuth URL

在 Console 中运行：

```javascript
const { data } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    skipBrowserRedirect: true,
    redirectTo: chrome.identity.getRedirectURL(),
  },
});
console.log('OAuth URL:', data.url);
```

复制这个 URL，在**普通浏览器标签页**中打开：
- 如果能正常显示 Google 登录页 → Supabase 配置正确
- 如果显示错误 → Supabase 配置有问题

### 步骤 3: 测试 launchWebAuthFlow

在 Console 中运行：

```javascript
chrome.identity.launchWebAuthFlow(
  {
    url: 'https://accounts.google.com',
    interactive: true
  },
  (result) => {
    console.log('Result:', result);
    console.log('Error:', chrome.runtime.lastError);
  }
);
```

- 如果能打开窗口 → Chrome Identity API 工作正常
- 如果报错 → Chrome 权限或配置问题

### 步骤 4: 检查 Redirect URI 匹配

确认这三个值**完全一致**：

1. **Console 输出**：
   ```javascript
   console.log(chrome.identity.getRedirectURL());
   ```

2. **Google Cloud Console** → Authorized redirect URIs

3. **Supabase Dashboard** → Redirect URLs

必须**一模一样**，包括：
- `https://`
- 完整的 ID
- `.chromiumapp.org`
- 结尾的 `/`

## 🎯 临时解决方案

在 OAuth 登录修复之前，可以使用：

### 方案 1：本地存储模式 ✅

**优点**：
- 立即可用
- 无需登录
- 所有功能正常

**缺点**：
- 数据只保存在本地浏览器
- 不能跨设备同步

**使用方法**：
- 点击"稍后登录（使用本地存储）"

### 方案 2：等待配置生效

Google 的配置更改通常在 **5-15 分钟**内生效。

**建议**：
1. 先使用本地存储模式
2. 15-30 分钟后再尝试登录
3. 如果还是失败，联系支持

## 📋 最终检查清单

在联系支持之前，请确认：

### Google Cloud Console
- [ ] OAuth 2.0 Client ID 已创建
- [ ] Authorized JavaScript origins: **留空或删除 chrome-extension:// URL**
- [ ] Authorized redirect URIs 包含：
  - [ ] `https://jtwdubvfnadvyzqjxirq.supabase.co/auth/v1/callback`
  - [ ] `https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/`
- [ ] OAuth consent screen 已配置
- [ ] 测试用户已添加（如果是测试模式）

### Supabase Dashboard
- [ ] Authentication → Providers → Google 已启用
- [ ] Client ID 已填写
- [ ] Client Secret 已填写
- [ ] URL Configuration → Redirect URLs 包含：
  - [ ] `https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/`

### Chrome 扩展
- [ ] Extension ID: `amnpeighmpmnglhjhkpdmkehckaaaamb`
- [ ] 扩展已启用
- [ ] 已刷新扩展（在 chrome://extensions/）
- [ ] 权限已授予

### 时间
- [ ] 最后修改配置的时间：____________
- [ ] 已等待：____ 分钟

## 💡 成功案例

如果配置正确，登录流程应该是：

```
🔵 Header: 用户点击登录按钮
🚀 [步骤 1/5] 开始 Google OAuth 登录流程...
📍 Chrome Extension ID: amnpeighmpmnglhjhkpdmkehckaaaamb
🔗 Redirect URL: https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/
📡 [步骤 2/5] 从 Supabase 获取 OAuth URL...
✅ OAuth URL 获取成功
🌐 [步骤 3/5] 启动 OAuth 认证窗口...
[弹出 Google 登录窗口]
✅ 收到重定向 URL
🔑 [步骤 4/5] 提取认证令牌...
✅ 成功获取 access token
💾 [步骤 5/5] 设置 Supabase 会话...
✅ Supabase 会话设置成功
🎉 登录完成！
```

## 🆘 仍然无法解决？

如果尝试了所有步骤仍然失败：

1. **确认等待了至少 15-30 分钟**
2. **截图所有配置页面**：
   - Google Cloud Console Credentials
   - Supabase URL Configuration
   - Chrome Console 错误日志
3. **记录**：
   - Chrome 版本
   - 操作系统
   - 网络环境（公司/家庭/VPN）
4. **提供 Extension ID**

## 📚 参考资料

- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

**更新时间**: 2026-01-13
**状态**: 配置已完成，等待生效中...
