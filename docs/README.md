# 📚 文档目录

欢迎来到 QA sidePanel 的文档中心！这里包含了所有关于安装、配置、使用和调试的详细文档。

## 📖 目录结构

```
docs/
├── features/           # 功能实现与说明
├── setup/              # 配置与安装
├── debugging/          # 调试与测试
├── deployment/         # 部署相关
└── troubleshooting/    # 故障排查
```

---

## 🚀 快速开始

如果你是第一次使用，建议按以下顺序阅读：

1. **[快速开始](./setup/QUICKSTART.md)** - 5 分钟快速上手
2. **[安装指南](./setup/INSTALL.md)** - 详细安装步骤
3. **[Supabase 配置](./setup/SUPABASE_SETUP.md)** - 配置后端服务
4. **[使用模式](./features/USAGE_MODES.md)** - 了解登录模式和本地模式

---

## 📁 分类文档

### ⚙️ 配置与安装 (`setup/`)

基础配置和环境搭建相关文档。

- **[快速开始](./setup/QUICKSTART.md)** - 快速上手指南
- **[安装指南](./setup/INSTALL.md)** - 详细安装步骤
- **[Supabase 配置](./setup/SUPABASE_SETUP.md)** - 配置 Supabase 后端
- **[Supabase 配置信息](./setup/SUPABASE_CONFIG_INFO.md)** - Supabase 详细配置
- **[Google OAuth 配置](./setup/GOOGLE_OAUTH_SETUP.md)** - Google 登录配置（已废弃）
- **[OAuth 配置](./setup/OAUTH_CONFIG.md)** - OAuth 相关配置
- **[安装说明](./setup/SETUP_INSTRUCTIONS.md)** - 设置说明
- **[数据库迁移脚本](./setup/supabase_add_isPinned.sql)** - 添加置顶功能的 SQL

### ✨ 功能说明 (`features/`)

各项功能的详细实现和使用说明。

- **[Email 认证实现](./features/EMAIL_AUTH_IMPLEMENTATION.md)** - Email 注册/登录功能
- **[禁用邮箱确认](./features/EMAIL_CONFIRMATION_DISABLE.md)** - 如何禁用邮箱确认
- **[置顶功能](./features/PIN_FEATURE_IMPLEMENTATION.md)** - 内容置顶功能说明
- **[置顶功能 Bug 修复](./features/PIN_BUG_FIX.md)** - 置顶功能的问题修复
- **[图标配置](./features/ICON_SETUP.md)** - 如何配置扩展图标
- **[对话框组件](./features/DIALOG_COMPONENT.md)** - Dialog 组件实现
- **[编辑器修复](./features/EDITOR_FIX.md)** - 编辑器相关修复
- **[性能优化](./features/PERFORMANCE_OPTIMIZATION.md)** - 性能优化说明
- **[使用模式](./features/USAGE_MODES.md)** - 登录模式 vs 本地模式

### 🐛 调试与测试 (`debugging/`)

调试工具和测试指南。

- **[调试指南](./debugging/HOW_TO_DEBUG.md)** - 如何调试扩展
- **[调试过滤器](./debugging/DEBUG_FILTER.md)** - 过滤功能调试
- **[调试登录](./debugging/DEBUG_LOGIN.md)** - 登录功能调试
- **[测试指南](./debugging/TESTING_GUIDE.md)** - 完整测试指南
- **[测试清单](./debugging/TESTING_CHECKLIST.md)** - 测试检查清单
- **[OAuth 测试](./debugging/TESTING_OAUTH.md)** - OAuth 功能测试
- **[快速测试](./debugging/QUICK_TEST.md)** - 快速测试方法

### 🚀 部署相关 (`deployment/`)

生产环境部署和数据迁移。

- **[部署指南](./deployment/DEPLOYMENT.md)** - 如何部署到生产环境
- **[迁移到 Supabase](./deployment/MIGRATION_TO_SUPABASE.md)** - 从其他服务迁移到 Supabase

### 🔧 故障排查 (`troubleshooting/`)

常见问题和解决方案。

- **[OAuth 故障排查](./troubleshooting/OAUTH_TROUBLESHOOTING.md)** - OAuth 相关问题
- **[自定义 OAuth 界面](./troubleshooting/CUSTOMIZE_OAUTH_SCREEN.md)** - 自定义 OAuth 同意屏幕
- **[Google 登录实现](./troubleshooting/GOOGLE_LOGIN_IMPLEMENTATION.md)** - Google 登录详解
- **[登录逻辑](./troubleshooting/LOGIN_LOGIC.md)** - 登录流程说明

---

## 🎯 按场景查找

### 我想开始使用

1. [快速开始](./setup/QUICKSTART.md)
2. [安装指南](./setup/INSTALL.md)
3. [使用模式](./features/USAGE_MODES.md)

### 我想配置 Supabase

1. [Supabase 配置](./setup/SUPABASE_SETUP.md)
2. [Supabase 配置信息](./setup/SUPABASE_CONFIG_INFO.md)
3. [数据库迁移](./setup/supabase_add_isPinned.sql)

### 我想使用 Email 登录

1. [Email 认证实现](./features/EMAIL_AUTH_IMPLEMENTATION.md)
2. [禁用邮箱确认](./features/EMAIL_CONFIRMATION_DISABLE.md)

### 我想添加置顶功能

1. [置顶功能说明](./features/PIN_FEATURE_IMPLEMENTATION.md)
2. [置顶 Bug 修复](./features/PIN_BUG_FIX.md)
3. [数据库迁移脚本](./setup/supabase_add_isPinned.sql)

### 我遇到了问题

1. [调试指南](./debugging/HOW_TO_DEBUG.md)
2. [故障排查目录](./troubleshooting/)
3. [测试指南](./debugging/TESTING_GUIDE.md)

### 我想部署到生产环境

1. [部署指南](./deployment/DEPLOYMENT.md)
2. [数据迁移](./deployment/MIGRATION_TO_SUPABASE.md)

---

## 📝 文档贡献

发现文档有误或需要补充？欢迎提交 PR 或 Issue！

### 文档规范

- 使用 Markdown 格式
- 包含清晰的标题和目录
- 提供代码示例
- 添加截图说明（如需要）
- 保持简洁明了

---

## 🔗 相关链接

- [项目主页](../)
- [GitHub Issues](https://github.com/your-repo/issues)
- [Supabase 文档](https://supabase.com/docs)
- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)

---

最后更新：2026-01-14
