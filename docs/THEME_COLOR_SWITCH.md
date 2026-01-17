# 主题色切换功能说明

## 📋 功能概述

新增主题色切换功能，用户可以在**紫色（Indigo）**和**绿色（Lime/Green）**两种主题色之间自由切换。

---

## ✨ 功能特性

### 1. **双主题色支持**
- ✅ **紫色主题**：经典的 Indigo 蓝紫色系（原默认主题）
- ✅ **绿色主题**：与 Logo 一致的 Lime 青绿色系
- ✅ 完整的暗黑模式适配

### 2. **一键切换**
- ✅ Header 中的调色板图标按钮
- ✅ 点击即可切换主题色
- ✅ 右上角彩色圆点指示当前主题

### 3. **持久化存储**
- ✅ 主题色选择自动保存到 localStorage
- ✅ 下次打开应用自动应用上次选择的主题
- ✅ 跨会话保持一致

### 4. **动态 CSS 变量**
- ✅ 使用 CSS 变量实现动态切换
- ✅ 所有组件自动响应主题色变化
- ✅ 无需刷新页面即时生效

---

## 🎨 颜色方案

### 紫色主题（Indigo）

| Light 模式 | Dark 模式 | 用途 |
|-----------|----------|------|
| `indigo-600` (#4F46E5) | `indigo-400` (#A5B4FC) | 主色 |
| `indigo-700` (#4338CA) | `indigo-500` (#6366F1) | Hover |
| `indigo-500` (#6366F1) | `indigo-300` (#A5B4FC) | 轻量 |
| `indigo-800` (#3730A3) | `indigo-600` (#4F46E5) | 深色 |

### 绿色主题（Lime）

| Light 模式 | Dark 模式 | 用途 |
|-----------|----------|------|
| `lime-600` (#84CC16) | `lime-400` (#A3E635) | 主色 |
| `lime-700` (#65A30D) | `lime-500` (#84CC16) | Hover |
| `lime-500` (#A3E635) | `lime-300` (#BEF264) | 轻量 |
| `lime-800` (#4D7C0F) | `lime-600` (#84CC16) | 深色 |

---

## 🔧 技术实现

### 1. CSS 变量系统

在 `src/index.css` 中定义：

```css
/* 紫色主题 */
:root[data-theme="indigo"] {
  --color-primary: 79 70 229; /* indigo-600 */
  --color-primary-hover: 67 56 202; /* indigo-700 */
  --color-primary-light: 99 102 241; /* indigo-500 */
  --color-primary-dark: 55 48 163; /* indigo-800 */
}

/* 绿色主题 */
:root[data-theme="green"] {
  --color-primary: 132 204 22; /* lime-600 */
  --color-primary-hover: 101 163 13; /* lime-700 */
  --color-primary-light: 163 230 53; /* lime-500 */
  --color-primary-dark: 77 124 15; /* lime-800 */
}

/* 暗黑模式 - 紫色 */
.dark[data-theme="indigo"] {
  --color-primary: 129 140 248; /* indigo-400 */
  /* ... */
}

/* 暗黑模式 - 绿色 */
.dark[data-theme="green"] {
  --color-primary: 163 230 53; /* lime-400 */
  /* ... */
}
```

### 2. Tailwind 配置

在 `tailwind.config.js` 中：

```javascript
colors: {
  primary: {
    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
    hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
    light: 'rgb(var(--color-primary-light) / <alpha-value>)',
    dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
  },
}
```

### 3. useThemeColor Hook

`src/hooks/useThemeColor.ts`：

```typescript
export type ThemeColor = 'indigo' | 'green';

export function useThemeColor() {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('qa_sider_theme_color');
    return (saved as ThemeColor) || 'indigo';
  });

  useEffect(() => {
    // 应用主题色到 HTML 根元素
    document.documentElement.setAttribute('data-theme', themeColor);
    localStorage.setItem('qa_sider_theme_color', themeColor);
  }, [themeColor]);

  return {
    themeColor,
    setThemeColor,
    toggleThemeColor,
    isIndigo: themeColor === 'indigo',
    isGreen: themeColor === 'green',
  };
}
```

### 4. ThemeColorToggle 组件

`src/components/ThemeColorToggle/ThemeColorToggle.tsx`：

```tsx
export default function ThemeColorToggle() {
  const { themeColor, toggleThemeColor } = useThemeColor();

  return (
    <button onClick={toggleThemeColor} className="relative p-2 ...">
      <Palette size={20} className="..." />
      
      {/* 颜色指示器 */}
      <span className={`
        absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ...
        ${themeColor === 'indigo' 
          ? 'bg-indigo-600 dark:bg-indigo-400' 
          : 'bg-lime-600 dark:bg-lime-400'}
      `} />
    </button>
  );
}
```

---

## 🎯 使用方式

### 切换主题色

1. 点击 Header 右上角的调色板图标 🎨
2. 主题色立即切换
3. 所有组件颜色自动更新

### 颜色指示器

- **紫色圆点**：当前使用紫色主题
- **绿色圆点**：当前使用绿色主题

---

## 📁 修改的文件

### 新建文件

1. **`src/hooks/useThemeColor.ts`**
   - 主题色状态管理 Hook
   - 持久化存储逻辑

2. **`src/components/ThemeColorToggle/ThemeColorToggle.tsx`**
   - 主题色切换按钮组件
   - 调色板图标 + 颜色指示器

### 修改文件

3. **`src/index.css`**
   - 添加 CSS 变量定义
   - 4 种组合（light/dark × indigo/green）

4. **`tailwind.config.js`**
   - 配置 primary 颜色为 CSS 变量
   - 支持透明度和变体

5. **`src/App.tsx`**
   - 导入并初始化 `useThemeColor()`

6. **`src/components/Header/Header.tsx`**
   - 添加 `ThemeColorToggle` 组件
   - 更新按钮样式使用 `bg-primary`

7. **`src/components/FilterTabs/FilterTabs.tsx`**
   - 更新激活状态样式
   - 批量管理按钮使用动态主题色

8. **`src/components/ContentList/BatchActionsBar.tsx`**
   - 工具栏背景色使用 `bg-primary/10`
   - 按钮文字颜色使用 `text-primary`

9. **`src/components/Loading/Loading.tsx`**
   - 加载图标使用 `text-primary`
   - 进度点使用 `bg-primary`

10. **`src/components/Dialog/Dialog.tsx`**
    - 确认按钮使用 `bg-primary` 和 `hover:bg-primary-hover`

---

## 🎨 视觉效果

### Header 中的切换按钮

```
┌──────────────────────────────────────┐
│ [☀️] [🎨●] [统计] [新建]           │
└──────────────────────────────────────┘
       ↑
   主题色切换
   右上角的圆点表示当前主题
```

### 切换前后对比

#### 紫色主题
- 主按钮：紫色背景
- 激活标签：紫色背景
- 图标：紫色

#### 绿色主题
- 主按钮：绿色背景
- 激活标签：绿色背景
- 图标：绿色

---

## 🔄 工作流程

```
用户点击调色板图标
  ↓
toggleThemeColor()
  ↓
更新 themeColor 状态
  ↓
useEffect 触发
  ↓
设置 document.documentElement.setAttribute('data-theme', ...)
  ↓
CSS 变量自动更新
  ↓
所有使用 bg-primary / text-primary 的组件
自动应用新颜色
  ↓
保存到 localStorage
```

---

## 💡 扩展建议

### 添加更多主题色

在 `useThemeColor.ts` 中：

```typescript
export type ThemeColor = 'indigo' | 'green' | 'blue' | 'rose';
```

在 `index.css` 中添加：

```css
:root[data-theme="blue"] {
  --color-primary: 37 99 235; /* blue-600 */
  /* ... */
}

:root[data-theme="rose"] {
  --color-primary: 225 29 72; /* rose-600 */
  /* ... */
}
```

### 添加主题色选择器

创建一个下拉菜单而不是简单的切换：

```tsx
<select onChange={(e) => setThemeColor(e.target.value)}>
  <option value="indigo">紫色</option>
  <option value="green">绿色</option>
  <option value="blue">蓝色</option>
  <option value="rose">玫红</option>
</select>
```

---

## ✅ 完成清单

- [x] 创建 useThemeColor Hook
- [x] 创建 ThemeColorToggle 组件
- [x] 配置 CSS 变量系统
- [x] 更新 Tailwind 配置
- [x] 集成到 App 和 Header
- [x] 更新关键组件样式
- [x] 暗黑模式适配
- [x] 持久化存储
- [x] 通过 Linter 检查

---

## 📚 相关文档

- [Loading 组件](./LOADING_COMPONENT.md)
- [批量操作功能](./BATCH_OPERATIONS.md)
- [Dialog 优化](../src/components/Dialog/Dialog.tsx)
