# 数据保存逻辑优化

## 📋 问题背景

之前的代码存在一个严重的问题：

- **本地模式**下保存的数据，`userId` 被设置为字符串 `"local"`
- 这些数据被错误地保存到了 **Supabase 数据库**
- 由于 RLS（行级安全）策略要求 `auth.uid()::text = userId`
- 结果：数据保存到数据库，但用户无法看到（因为 `auth.uid()` 是 NULL 或不匹配）

## ✅ 修复方案

### 核心原则

**严格区分本地模式和登录模式：**

1. **本地模式** → 数据保存到 **Chrome Storage**（本地存储）
2. **登录模式** → 数据保存到 **Supabase**（云端数据库）
3. **未登录** → 不允许保存到 Supabase，提示用户登录

---

## 🔧 代码改动

### 1. App.tsx - handleQuickSave()

#### 修改前：

```typescript
const handleQuickSave = async (data) => {
  const userId = useLocalMode ? 'local' : user?.uid;
  
  if (!userId) {
    await dialog.showAlert('请先登录或使用本地模式', '错误');
    return;
  }

  if (useLocalMode) {
    // 保存到本地
    const newItem = { id: `local_${now}`, userId: 'local', ...data };
    await saveToLocalStorage([...localData, newItem]);
  } else {
    // 保存到 Supabase
    await createContent({ userId, ...data });
  }
};
```

**问题**：
- ❌ 即使 `useLocalMode = true`，也可能意外保存到 Supabase
- ❌ `userId = 'local'` 字符串会导致 RLS 问题
- ❌ 错误提示不够明确

---

#### 修改后：

```typescript
const handleQuickSave = async (data) => {
  const now = Date.now();

  // 本地模式：只保存到本地存储
  if (useLocalMode) {
    const localData = await getFromLocalStorage();
    const newItem: ContentItem = {
      id: `local_${now}`,
      userId: 'local',
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    await saveToLocalStorage([...localData, newItem]);
    setQuickSaveContent(null);
    refresh();
    await dialog.showAlert('片段已保存到本地！', '成功');
    return;  // 提前返回，不会继续执行
  }

  // 登录模式：检查用户是否已登录
  if (!user?.uid) {
    await dialog.showAlert(
      '请先登录后再保存到云端\n\n或者使用"本地模式"保存到浏览器本地',
      '需要登录'
    );
    return;
  }

  // 保存到 Supabase
  await createContent({
    userId: user.uid,  // 确保使用真实的用户 ID
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  setQuickSaveContent(null);
  refresh();
  await dialog.showAlert('片段已保存到云端！', '成功');
};
```

**改进**：
- ✅ 本地模式**提前返回**，绝不会保存到 Supabase
- ✅ 登录模式**必须验证** `user?.uid` 存在
- ✅ 成功消息明确告知保存位置（本地 vs 云端）
- ✅ 错误提示更友好，指导用户操作

---

### 2. EditorModal.tsx - handleSave()

#### 修改前：

```typescript
const handleSave = async () => {
  if (userId) {
    // 保存到 Supabase
    if (contentId) {
      await updateContent(contentId, { ... });
    } else {
      await createContent({ userId, ... });
    }
  } else {
    // 保存到本地存储
    const localData = await getFromLocalStorage();
    // ...
  }
};
```

**问题**：
- ❌ 逻辑分散，不够清晰
- ❌ 没有统一的数据结构处理

---

#### 修改后：

```typescript
const handleSave = async () => {
  // 验证输入
  if (!title.trim() || !content.trim()) {
    await showAlert('请输入标题和内容', '提示');
    return;
  }

  setLoading(true);
  try {
    const now = Date.now();
    
    // 统一的数据结构
    const dataToSave = {
      title: title.trim(),
      content: content.trim(),
      type,
      language: type === 'text' ? undefined : language,
      tags: tags.length > 0 ? tags : undefined,
      variables: variables.length > 0 ? variables : undefined,
    };

    if (userId) {
      // 登录模式：保存到 Supabase
      if (contentId) {
        await updateContent(contentId, { ...dataToSave, updatedAt: now });
      } else {
        await createContent({
          userId,
          ...dataToSave,
          createdAt: now,
          updatedAt: now,
        });
      }
    } else {
      // 本地模式：保存到本地存储
      const localData = await getFromLocalStorage();
      if (contentId) {
        const updatedData = localData.map((item) =>
          item.id === contentId
            ? { ...item, ...dataToSave, updatedAt: now }
            : item
        );
        await saveToLocalStorage(updatedData);
      } else {
        const newItem: ContentItem = {
          id: `local_${now}`,
          userId: 'local',
          ...dataToSave,
          createdAt: now,
          updatedAt: now,
        };
        await saveToLocalStorage([...localData, newItem]);
      }
    }
    
    onSave();
  } catch (error) {
    console.error('保存失败:', error);
    await showAlert('保存失败，请重试', '错误');
  } finally {
    setLoading(false);
  }
};
```

**改进**：
- ✅ 统一的 `dataToSave` 对象，避免重复代码
- ✅ 清晰的登录模式 vs 本地模式分支
- ✅ 完整的错误处理

---

## 🔒 数据安全保证

### RLS 策略保护

```sql
CREATE POLICY "Users can view their own contents"
    ON public.contents
    FOR SELECT
    USING (auth.uid()::text = "userId");
```

**保证**：
- ✅ 只有 `userId = auth.uid()::text` 的数据才能被查看
- ✅ 本地模式的数据（`userId = 'local'`）不会被保存到 Supabase
- ✅ 未登录用户无法保存到 Supabase

---

## 📊 数据流程图

### 本地模式流程

```
用户操作
  ↓
点击保存
  ↓
检查 useLocalMode = true
  ↓
保存到 Chrome Storage
  ↓
userId = 'local'
  ↓
✅ 完成（不涉及 Supabase）
```

### 登录模式流程

```
用户操作
  ↓
点击保存
  ↓
检查 useLocalMode = false
  ↓
验证 user?.uid 存在
  ↓
  ├─ 存在 → 保存到 Supabase
  │           userId = user.uid
  │           ✅ 完成
  │
  └─ 不存在 → 提示登录
              ❌ 拒绝保存
```

---

## 🧪 测试场景

### 场景 1：本地模式保存

1. 确保在本地模式（`useLocalMode = true`）
2. 创建新片段
3. 保存
4. **验证**：
   - ✅ 数据保存到 Chrome Storage
   - ✅ 可以在应用中看到数据
   - ✅ Supabase 数据库中**没有**这条数据

### 场景 2：登录后保存

1. 使用 GitHub 或邮箱登录
2. 确保在登录模式（`useLocalMode = false`）
3. 创建新片段
4. 保存
5. **验证**：
   - ✅ 数据保存到 Supabase
   - ✅ `userId` = 真实的用户 ID（UUID 格式）
   - ✅ 可以在 Table Editor 中看到数据
   - ✅ 可以在应用中看到数据

### 场景 3：未登录尝试保存到云端

1. 确保未登录
2. 确保不在本地模式
3. 尝试保存
4. **验证**：
   - ✅ 显示错误提示："请先登录后再保存到云端"
   - ✅ 数据**未**保存

---

## 🐛 修复的 Bug

### Bug 1: 本地数据保存到 Supabase

**症状**：
- 本地模式下保存的数据出现在 Supabase 数据库中
- `userId = 'local'`
- 由于 RLS 策略，用户看不到这些数据

**修复**：
- 本地模式提前返回，不会执行 Supabase 保存逻辑

---

### Bug 2: userId 类型不匹配

**症状**：
- 数据存在，但 RLS 策略阻止访问
- `"userId" = 'local'` 但 `auth.uid()` 返回 UUID

**修复**：
- 确保登录模式使用真实的 `user.uid`
- 本地模式只保存到本地存储

---

### Bug 3: 错误提示不明确

**症状**：
- 用户不知道为什么保存失败
- 不知道应该登录还是使用本地模式

**修复**：
- 明确的错误消息
- 提供操作建议

---

## 📝 迁移指南

如果你已经有错误保存的数据（`userId = 'local'`），需要清理：

```sql
-- 1. 查看错误数据
SELECT id, "userId", title 
FROM public.contents 
WHERE "userId" = 'local';

-- 2. 删除错误数据（如果确定不需要）
DELETE FROM public.contents 
WHERE "userId" = 'local';

-- 3. 或者迁移到当前用户（如果需要保留）
UPDATE public.contents 
SET "userId" = auth.uid()::text 
WHERE "userId" = 'local';
```

---

## ✅ 验证清单

完成修复后，确认：

- [ ] 本地模式下保存的数据不会出现在 Supabase
- [ ] 登录模式下必须先登录才能保存
- [ ] 保存成功后有明确的提示（本地/云端）
- [ ] RLS 策略正常工作
- [ ] 可以在 Table Editor 中看到自己的数据
- [ ] 代码通过 linter 检查

---

## 🎯 最佳实践

1. **永远不要在本地模式下保存到 Supabase**
2. **永远验证 `user?.uid` 存在后再保存到 Supabase**
3. **使用明确的返回语句避免逻辑继续执行**
4. **提供清晰的用户反馈**
5. **保持本地和云端存储逻辑分离**

---

## 相关文档

- [RLS 问题排查](./RLS_TROUBLESHOOTING.md)
- [数据库配置指南](./DATABASE_SETUP_GUIDE.md)
- [诊断 SQL](./DIAGNOSTIC_QUERIES.sql)
