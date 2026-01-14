# Email 注册/登录功能实现

## 实现内容

已成功实现基于 Email 的注册/登录功能，并暂时隐藏了 Google 账号登录按钮。

## 主要改动

### 1. 添加 Email 认证函数 (src/services/supabase.ts)

添加了两个新函数：

- `signUpWithEmail(email: string, password: string)` - Email 注册
- `signInWithEmail(email: string, password: string)` - Email 登录

这两个函数使用 Supabase Auth 的标准 Email/Password 认证方法。

### 2. 更新认证面板 (src/components/Auth/AuthPanel.tsx)

#### 新增状态管理：
- `isSignUp` - 切换注册/登录模式
- `email` - 邮箱输入
- `password` - 密码输入
- `confirmPassword` - 确认密码输入（仅注册时显示）

#### 新增功能：
- **Email 表单**：包含邮箱、密码输入框
- **表单验证**：
  - 检查邮箱和密码是否填写
  - 密码长度至少 6 位
  - 注册时验证两次密码是否一致
- **友好的错误提示**：
  - 邮箱或密码错误
  - 邮箱已被注册
  - 邮箱格式不正确
  - 需要先确认邮箱
- **注册/登录切换**：用户可以在注册和登录模式之间切换
- **隐藏 Google 登录**：使用 `{false && ...}` 条件渲染来隐藏 Google 登录按钮

## UI 特性

1. **现代化设计**：
   - 清晰的表单布局
   - 使用 Tailwind CSS 实现响应式设计
   - 友好的按钮状态（加载中、禁用等）

2. **用户体验**：
   - 自动完成支持（autocomplete）
   - 表单提交防抖（加载状态）
   - 清晰的视觉反馈
   - 注册/登录模式一键切换

3. **分隔线设计**：
   - 在 Email 登录和"稍后登录"按钮之间添加了"或"分隔线
   - 为未来可能重新启用 Google 登录预留了位置

## 使用方式

### 注册新账号：
1. 点击"没有账号？点击注册"
2. 输入邮箱和密码（至少 6 位）
3. 再次确认密码
4. 点击"注册"按钮
5. **如果已禁用邮箱确认**：注册成功后自动登录
6. **如果启用邮箱确认**：检查邮箱确认链接

> 💡 **推荐配置**：对于个人应用，建议在 Supabase 控制台禁用邮箱确认功能。
> 详见：`EMAIL_CONFIRMATION_DISABLE.md`

### 登录：
1. 输入已注册的邮箱和密码
2. 点击"登录"按钮
3. 登录成功后自动进入应用

### 本地模式：
- 用户仍然可以选择"稍后登录（使用本地存储）"来使用本地模式

## 技术细节

### 认证流程：
1. 用户提交表单 → 调用 `signUpWithEmail` 或 `signInWithEmail`
2. Supabase 处理认证 → 返回用户信息
3. `useAuth` hook 监听认证状态变化 → 自动更新 UI
4. App 组件根据认证状态显示相应界面

### 错误处理：
- 所有错误都会被捕获并转换为用户友好的中文消息
- 使用 Dialog 组件显示错误提示
- 支持常见的 Supabase 错误类型识别

## 待完成功能

如果需要重新启用 Google 登录，只需：
1. 将 `AuthPanel.tsx` 第 206 行的 `{false && (` 改为 `{true && (`
2. 或者完全移除条件，直接显示 Google 登录按钮

## 测试建议

由于这是 Chrome 扩展程序，需要：
1. 运行 `npm run build` 构建扩展
2. 在 Chrome 浏览器中加载 `dist` 目录作为未打包的扩展
3. 打开侧边栏测试登录功能
4. 确保 Supabase 项目已正确配置（数据库表、Email 认证等）

## 注意事项

1. **Email 确认配置**：
   - 代码已支持自动检测是否需要邮箱确认
   - 推荐在 Supabase 控制台禁用邮箱确认（适合个人应用）
   - 详细配置步骤请参考：`EMAIL_CONFIRMATION_DISABLE.md`
2. **环境变量**：确保 `.env` 文件中包含正确的 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
3. **密码策略**：目前最小密码长度为 6 位，可以在 Supabase 控制台中调整

## 相关文档

- `EMAIL_CONFIRMATION_DISABLE.md` - 如何禁用 Supabase 邮箱确认的详细指南
