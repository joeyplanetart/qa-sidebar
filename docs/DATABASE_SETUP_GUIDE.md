# Supabase 数据库配置指南

## ⚠️ 错误信息

如果你看到以下错误：

```
"Could not find the 'variables' column of 'contents' in the schema cache"
```

这说明数据库表结构不完整或不存在。请按照以下步骤配置。

---

## 🚀 快速配置步骤

### 1. 登录 Supabase Dashboard

访问：https://app.supabase.com

选择你的项目

### 2. 执行 SQL 脚本

1. 点击左侧菜单 **"SQL Editor"**
2. 点击 **"New Query"** 按钮
3. 打开文件 `docs/SUPABASE_SETUP.sql`
4. 复制整个文件内容
5. 粘贴到 SQL Editor
6. 点击 **"Run"** 按钮执行

### 3. 验证表结构

1. 点击左侧菜单 **"Table Editor"**
2. 应该能看到 `contents` 表
3. 点击表名查看字段列表

#### 必须包含的字段：

- ✅ `id` (uuid)
- ✅ `userId` (text)
- ✅ `type` (text)
- ✅ `title` (text)
- ✅ `content` (text)
- ✅ `language` (text, nullable)
- ✅ `formattedHtml` (text, nullable)
- ✅ `tags` (text[], nullable)
- ✅ `variables` (text[], nullable) ⭐ **重要！**
- ✅ `isPinned` (boolean, nullable)
- ✅ `useCount` (integer, nullable) ⭐ **新增！**
- ✅ `lastUsedAt` (bigint, nullable) ⭐ **新增！**
- ✅ `createdAt` (bigint)
- ✅ `updatedAt` (bigint)

---

## 📊 表结构说明

### ContentItem 类型对应

```typescript
export interface ContentItem {
  id: string;                    // UUID 主键
  userId: string;                // 用户 ID
  type: ContentType;             // 'code' | 'sql' | 'text'
  title: string;                 // 标题
  content: string;               // 内容
  language?: string;             // 编程语言
  formattedHtml?: string;        // 格式化的 HTML
  tags?: string[];               // 标签数组
  variables?: string[];          // 变量列表 ⭐
  isPinned?: boolean;            // 是否置顶
  useCount?: number;             // 使用次数 ⭐
  lastUsedAt?: number;           // 最后使用时间 ⭐
  createdAt: number;             // 创建时间
  updatedAt: number;             // 更新时间
}
```

---

## 🔐 行级安全 (RLS) 策略

表已启用行级安全，确保用户只能访问自己的数据：

- **SELECT**: 用户只能查看自己的内容
- **INSERT**: 用户只能插入自己的内容
- **UPDATE**: 用户只能更新自己的内容
- **DELETE**: 用户只能删除自己的内容

---

## 🔍 常见问题

### Q1: 执行 SQL 时出错怎么办？

**A**: 常见错误及解决方案：

#### 错误：`permission denied for table contents`

**原因**：权限不足

**解决**：
1. 确保你是项目的 Owner
2. 或者移除 RLS 策略后重试

#### 错误：`relation "contents" already exists`

**原因**：表已存在

**解决**：
```sql
-- 删除旧表
DROP TABLE IF EXISTS public.contents CASCADE;
-- 然后重新执行完整的 SQL 脚本
```

#### 错误：字段类型不匹配

**原因**：旧表结构与新结构冲突

**解决**：
1. 导出现有数据（如果有）
2. 删除旧表
3. 创建新表
4. 导入数据

---

### Q2: 如何检查表是否创建成功？

**A**: 在 SQL Editor 中运行：

```sql
-- 查看表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'contents'
ORDER BY 
    ordinal_position;
```

---

### Q3: 如何添加测试数据？

**A**: 在 SQL Editor 中运行：

```sql
-- 插入测试数据
INSERT INTO public.contents (
    "userId",
    type,
    title,
    content,
    language,
    tags,
    variables,
    "isPinned",
    "useCount",
    "createdAt",
    "updatedAt"
) VALUES (
    'test-user-id',  -- 替换为真实的用户 ID
    'code',
    'Hello World',
    'console.log("Hello, ${NAME}!")',
    'javascript',
    ARRAY['demo', 'test'],
    ARRAY['NAME'],
    false,
    0,
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);
```

---

### Q4: 如何迁移现有数据？

**A**: 如果你已经有数据，但表结构不完整：

```sql
-- 1. 备份现有数据
CREATE TABLE contents_backup AS 
SELECT * FROM public.contents;

-- 2. 删除旧表
DROP TABLE public.contents CASCADE;

-- 3. 创建新表（执行 SUPABASE_SETUP.sql）

-- 4. 迁移数据
INSERT INTO public.contents (
    id,
    "userId",
    type,
    title,
    content,
    language,
    "formattedHtml",
    tags,
    variables,
    "isPinned",
    "useCount",
    "lastUsedAt",
    "createdAt",
    "updatedAt"
)
SELECT 
    id,
    "userId",
    type,
    title,
    content,
    language,
    "formattedHtml",
    tags,
    COALESCE(variables, ARRAY[]::TEXT[]),  -- 如果没有，设为空数组
    COALESCE("isPinned", false),           -- 如果没有，设为 false
    COALESCE("useCount", 0),                -- 如果没有，设为 0
    "lastUsedAt",
    "createdAt",
    "updatedAt"
FROM contents_backup;

-- 5. 验证数据
SELECT COUNT(*) FROM public.contents;
SELECT COUNT(*) FROM contents_backup;

-- 6. 确认无误后删除备份
-- DROP TABLE contents_backup;
```

---

## 🧪 测试步骤

### 1. 测试数据库连接

在应用的浏览器控制台运行：

```javascript
// 测试查询
const { data, error } = await supabase
  .from('contents')
  .select('*')
  .limit(1);

console.log('数据:', data);
console.log('错误:', error);
```

### 2. 测试插入数据

```javascript
const { data, error } = await supabase
  .from('contents')
  .insert({
    userId: 'test-user',
    type: 'code',
    title: '测试片段',
    content: 'console.log("test")',
    language: 'javascript',
    tags: ['test'],
    variables: [],
    isPinned: false,
    useCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
  .select();

console.log('插入结果:', data);
console.log('错误:', error);
```

---

## 📈 性能优化

SQL 脚本已经创建了以下索引：

- `idx_contents_userId` - 按用户查询
- `idx_contents_type` - 按类型筛选
- `idx_contents_createdAt` - 按时间排序
- `idx_contents_isPinned` - 置顶内容查询
- `idx_contents_tags` - 标签搜索（GIN 索引）

如果数据量很大，还可以添加更多索引：

```sql
-- 复合索引：用户 + 创建时间
CREATE INDEX idx_contents_userId_createdAt 
ON public.contents("userId", "createdAt" DESC);

-- 全文搜索索引
CREATE INDEX idx_contents_fulltext 
ON public.contents 
USING GIN(to_tsvector('english', title || ' ' || content));
```

---

## 🔗 相关文档

- [Supabase Table 文档](https://supabase.com/docs/guides/database/tables)
- [Supabase RLS 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL 数据类型](https://www.postgresql.org/docs/current/datatype.html)

---

## ✅ 配置完成检查清单

完成配置后，确认以下所有项：

- [ ] SQL 脚本执行成功，无错误
- [ ] 在 Table Editor 中看到 `contents` 表
- [ ] 表包含所有 18 个字段
- [ ] RLS 策略已启用
- [ ] 可以在应用中保存新片段
- [ ] 可以查看已保存的片段
- [ ] 统计功能正常工作

---

## 🆘 需要帮助？

如果仍然遇到问题：

1. 检查 Supabase Dashboard 的 Logs
2. 查看浏览器控制台的错误信息
3. 确认用户已登录（auth.uid() 不为空）
4. 验证 Supabase 项目 URL 和 API Key 配置正确

---

## 💡 下一步

配置完成后：

1. 重新加载应用
2. 尝试创建新片段
3. 测试统计功能
4. 测试 GitHub 登录（如果已配置）
