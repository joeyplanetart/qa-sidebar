# Google 登录实现文档

本文档详细说明了 QA Sider Chrome 扩展中 Google OAuth 登录的实现方式。

## 实现概述

Chrome 扩展的 OAuth 登录与普通网页应用不同，需要使用 Chrome 的 `chrome.identity` API 来处理认证流程。

## 配置信息

### Google OAuth 凭据
- **Client ID**: 已在 manifest.json 和 Supabase 中配置
- **Client Secret**: 已在 Supabase 中配置

### 已在 Supabase 配置
- Google OAuth 提供商已在 Supabase 项目中启用
- 使用 Google Cloud Console 生成的 Client ID 和 Client Secret

## 技术架构

### 1. Chrome Extension Manifest (manifest.json)

```json
{
  "permissions": [
    "identity"  // 必需：用于 OAuth 认证
  ],
  "host_permissions": [
    "https://*.supabase.co/*",
    "https://*.googleapis.com/*",
    "https://accounts.google.com/*"
  ],
  "oauth2": {
    "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    "scopes": [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  }
}
```

### 2. Chrome Identity 认证服务 (src/services/chromeAuth.ts)

#### 登录流程

```typescript
export const signInWithChromeIdentity = async (): Promise<void> => {
  // 1. 使用 chrome.identity.getAuthToken 获取 Google OAuth token
  const token = await new Promise<string>((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (result) => {
      // 处理不同的返回类型（字符串或对象）
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (result && typeof result === 'string') {
        resolve(result);
      } else if (result && typeof result === 'object' && 'token' in result) {
        resolve((result as { token: string }).token);
      } else {
        reject(new Error('未能获取认证令牌'));
      }
    });
  });

  // 2. 使用 token 获取用户信息（可选，用于验证）
  const userInfo = await fetchGoogleUserInfo(token);

  // 3. 使用 Supabase 的 signInWithIdToken 进行认证
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: token,
  });

  if (error) throw error;
};
```

#### 登出流程

```typescript
export const signOutChromeIdentity = async (): Promise<void> => {
  // 1. 获取当前缓存的 token
  const token = await chrome.identity.getAuthToken({ interactive: false });

  // 2. 移除 Chrome 缓存的 token
  if (token) {
    await chrome.identity.removeCachedAuthToken({ token });
  }

  // 3. 从 Supabase 登出
  await supabase.auth.signOut();
};
```

### 3. 认证状态管理 (src/hooks/useAuth.ts)

使用 Supabase 的 `onAuthStateChange` 监听认证状态：

```typescript
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthChange(async (newUser) => {
      setUser(newUser);
      
      // 当用户首次登录时，自动迁移本地数据到云端
      if (newUser && !hasMigrated.current) {
        await migrateLocalDataToSupabase(newUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
```

## 用户流程

### 登录流程

1. **用户点击"使用 Google 账号登录"按钮**
   - 触发 `signInWithChromeIdentity()`

2. **Chrome Identity API 处理**
   - 显示 Google 登录弹窗
   - 用户授权后，返回 OAuth token

3. **Supabase 认证**
   - 使用 token 调用 `supabase.auth.signInWithIdToken()`
   - Supabase 验证 token 并创建会话

4. **认证状态更新**
   - `onAuthStateChange` 触发
   - `useAuth` hook 更新用户状态
   - UI 自动更新显示用户信息

5. **数据迁移**
   - 自动将本地存储的数据迁移到 Supabase

### 登出流程

1. **用户点击登出按钮**
   - 触发 `signOutChromeIdentity()`

2. **清除认证信息**
   - 移除 Chrome 缓存的 OAuth token
   - 从 Supabase 登出

3. **状态重置**
   - 清除本地模式标记
   - 重新加载应用

## 关键特性

### 1. 自动 Token 管理
- Chrome 自动缓存 OAuth token
- 无需手动刷新 token
- 登出时自动清除缓存

### 2. 无缝集成 Supabase
- 使用 `signInWithIdToken` 方法
- Supabase 自动验证 Google token
- 自动创建用户会话

### 3. 数据迁移
- 登录后自动迁移本地数据
- 只在首次登录时执行
- 失败不影响登录流程

### 4. 双模式支持
- **登录模式**：数据同步到 Supabase
- **本地模式**：数据仅保存在浏览器

## 错误处理

### 常见错误及解决方案

1. **"未能获取认证令牌"**
   - 原因：用户取消登录或网络问题
   - 解决：提示用户重试

2. **"Supabase 认证失败"**
   - 原因：Token 无效或 Supabase 配置错误
   - 解决：检查 Supabase 配置，确保 Google OAuth 已启用

3. **"获取用户信息失败"**
   - 原因：Token 过期或权限不足
   - 解决：重新登录获取新 token

## 安全考虑

### 1. Token 安全
- Token 仅在内存中传递
- Chrome 自动加密存储
- 不在代码中硬编码敏感信息

### 2. 权限最小化
- 只请求必要的 OAuth scopes
- `userinfo.email` 和 `userinfo.profile`

### 3. HTTPS 强制
- 所有 API 调用使用 HTTPS
- manifest 中限制 host_permissions

## 测试指南

### 手动测试步骤

1. **安装扩展**
   ```bash
   npm run build
   # 在 Chrome 中加载 dist 目录
   ```

2. **测试登录**
   - 打开扩展侧边栏
   - 点击"使用 Google 账号登录"
   - 验证 Google 登录弹窗出现
   - 授权后验证用户信息显示正确

3. **测试数据同步**
   - 在本地模式创建一些内容
   - 登录账号
   - 验证数据已迁移到云端

4. **测试登出**
   - 点击登出按钮
   - 验证返回到登录页面
   - 重新登录验证数据仍然存在

### 调试技巧

1. **查看 Chrome Identity Token**
   ```javascript
   chrome.identity.getAuthToken({ interactive: false }, (token) => {
     console.log('Current token:', token);
   });
   ```

2. **查看 Supabase 会话**
   ```javascript
   const { data } = await supabase.auth.getSession();
   console.log('Session:', data.session);
   ```

3. **监听认证事件**
   ```javascript
   supabase.auth.onAuthStateChange((event, session) => {
     console.log('Auth event:', event, session);
   });
   ```

## 故障排除

### 问题：登录后立即登出

**可能原因**：
- Supabase 配置的重定向 URL 不匹配
- Chrome extension ID 变化

**解决方案**：
1. 检查 Supabase 项目设置中的 "Site URL"
2. 确保 Chrome extension ID 稳定（使用固定的 key）

### 问题：Token 验证失败

**可能原因**：
- Google OAuth Client ID 不匹配
- Supabase 中的 Google OAuth 配置错误

**解决方案**：
1. 验证 manifest.json 中的 client_id
2. 检查 Supabase 中的 Google OAuth 设置
3. 确保 Client ID 和 Client Secret 正确

### 问题：用户信息不显示

**可能原因**：
- OAuth scopes 不足
- 用户信息映射错误

**解决方案**：
1. 确保请求了 `userinfo.email` 和 `userinfo.profile` scopes
2. 检查 `onAuthChange` 中的用户信息映射逻辑

## 未来改进

1. **离线支持**
   - 缓存用户会话
   - 离线时使用本地数据

2. **多账号支持**
   - 允许切换不同的 Google 账号
   - 保持多个会话

3. **更好的错误提示**
   - 详细的错误信息
   - 用户友好的解决建议

4. **性能优化**
   - 减少不必要的 API 调用
   - 优化 token 刷新策略

## 参考资料

- [Chrome Identity API 文档](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)

## 总结

本实现使用 Chrome Identity API 和 Supabase Auth 提供了安全、可靠的 Google 登录功能。关键优势包括：

- ✅ 无需手动处理 OAuth 重定向
- ✅ Chrome 自动管理 token 缓存
- ✅ 与 Supabase 无缝集成
- ✅ 支持本地和云端双模式
- ✅ 自动数据迁移

用户体验流畅，开发维护简单。
