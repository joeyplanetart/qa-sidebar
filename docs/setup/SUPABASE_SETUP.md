# Supabase 配置指南

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击"Start your project"或"New project"
3. 选择组织或创建新组织
4. 输入项目名称（例如：qa-sider）
5. 设置数据库密码（请妥善保存）
6. 选择区域（建议选择最近的区域，如 Northeast Asia (Tokyo)）
7. 选择定价计划（免费版已足够）
8. 点击"Create new project"

## 步骤 2: 创建数据库表

### 2.1 创建 contents 表

在 Supabase Dashboard：

1. 点击左侧菜单的 "Table Editor"
2. 点击 "Create a new table"
3. 配置表：
   - Name: `contents`
   - Description: "用户保存的代码片段和文本内容"
   - 取消勾选 "Enable Row Level Security (RLS)" （稍后再启用）

4. 添加以下列（Columns）：

| Name | Type | Default Value | Primary | Nullable | Unique |
|------|------|---------------|---------|----------|--------|
| id | uuid | gen_random_uuid() | ✅ | ❌ | ✅ |
| userId | text | - | ❌ | ❌ | ❌ |
| type | text | - | ❌ | ❌ | ❌ |
| title | text | - | ❌ | ❌ | ❌ |
| content | text | - | ❌ | ❌ | ❌ |
| language | text | null | ❌ | ✅ | ❌ |
| formattedHtml | text | null | ❌ | ✅ | ❌ |
| tags | text[] | null | ❌ | ✅ | ❌ |
| createdAt | bigint | - | ❌ | ❌ | ❌ |
| updatedAt | bigint | - | ❌ | ❌ | ❌ |

5. 点击 "Save" 创建表

### 2.2 使用 SQL 快速创建（推荐）

或者，点击 "SQL Editor"，执行以下 SQL：

\`\`\`sql
-- 创建 contents 表
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

-- 创建索引以优化查询性能
CREATE INDEX idx_contents_userId ON contents("userId");
CREATE INDEX idx_contents_createdAt ON contents("createdAt" DESC);
CREATE INDEX idx_contents_userId_type ON contents("userId", type);
\`\`\`

## 步骤 3: 启用 Row Level Security (RLS)

### 3.1 启用 RLS

在 SQL Editor 中执行：

\`\`\`sql
-- 启用 RLS
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
\`\`\`

### 3.2 创建安全策略

\`\`\`sql
-- 允许用户读取自己的内容
CREATE POLICY "Users can read own contents"
ON contents FOR SELECT
USING (auth.uid()::text = "userId");

-- 允许用户创建内容
CREATE POLICY "Users can create own contents"
ON contents FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

-- 允许用户更新自己的内容
CREATE POLICY "Users can update own contents"
ON contents FOR UPDATE
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- 允许用户删除自己的内容
CREATE POLICY "Users can delete own contents"
ON contents FOR DELETE
USING (auth.uid()::text = "userId");
\`\`\`

## 步骤 4: 配置 Google Authentication

### 4.1 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "Google+ API"
4. 转到 "凭据" → "创建凭据" → "OAuth 客户端 ID"
5. 应用类型：Web 应用
6. 授权重定向 URI：
   - 开发环境：`http://localhost:54321/auth/v1/callback`
   - 生产环境：`https://[你的项目引用].supabase.co/auth/v1/callback`
   
   （可以在 Supabase Dashboard → Authentication → Providers → Google 中找到正确的回调 URL）

7. 保存 Client ID 和 Client Secret

### 4.2 在 Supabase 中配置 Google Provider

1. 在 Supabase Dashboard，点击左侧 "Authentication"
2. 点击 "Providers" 标签
3. 找到 "Google"，点击右侧的齿轮图标
4. 启用 Google Provider
5. 输入 Client ID 和 Client Secret
6. 点击 "Save"

### 4.3 配置 Chrome Extension 回调

由于 Chrome Extension 的特殊性，需要额外配置：

1. 在 Supabase Dashboard → Authentication → URL Configuration
2. 添加重定向 URL：
   ```
   chrome-extension://[你的扩展ID]/
   ```
   
   （扩展 ID 在加载扩展后可以在 chrome://extensions/ 中找到）

## 步骤 5: 获取 Supabase 配置

1. 在 Supabase Dashboard，点击左侧的齿轮图标（Project Settings）
2. 点击 "API" 标签
3. 找到以下信息：
   - **Project URL**: 类似 `https://xxxxx.supabase.co`
   - **anon public key**: 以 `eyJ` 开头的长字符串

## 步骤 6: 配置环境变量

在项目根目录创建 `.env` 文件：

\`\`\`env
VITE_SUPABASE_URL=https://你的项目引用.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon-public-key
\`\`\`

**示例**:
\`\`\`env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0MjU2MDAsImV4cCI6MTk5OTk5OTk5OX0...
\`\`\`

## 步骤 7: 测试数据库连接

在 SQL Editor 中执行以下测试查询：

\`\`\`sql
SELECT * FROM contents;
\`\`\`

应该返回空结果（表示表已成功创建）。

## 步骤 8: 验证配置

1. 重新构建项目：
   \`\`\`bash
   npm run build
   \`\`\`

2. 在 Chrome 中重新加载扩展

3. 打开 Side Panel

4. 尝试使用 Google 账号登录

5. 创建一个测试内容

6. 在 Supabase Dashboard → Table Editor → contents 中查看是否有新记录

## 常见问题

### Q: OAuth 登录失败
**A**: 
- 检查 Google OAuth 回调 URL 是否正确
- 确保在 Supabase 中正确配置了 Google Provider
- 检查 Client ID 和 Secret 是否正确

### Q: 无法读取/写入数据
**A**: 
- 检查 RLS 策略是否正确启用
- 确保用户已登录
- 在浏览器控制台查看详细错误信息
- 在 Supabase Dashboard → Database → Logs 中查看日志

### Q: CORS 错误
**A**: 
- 在 manifest.json 中确保添加了 `https://*.supabase.co/*` 到 host_permissions
- 检查 Supabase URL 是否正确

### Q: 类型错误（TypeScript）
**A**: 
- Supabase 会自动推断类型
- 如果需要手动定义，可以使用 Supabase CLI 生成类型定义

### Q: API Key 安全吗？
**A**: 
- Supabase 的 `anon` key 可以安全地暴露在前端
- 实际安全由 RLS 策略保护
- 建议在 Supabase 设置中启用邮件验证等额外安全措施

## 性能优化

### 创建索引

\`\`\`sql
-- 为常用查询创建索引
CREATE INDEX IF NOT EXISTS idx_contents_userId_createdAt 
ON contents("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_contents_type 
ON contents(type);

-- 全文搜索索引（可选）
CREATE INDEX IF NOT EXISTS idx_contents_title_search 
ON contents USING gin(to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_contents_content_search 
ON contents USING gin(to_tsvector('english', content));
\`\`\`

### 全文搜索（高级功能）

如果需要更强大的搜索功能：

\`\`\`sql
-- 添加全文搜索列
ALTER TABLE contents ADD COLUMN search_vector tsvector;

-- 创建触发器自动更新搜索向量
CREATE OR REPLACE FUNCTION contents_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER contents_search_update BEFORE INSERT OR UPDATE
ON contents FOR EACH ROW EXECUTE FUNCTION contents_search_trigger();

-- 创建 GIN 索引
CREATE INDEX contents_search_idx ON contents USING GIN(search_vector);
\`\`\`

## 数据库备份

Supabase 免费版提供自动备份，但也可以手动导出：

1. Database → Backups
2. 点击 "Download" 下载备份
3. 定期备份重要数据

## 监控和分析

1. **Usage**: 查看 API 请求、存储使用情况
2. **Logs**: 实时查看数据库和 API 日志
3. **Reports**: 查看使用报告和性能指标

## 下一步

配置完成后：
- 重新构建项目 (`npm run build`)
- 在 Chrome 中测试扩展
- 创建测试数据验证功能
- 根据需要调整 RLS 策略

## 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth 设置](https://supabase.com/docs/guides/auth/social-login/auth-google)
