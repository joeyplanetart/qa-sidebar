# 🎉 代码片段变量功能 - 测试指南

## 问题已修复

之前存在的问题:
- ❌ 旧的代码片段没有 `variables` 字段
- ❌ `App.tsx` 缺少 `variables` 参数支持
- ❌ `EditorModal.tsx` 没有提取和保存变量

**现已全部修复!** ✅

## 🚀 快速测试步骤

### 1. 重新加载扩展

由于修改了核心文件,需要重新加载扩展:

1. 打开 Chrome 扩展管理页面: `chrome://extensions/`
2. 找到 "QA Sider" 扩展
3. 点击 **刷新/重新加载** 按钮
4. 或者先关闭再启用扩展

### 2. 创建新的测试片段

#### 方法A: 使用快速保存 (推荐)

1. 选中以下 SQL 代码:
   ```sql
   SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE ${CONDITION}
   ```

2. 按快捷键保存 (Alt+Shift+S 或 Cmd+Shift+D)

3. 在保存对话框中应该看到:
   - ✅ 上方显示 "检测到 3 个变量"
   - ✅ 底部显示 "包含变量: ${COLUMNS}, ${TABLE_NAME}, ${CONDITION}"

4. 填写标题并保存

#### 方法B: 使用编辑器创建

1. 点击 "新建内容" 按钮
2. 粘贴包含变量的代码:
   ```javascript
   const response = await fetch('${API_URL}/api/${ENDPOINT}', {
     method: '${METHOD}',
     headers: { 'Authorization': 'Bearer ${TOKEN}' }
   });
   ```

3. 应该看到:
   - ✅ 右上角显示 "检测到 4 个变量"
   - ✅ 底部提示显示所有变量名

### 3. 测试插入功能

1. 按快捷键打开插入对话框 (Alt+Shift+I 或 Cmd+Shift+I)

2. 选择刚才创建的包含变量的片段

3. 在列表中应该看到:
   - ✅ 标题旁边有一个数字图标显示变量数量

4. 点击片段,在右侧预览区查看:
   - ✅ 应该显示变量信息卡片
   - ✅ 变量在代码中以黄色高亮显示

5. 点击 "插入到页面" 按钮

6. **关键步骤**: 应该弹出变量填写表单
   - ✅ 显示所有需要填写的变量
   - ✅ 每个变量都有输入框

7. 填写变量值:
   - 可以使用 Enter 键快速切换
   - 最后一个输入框按 Enter 直接提交

8. 点击 "确认插入",代码应该被正确替换后插入到页面

### 4. 完整测试案例

```sql
-- 测试片段: 复杂 SQL 查询
SELECT 
  ${COLUMNS}
FROM 
  ${TABLE_NAME} AS t
WHERE 
  ${WHERE_CONDITION}
  AND status = '${STATUS}'
GROUP BY 
  ${GROUP_BY}
ORDER BY 
  ${ORDER_BY}
LIMIT ${LIMIT}
OFFSET ${OFFSET}
```

**测试填写:**
- COLUMNS: `id, name, email, created_at`
- TABLE_NAME: `users`
- WHERE_CONDITION: `deleted_at IS NULL`
- STATUS: `active`
- GROUP_BY: `user_type`
- ORDER_BY: `created_at DESC`
- LIMIT: `10`
- OFFSET: `0`

**期望结果:**
```sql
SELECT 
  id, name, email, created_at
FROM 
  users AS t
WHERE 
  deleted_at IS NULL
  AND status = 'active'
GROUP BY 
  user_type
ORDER BY 
  created_at DESC
LIMIT 10
OFFSET 0
```

## ✅ 检查清单

### 保存时:
- [ ] QuickSaveDialog 显示变量数量
- [ ] QuickSaveDialog 底部显示变量列表
- [ ] EditorModal 右上角显示变量数量
- [ ] EditorModal 底部显示变量列表

### 插入时:
- [ ] QuickInsertDialog 列表项显示变量图标
- [ ] 预览区显示变量信息卡片
- [ ] 预览代码中变量高亮(黄色)
- [ ] 点击插入弹出变量表单
- [ ] 表单显示所有变量
- [ ] Enter键可以切换输入框
- [ ] 未填写变量时显示错误
- [ ] 填写完成后正确替换并插入

## 🐛 常见问题

### Q: 为什么旧的片段没有显示变量?

A: 旧片段是在添加此功能前创建的,没有 `variables` 字段。解决方法:
- **重新保存**: 编辑旧片段,保存时会自动提取变量
- **或创建新片段**: 复制内容,创建新片段

### Q: 为什么没有弹出变量表单?

A: 可能原因:
1. 片段是旧的,需要重新保存
2. 扩展没有重新加载
3. 浏览器缓存问题,尝试硬刷新

### Q: 变量没有高亮显示?

A: 检查:
1. 确保使用正确的语法 `${变量名}`
2. 重新加载扩展
3. 清除浏览器缓存

## 🔧 调试技巧

### 打开控制台查看日志

1. 右键点击扩展图标 → 检查弹出窗口
2. 查看 Console 标签
3. 应该能看到变量相关的日志输出

### 检查数据

在控制台输入:
```javascript
chrome.storage.local.get('qa_sider_contents', (data) => {
  console.log(data);
});
```

查看片段是否包含 `variables` 字段。

## 📝 反馈

如果遇到任何问题,请提供:
1. 测试的代码片段内容
2. 控制台错误信息
3. 操作步骤描述
