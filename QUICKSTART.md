# 🚀 Web 版本快速开始指南

5 分钟内让你的 QA Sider Web 版本运行起来！

## 📋 准备工作

确保你已安装：
- Node.js 18+ 
- npm 或 pnpm
- Git

## 🎯 本地开发（3 分钟）

### 1. 克隆项目

```bash
# 克隆仓库
git clone <your-repo-url>
cd qa_sider

# 切换到 web_version 分支
git checkout web_version
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量（可选）

如果你想使用云端同步功能：

```bash
# 复制环境变量示例
cp env.example .env.local

# 编辑 .env.local，填入你的 Supabase 配置
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

> 💡 **提示**: 不配置环境变量也可以使用，所有数据会保存在浏览器本地。

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000` 🎉

## ☁️ 部署到 Vercel（2 分钟）

### 方法 1: 自动部署（推荐）

1. 推送代码到 GitHub
   ```bash
   git add .
   git commit -m "feat: Web 版本初始化"
   git push origin web_version
   ```

2. 访问 [Vercel](https://vercel.com) 并登录

3. 点击 **"Add New Project"**

4. 导入你的 GitHub 仓库

5. 配置项目:
   - **Framework Preset**: Vite
   - **Branch**: `web_version`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. 添加环境变量（可选）:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

7. 点击 **"Deploy"**

等待 1-2 分钟，你的应用就部署好了！🚀

### 方法 2: Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 生产部署
vercel --prod
```

## 🗄️ Supabase 设置（可选，5 分钟）

如果你想使用云端同步功能：

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 **"New Project"**
3. 填写项目信息并创建

### 2. 创建数据表

在 SQL Editor 中执行：

```sql
CREATE TABLE contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  language TEXT,
  tags TEXT[],
  variables TEXT[],
  isPinned BOOLEAN DEFAULT FALSE,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL
);

CREATE INDEX idx_contents_userId ON contents(userId);
CREATE INDEX idx_contents_createdAt ON contents(createdAt DESC);

ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own contents"
  ON contents FOR ALL
  USING (auth.uid()::text = userId);
```

### 3. 启用认证

1. 进入 **Authentication** > **Providers**
2. 启用 **Email**
3. 完成！

### 4. 获取配置信息

1. 进入 **Settings** > **API**
2. 复制:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

## 🎮 使用应用

### 首次访问

1. 打开应用
2. 选择：
   - **注册/登录** - 使用云端同步
   - **稍后登录** - 使用本地存储

### 创建第一个片段

1. 点击右上角 **"新建"** 按钮
2. 填写标题和内容
3. 选择类型（代码/SQL/文本）
4. 添加标签（可选）
5. 点击 **"保存"**

### 搜索和筛选

- 使用搜索框搜索内容
- 点击类型标签筛选
- 点击标签云筛选
- 组合使用获得最佳效果

### 主题切换

- 点击主题切换按钮切换亮色/暗色
- 点击色盘按钮选择主题色

## 📁 项目结构

```
qa_sider/
├── src/
│   ├── components/     # React 组件
│   ├── hooks/         # 自定义 Hooks
│   ├── services/      # API 服务
│   ├── types/         # TypeScript 类型
│   └── utils/         # 工具函数
├── public/            # 静态资源
├── docs/              # 文档
├── vercel.json        # Vercel 配置
└── package.json       # 依赖配置
```

## 🔧 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产构建

# 代码质量
npm run lint         # 运行 ESLint
npm run type-check   # TypeScript 类型检查
```

## 🆘 遇到问题？

### 构建失败
- 确保 Node.js 版本 >= 18
- 删除 `node_modules` 和 `package-lock.json`，重新 `npm install`

### 无法连接 Supabase
- 检查环境变量是否正确
- 确保以 `VITE_` 开头
- 重启开发服务器

### 页面空白
- 打开浏览器控制台查看错误
- 检查网络请求
- 确认 Supabase 表已创建

## 📚 更多资源

- [完整 README](./README.md)
- [Vercel 部署指南](./docs/VERCEL_DEPLOYMENT.md)
- [版本对比](./docs/VERSION_COMPARISON.md)
- [测试清单](./TESTING_CHECKLIST.md)

## 🎉 开始使用

现在你已经准备好了！开始管理你的代码片段吧！

```bash
# 启动应用
npm run dev
```

访问 http://localhost:3000 开始使用！

---

**祝你使用愉快！** 🚀
