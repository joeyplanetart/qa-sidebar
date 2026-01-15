# 代码片段变量/占位符功能

## 功能概述

代码片段变量/占位符功能允许你在保存代码片段时使用 `${变量名}` 语法定义占位符,在插入时通过表单填写这些变量的值,从而大大提高代码复用性。

## 使用方法

### 1. 创建包含变量的代码片段

在保存代码片段时,使用 `${变量名}` 语法定义变量:

```javascript
const query = `SELECT * FROM ${TABLE_NAME} WHERE id = ${USER_ID}`;
```

系统会自动检测并提取所有变量:
- `TABLE_NAME`
- `USER_ID`

### 2. 插入代码片段

当你选择插入包含变量的代码片段时:

1. 系统会自动检测代码片段中的变量
2. 弹出变量填写表单
3. 填写每个变量的值
4. 点击"确认插入"按钮

系统会将所有 `${变量名}` 替换为你填写的值后再插入到页面中。

### 示例

**保存时的代码:**
```sql
SELECT * FROM ${TABLE_NAME} 
WHERE id = ${USER_ID} 
  AND status = '${STATUS}'
```

**填写变量:**
- `TABLE_NAME`: `users`
- `USER_ID`: `123`
- `STATUS`: `active`

**插入后的结果:**
```sql
SELECT * FROM users 
WHERE id = 123 
  AND status = 'active'
```

## 功能特性

### ✅ 自动检测变量
- 在保存时自动提取所有 `${变量名}` 格式的占位符
- 在QuickSaveDialog中显示检测到的变量数量和名称

### ✅ 变量高亮显示
- 在内容预览中,变量占位符会以黄色高亮显示
- 在QuickInsertDialog中显示变量数量图标

### ✅ 友好的填写表单
- 清晰显示每个变量名
- 必填验证,确保所有变量都有值
- 支持 Enter 键快速切换输入框
- 支持 Esc 键取消操作

### ✅ 变量名规则
- 推荐使用大写字母和下划线(如 `TABLE_NAME`)
- 可以使用字母、数字、下划线
- 必须以字母或下划线开头

## 技术实现

### 核心文件

1. **类型定义** (`src/types/index.ts`)
   - 扩展 `ContentItem` 接口,添加 `variables` 字段

2. **工具函数** (`src/utils/variables.ts`)
   - `extractVariables()`: 提取变量列表
   - `replaceVariables()`: 替换变量值
   - `hasVariables()`: 检查是否包含变量
   - `highlightVariables()`: 高亮显示变量

3. **变量表单组件** (`src/components/VariableForm/VariableForm.tsx`)
   - 收集用户输入的变量值
   - 表单验证
   - 键盘快捷键支持

4. **修改的组件**
   - `QuickSaveDialog`: 在保存时提取变量
   - `QuickInsertDialog`: 在插入前填写变量

## 使用场景

### 1. SQL 查询模板
```sql
SELECT ${COLUMNS} FROM ${TABLE_NAME}
WHERE ${CONDITION}
ORDER BY ${ORDER_BY}
LIMIT ${LIMIT}
```

### 2. API 请求模板
```javascript
fetch('${API_URL}/users/${USER_ID}', {
  method: '${METHOD}',
  headers: {
    'Authorization': 'Bearer ${TOKEN}'
  }
})
```

### 3. 配置文件模板
```yaml
database:
  host: ${DB_HOST}
  port: ${DB_PORT}
  name: ${DB_NAME}
  user: ${DB_USER}
```

### 4. 代码生成模板
```typescript
interface ${INTERFACE_NAME} {
  id: ${ID_TYPE};
  name: string;
  ${CUSTOM_FIELD}: ${CUSTOM_TYPE};
}
```

## 优势

- 🚀 **提高效率**: 一次编写,多次复用,无需手动修改
- 🎯 **减少错误**: 通过表单填写,避免手动查找替换时的遗漏
- 📋 **标准化**: 统一的代码模板格式,便于团队协作
- 💡 **灵活性**: 支持任意数量的变量,适应各种使用场景

## 注意事项

1. 变量名区分大小写: `${USER_ID}` 和 `${user_id}` 是不同的变量
2. 变量值会原样替换,不会进行任何转义或格式化
3. 如果变量名包含特殊字符,可能无法正确识别
4. 建议使用有意义的变量名,便于理解和维护
