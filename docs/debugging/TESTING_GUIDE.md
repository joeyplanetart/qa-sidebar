# 测试和调试指南

## 🔍 验证数据是否真的保存

### 方法 1：使用 Chrome DevTools 查看存储

#### 步骤：
1. 打开扩展的 Side Panel
2. 右键点击 Side Panel 的任意位置
3. 选择"检查"（Inspect）
4. 在 DevTools 中，切换到 **Application** 标签
5. 展开左侧的 **Storage** → **Local Storage**
6. 点击你的扩展 URL（类似 `chrome-extension://xxxxx`）
7. 查找 key 为 `qa_sider_contents` 的项
8. 查看 Value，应该能看到保存的 JSON 数据

#### 示例数据格式：
```json
[
  {
    "id": "local_1234567890",
    "userId": "local",
    "title": "测试代码",
    "content": "console.log('hello');",
    "type": "code",
    "language": "javascript",
    "createdAt": 1234567890000,
    "updatedAt": 1234567890000
  }
]
```

### 方法 2：使用控制台查询

在 DevTools Console 中执行：

```javascript
// 查看所有存储的内容
chrome.storage.local.get('qa_sider_contents', (result) => {
  console.log('存储的内容:', result.qa_sider_contents);
  console.log('内容数量:', result.qa_sider_contents?.length || 0);
});

// 查看所有 storage 键
chrome.storage.local.get(null, (items) => {
  console.log('所有存储的数据:', items);
});
```

### 方法 3：在代码中添加调试日志

修改 `src/services/storage.ts`，添加 console.log：

```typescript
export const saveToLocalStorage = async (contents: ContentItem[]): Promise<void> => {
  try {
    console.log('📝 准备保存到本地存储:', contents);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ [STORAGE_KEY]: contents });
      console.log('✅ 保存成功，内容数量:', contents.length);
    }
  } catch (error) {
    console.error('❌ 保存到本地存储失败:', error);
    throw error;
  }
};
```

## 🐛 常见问题排查

### 问题 1：保存后列表不显示

**可能原因：**
1. 数据没有真正保存
2. 保存后没有刷新列表
3. 过滤器或搜索框过滤掉了内容

**解决方案：**
- ✅ 已修复：添加了 `onSave` 回调，保存成功后自动刷新列表
- 检查搜索框是否有内容，清空搜索框
- 检查过滤标签是否选择了"全部"

### 问题 2：数据保存了但重启后消失

**可能原因：**
- Chrome Storage 权限问题
- 扩展被重新安装，清空了数据

**验证方法：**
```javascript
// 检查权限
chrome.permissions.contains({
  permissions: ['storage']
}, (result) => {
  console.log('storage 权限:', result);
});
```

### 问题 3：看到"游客模式"但仍提示登录

**可能原因：**
- `useLocalMode` 状态没有正确设置

**检查方法：**
在 `App.tsx` 中添加日志：
```typescript
console.log('useLocalMode:', useLocalMode);
console.log('user:', user);
```

## 🧪 完整测试流程

### 测试 1：创建内容
1. 点击"稍后登录（使用本地存储）"进入游客模式
2. 点击右上角"新建"按钮
3. 填写：
   - 标题：`测试内容`
   - 类型：`代码`
   - 语言：`JavaScript`
   - 内容：`console.log('Hello World');`
4. 点击"保存"按钮
5. ✅ **期望结果**：
   - 编辑器关闭
   - 列表中立即显示新创建的内容
   - 内容卡片显示标题、类型、时间等信息

### 测试 2：验证存储
1. 打开 DevTools → Application → Storage
2. 查看 `qa_sider_contents`
3. ✅ **期望结果**：
   - 能看到刚才保存的数据
   - 数据结构完整（包含 id, title, content 等）

### 测试 3：编辑内容
1. 点击内容卡片上的"编辑"按钮
2. 修改标题或内容
3. 点击"保存"
4. ✅ **期望结果**：
   - 列表中的内容立即更新
   - Storage 中的数据也已更新

### 测试 4：删除内容
1. 点击内容卡片上的"删除"按钮
2. 确认删除
3. ✅ **期望结果**：
   - 内容从列表中消失
   - Storage 中的数据也被删除

### 测试 5：刷新页面
1. 关闭并重新打开 Side Panel
2. ✅ **期望结果**：
   - 之前保存的内容仍然存在
   - 数据没有丢失

## 📊 性能测试

### 测试大量数据
```javascript
// 在 Console 中创建 100 条测试数据
const testData = Array.from({ length: 100 }, (_, i) => ({
  id: `test_${i}`,
  userId: 'local',
  title: `测试内容 ${i}`,
  content: `这是第 ${i} 条测试内容`,
  type: 'text',
  createdAt: Date.now() - i * 1000,
  updatedAt: Date.now() - i * 1000,
}));

chrome.storage.local.set({ qa_sider_contents: testData }, () => {
  console.log('✅ 测试数据创建成功');
  location.reload();
});
```

### 清空所有数据
```javascript
// 清空测试数据
chrome.storage.local.remove('qa_sider_contents', () => {
  console.log('✅ 数据已清空');
  location.reload();
});
```

## 🔧 修复历史

### v1.0.1 (最新)
- ✅ 修复：保存后列表不刷新
- ✅ 添加：`onSave` 回调机制
- ✅ 改进：保存成功后自动刷新列表

### v1.0.0
- ✅ 实现：本地存储基本功能
- ✅ 实现：游客模式
- ✅ 实现：代码语法高亮

## 💡 开发建议

### 启用详细日志
在开发时，建议在关键位置添加日志：

1. **保存前**：记录要保存的数据
2. **保存后**：确认保存成功
3. **加载时**：显示加载的数据数量
4. **刷新时**：确认刷新被调用

### 使用 React DevTools
安装 React DevTools 扩展，可以：
- 查看组件状态
- 追踪 props 变化
- 检查 hooks 状态
