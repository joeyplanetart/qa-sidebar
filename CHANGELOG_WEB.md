# Web 版本更新日志

## [1.0.0] - 2026-01-19

### 🎉 首个 Web 版本发布

基于 Chrome 插件版本改造而来，移除了浏览器插件特定功能，成为独立的 Web 应用。

### ✨ 新增

- Vercel 部署配置 (`vercel.json`)
- 环境变量示例文件 (`env.example`)
- Vercel 部署指南文档
- 版本对比文档

### 🔄 改动

- 使用 `localStorage` 替代 `chrome.storage.local`
- 简化认证系统，仅保留 Email/Password 登录
- 移除 Chrome Identity API 依赖
- 标准 Vite SPA 构建配置

### ❌ 移除

- Chrome Extension manifest
- Background Service Worker
- Content Script
- Chrome Identity OAuth 认证
- 快速保存/插入功能（依赖 content script）
- 右键菜单集成
- 全局快捷键

### ✅ 保留功能

所有核心业务功能完整保留：
- 代码片段/SQL/文本管理
- Monaco 编辑器集成
- 标签系统和搜索
- 云端同步（Supabase）
- 本地存储模式
- 主题切换
- 批量操作
- 变量替换

### 📦 依赖更新

**移除:**
- `@crxjs/vite-plugin`
- `@types/chrome`

**保留所有核心依赖:**
- React 18, TypeScript, TailwindCSS
- Monaco Editor, Prism.js
- Supabase, Zustand
- 所有 UI 库

### 🚀 部署

现在可以部署到任何静态托管平台：
- Vercel (推荐)
- Netlify
- GitHub Pages
- Cloudflare Pages

详见 `docs/VERCEL_DEPLOYMENT.md`
