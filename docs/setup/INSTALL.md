# 安装指南

## 🎉 Supabase 迁移完成！

项目已成功从 Firebase 迁移到 Supabase。现在使用开源的 PostgreSQL 数据库，体积更小，性能更好！

## ✅ 当前状态

```
✅ 项目代码完成
✅ Supabase 集成完成
✅ 所有依赖已安装
✅ 项目构建成功 (380KB, -36%)
⏳ 等待 Supabase 配置
⏳ 等待在 Chrome 中测试
```

## 📊 对比 Firebase

| 特性 | Firebase | Supabase |
|------|----------|----------|
| 数据库 | Firestore (NoSQL) | PostgreSQL (SQL) |
| 开源 | ❌ | ✅ |
| 自托管 | ❌ | ✅ |
| 包体积 | 597KB | 380KB (-36%) |
| 免费额度 | 有限 | 更慷慨 |

## 🚀 快速开始（3步）

### 步骤 1: 配置 Supabase

**1.1 创建项目**
1. 访问 https://supabase.com/
2. 创建新项目（1分钟）

**1.2 创建数据库表**
在 SQL Editor 执行：

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

-- 索引
CREATE INDEX idx_contents_userId ON contents("userId");
CREATE INDEX idx_contents_createdAt ON contents("createdAt" DESC);

-- 启用 RLS
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- 安全策略
CREATE POLICY "Users can read own contents"
ON contents FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own contents"
ON contents FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own contents"
ON contents FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own contents"
ON contents FOR DELETE USING (auth.uid()::text = "userId");
\`\`\`

**1.3 配置 Google 登录**
1. Google Cloud Console 创建 OAuth 应用
2. Supabase Dashboard → Authentication → Providers → Google
3. 启用并配置

**1.4 获取配置**
Project Settings → API：
- Project URL
- anon public key

**1.5 创建 .env 文件**

\`\`\`env
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon-key
\`\`\`

### 步骤 2: 重新构建

\`\`\`bash
cd /Users/joey/qa_sider
npm run build
\`\`\`

### 步骤 3: 加载到 Chrome

1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 加载 `dist` 目录
4. 开始使用！ 🎊

## 📚 详细文档

| 文档 | 说明 |
|------|------|
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | 🌟 Supabase 详细配置（推荐）|
| [MIGRATION_TO_SUPABASE.md](MIGRATION_TO_SUPABASE.md) | 迁移记录 |
| [QUICKSTART.md](QUICKSTART.md) | 5分钟快速上手 |
| [README.md](README.md) | 项目说明 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 部署指南 |

## 🆕 新特性（Supabase）

- ✨ **PostgreSQL**: 强大的关系型数据库
- ⚡ **更快**: 包体积减少 36%
- 💰 **更便宜**: 免费额度更大
- 🔓 **开源**: 完全开源，可自托管
- 🎯 **类型安全**: 自动生成 TypeScript 类型

## ⚠️ 注意事项

1. **Chrome 版本**: >= 114
2. **Supabase 配置**: 必须配置才能使用（见 SUPABASE_SETUP.md）
3. **数据迁移**: 如果之前使用 Firebase，数据需要手动迁移
4. **OAuth 配置**: Google OAuth 需要正确配置回调URL

## 🐛 常见问题

**Q: 构建失败？**
- 确保已安装依赖：`npm install`

**Q: 登录失败？**
- 检查 `.env` 配置
- 确保 Google OAuth 已配置

**Q: 无法保存数据？**
- 检查 RLS 策略是否已创建
- 确保已登录

**Q: 与 Firebase 的区别？**
- 查看 [MIGRATION_TO_SUPABASE.md](MIGRATION_TO_SUPABASE.md)

## 🎯 项目特点

- 🔐 安全：Row Level Security 保护数据
- 🚀 高性能：PostgreSQL + 优化的查询
- 📱 现代 UI：TailwindCSS + React
- 💻 Monaco Editor：VS Code 编辑器体验
- 🎨 语法高亮：Prism.js 支持多种语言
- 🔍 实时搜索：防抖优化
- ☁️ 云同步：Supabase 实时同步

## 📞 获取帮助

1. 查看文档（特别是 SUPABASE_SETUP.md）
2. 检查浏览器控制台错误
3. 查看 Supabase Dashboard 日志
4. 在 GitHub 创建 Issue

## 🎉 开始使用

配置好 Supabase 后：

\`\`\`bash
npm run build
\`\`\`

然后在 Chrome 中加载 `dist` 目录，享受你的内容管理器！

---

**祝使用愉快！** 🚀

有任何问题请查看 [SUPABASE_SETUP.md](SUPABASE_SETUP.md) 获取详细配置说明。
