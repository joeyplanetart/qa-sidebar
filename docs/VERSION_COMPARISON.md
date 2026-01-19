# Web 版本 vs Chrome 插件版本对比

本文档对比了 QA Sider 的 Web 版本（`web_version` 分支）和 Chrome 插件版本（`main` 分支）的区别。

## 📊 功能对比

| 功能 | Chrome 插件版 | Web 版本 | 说明 |
|------|-------------|---------|------|
| ✅ 代码片段管理 | ✅ | ✅ | 完全相同 |
| ✅ SQL 语句管理 | ✅ | ✅ | 完全相同 |
| ✅ 文本内容管理 | ✅ | ✅ | 完全相同 |
| ✅ Monaco 编辑器 | ✅ | ✅ | 完全相同 |
| ✅ 语法高亮 | ✅ | ✅ | 完全相同 |
| ✅ 标签系统 | ✅ | ✅ | 完全相同 |
| ✅ 类型筛选 | ✅ | ✅ | 完全相同 |
| ✅ 搜索功能 | ✅ | ✅ | 完全相同 |
| ✅ 置顶功能 | ✅ | ✅ | 完全相同 |
| ✅ 批量操作 | ✅ | ✅ | 完全相同 |
| ✅ 变量替换 | ✅ | ✅ | 完全相同 |
| ✅ 主题切换 | ✅ | ✅ | 完全相同 |
| ✅ 本地存储 | ✅ | ✅ | 插件用 chrome.storage，Web 用 localStorage |
| ✅ 云端同步 | ✅ | ✅ | 都使用 Supabase |
| ✅ Email 登录 | ✅ | ✅ | 完全相同 |
| ⚠️ OAuth 登录 | Google/GitHub/Slack | ❌ | Web 版移除了第三方 OAuth |
| ❌ 快速保存选中文本 | ✅ | ❌ | 需要 content script |
| ❌ 快速插入片段 | ✅ | ❌ | 需要 content script |
| ❌ 右键菜单 | ✅ | ❌ | 浏览器 API 限制 |
| ❌ 全局快捷键 | ✅ | ❌ | 浏览器 API 限制 |
| ❌ 侧边栏模式 | ✅ | ❌ | Chrome 插件特有 |

## 🏗️ 技术架构对比

### Chrome 插件版

```
qa_sider/
├── manifest.json          # 插件配置
├── src/
│   ├── background/        # Service Worker
│   │   └── service-worker.ts
│   ├── content/          # Content Script
│   │   └── content.ts
│   ├── services/
│   │   ├── chromeAuth.ts  # Chrome Identity API
│   │   └── storage.ts     # chrome.storage.local
│   └── ...
└── vite.config.ts        # 使用 @crxjs/vite-plugin
```

### Web 版本

```
qa_sider/
├── vercel.json           # Vercel 配置
├── src/
│   ├── services/
│   │   └── storage.ts    # localStorage
│   └── ...
└── vite.config.ts       # 标准 Vite 配置
```

## 📦 依赖差异

### 移除的依赖

- `@crxjs/vite-plugin` - Chrome 插件构建工具
- `@types/chrome` - Chrome API 类型定义

### 保留的核心依赖

所有业务逻辑相关的依赖都保留：
- React 18
- TypeScript
- TailwindCSS
- Monaco Editor
- Supabase
- Zustand
- Prism.js
- Lucide React
- React Virtuoso

## 🔧 代码改动详情

### 1. 构建配置

**Chrome 插件版 (`vite.config.ts`):**
```typescript
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as any }),
  ],
})
```

**Web 版本 (`vite.config.ts`):**
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'editor': ['@monaco-editor/react'],
          'ui-vendor': ['lucide-react', 'react-virtuoso'],
        },
      },
    },
  },
})
```

### 2. 存储服务

**Chrome 插件版 (`storage.ts`):**
```typescript
export const saveToLocalStorage = async (contents: ContentItem[]) => {
  await chrome.storage.local.set({ [STORAGE_KEY]: contents });
};
```

**Web 版本 (`storage.ts`):**
```typescript
export const saveToLocalStorage = async (contents: ContentItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
};
```

### 3. 认证服务

**Chrome 插件版:**
- 支持 Chrome Identity API 的 OAuth 流程
- Google/GitHub/Slack 登录
- Email/Password 登录

**Web 版本:**
- 仅支持 Email/Password 登录
- 移除了 `chromeAuth.ts`
- 简化了 `AuthPanel.tsx`

### 4. 应用主组件

**移除的功能:**
- Chrome runtime 消息监听
- 快速保存对话框
- 快速插入对话框
- 相关的 handlers

**保留的功能:**
- 所有核心 CRUD 操作
- 标签管理
- 搜索和筛选
- 编辑器
- 统计面板

## 🚀 部署方式对比

### Chrome 插件版

1. 构建: `npm run build`
2. 打包: 生成 `dist` 目录
3. 发布:
   - Chrome Web Store 提交
   - 或本地加载（开发）

### Web 版本

1. 构建: `npm run build`
2. 部署:
   - Vercel (推荐)
   - Netlify
   - GitHub Pages
   - 任何静态托管服务

**优势:**
- 自动部署
- CDN 加速
- HTTPS 自动配置
- 无需审核流程

## 🎯 使用场景建议

### 选择 Chrome 插件版

适合以下场景：
- ✅ 需要在任意网页快速保存选中的代码
- ✅ 需要快速插入代码片段到其他网站
- ✅ 需要使用右键菜单和快捷键
- ✅ 主要在浏览器中工作

### 选择 Web 版本

适合以下场景：
- ✅ 作为独立的代码片段管理工具
- ✅ 团队共享和协作
- ✅ 跨设备访问（手机、平板等）
- ✅ 不想安装浏览器插件
- ✅ 需要自定义域名和品牌

## 🔄 在两个版本间切换

### 从插件版切换到 Web 版

```bash
git checkout web_version
npm install
npm run dev
```

### 从 Web 版切换回插件版

```bash
git checkout main
npm install
npm run dev
```

## 💡 维护策略

### 推荐方式

1. **核心功能**: 在两个分支同步维护
2. **特有功能**: 分别维护
   - `main` 分支: Chrome 插件特有功能
   - `web_version` 分支: Web 特有优化

### 共享组件

以下组件可以在两个版本间共享：
- 所有 UI 组件 (`src/components/`)
- 所有 Hooks (`src/hooks/`)
- Supabase 服务 (`src/services/supabase.ts`)
- 工具函数 (`src/utils/`)
- 类型定义 (`src/types/`)

## 📈 性能对比

### 构建产物大小

**Chrome 插件版:**
- 总大小: ~550KB (gzipped)
- 包含 manifest 和 background worker

**Web 版本:**
- 总大小: ~520KB (gzipped)
- 代码分割优化
- 更好的缓存策略

### 加载性能

**Chrome 插件版:**
- 侧边栏模式，即开即用
- 受浏览器性能影响

**Web 版本:**
- CDN 加速
- 首屏加载优化
- Service Worker 缓存（可选）

## 🔍 总结

| 方面 | Chrome 插件版 | Web 版本 |
|------|-------------|---------|
| **核心功能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **跨页面集成** | ⭐⭐⭐⭐⭐ | ❌ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **可访问性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **部署难度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **维护成本** | ⭐⭐⭐ | ⭐⭐⭐⭐ |

**推荐:**
- 个人使用 → Chrome 插件版
- 团队使用 → Web 版本
- 混合使用 → 两者都部署

---

最后更新: 2026-01-19
