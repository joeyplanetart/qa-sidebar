# 快速插入功能文档

## 🚀 功能概述

快速插入功能大幅提升工作流效率，让你可以：
- ⚡ 通过右键菜单快速保存选中文本为片段
- 🎯 通过快捷键或右键菜单快速插入片段到网页
- 💾 智能语言检测和分类
- 🏷️ 支持标签管理

## ✨ 主要功能

### 1. 快速保存选中文本

**使用方式**：
- **右键菜单**：选中文本 → 右键 → "保存选中文本为片段"
- **快捷键**：选中文本 → `Alt+Shift+S` (Mac: `Cmd+Shift+D`)

**功能特点**：
- ✅ 自动检测语言类型（JavaScript、Python、SQL等）
- ✅ 智能填充标题建议
- ✅ 支持添加 3 个标签
- ✅ 实时预览内容
- ✅ 字符计数显示

### 2. 快速插入片段到网页

**使用方式**：
- **右键菜单**：在输入框右键 → "插入片段"
- **快捷键**：`Ctrl+Shift+V` (Mac: `Cmd+Shift+V`)

**功能特点**：
- ✅ 实时搜索过滤片段
- ✅ 左右分栏：列表+预览
- ✅ 支持按标题、内容、标签搜索
- ✅ 键盘操作（Enter 插入、Esc 取消）
- ✅ 智能插入到各种输入元素

### 3. 智能文本插入

**支持的元素类型**：
- `<input>` - 标准输入框
- `<textarea>` - 多行文本框
- `contenteditable` - 富文本编辑器
- 任何可编辑区域

**插入特性**：
- ✅ 保持光标位置
- ✅ 触发框架事件（兼容 React 等）
- ✅ 保持文本格式和换行
- ✅ 页面通知反馈

## 🎯 使用场景

### 场景 1：保存网页代码片段

1. 在 GitHub/StackOverflow 等网站看到有用的代码
2. 选中代码
3. 右键 → "保存选中文本为片段" 或按 `Alt+Shift+S`
4. 输入标题，添加标签（如"Python", "API", "常用"）
5. 点击保存

### 场景 2：快速插入常用代码

1. 在 IDE 或编辑器中需要插入代码
2. 按 `Ctrl+Shift+V` 打开片段选择器
3. 搜索或浏览片段列表
4. 点击或按 Enter 插入

### 场景 3：复用 SQL 查询

1. 在数据库管理工具中
2. 按 `Ctrl+Shift+V`
3. 搜索 "SQL" 或相关标签
4. 选择查询语句并插入

## 📋 快捷键列表

| 快捷键 | Mac 快捷键 | 功能 |
|--------|-----------|------|
| `Alt+Shift+S` | `Cmd+Shift+D` | 保存选中文本为片段 |
| `Ctrl+Shift+V` | `Cmd+Shift+V` | 插入片段到页面 |
| `Enter` | `Enter` | 在选择器中插入选中的片段 |
| `Esc` | `Esc` | 关闭对话框 |

> **注意**：原来的 `Ctrl+Shift+S` 与 Chrome 保存页面快捷键冲突，已改为 `Alt+Shift+S`

## 🎨 UI 组件

### QuickSaveDialog - 快速保存对话框

**特性**：
- 自动检测语言类型
- 支持 9 种语言（JavaScript, TypeScript, Python, Java, SQL, HTML, CSS, JSON, 纯文本）
- 标签输入组件集成
- 实时内容预览和编辑
- 字符计数

**语言检测规则**：
```typescript
SQL:        以 SELECT, INSERT, UPDATE, DELETE, CREATE 等开头
JavaScript: 以 function, const, let, var, class 等开头
Python:     以 def, import, from, class 等开头
HTML:       以 <!DOCTYPE, <html, <div 等开头
JSON:       以 { 或 [ 开头
```

### QuickInsertDialog - 快速插入对话框

**特性**：
- 左右分栏布局
- 实时搜索过滤
- 标签高亮显示
- 内容预览
- 片段计数显示

**UI 布局**：
```
┌───────────────────────────────────┐
│  选择要插入的片段       [×]        │
├───────────────────────────────────┤
│  🔍 搜索标题、内容或标签...        │
├──────────────┬────────────────────┤
│ 列表 (50%)   │ 预览 (50%)         │
│              │                    │
│ [片段1]      │ 标题               │
│  片段2       │ 标签: ...          │
│  片段3       │ ┌───────────────┐ │
│  片段4       │ │ 代码预览      │ │
│  ...         │ │               │ │
│              │ └───────────────┘ │
├──────────────┴────────────────────┤
│ 23 个片段 · 按 Enter 插入          │
│               [取消] [插入到页面]  │
└───────────────────────────────────┘
```

## 🔧 技术实现

### 架构概览

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   网页      │ ←──→ │  Content     │ ←──→ │  Background │
│  (DOM)      │      │  Script      │      │  Service    │
└─────────────┘      └──────────────┘      └─────────────┘
                            ↑                      ↑
                            │                      │
                            └──────────────────────┘
                                     ↑
                            ┌────────┴────────┐
                            │   Side Panel    │
                            │   (React App)   │
                            └─────────────────┘
```

### 文件结构

```
src/
├── content/
│   └── content.ts              ✅ 内容脚本（与网页交互）
├── background/
│   └── service-worker.ts       ✅ 后台服务（消息中心）
├── components/
│   ├── QuickSave/
│   │   └── QuickSaveDialog.tsx ✅ 快速保存对话框
│   └── QuickInsert/
│       └── QuickInsertDialog.tsx ✅ 快速插入对话框
└── App.tsx                     ✅ 主应用（集成逻辑）
```

### 消息流

**1. 保存选中文本**：
```
用户选中文本并右键
    ↓
Background 创建右键菜单
    ↓
点击"保存选中文本为片段"
    ↓
Background 打开 Side Panel
    ↓
发送 QUICK_SAVE 消息
    ↓
App.tsx 显示 QuickSaveDialog
    ↓
用户填写信息并保存
    ↓
保存到 Supabase/本地存储
```

**2. 插入片段**：
```
用户在输入框按 Ctrl+Shift+V
    ↓
Background 接收命令
    ↓
打开 Side Panel
    ↓
发送 SHOW_INSERT_MODE 消息
    ↓
App.tsx 显示 QuickInsertDialog
    ↓
用户选择片段并点击插入
    ↓
Background 转发 insertToPage 消息
    ↓
Content Script 接收并插入到 DOM
    ↓
显示成功通知
```

### 关键 API

**Chrome Extension API**：
- `chrome.contextMenus` - 右键菜单
- `chrome.commands` - 快捷键
- `chrome.runtime.sendMessage` - 消息传递
- `chrome.tabs.sendMessage` - 向 content script 发消息
- `chrome.sidePanel.open` - 打开侧边栏

**DOM API**：
- `window.getSelection()` - 获取选中文本
- `document.activeElement` - 获取焦点元素
- `HTMLInputElement.setSelectionRange()` - 设置光标
- `Range.insertNode()` - 插入节点
- `dispatchEvent()` - 触发事件

## 🎨 页面通知

插入成功或失败时，会在网页右上角显示通知：

**样式**：
- 成功：绿色背景
- 警告：橙色背景
- 错误：红色背景
- 动画：从右侧滑入，3秒后滑出

## 🔐 权限说明

**manifest.json 新增权限**：
```json
{
  "permissions": [
    "contextMenus",  // 右键菜单
    "scripting",     // 脚本注入
    "tabs"           // 标签页访问
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/content.ts"]
    }
  ],
  "commands": {
    "insert-snippet": {
      "suggested_key": {
        "default": "Ctrl+Shift+V",
        "mac": "Command+Shift+V"
      }
    },
    "save-selection": {
      "suggested_key": {
        "default": "Ctrl+Shift+S",
        "mac": "Command+Shift+S"
      }
    }
  }
}
```

## 💡 最佳实践

### 1. 标签使用建议

为保存的片段添加合适的标签：
- **语言标签**：Python, JavaScript, SQL
- **用途标签**：API, 配置, 工具
- **频率标签**：常用, 参考

### 2. 片段命名规范

- ✅ 使用清晰描述性的标题
- ✅ 包含关键功能词
- ❌ 避免过于简单（如"代码1"）

例如：
- ✅ "FastAPI 用户认证中间件"
- ✅ "MySQL 查询未支付订单"
- ❌ "代码片段"

### 3. 快捷键技巧

1. **快速保存工作流**：
   - 浏览代码 → 选中 → `Alt+Shift+S` → 输入标题 → Enter → 完成
   
2. **快速插入工作流**：
   - 光标定位 → `Ctrl+Shift+V` → 搜索/选择 → Enter → 完成

## 🐛 故障排查

### 问题 1：快捷键不工作

**原因**：
- `Ctrl+Shift+S` 与 Chrome 保存页面快捷键冲突
- 已更改为 `Alt+Shift+S`（Windows/Linux）和 `Cmd+Shift+D`（Mac）

**解决方案**：
1. 更新到最新版本（使用新的快捷键）
2. 或自定义快捷键：访问 `chrome://extensions/shortcuts`
3. 找到 "QA sidePanel" - "保存选中文本为片段"
4. 点击编辑图标，设置你喜欢的快捷键组合
5. 建议使用 `Alt` 或 `Ctrl+Alt` 组合避免冲突

### 问题 2：无法插入到输入框

**可能原因**：
- 输入框不在焦点
- 输入框被禁用
- 页面使用了特殊的输入组件

**解决方案**：
1. 先点击输入框获得焦点
2. 尝试右键菜单方式
3. 手动复制粘贴

### 问题 3：右键菜单不显示

**解决方案**：
1. 重新加载扩展
2. 检查是否在允许的页面（某些内置页面如 chrome:// 不支持）
3. 刷新网页

## 🔮 未来改进

可能的增强功能：
1. **模板变量** - 支持在片段中使用变量（如 ${DATE}, ${USER}）
2. **片段文件夹** - 组织大量片段
3. **自动插入格式化** - 根据目标语言自动格式化
4. **协作共享** - 团队间共享片段库
5. **快捷短语** - 输入触发词自动展开（如 ::api → API 模板）
6. **片段统计** - 追踪最常用的片段
7. **批量操作** - 批量导入/导出片段

## 🎉 总结

快速插入功能让代码片段管理更加高效：

✅ **快速保存** - 右键或快捷键即可保存
✅ **快速插入** - 随时随地插入到任何网页
✅ **智能检测** - 自动识别语言类型
✅ **无缝集成** - 与现有工作流完美配合
✅ **跨平台支持** - Windows、Mac、Linux 通用

现在你的工作效率将大幅提升！🚀
