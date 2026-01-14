# 文档整理说明

## 整理时间
2026-01-14

## 整理内容

已将项目中所有的 `.md` 文档文件整理到 `docs/` 目录，并按功能分类。

## 目录结构

```
docs/
├── README.md                    # 📚 文档索引（主入口）
├── PROJECT_SUMMARY.md           # 项目总结
│
├── features/                    # ✨ 功能实现与说明
│   ├── EMAIL_AUTH_IMPLEMENTATION.md
│   ├── EMAIL_CONFIRMATION_DISABLE.md
│   ├── PIN_FEATURE_IMPLEMENTATION.md
│   ├── PIN_BUG_FIX.md
│   ├── ICON_SETUP.md
│   ├── DIALOG_COMPONENT.md
│   ├── EDITOR_FIX.md
│   ├── PERFORMANCE_OPTIMIZATION.md
│   └── USAGE_MODES.md
│
├── setup/                       # ⚙️ 配置与安装
│   ├── QUICKSTART.md
│   ├── INSTALL.md
│   ├── SETUP_INSTRUCTIONS.md
│   ├── SUPABASE_SETUP.md
│   ├── SUPABASE_CONFIG_INFO.md
│   ├── GOOGLE_OAUTH_SETUP.md
│   ├── OAUTH_CONFIG.md
│   └── supabase_add_isPinned.sql
│
├── debugging/                   # 🐛 调试与测试
│   ├── HOW_TO_DEBUG.md
│   ├── DEBUG_FILTER.md
│   ├── DEBUG_LOGIN.md
│   ├── TESTING_GUIDE.md
│   ├── TESTING_CHECKLIST.md
│   ├── TESTING_OAUTH.md
│   └── QUICK_TEST.md
│
├── deployment/                  # 🚀 部署相关
│   ├── DEPLOYMENT.md
│   └── MIGRATION_TO_SUPABASE.md
│
└── troubleshooting/            # 🔧 故障排查
    ├── OAUTH_TROUBLESHOOTING.md
    ├── CUSTOMIZE_OAUTH_SCREEN.md
    ├── GOOGLE_LOGIN_IMPLEMENTATION.md
    └── LOGIN_LOGIC.md
```

## 分类说明

### 📁 features/ - 功能实现
包含各项功能的详细实现说明、使用指南和 bug 修复记录。

**文件列表：**
- Email 认证功能及配置
- 置顶功能实现和修复
- 图标配置
- 对话框组件
- 编辑器修复
- 性能优化
- 使用模式说明

### 📁 setup/ - 配置安装
包含项目初始化、环境配置、数据库设置等文档。

**文件列表：**
- 快速开始指南
- 详细安装步骤
- Supabase 配置
- OAuth 配置
- 数据库迁移脚本

### 📁 debugging/ - 调试测试
包含调试技巧、测试方法、测试清单等。

**文件列表：**
- 调试指南
- 功能调试（过滤器、登录）
- 测试指南和清单
- OAuth 测试

### 📁 deployment/ - 部署
包含生产环境部署和数据迁移相关文档。

**文件列表：**
- 部署指南
- 数据迁移说明

### 📁 troubleshooting/ - 故障排查
包含常见问题、错误处理、故障排查方法。

**文件列表：**
- OAuth 问题排查
- 自定义 OAuth 界面
- Google 登录实现
- 登录逻辑说明

## 根目录保留文件

```
qa_sider/
├── README.md          # ✅ 项目主 README（GitHub 首页）
├── docs/              # ✅ 所有文档目录
└── ...                # 其他项目文件
```

## 文档访问方式

### 1. 从根目录 README 开始
根目录的 `README.md` 提供了项目概览和快速链接。

### 2. 查看文档索引
`docs/README.md` 是完整的文档索引，按分类列出所有文档。

### 3. 按需查找
根据需求在相应的子目录中查找文档：
- 想配置？→ `docs/setup/`
- 想了解功能？→ `docs/features/`
- 遇到问题？→ `docs/troubleshooting/`
- 要部署？→ `docs/deployment/`
- 要调试？→ `docs/debugging/`

## 文档链接更新

所有文档中的内部链接已更新为相对路径，确保在任何环境下都能正常访问。

## 迁移统计

- **总文档数**: 31 个 .md 文件
- **分类数**: 5 个主要分类
- **根目录保留**: 1 个 README.md
- **新增**: 1 个 docs/README.md 索引

## 后续维护建议

### 添加新文档时
1. 确定文档类型（功能/配置/调试/部署/排查）
2. 放到对应的 `docs/` 子目录
3. 更新 `docs/README.md` 索引
4. 如需要，在根目录 `README.md` 添加链接

### 文档命名规范
- 使用大写字母和下划线（如 `EMAIL_AUTH_IMPLEMENTATION.md`）
- 名称要清晰表达文档内容
- 避免使用缩写（除非广为人知）

### 保持文档更新
- 功能变更时同步更新相关文档
- 定期检查文档链接是否有效
- 删除过时或废弃的文档

## 已废弃的文档

以下文档涉及已废弃的功能，但保留以供参考：
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth 配置（已改用 Email 登录）
- `GOOGLE_LOGIN_IMPLEMENTATION.md` - Google 登录实现

## 总结

✅ 所有文档已整理完毕
✅ 目录结构清晰合理
✅ 文档索引完善
✅ 根目录保持简洁

现在查找文档更加方便，维护也更容易！🎉
