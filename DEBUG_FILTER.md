# SQL 过滤问题调试指南

## 🐛 问题描述
点击 SQL 标签页过滤时，显示"暂无内容"，但实际可能有 SQL 类型的内容。

## 🔍 调试步骤

### 1. 打开开发者工具

1. 打开扩展的 Side Panel
2. 右键点击页面
3. 选择"检查"（Inspect）
4. 切换到 **Console** 标签

### 2. 查看调试信息

在 Console 中会自动输出调试信息：

```
=== 内容调试信息 ===
所有内容数量: 3
当前过滤器: sql
所有内容类型统计: { code: 2, sql: 1 }
过滤后内容数量: 1
所有内容详情: [
  { title: "测试代码", type: "code" },
  { title: "测试SQL", type: "sql" },
  { title: "测试文本", type: "text" }
]
```

### 3. 检查内容类型

**关键检查项：**
- `所有内容数量`：显示总共有多少条内容
- `当前过滤器`：显示当前选择的过滤器（应该是 `sql`）
- `所有内容类型统计`：显示每种类型的数量
- `过滤后内容数量`：显示过滤后剩余的数量
- `所有内容详情`：显示每条内容的标题和类型

## 🔧 常见问题排查

### 问题 1：没有 SQL 类型的内容

**现象：**
```
所有内容类型统计: { code: 2, text: 1 }
```
没有显示 `sql` 键。

**原因：**
- 您还没有创建任何 SQL 类型的内容
- 之前创建的内容选择的类型是"代码"而不是"SQL"

**解决方案：**
1. 点击"新建"按钮
2. 在"类型"下拉框中选择 **SQL**
3. 填写内容并保存
4. 再次点击 SQL 标签查看

### 问题 2：内容类型字符串不匹配

**现象：**
```
所有内容详情: [
  { title: "测试", type: "SQL" }  // 大写
]
```

**原因：**
类型值应该是小写的 `'sql'` 但保存的是大写或其他格式。

**解决方案：**
这是代码 bug，需要检查保存逻辑。

### 问题 3：数据结构问题

**现象：**
Console 显示错误或 `type` 字段为 `undefined`

**解决方案：**
1. 查看 Chrome Storage 中的实际数据：
```javascript
chrome.storage.local.get('qa_sider_contents', (result) => {
  console.log('原始存储数据:', result.qa_sider_contents);
});
```

2. 检查数据结构是否正确

## 🧪 手动测试步骤

### 测试 1：创建 SQL 内容

1. 点击右上角"新建"按钮
2. 填写表单：
   - **标题**：`测试 SQL`
   - **类型**：选择 **SQL**（不是"代码"）
   - **语言**：选择 **SQL**
   - **内容**：
     ```sql
     SELECT * FROM users WHERE id = 1;
     ```
3. 点击"保存"
4. 应该看到内容出现在列表中
5. 点击 **SQL** 标签
6. ✅ 应该只显示刚才创建的 SQL 内容

### 测试 2：验证过滤功能

1. 创建三种类型的内容：
   - 代码类型 1 条
   - SQL 类型 1 条
   - 文本类型 1 条
2. 点击"全部" → 应该显示 3 条
3. 点击"代码" → 应该显示 1 条
4. 点击"SQL" → 应该显示 1 条
5. 点击"文本" → 应该显示 1 条

## 📊 验证数据

### 方法 1：使用控制台查询

```javascript
// 查看所有内容
chrome.storage.local.get('qa_sider_contents', (result) => {
  const contents = result.qa_sider_contents || [];
  console.log('总数量:', contents.length);
  
  // 按类型分组
  const byType = contents.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  console.log('类型统计:', byType);
  
  // 显示所有 SQL 类型的内容
  const sqlItems = contents.filter(item => item.type === 'sql');
  console.log('SQL 内容:', sqlItems);
});
```

### 方法 2：查看 Application Storage

1. DevTools → Application 标签
2. Storage → Local Storage → 扩展 URL
3. 找到 `qa_sider_contents` 键
4. 查看 Value（JSON 格式）
5. 检查每个对象的 `type` 字段

## ✅ 预期行为

### 正确的数据格式

```json
[
  {
    "id": "local_1234567890",
    "userId": "local",
    "title": "测试 SQL",
    "content": "SELECT * FROM users;",
    "type": "sql",
    "language": "sql",
    "createdAt": 1234567890000,
    "updatedAt": 1234567890000
  }
]
```

**关键点：**
- `type` 必须是小写的 `"sql"`（不是 "SQL"）
- `type` 必须是三个值之一：`"code"`, `"sql"`, `"text"`

### 正确的过滤逻辑

```typescript
// 如果 activeFilter 是 'sql'，应该只显示 type === 'sql' 的内容
if (activeFilter !== 'all' && item.type !== activeFilter) {
  return false; // 过滤掉不匹配的
}
```

## 🎯 快速诊断

运行这个完整的诊断脚本：

```javascript
// 在 Console 中执行
chrome.storage.local.get('qa_sider_contents', (result) => {
  const contents = result.qa_sider_contents || [];
  
  console.log('📊 诊断报告');
  console.log('='.repeat(50));
  console.log('总内容数:', contents.length);
  console.log('');
  
  // 类型统计
  const stats = contents.reduce((acc, item) => {
    const type = item.type || '未知';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  console.log('类型分布:', stats);
  console.log('');
  
  // 检查类型值
  const types = [...new Set(contents.map(item => item.type))];
  console.log('所有类型值:', types);
  console.log('');
  
  // SQL 内容详情
  const sqlItems = contents.filter(item => item.type === 'sql');
  console.log('SQL 内容数量:', sqlItems.length);
  if (sqlItems.length > 0) {
    console.log('SQL 内容列表:');
    sqlItems.forEach(item => {
      console.log(`  - ${item.title} (${item.type})`);
    });
  } else {
    console.log('❌ 没有找到 SQL 类型的内容');
    console.log('💡 建议：创建一个类型为 SQL 的内容');
  }
  console.log('='.repeat(50));
});
```

## 🔧 修复建议

如果诊断发现问题，可以尝试：

### 修复 1：重新创建内容

如果发现类型值错误，删除旧内容并重新创建。

### 修复 2：手动修复数据

如果有很多内容需要修复：

```javascript
chrome.storage.local.get('qa_sider_contents', (result) => {
  let contents = result.qa_sider_contents || [];
  
  // 修复类型值（如果是大写的话）
  contents = contents.map(item => ({
    ...item,
    type: item.type.toLowerCase() // 转换为小写
  }));
  
  // 保存修复后的数据
  chrome.storage.local.set({ qa_sider_contents: contents }, () => {
    console.log('✅ 数据已修复');
    location.reload(); // 重新加载页面
  });
});
```

## 📝 反馈信息

如果问题仍然存在，请提供以下信息：

1. Console 中的调试输出
2. `qa_sider_contents` 的完整 JSON 数据
3. 具体操作步骤
4. 期望行为 vs 实际行为
