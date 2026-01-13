# 登录问题调试指南

## 调试步骤

### 1. 打开 Chrome DevTools

1. 右键点击扩展侧边栏
2. 选择"检查"或"Inspect"
3. 打开 Console 标签页

### 2. 点击登录并查看日志

预期看到的日志顺序：

```
开始 Google OAuth 登录流程...
OAuth URL: https://...
Redirect URL: https://...
```

如果在这里卡住，说明问题在于 **OAuth 流程启动**。

### 3. 常见问题诊断

#### 问题 A：没有任何日志输出

**原因**：点击事件未触发或代码未加载

**解决方案**：
```bash
# 重新构建
npm run build

# 在 chrome://extensions/ 刷新扩展
# 关闭并重新打开侧边栏
```

#### 问题 B：报错 "获取 OAuth URL 失败"

**原因**：Supabase 配置问题

**检查清单**：
- [ ] Supabase 项目中是否启用了 Google OAuth Provider
- [ ] Client ID 和 Secret 是否正确填写
- [ ] .env 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 是否正确

**验证环境变量**：
在 Console 中运行：
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

#### 问题 C：launchWebAuthFlow 错误

**原因**：Chrome Identity API 权限或配置问题

**检查清单**：
- [ ] manifest.json 中是否有 "identity" 权限
- [ ] oauth2.client_id 是否正确

**验证**：
在 Console 中运行：
```javascript
chrome.identity.getRedirectURL()
// 应该返回类似: https://abcdefghijklmnop.chromiumapp.org/
```

#### 问题 D：未收到重定向 URL

**原因**：Google OAuth 配置中缺少重定向 URI

**解决方案**：
1. 在 Console 中查看 "Redirect URL:" 的值
2. 复制这个 URL
3. 打开 Google Cloud Console
4. 进入 OAuth 2.0 客户端配置
5. 添加这个 URL 到"授权重定向 URI"列表
6. 保存

#### 问题 E：未能获取 access token

**原因**：重定向 URL 格式不正确或 Supabase 配置问题

**检查**：
查看 Console 中的 "收到重定向 URL:" 日志，URL 应该包含 `#access_token=...`

### 4. 手动测试 OAuth 流程

在 Console 中运行以下代码进行逐步测试：

```javascript
// 测试 1: 获取 Redirect URL
const redirectUrl = chrome.identity.getRedirectURL();
console.log('Redirect URL:', redirectUrl);

// 测试 2: 测试 Supabase 连接
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    skipBrowserRedirect: true,
    redirectTo: redirectUrl,
  },
});
console.log('OAuth Data:', data);
console.log('OAuth Error:', error);

// 测试 3: 如果上面成功，手动启动 OAuth 流程
chrome.identity.launchWebAuthFlow(
  {
    url: data.url,
    interactive: true,
  },
  (responseUrl) => {
    console.log('Response URL:', responseUrl);
    console.log('Error:', chrome.runtime.lastError);
  }
);
```

### 5. 检查 Google OAuth 配置

确保在 Google Cloud Console 的 OAuth 客户端中：

#### 授权的 JavaScript 来源
- `chrome-extension://YOUR_EXTENSION_ID`

#### 授权的重定向 URI
- `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- Chrome Identity Redirect URL (从 Console 获取)

### 6. 检查 Supabase 配置

在 Supabase Dashboard → Authentication → URL Configuration：

#### Site URL
- 设置为扩展的 URL 或留空

#### Redirect URLs
- 添加 Chrome Identity Redirect URL

## 完整的调试日志示例

**成功的流程**应该看到：

```
开始 Google OAuth 登录流程...
OAuth URL: https://xxxxxx.supabase.co/auth/v1/authorize?provider=google&...
Redirect URL: https://abcdefghijklmnop.chromiumapp.org/
收到重定向 URL: https://abcdefghijklmnop.chromiumapp.org/#access_token=...
成功获取 access token
Supabase 会话设置成功: {...}
```

**失败的情况**会在某个步骤卡住或报错。

## 需要提供的调试信息

如果仍然无法解决，请提供：

1. **Console 中的完整错误日志**
2. **Chrome Extension ID**（从 chrome://extensions/ 获取）
3. **chrome.identity.getRedirectURL() 的返回值**
4. **Supabase 项目的 URL**（不含密钥）
5. **错误发生在哪个步骤**

## 替代方案：简化版登录

如果上述方法都不行，可以尝试使用简化的登录流程：

编辑 `src/services/chromeAuth.ts`，使用 Supabase 的 Magic Link 或 Email 登录：

```typescript
// 使用邮箱登录（无需 OAuth）
export const signInWithEmail = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: chrome.identity.getRedirectURL(),
    },
  });
  
  if (error) throw error;
};
```

这样用户输入邮箱后会收到验证码，更简单可靠。
