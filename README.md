# QA sidePanel - Chrome 扩展

一个现代化的 Chrome 侧边栏扩展，用于保存和管理代码片段、SQL 语句和文本内容。支持云端同步、本地存储、置顶功能等。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 主要功能

- 📝 **多类型支持** - 保存代码片段、SQL 语句和纯文本
- ⚡ **快速插入** - 右键菜单/快捷键快速保存和插入片段
- 🎨 **专业编辑器** - Monaco Editor 集成，提供 IDE 级编辑体验
- 🔍 **智能搜索** - 实时模糊搜索，快速定位内容
- 📌 **置顶功能** - 常用内容置顶，快速访问
- 🏷️ **标签系统** - 多标签支持、智能建议、标签云筛选
- 📂 **类型筛选** - 按类型分类（代码/SQL/文本）
- 🔐 **Email 登录** - 简单的邮箱密码认证
- 👤 **随机头像** - 每个用户自动生成独特头像
- ☁️ **云端同步** - Supabase 后端，数据自动同步
- 💾 **本地模式** - 支持匿名使用，数据保存在本地
- 🎯 **语法高亮** - Prism.js 驱动，支持多种语言
- 📱 **现代化 UI** - TailwindCSS + 响应式设计

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone <your-repo-url>
cd qa_sider

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 Supabase 配置

# 构建扩展
npm run build
```

### 加载到 Chrome

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角的 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择项目的 `dist` 目录
5. 点击扩展图标打开侧边栏

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite + @crxjs/vite-plugin
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
├── src/                      # 源代码
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
│   └── icons/              # 扩展图标
├── docs/                    # 📚 文档
├── manifest.json            # Chrome 扩展配置
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
3. 可以选择多个标签（OR 逻辑，包含任一标签）
4. 点击"清除全部"重置筛选

**标签建议**：
- 基于历史标签自动建议
- 实时过滤匹配的标签
- 避免重复添加
- 精选 3 个最核心标签

### 快速插入功能

**快速保存片段**：
- 在任何网页选中文本
- 右键菜单选择"保存选中文本为片段"
- 或使用快捷键 `Ctrl+Shift+S` (Mac: `Cmd+Shift+S`)
- 自动检测语言类型，添加标签后保存

**快速插入片段**：
- 在任何输入框/编辑器中
- 右键菜单选择"插入片段"
- 或使用快捷键 `Ctrl+Shift+V` (Mac: `Cmd+Shift+V`)
- 搜索并选择片段，按 Enter 插入

**支持的快捷键**：
- `Ctrl+Shift+S` / `Cmd+Shift+S` - 保存选中文本
- `Ctrl+Shift+V` / `Cmd+Shift+V` - 插入片段

详细说明请查看 [快速插入功能文档](QUICK_INSERT_FEATURE.md)


## 🔧 开发

```bash
# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 类型检查
tsc --noEmit
```



## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

## 📄 许可证

MIT License

## 🙏 致谢

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [Prism.js](https://prismjs.com/) - 语法高亮
- [Lucide](https://lucide.dev/) - 图标库
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架

---

Made with ❤️ for developers who love to organize their snippets.
