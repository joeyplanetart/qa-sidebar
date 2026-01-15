# 深色模式功能文档

## 功能概述

QA SidePanel 现已支持完整的深色/浅色主题切换功能，包括：

- ✅ 深色/浅色主题手动切换
- ✅ 跟随系统主题自动切换
- ✅ 编辑器主题同步切换
- ✅ 主题设置持久化存储

## 使用方法

### 主题切换

在应用的头部区域（Header），您可以找到主题切换按钮组，包含三个选项：

1. **浅色模式** ☀️ - 明亮的浅色主题
2. **深色模式** 🌙 - 护眼的深色主题
3. **跟随系统** 💻 - 自动跟随操作系统的主题设置

点击任意按钮即可切换主题，您的选择会自动保存到本地存储。

### 系统主题跟随

当选择"跟随系统"模式时：

- 应用会自动检测您操作系统的主题设置
- 当系统主题发生变化时，应用主题会实时自动切换
- 无需手动操作，提供最佳的系统集成体验

### 编辑器主题同步

代码编辑器会根据当前主题自动切换颜色方案：

- **浅色模式**：使用明亮的编辑器背景色
- **深色模式**：使用深色的编辑器背景色，保护眼睛
- 语法高亮与主题完美匹配

## 技术实现

### 核心组件

1. **ThemeContext** (`src/contexts/ThemeContext.tsx`)
   - 使用 React Context API 管理全局主题状态
   - 支持 `light`、`dark`、`system` 三种主题模式
   - 自动监听系统主题变化（通过 `prefers-color-scheme` 媒体查询）
   - 将主题设置保存到 localStorage

2. **ThemeToggle** (`src/components/ThemeToggle/ThemeToggle.tsx`)
   - 提供用户友好的主题切换界面
   - 三个按钮对应三种主题模式
   - 当前选中的主题会高亮显示

### Tailwind CSS 配置

项目使用 Tailwind CSS 的 `class` 模式实现深色主题：

```js
// tailwind.config.js
export default {
  darkMode: 'class', // 使用 class 模式
  // ...
}
```

### 样式应用

所有组件都已更新以支持深色模式：

- 使用 `dark:` 前缀定义深色模式下的样式
- 添加 `transition-colors` 实现平滑的颜色过渡
- 确保所有文本、背景、边框在两种模式下都有良好的对比度

### 受影响的组件

以下组件已全面支持深色模式：

- ✅ App.tsx - 主应用容器
- ✅ Header - 顶部导航栏
- ✅ SearchBar - 搜索框
- ✅ FilterTabs - 筛选标签页
- ✅ TagFilter - 标签过滤器
- ✅ TagInput - 标签输入框
- ✅ ContentList - 内容列表
- ✅ EditorModal - 编辑器模态框
- ✅ Dialog - 对话框
- ✅ AuthPanel - 登录面板
- ✅ QuickSaveDialog - 快速保存对话框
- ✅ QuickInsertDialog - 快速插入对话框

### CSS 全局样式

`index.css` 文件中定义了深色模式的全局样式：

- 滚动条样式适配深色主题
- 富文本预览区域的深色样式
- 代码高亮的深色背景

## 主题状态管理

主题状态通过以下方式管理：

1. **初始化**：从 localStorage 读取用户上次选择的主题（默认为 `system`）
2. **切换**：用户点击主题按钮时，更新状态并保存到 localStorage
3. **系统跟随**：监听 `prefers-color-scheme` 媒体查询的变化
4. **应用**：根据解析后的主题（light/dark）在 `<html>` 元素上添加或移除 `dark` 类

## 持久化

主题设置保存在浏览器的 localStorage 中：

```javascript
localStorage.setItem('qa_sider_theme', 'light' | 'dark' | 'system');
```

这确保了用户的主题偏好在刷新页面或重新打开应用后仍然保持。

## 浏览器兼容性

- ✅ Chrome/Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ 其他现代浏览器

系统主题检测依赖 `prefers-color-scheme` 媒体查询，在所有现代浏览器中都得到良好支持。

## 未来改进

可能的功能扩展：

- 🎨 支持自定义主题颜色
- 🌈 提供更多预设主题
- ⏰ 根据时间自动切换主题
- 🔧 更细粒度的主题自定义选项
