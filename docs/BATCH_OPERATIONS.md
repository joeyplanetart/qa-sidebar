# 批量操作功能说明

## 📋 功能概述

新增了片段列表的批量管理功能，允许用户一次性选择多个片段进行批量删除操作。

---

## ✨ 新增功能

### 1. **批量管理模式**

- ✅ 点击"批量管理"按钮进入批量模式
- ✅ 在批量模式下可以选择多个片段
- ✅ 点击"取消"退出批量模式

### 2. **多选功能**

- ✅ 点击片段卡片或选择框进行选择/取消选择
- ✅ 已选择的片段有明显的视觉反馈（边框高亮）
- ✅ 选择框图标：空心圆 → 实心圆（选中）

### 3. **全选/取消全选**

- ✅ 点击"全选"按钮选择所有片段
- ✅ 点击"取消全选"按钮清空所有选择
- ✅ 智能切换按钮文本和图标

### 4. **批量删除**

- ✅ 选择片段后点击"删除"按钮
- ✅ 显示确认对话框（防止误操作）
- ✅ 批量删除后自动退出批量模式
- ✅ 显示删除成功提示

---

## 🎨 UI 组件

### 1. BatchActionsBar（批量操作工具栏）

位置：列表顶部（批量模式下显示）

**组件结构**：

```
┌─────────────────────────────────────────────────┐
│ [全选] 已选择 3 个片段    [删除 (3)] [取消]  │
└─────────────────────────────────────────────────┘
```

**功能**：
- 左侧：全选/取消全选按钮 + 选择计数
- 右侧：批量删除按钮 + 取消按钮

**样式**：
- 背景色：`bg-indigo-50` (浅蓝色)
- 边框：`border-indigo-200`
- 暗黑模式：`dark:bg-indigo-900/30`

### 2. ContentItemRow（片段卡片）

**批量模式下的变化**：

- ✅ 左侧显示选择框图标
- ✅ 隐藏操作按钮（编辑、删除等）
- ✅ 整个卡片可点击
- ✅ 选中状态视觉反馈

**选中状态样式**：
```css
border: border-indigo-500
background: bg-indigo-50 dark:bg-indigo-900/20
shadow: shadow-lg
```

### 3. 批量管理按钮

位置：列表上方（非批量模式下显示）

```jsx
<button>批量管理</button>
```

---

## 🔧 技术实现

### 核心状态管理

```typescript
const [batchMode, setBatchMode] = useState(false);        // 是否在批量模式
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());  // 选中的 ID 集合
```

### 关键函数

#### 1. `handleToggleSelect(id: string)`

切换单个片段的选择状态：

```typescript
const handleToggleSelect = (id: string) => {
  setSelectedIds(prev => {
    const newSet = new Set(prev);
    if (newSet.has(id)) {
      newSet.delete(id);  // 取消选择
    } else {
      newSet.add(id);     // 选择
    }
    return newSet;
  });
};
```

#### 2. `handleSelectAll()`

全选所有片段：

```typescript
const handleSelectAll = () => {
  setSelectedIds(new Set(contents.map(item => item.id)));
};
```

#### 3. `handleDeselectAll()`

取消全选：

```typescript
const handleDeselectAll = () => {
  setSelectedIds(new Set());
};
```

#### 4. `handleBatchDelete()`

批量删除（带确认）：

```typescript
const handleBatchDelete = async () => {
  if (selectedIds.size === 0) return;

  const confirmed = await showAlert(
    `确定要删除选中的 ${selectedIds.size} 个片段吗？\n\n`,
    '确认'
  );

  if (confirmed) {
    await onBatchDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
    setBatchMode(false);
  }
};
```

---

## 📊 数据流

### 批量删除流程

```
用户点击"批量管理"
  ↓
进入批量模式 (batchMode = true)
  ↓
用户点击片段选择
  ↓
更新 selectedIds (Set)
  ↓
用户点击"删除"按钮
  ↓
显示确认对话框
  ↓
用户确认
  ↓
调用 onBatchDelete(ids[])
  ↓
App.tsx 执行批量删除逻辑
  ↓
逐个调用 deleteContent(id)
  ↓
删除成功
  ↓
清空选择 + 退出批量模式
  ↓
显示成功提示
```

---

## 🎯 用户操作流程

### 基本流程

1. **进入批量模式**
   - 点击列表上方的"批量管理"按钮
   - 界面显示批量操作工具栏
   - 片段卡片左侧显示选择框

2. **选择片段**
   - 点击片段卡片任意位置
   - 或点击左侧的选择框图标
   - 选中的片段会高亮显示

3. **全选**
   - 点击工具栏的"全选"按钮
   - 所有片段被选中

4. **批量删除**
   - 点击工具栏的"删除 (N)"按钮
   - 确认删除对话框弹出
   - 点击"确认"执行删除

5. **退出批量模式**
   - 点击工具栏的"取消"按钮
   - 或删除完成后自动退出

---

## 🔒 安全机制

### 1. 删除确认

```typescript
const confirmed = await showAlert(
  `确定要删除选中的 ${selectedIds.size} 个片段吗？\n\n此操作无法撤销！`,
  '批量删除确认'
);
```

- ✅ 显示要删除的片段数量
- ✅ 明确提示不可撤销
- ✅ 必须确认才能执行

### 2. 空选择保护

```typescript
if (selectedIds.size === 0) return;
```

- ✅ 没有选择时，删除按钮禁用
- ✅ 避免误操作

### 3. 状态清理

```typescript
// 删除完成后
setSelectedIds(new Set());
setBatchMode(false);
```

- ✅ 自动清空选择
- ✅ 自动退出批量模式
- ✅ 避免状态残留

---

## 🎨 视觉设计

### 批量模式指示器

| 状态 | 视觉效果 |
|------|---------|
| **普通模式** | 白色背景，灰色边框 |
| **批量模式** | 显示选择框 |
| **已选择** | 蓝色边框，浅蓝背景，投影增强 |
| **未选择** | 灰色边框，正常背景 |

### 工具栏配色

- **背景**：`bg-indigo-50` / `dark:bg-indigo-900/30`
- **边框**：`border-indigo-200` / `dark:border-indigo-800`
- **删除按钮**：`bg-red-600` → `hover:bg-red-700`
- **取消按钮**：`bg-white` → `hover:bg-gray-50`

### 选择框图标

- **未选择**：`<Circle />` 空心圆，灰色
- **已选择**：`<CheckCircle2 />` 实心圆，蓝色

---

## 📱 响应式适配

### 高度调整

```typescript
// 普通模式
height: 'calc(100vh - 280px)'

// 批量模式（工具栏占用空间）
height: 'calc(100vh - 340px)'
```

自动根据批量模式调整列表高度，确保不溢出。

---

## 🧪 测试场景

### 场景 1：基本批量删除

1. 创建 3-5 个测试片段
2. 点击"批量管理"进入批量模式
3. 选择 2-3 个片段
4. 点击"删除"按钮
5. 确认删除
6. **验证**：
   - ✅ 选中的片段被删除
   - ✅ 其他片段保留
   - ✅ 自动退出批量模式

### 场景 2：全选删除

1. 创建 5 个片段
2. 进入批量模式
3. 点击"全选"
4. 点击"删除"
5. 确认删除
6. **验证**：
   - ✅ 所有片段被删除
   - ✅ 显示"暂无内容"

### 场景 3：取消操作

1. 进入批量模式
2. 选择几个片段
3. 点击"取消"
4. **验证**：
   - ✅ 退出批量模式
   - ✅ 选择被清空
   - ✅ 恢复正常模式

### 场景 4：取消删除确认

1. 进入批量模式
2. 选择片段
3. 点击"删除"
4. 点击"取消"（不确认）
5. **验证**：
   - ✅ 片段未被删除
   - ✅ 保持批量模式
   - ✅ 选择保留

---

## 🚀 未来扩展

### 可能的新功能

1. **批量编辑标签**
   - 为多个片段添加/删除标签

2. **批量导出**
   - 导出选中的片段为文件

3. **批量置顶**
   - 批量置顶/取消置顶

4. **批量移动**
   - 批量修改类型或分类

5. **批量复制**
   - 复制选中片段到剪贴板

### 扩展建议

在 `BatchActionsBar` 组件中添加更多按钮：

```tsx
<button onClick={onBatchExport}>
  <Download size={16} />
  导出
</button>

<button onClick={onBatchTag}>
  <Tag size={16} />
  添加标签
</button>
```

---

## 📝 代码位置

### 新增文件

- `src/components/ContentList/BatchActionsBar.tsx` - 批量操作工具栏组件

### 修改文件

- `src/components/ContentList/ContentList.tsx` - 添加批量模式逻辑
- `src/App.tsx` - 添加 `handleBatchDelete` 函数

### 新增 Props

```typescript
// ContentListProps
interface ContentListProps {
  // ... 现有 props
  onBatchDelete: (ids: string[]) => void;  // 新增
}
```

---

## 💡 最佳实践

### 1. 性能优化

- ✅ 使用 `Set` 而不是 `Array` 存储选中 ID（O(1) 查找）
- ✅ 使用 `memo` 避免不必要的重渲染
- ✅ 使用 `Virtuoso` 虚拟滚动处理大列表

### 2. 用户体验

- ✅ 视觉反馈明显（选中状态高亮）
- ✅ 确认对话框防止误操作
- ✅ 操作完成后自动清理状态
- ✅ 批量模式可随时取消

### 3. 代码组织

- ✅ 批量操作逻辑独立组件
- ✅ 状态管理清晰
- ✅ 函数命名语义化
- ✅ Props 类型完整

---

## 🐛 已知限制

1. **删除速度**：大批量删除（100+）时，逐个删除可能较慢
   - **改进方案**：实现批量删除 API

2. **撤销功能**：删除后无法撤销
   - **改进方案**：添加"回收站"功能

3. **选择持久化**：刷新页面后选择丢失
   - **改进方案**：如有需要可存储到 localStorage

---

## ✅ 完成清单

- [x] 创建 BatchActionsBar 组件
- [x] 添加批量模式切换
- [x] 实现多选逻辑
- [x] 实现全选/取消全选
- [x] 实现批量删除
- [x] 添加删除确认
- [x] 视觉反馈优化
- [x] 暗黑模式适配
- [x] 通过 Linter 检查

---

## 相关文档

- [数据保存修复](./DATA_SAVE_FIX.md)
- [语言选项统一](./LANGUAGE_OPTIONS_UNIFIED.md)
- [数据库配置](./DATABASE_SETUP_GUIDE.md)
