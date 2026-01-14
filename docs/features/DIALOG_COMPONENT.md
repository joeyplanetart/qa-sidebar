# 自定义对话框组件说明

## 🎯 功能概述

替换了浏览器默认的 `alert()` 和 `confirm()` 弹窗，使用自定义的对话框组件，确保弹窗在 Side Panel 中居中显示，提供更好的用户体验。

## 📦 组件结构

### 1. Dialog 组件 (`src/components/Dialog/Dialog.tsx`)

自定义对话框组件，支持两种类型：

#### Alert 对话框
- 单个确定按钮
- 用于提示信息

#### Confirm 对话框
- 确定和取消按钮
- 用于确认操作

### 2. useDialog Hook (`src/hooks/useDialog.ts`)

管理对话框状态的 Hook，提供以下功能：

- `showAlert(message, title?)` - 显示提示对话框
- `showConfirm(message, title?)` - 显示确认对话框
- 返回 Promise，可以 await 用户的选择

## 🎨 UI 设计

### 布局
- **位置**：在 Side Panel 中居中显示
- **背景**：半透明黑色遮罩层 (`bg-black bg-opacity-50`)
- **容器**：白色圆角卡片，最大宽度 `max-w-md`
- **层级**：`z-50` 确保在最上层

### 样式
- **标题**：可选，灰黑色粗体字
- **内容**：灰色文字，支持换行
- **按钮**：主按钮（蓝色）+ 次要按钮（灰色边框）
- **动画**：hover 时颜色过渡

## 🔧 使用方法

### 在组件中使用

```typescript
import { useDialog } from './hooks/useDialog';

function MyComponent() {
  const dialog = useDialog();

  // 显示提示
  const handleAlert = async () => {
    await dialog.showAlert('操作成功！', '提示');
    console.log('用户点击了确定');
  };

  // 显示确认
  const handleConfirm = async () => {
    const confirmed = await dialog.showConfirm(
      '确定要删除这个内容吗？',
      '删除确认'
    );
    if (confirmed) {
      // 用户点击了确定
      deleteItem();
    } else {
      // 用户点击了取消
      console.log('取消删除');
    }
  };

  return (
    <>
      {/* 你的组件内容 */}
      
      {/* 对话框组件 */}
      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.config.title}
        message={dialog.config.message}
        type={dialog.config.type}
        onConfirm={dialog.handleConfirm}
        onCancel={dialog.handleCancel}
      />
    </>
  );
}
```

## 📍 已替换的地方

### 1. App.tsx
- ✅ `confirm('确定要删除这个内容吗？')` → `dialog.showConfirm(...)`

### 2. EditorModal.tsx
- ✅ `alert('请输入标题')` → `showAlert('请输入标题', '提示')`
- ✅ `alert('请输入内容')` → `showAlert('请输入内容', '提示')`
- ✅ `alert('加载内容失败')` → `showAlert('加载内容失败', '错误')`
- ✅ `alert('保存失败，请重试')` → `showAlert('保存失败，请重试', '错误')`

### 3. AuthPanel.tsx
- ✅ `alert('登录失败，请重试')` → `showAlert('登录失败，请重试', '错误')`

## 🎭 对话框类型

### Alert（提示）
```typescript
await showAlert('这是一条提示信息', '提示');
```

**显示效果：**
```
┌─────────────────────────┐
│ 提示                  ×  │
├─────────────────────────┤
│ 这是一条提示信息        │
├─────────────────────────┤
│              [确定]      │
└─────────────────────────┘
```

### Confirm（确认）
```typescript
const result = await showConfirm('确定要删除吗？', '删除确认');
if (result) {
  // 用户点击了确定
}
```

**显示效果：**
```
┌─────────────────────────┐
│ 删除确认              ×  │
├─────────────────────────┤
│ 确定要删除吗？          │
├─────────────────────────┤
│        [取消]  [确定]   │
└─────────────────────────┘
```

## 🎯 优势

### vs 浏览器默认弹窗

| 特性 | 浏览器默认 | 自定义对话框 |
|------|-----------|-------------|
| 位置 | 屏幕中央 | Side Panel 中居中 ✅ |
| 样式 | 系统默认 | 可自定义 ✅ |
| 动画 | 无 | 平滑过渡 ✅ |
| 标题 | 固定 | 可自定义 ✅ |
| 品牌一致性 | ❌ | ✅ |
| 响应式 | 有限 | 完全响应式 ✅ |

## 🔒 用户体验

### 交互方式
1. **点击确定** → 执行操作并关闭
2. **点击取消** → 不执行操作并关闭
3. **点击 X 按钮** → 等同于取消
4. **按 ESC 键** → 可扩展支持（未实现）

### Promise 模式
使用 Promise 让代码更简洁：

```typescript
// 之前（浏览器默认）
if (confirm('确定删除吗？')) {
  deleteItem();
}

// 现在（自定义对话框）
const confirmed = await dialog.showConfirm('确定删除吗？', '删除确认');
if (confirmed) {
  deleteItem();
}
```

## 🎨 自定义样式

如需修改样式，编辑 `src/components/Dialog/Dialog.tsx`：

### 修改颜色
```tsx
// 主按钮颜色
className="... bg-primary text-white hover:bg-indigo-700 ..."

// 次要按钮颜色
className="... border-gray-300 hover:bg-gray-100 ..."
```

### 修改大小
```tsx
// 对话框宽度
className="... max-w-md ..." // 可改为 max-w-lg, max-w-xl 等
```

### 修改遮罩
```tsx
// 遮罩透明度
className="... bg-opacity-50 ..." // 可改为 bg-opacity-30, bg-opacity-70 等
```

## 🚀 未来扩展

可以添加的功能：

### 1. 输入对话框
```typescript
const input = await dialog.showPrompt('请输入名称:', '输入');
```

### 2. 自定义按钮
```typescript
await dialog.showConfirm('确定删除吗？', '删除确认', {
  confirmText: '删除',
  cancelText: '不删除',
});
```

### 3. 图标支持
```typescript
await dialog.showAlert('操作成功！', '提示', {
  icon: 'success' // 显示成功图标
});
```

### 4. 键盘支持
- ESC 键关闭
- Enter 键确认

### 5. 动画效果
- 淡入淡出
- 缩放效果

## 📝 代码示例

### 完整示例：删除确认

```typescript
const handleDelete = async (id: string) => {
  // 显示确认对话框
  const confirmed = await dialog.showConfirm(
    '确定要删除这个内容吗？\n删除后将无法恢复。',
    '删除确认'
  );
  
  // 用户确认后才删除
  if (confirmed) {
    try {
      await deleteContent(id);
      // 可以显示成功提示
      await dialog.showAlert('删除成功！', '提示');
    } catch (error) {
      // 显示错误提示
      await dialog.showAlert('删除失败，请重试', '错误');
    }
  }
};
```

## 🎓 最佳实践

### 1. 标题建议
- **提示**：用于一般信息
- **错误**：用于错误信息
- **警告**：用于警告信息
- **成功**：用于成功信息
- **确认**：用于需要确认的操作

### 2. 消息编写
- 简洁明了
- 说明原因和后果
- 使用换行符 `\n` 分段
- 避免技术术语

### 3. 按钮文本
- 使用动词（删除、保存、取消）
- 明确操作结果
- 保持简短

## 🐛 常见问题

### Q: 对话框没有显示？
A: 确保在组件的 return 中添加了 `<Dialog />` 组件。

### Q: 点击确定没有反应？
A: 检查是否使用了 `await`：
```typescript
// ✅ 正确
const result = await dialog.showConfirm(...);

// ❌ 错误
dialog.showConfirm(...); // 没有 await
```

### Q: 如何在对话框中显示多行文本？
A: 使用 `\n` 换行符：
```typescript
await dialog.showAlert(
  '第一行\n第二行\n第三行',
  '多行文本'
);
```
