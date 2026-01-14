# 📚 QA sidePanel 文档

这是 QA sidePanel Chrome 扩展的文档目录。

## 📖 文档列表

### 📊 项目总结
- [整理总结](./SUMMARY.md) - 文档整理完成总结

## 🚀 快速开始指南

### 基本步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd qa_sider
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env` 文件：
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **配置 Supabase 数据库**
   
   在 Supabase SQL 编辑器中执行：
   ```sql
   -- 创建 contents 表
   CREATE TABLE contents (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     "userId" text NOT NULL,
     type text NOT NULL,
     title text NOT NULL,
     content text NOT NULL,
     language text,
     "isPinned" boolean DEFAULT false,
     "createdAt" bigint NOT NULL,
     "updatedAt" bigint NOT NULL
   );

   -- 创建索引
   CREATE INDEX idx_contents_userId ON contents("userId");
   CREATE INDEX idx_contents_isPinned ON contents("isPinned", "createdAt" DESC);

   -- 启用 RLS
   ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

   -- 创建安全策略
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
   ```

5. **禁用 Supabase 邮箱确认（可选）**
   
   在 Supabase 控制台：
   - 进入 Authentication → Settings
   - 关闭 "Enable email confirmations"
   - 保存

6. **构建扩展**
   ```bash
   npm run build
   ```

7. **加载到 Chrome**
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 目录

## 🎯 主要功能

### Email 认证
- 支持邮箱密码注册和登录
- 可配置是否需要邮箱确认
- 支持本地模式（无需登录）

### 内容管理
- 支持代码片段、SQL 语句、纯文本三种类型
- Monaco Editor 专业编辑器
- 语法高亮显示

### 置顶功能
- 点击图钉图标置顶常用内容
- 置顶内容自动排在列表顶部
- 支持云端同步和本地存储

### 搜索和筛选
- 实时模糊搜索
- 按类型筛选
- 虚拟列表优化性能

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 🐛 常见问题

### 页面空白
- 检查浏览器控制台是否有错误
- 确认 Supabase 配置正确
- 检查数据库表和字段是否正确

### 登录失败
- 确认 Supabase URL 和 Key 正确
- 检查网络连接
- 查看浏览器控制台错误信息

### 置顶不生效
- 确认数据库中有 `isPinned` 字段
- 检查 RLS 策略是否正确

## 🗄️ 数据库结构

### contents 表字段

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| userId | text | 用户 ID |
| type | text | 类型（code/sql/text） |
| title | text | 标题 |
| content | text | 内容 |
| language | text | 编程语言（可选） |
| isPinned | boolean | 是否置顶 |
| createdAt | bigint | 创建时间戳 |
| updatedAt | bigint | 更新时间戳 |

## 📦 项目技术栈

- React 18 + TypeScript
- Vite + @crxjs/vite-plugin
- TailwindCSS
- Monaco Editor
- Prism.js
- Supabase
- Zustand
- Lucide React
- React Virtuoso

## 🔗 相关链接

- [Supabase 文档](https://supabase.com/docs)
- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [React Virtuoso](https://virtuoso.dev/)

---

最后更新：2026-01-14
