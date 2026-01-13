# 快速开始指南

这是一个 5 分钟快速上手指南，帮助你快速运行项目。

## 前置要求

- Node.js 16+
- Chrome 浏览器 114+
- Google 账号（用于 Firebase）

## 步骤 1: 克隆并安装

\`\`\`bash
cd /Users/joey/qa_sider
npm install
\`\`\`

## 步骤 2: 配置 Supabase（5分钟）

### 2.1 创建 Supabase 项目

1. 访问 https://supabase.com/
2. 点击"New project" → 输入名称 → 创建

### 2.2 创建数据库表

在 SQL Editor 中执行：

\`\`\`sql
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT,
  "formattedHtml" TEXT,
  tags TEXT[],
  "createdAt" BIGINT NOT NULL,
  "updatedAt" BIGINT NOT NULL
);

CREATE INDEX idx_contents_userId ON contents("userId");
CREATE INDEX idx_contents_createdAt ON contents("createdAt" DESC);
\`\`\`

### 2.3 启用 RLS

\`\`\`sql
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own contents"
ON contents FOR SELECT
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own contents"
ON contents FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own contents"
ON contents FOR UPDATE
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own contents"
ON contents FOR DELETE
USING (auth.uid()::text = "userId");
\`\`\`

### 2.4 配置 Google Authentication

1. 在 Google Cloud Console 创建 OAuth 应用
2. 在 Supabase Dashboard → Authentication → Providers → Google
3. 启用并配置 Client ID 和 Secret

### 2.5 获取配置

1. Project Settings → API
2. 复制 Project URL 和 anon public key

### 2.6 创建 .env 文件

在项目根目录创建 `.env` 文件：

\`\`\`env
VITE_SUPABASE_URL=https://你的项目引用.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon-key
\`\`\`

## 步骤 3: 构建并加载扩展

\`\`\`bash
npm run build
\`\`\`

1. 打开 Chrome：`chrome://extensions/`
2. 开启"开发者模式"（右上角）
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 目录

## 步骤 4: 使用扩展

1. 点击扩展图标（或在任意页面右键 → 打开侧边栏）
2. 使用 Google 账号登录
3. 点击"新建"创建第一个代码片段
4. 享受使用！

## 常见问题

**Q: 登录失败？**
- 检查 .env 配置是否正确
- 确保 Supabase Authentication 已启用 Google 登录
- 确保 Google OAuth 已正确配置

**Q: 无法保存数据？**
- 检查 RLS 策略是否已配置
- 确保已登录

**Q: Side Panel 打不开？**
- 确保 Chrome 版本 >= 114
- 重新加载扩展

## 详细文档

- 完整说明：[README.md](README.md)
- Supabase 详细配置：[SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- 部署指南：[DEPLOYMENT.md](DEPLOYMENT.md)

## 需要帮助？

在 GitHub 项目页面创建 Issue。
