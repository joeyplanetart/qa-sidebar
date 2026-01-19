# Web 版本部署指南

本指南将帮助你将 QA Sider Web 版本部署到 Vercel。

## 📋 前置准备

1. **Supabase 项目**
   - 在 [Supabase](https://supabase.com) 创建新项目
   - 记录项目 URL 和 anon key

2. **GitHub 账号**
   - 确保已将代码推送到 GitHub

3. **Vercel 账号**
   - 注册 [Vercel](https://vercel.com) 账号
   - 连接 GitHub 账号

## 🚀 快速部署

### 方法 1: 一键部署

点击下面的按钮即可快速部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/qa_sider)

### 方法 2: 手动部署

#### 步骤 1: 推送代码到 GitHub

```bash
# 确保在 web_version 分支
git checkout web_version

# 添加所有更改
git add .

# 提交更改
git commit -m "feat: Web 版本改造完成"

# 推送到远程仓库
git push origin web_version
```

#### 步骤 2: 在 Vercel 中导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** > **"Project"**
3. 选择你的 GitHub 仓库
4. 选择 `web_version` 分支
5. Vercel 会自动检测到这是一个 Vite 项目

#### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | 你的 Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | 你的 Supabase 匿名密钥 |

**如何获取这些值：**

1. 访问你的 Supabase 项目
2. 点击左侧菜单的 **Settings** > **API**
3. 复制 **Project URL** 和 **anon/public key**

#### 步骤 4: 部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（通常需要 1-2 分钟）
3. 部署成功后会得到一个 URL，如 `https://qa-sider.vercel.app`

## 🗄️ Supabase 数据库配置

### 创建 contents 表

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 创建 contents 表
CREATE TABLE contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('code', 'sql', 'text')),
  language TEXT,
  formattedHtml TEXT,
  tags TEXT[],
  variables TEXT[],
  isPinned BOOLEAN DEFAULT FALSE,
  useCount INTEGER DEFAULT 0,
  lastUsedAt BIGINT,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX idx_contents_userId ON contents(userId);
CREATE INDEX idx_contents_createdAt ON contents(createdAt DESC);
CREATE INDEX idx_contents_isPinned ON contents(isPinned) WHERE isPinned = TRUE;

-- 启用行级安全策略 (RLS)
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "Users can only access their own contents"
  ON contents
  FOR ALL
  USING (auth.uid()::text = userId);
```

### 配置认证

1. 在 Supabase 项目中，进入 **Authentication** > **Providers**
2. 启用 **Email** 提供商
3. 配置邮箱模板（可选）

## 🔧 自定义域名（可选）

1. 在 Vercel 项目设置中点击 **"Domains"**
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效和 SSL 证书颁发

## 📊 监控和分析

Vercel 提供了内置的分析功能：

- **Analytics**: 访问量、页面性能等
- **Logs**: 实时日志查看
- **Speed Insights**: 性能监控

可以在项目设置中启用这些功能。

## 🔄 更新部署

当你更新代码后：

```bash
git add .
git commit -m "your commit message"
git push origin web_version
```

Vercel 会自动检测到更新并重新部署。

## 🐛 故障排查

### 构建失败

1. 检查环境变量是否正确配置
2. 查看 Vercel 构建日志
3. 确保 `package.json` 中的依赖版本正确

### 无法连接 Supabase

1. 验证环境变量是否正确
2. 检查 Supabase 项目是否正常运行
3. 确认 RLS 策略配置正确

### 页面显示空白

1. 打开浏览器控制台查看错误
2. 检查 Supabase 表是否创建成功
3. 验证环境变量前缀是否为 `VITE_`

## 💡 生产环境优化建议

1. **启用 Supabase 邮箱确认**
   - 在 Authentication 设置中启用邮箱确认
   - 配置邮箱模板

2. **配置 CORS**
   - 在 Supabase 项目设置中添加你的域名到允许列表

3. **设置速率限制**
   - 使用 Supabase Edge Functions 或 Vercel Middleware

4. **添加监控**
   - 使用 Sentry 等工具监控错误
   - 配置 Vercel Analytics

## 📚 相关文档

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

遇到问题？请查看项目的 [Issue](https://github.com/yourusername/qa_sider/issues) 页面。
