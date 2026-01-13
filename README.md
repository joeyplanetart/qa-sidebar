# 内容管理器 - Chrome Extension

一个基于 Chrome Side Panel 的内容管理器，用于保存和管理代码片段、SQL 语句和文本内容。

## 功能特性

- ✨ 支持保存代码片段、SQL 语句和纯文本
- 🎨 Monaco Editor 集成，提供专业的代码编辑体验
- 🔍 实时模糊搜索功能
- 🏷️ 类型分类筛选（全部/代码/SQL/文本）
- 🔐 Google 账号登录，数据云端同步
- 💾 支持匿名模式（本地存储）
- 🎯 语法高亮显示
- 📱 美观的现代化 UI

## 技术栈

- **前端**: React 18 + TypeScript + TailwindCSS
- **构建工具**: Vite + @crxjs/vite-plugin
- **编辑器**: Monaco Editor
- **语法高亮**: Prism.js
- **后端服务**: Supabase (Auth + PostgreSQL)
- **状态管理**: Zustand
- **图标**: Lucide React

## 开发环境设置

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置 Firebase

1. 在 [Firebase Console](https://console.firebase.google.com/) 创建新项目
2. 启用 Google Authentication
3. 创建 Firestore 数据库
4. 复制 Firebase 配置信息
5. 创建 `.env` 文件（参考 `.env.example`）：

\`\`\`env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
\`\`\`

### 3. 配置 Supabase 安全策略

在 Supabase SQL Editor 中执行：

\`\`\`sql
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
\`\`\`

### 4. 开发模式运行

\`\`\`bash
npm run dev
\`\`\`

### 5. 加载到 Chrome

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `dist` 目录

### 6. 构建生产版本

\`\`\`bash
npm run build
\`\`\`

## 项目结构

\`\`\`
qa_sider/
├── manifest.json              # Chrome Extension 配置
├── src/
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   ├── index.css             # 全局样式
│   ├── background/           # Background Service Worker
│   │   └── service-worker.ts
│   ├── components/           # React 组件
│   │   ├── Header/          # 头部组件
│   │   ├── SearchBar/       # 搜索栏
│   │   ├── FilterTabs/      # 分类筛选
│   │   ├── ContentList/     # 内容列表
│   │   ├── Editor/          # 编辑器对话框
│   │   └── Auth/            # 登录组件
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useAuth.ts       # 认证状态管理
│   │   └── useContents.ts   # 内容数据管理
│   ├── services/            # 服务层
│   │   ├── firebase.ts      # Firebase 服务
│   │   └── storage.ts       # Chrome Storage API
│   └── types/               # TypeScript 类型定义
│       └── index.ts
├── public/                   # 静态资源
└── vite.config.ts           # Vite 配置
\`\`\`

## 使用说明

### 登录

1. 首次使用时，点击"使用 Google 账号登录"
2. 登录后可以在所有设备间同步内容

### 创建内容

1. 点击右上角的"新建"按钮
2. 输入标题
3. 选择类型（代码/SQL/文本）
4. 选择编程语言（代码和 SQL 类型）
5. 在编辑器中输入内容
6. 点击"保存"

### 搜索和筛选

- 使用搜索框进行实时模糊搜索
- 点击分类标签（全部/代码/SQL/文本）进行筛选

### 编辑和删除

- 点击内容卡片上的编辑图标进行编辑
- 点击删除图标删除内容（需确认）

## 注意事项

1. **Firebase 配置**: 确保正确配置 Firebase 环境变量
2. **Chrome 版本**: 需要 Chrome 114+ 版本（支持 Side Panel API）
3. **权限**: 插件需要 `sidePanel`、`storage`、`activeTab` 权限
4. **数据安全**: Firestore 安全规则确保用户只能访问自己的数据

## 开发计划

- [ ] 添加标签功能
- [ ] 支持内容导出
- [ ] 支持批量操作
- [ ] 添加内容分享功能
- [ ] 优化移动端体验
- [ ] 添加快捷键支持

## License

MIT
