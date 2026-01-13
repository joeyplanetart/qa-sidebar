# OAuth 回调失败调试指南

## 🔍 问题分析

您遇到的错误发生在步骤3（OAuth 认证窗口关闭后）。这通常有以下几个可能的原因：

### 1. **Supabase 的 Redirect URL 格式不匹配**

Chrome Extension 的 redirect URL 格式是：
```
https://<extension-id>.chromiumapp.org/
```

但 Supabase 可能期望一个不同的格式。

### 2. **Response Mode 问题**

`launchWebAuthFlow` 期望在 URL 的 **hash fragment** (#) 中接收 token，但 Supabase 可能返回在 **query parameters** (?) 中。

## 🎯 解决方案：检查并修改 Supabase 设置

### 步骤1：检查 Supabase Auth Settings

1. 打开 Supabase Dashboard
2. 进入 **Authentication** > **URL Configuration**
3. 确认以下设置：

   **Site URL:**
   ```
   https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org
   ```

   **Redirect URLs** (添加以下三个):
   ```
   https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/
   https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/*
   https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/callback
   ```

### 步骤2：检查 Google Cloud Console

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 进入 **APIs & Services** > **Credentials**
3. 点击您的 OAuth 2.0 Client ID
4. 确认 **Authorized redirect URIs** 包含：
   ```
   https://amnpeighmpmnglhjhkpdmkehckaaaamb.chromiumapp.org/
   ```

### 步骤3：测试修改后的代码

如果上述配置都正确，我们需要修改代码来正确处理回调。

## 🐛 调试信息收集

请在选择 email 后，控制台应该会输出错误信息。请提供：

1. **完整的错误消息**（从控制台复制）
2. **步骤3的日志输出**（特别是 "launchWebAuthFlow 错误" 后面的内容）
3. 如果可能，尝试在这段代码中添加更多日志：

```typescript
// 在 chromeAuth.ts 的第 60 行附近
(responseUrl) => {
  console.log('🔍 [调试] responseUrl:', responseUrl); // 添加这行
  if (chrome.runtime.lastError) {
    console.error('❌ launchWebAuthFlow 错误:', chrome.runtime.lastError);
```

这样我们可以看到实际返回的 URL 是什么格式，从而针对性地修复问题。

## 📋 下一步

请先确认以上配置，然后告诉我：
1. 配置是否都正确？
2. 选择 email 后的**完整错误信息**是什么？
