# Loading 组件说明

## 📋 功能概述

为应用启动时添加了优雅的加载动画，提升用户体验，让用户知道应用正在初始化。

---

## ✨ 组件特性

### 1. **视觉效果**
- ✅ 旋转的加载图标（Loader2）
- ✅ 发光效果（模糊阴影）
- ✅ 三个跳动的小圆点
- ✅ 清晰的加载文字说明

### 2. **动画效果**
- ✅ `animate-spin`：图标持续旋转
- ✅ `animate-bounce`：圆点跳动动画
- ✅ 错开的动画延迟（0ms, 150ms, 300ms）

### 3. **暗黑模式支持**
- ✅ 完整支持 light/dark 模式
- ✅ 颜色自动适配

---

## 🎨 视觉设计

### 布局结构
```
┌─────────────────────────────┐
│                             │
│          [旋转图标]          │
│         (带发光效果)          │
│                             │
│        QA Sider             │
│      正在初始化应用...        │
│                             │
│        ● ● ●                │
│      (跳动的点)              │
│                             │
└─────────────────────────────┘
```

### 颜色方案
| 元素 | Light 模式 | Dark 模式 |
|------|-----------|----------|
| **背景** | `bg-gray-50` | `bg-gray-950` |
| **图标** | `text-indigo-600` | `text-indigo-400` |
| **主文字** | `text-gray-700` | `text-gray-200` |
| **副文字** | `text-gray-500` | `text-gray-400` |
| **圆点** | `bg-indigo-600` | `bg-indigo-400` |

---

## 🔧 技术实现

### 组件代码

```typescript
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '加载中...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        {/* 旋转的加载图标 + 发光效果 */}
        <div className="relative">
          <Loader2 size={48} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
          <div className="absolute inset-0 blur-xl opacity-50">
            <Loader2 size={48} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
          </div>
        </div>
        
        {/* 加载文字 */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            正在初始化应用...
          </p>
        </div>

        {/* 加载进度点（错开跳动） */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" 
               style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" 
               style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" 
               style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
```

### 使用方式

在 `App.tsx` 中：

```typescript
import Loading from './components/Loading/Loading';

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <Loading message="QA Sider" />;
  }

  // ... 其他代码
}
```

---

## 📊 加载时机

### 触发条件

Loading 组件在以下情况显示：

1. **应用首次启动**
   - 检查用户认证状态
   - 加载本地/云端数据
   - 初始化应用配置

2. **认证状态检查中** (`authLoading === true`)
   - Supabase 验证 session
   - 检查本地存储模式
   - 决定显示登录页还是主界面

### 加载流程

```
用户打开插件
  ↓
显示 Loading 组件
  ↓
useAuth 检查认证状态 (authLoading = true)
  ↓
- 检查 Supabase session
- 检查本地模式设置
- 检查本地数据
  ↓
authLoading = false
  ↓
隐藏 Loading
  ↓
根据状态显示：
- 登录选择页 (AuthPanel)
- 或主应用界面
```

---

## 🎯 动画细节

### 1. 旋转图标 (`animate-spin`)

```css
/* Tailwind 内置动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

- 无限循环旋转
- 线性速度
- 视觉上表示"正在处理"

### 2. 发光效果

```tsx
<div className="absolute inset-0 blur-xl opacity-50">
  {/* 同样的图标，但模糊处理 */}
</div>
```

- 使用 `blur-xl` 创建模糊效果
- `opacity-50` 半透明
- 视觉上增强品牌感

### 3. 跳动圆点 (`animate-bounce`)

```tsx
<div style={{ animationDelay: '0ms' }}></div>
<div style={{ animationDelay: '150ms' }}></div>
<div style={{ animationDelay: '300ms' }}></div>
```

- 三个圆点错开 150ms
- 创建"波浪"跳动效果
- 视觉上表示活跃状态

---

## 💡 自定义选项

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `message` | `string` | `'加载中...'` | 主标题文字 |

### 使用示例

```tsx
// 默认样式
<Loading />

// 自定义消息
<Loading message="正在加载数据..." />

// 在不同场景使用
<Loading message="QA Sider" />
<Loading message="同步中" />
```

---

## 🎨 定制建议

如果需要进一步定制，可以修改：

### 1. 图标大小
```tsx
<Loader2 size={48} /> // 改为 size={64}
```

### 2. 动画速度
```css
/* 在 globals.css 中覆盖 */
.animate-spin {
  animation: spin 1s linear infinite; /* 改为 2s */
}
```

### 3. 颜色主题
```tsx
className="text-indigo-600" // 改为其他颜色
className="bg-indigo-600"   // 圆点颜色
```

### 4. 添加更多信息
```tsx
<p className="text-xs text-gray-400 mt-2">
  首次启动可能需要几秒钟
</p>
```

---

## 🧪 测试场景

### 1. 首次安装
- 打开插件
- 应该看到 Loading 1-2 秒
- 然后显示登录选择页

### 2. 已登录用户
- 打开插件
- 短暂 Loading
- 直接进入主界面

### 3. 本地模式用户
- 打开插件
- 短暂 Loading
- 直接进入主界面（显示本地数据）

### 4. 暗黑模式
- 切换到暗黑模式
- 打开插件
- Loading 颜色应该自动适配

---

## 📱 响应式设计

- ✅ 居中布局，适配所有屏幕尺寸
- ✅ 图标大小固定（48px）
- ✅ 文字清晰可读
- ✅ 动画流畅不卡顿

---

## ⚡ 性能优化

### 1. 轻量级
- 只使用 Tailwind 内置动画
- 无额外依赖
- 渲染性能极佳

### 2. CSS 动画
- 使用 GPU 加速的 CSS 动画
- 不阻塞 JavaScript 主线程
- 流畅 60fps

### 3. 按需显示
- 仅在 `authLoading` 时显示
- 加载完成立即卸载
- 不占用额外内存

---

## 🔄 未来扩展

### 可能的增强功能

1. **进度条**
   ```tsx
   <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
     <div className="h-full bg-indigo-600 animate-pulse"></div>
   </div>
   ```

2. **加载提示语变化**
   ```tsx
   const tips = ['加载用户数据...', '同步云端...', '准备就绪...'];
   // 每隔 1 秒切换提示
   ```

3. **骨架屏**
   - 在 Loading 后渐变到骨架屏
   - 显示即将出现的界面结构

4. **加载失败处理**
   ```tsx
   <Loading 
     message="加载失败" 
     error={true}
     onRetry={() => window.location.reload()}
   />
   ```

---

## 📝 相关文件

### 新增文件
- `src/components/Loading/Loading.tsx` - Loading 组件

### 修改文件
- `src/App.tsx` - 集成 Loading 组件

---

## ✅ 完成清单

- [x] 创建 Loading 组件
- [x] 添加旋转图标动画
- [x] 添加发光效果
- [x] 添加跳动圆点
- [x] 集成到 App.tsx
- [x] 暗黑模式适配
- [x] 通过 Linter 检查

---

## 📚 相关文档

- [批量操作功能](./BATCH_OPERATIONS.md)
- [Dialog 组件优化](../src/components/Dialog/Dialog.tsx)
- [数据保存修复](./DATA_SAVE_FIX.md)
