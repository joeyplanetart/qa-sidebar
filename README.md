# QA Sider - Web 版本

一个现代化的代码片段管理工具，专为 QA 和开发者打造。支持云端同步、本地存储、标签管理等功能。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 主要功能

- 📝 **多类型支持** - 保存代码片段、SQL 语句和纯文本
- 🎨 **专业编辑器** - Monaco Editor 集成，提供 IDE 级编辑体验
- 🔍 **智能搜索** - 实时模糊搜索，快速定位内容
- 📌 **置顶功能** - 常用内容置顶，快速访问
- 🏷️ **标签系统** - 多标签支持、智能建议、标签云筛选
- 📂 **类型筛选** - 按类型分类（代码/SQL/文本）
- 🔐 **邮箱登录** - 简单的邮箱密码认证
- 👤 **随机头像** - 每个用户自动生成独特头像
- ☁️ **云端同步** - Supabase 后端，数据自动同步
- 💾 **本地模式** - 支持匿名使用，数据保存在本地
- 🎯 **语法高亮** - Prism.js 驱动，支持多种语言
- 📱 **现代化 UI** - TailwindCSS + 响应式设计
- 🌓 **主题切换** - 支持亮色/暗色主题

## 🚀 快速开始

### 本地开发

```bash
# 克隆仓库
git clone <your-repo-url>
cd qa_sider

# 切换到 web 版本分支
git checkout web_version

# 安装依赖
npm install

# 配置环境变量
# 创建 .env.local 文件，填入你的 Supabase 配置
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 启动开发服务器
npm run dev
```

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/qa_sider&project-name=qa-sider&repository-name=qa_sider)

**手动部署步骤：**

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 创建新项目
3. 导入你的 GitHub 仓库
4. 配置环境变量：
   - `VITE_SUPABASE_URL`: 你的 Supabase 项目 URL
   - `VITE_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥
5. 点击部署

### Supabase 配置

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 创建 `contents` 表（参考 `SUPABASE_CONFIG.md`）
3. 启用 Email/Password 认证
4. 复制项目 URL 和 anon key 到环境变量

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS
- **编辑器**: Monaco Editor
- **语法高亮**: Prism.js
- **后端**: Supabase (Auth + PostgreSQL)
- **状态管理**: Zustand
- **图标**: Lucide React
- **虚拟列表**: React Virtuoso

## 📦 项目结构

```
qa_sider/
├── src/
│   ├── components/          # React 组件
│   │   ├── Auth/           # 认证相关
│   │   ├── ContentList/    # 内容列表
│   │   ├── Editor/         # 编辑器
│   │   ├── Header/         # 头部
│   │   └── ...
│   ├── hooks/              # 自定义 Hooks
│   ├── services/           # 服务层 (Supabase, Storage)
│   ├── types/              # TypeScript 类型
│   └── utils/              # 工具函数
├── public/                  # 静态资源
├── docs/                    # 📚 文档
└── package.json            # 项目依赖
```

## 🎯 使用说明

### 注册/登录

1. 首次使用时，点击 **"没有账号？点击注册"**
2. 输入邮箱和密码（至少 6 位）
3. 注册成功后自动登录
4. 或点击 **"稍后登录"** 使用本地模式

### 使用标签系统

**添加标签**：
1. 新建或编辑内容时，在标签输入框输入标签
2. 按 `Enter` 添加标签
3. 每个内容最多 3 个标签
4. 输入时会显示历史标签建议
5. 点击标签上的 `×` 删除

**筛选内容**：
1. 主界面显示所有可用标签
2. 点击标签进行筛选
3. 可以选择多个标签（OR 逻辑）
4. 点击"清除全部"重置筛选

### 变量功能

在代码片段中使用 `{{变量名}}` 定义变量，插入时可以替换为实际值：

```sql
SELECT * FROM users WHERE id = {{user_id}} AND status = {{status}}
```

## 🔧 开发

```bash
# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 类型检查
tsc --noEmit
```

## 📝 环境变量

创建 `.env.local` 文件：

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🌟 特性对比

| 特性 | Chrome 插件版 | Web 版本 |
|------|-------------|---------|
| 代码片段管理 | ✅ | ✅ |
| 云端同步 | ✅ | ✅ |
| 本地存储 | ✅ | ✅ |
| 标签系统 | ✅ | ✅ |
| 语法高亮 | ✅ | ✅ |
| 主题切换 | ✅ | ✅ |
| 跨页面快速保存 | ✅ | ❌ |
| 文本快速插入 | ✅ | ❌ |
| 右键菜单 | ✅ | ❌ |
| 全局快捷键 | ✅ | ❌ |

> 💡 **提示**: 如果需要跨页面操作功能（快速保存选中文本、插入片段等），请使用 Chrome 插件版本（`main` 分支）

## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

## 📄 许可证

MIT License

## 🙏 致谢

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [Prism.js](https://prismjs.com/) - 语法高亮
- [Lucide](https://lucide.dev/) - 图标库
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Supabase](https://supabase.com/) - 后端服务

---

Made with ❤️ for developers who love to organize their code snippets.
