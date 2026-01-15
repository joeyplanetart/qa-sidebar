# 代码片段变量功能测试示例

## 测试步骤

### 1. SQL 查询模板测试

复制以下内容并保存为代码片段:

```sql
SELECT ${COLUMNS} 
FROM ${TABLE_NAME} 
WHERE ${CONDITION} 
ORDER BY ${ORDER_BY} 
LIMIT ${LIMIT}
```

保存后,系统应该:
- ✅ 检测到 5 个变量
- ✅ 在预览区显示变量高亮
- ✅ 显示 "检测到 5 个变量" 的提示

### 2. 插入测试

选择刚才保存的片段并点击插入:

1. 应该弹出变量表单
2. 依次填写:
   - `COLUMNS`: `id, name, email`
   - `TABLE_NAME`: `users`
   - `CONDITION`: `status = 'active'`
   - `ORDER_BY`: `created_at DESC`
   - `LIMIT`: `10`
3. 点击"确认插入"

期望结果:
```sql
SELECT id, name, email 
FROM users 
WHERE status = 'active' 
ORDER BY created_at DESC 
LIMIT 10
```

### 3. JavaScript 模板测试

```javascript
const response = await fetch('${API_URL}/api/${ENDPOINT}', {
  method: '${HTTP_METHOD}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${API_TOKEN}'
  },
  body: JSON.stringify({
    userId: ${USER_ID},
    action: '${ACTION}'
  })
});
```

测试填写:
- `API_URL`: `https://api.example.com`
- `ENDPOINT`: `users`
- `HTTP_METHOD`: `POST`
- `API_TOKEN`: `abc123xyz`
- `USER_ID`: `42`
- `ACTION`: `update`

### 4. 配置文件模板测试

```yaml
database:
  host: ${DB_HOST}
  port: ${DB_PORT}
  database: ${DB_NAME}
  username: ${DB_USER}
  password: ${DB_PASSWORD}
  
redis:
  host: ${REDIS_HOST}
  port: ${REDIS_PORT}
```

### 5. 边界情况测试

#### 测试 1: 无变量
```javascript
console.log('Hello, World!');
```
期望: 直接插入,不弹出表单

#### 测试 2: 重复变量
```javascript
const a = ${VALUE};
const b = ${VALUE};
const c = ${VALUE};
```
期望: 只需填写一次 `VALUE`

#### 测试 3: 嵌套花括号(不支持)
```javascript
const obj = { key: ${VALUE} };
```
期望: 正确识别 `VALUE` 变量

#### 测试 4: 空变量名
```javascript
const test = ${};
```
期望: 不应该被识别为变量

### 6. 用户体验测试

- [ ] 在QuickSaveDialog中看到变量数量提示
- [ ] 变量在预览中以黄色高亮显示
- [ ] 在QuickInsertDialog列表中看到变量图标
- [ ] 变量表单清晰显示每个变量
- [ ] 按 Enter 可以快速切换输入框
- [ ] 按 Esc 可以关闭变量表单
- [ ] 未填写所有变量时显示错误提示
- [ ] 插入后内容正确替换

## 常见问题

### Q: 为什么我的变量没有被识别?
A: 请确保使用正确的语法 `${变量名}`,变量名只能包含字母、数字、下划线,且必须以字母或下划线开头。

### Q: 可以在变量中使用中文吗?
A: 建议只使用英文字母、数字和下划线,以确保最佳兼容性。

### Q: 同一个变量出现多次怎么办?
A: 只需要填写一次,系统会自动替换所有相同的变量。

### Q: 可以在变量值中使用特殊字符吗?
A: 可以,变量值会原样替换,不会进行任何转义。

## 反馈

如果发现任何问题或有改进建议,请提交 issue。
