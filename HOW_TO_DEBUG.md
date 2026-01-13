# 如何正确查看 Console 日志

## ⚠️ 重要：侧边栏有独立的 DevTools

Chrome 扩展的侧边栏（Side Panel）有**独立的 DevTools**，不要在网页的 Console 中查看！

## ✅ 正确的打开方式

### 方法 1：右键菜单（推荐）

1. **右键点击侧边栏的空白区域**（不是网页，是侧边栏本身）
2. 选择 **"检查"** 或 **"Inspect"**
3. 会弹出一个新的 DevTools 窗口
4. 切换到 **Console** 标签页

### 方法 2：通过扩展页面

1. 访问 `chrome://extensions/`
2. 找到 "QA sidePanel"
3. 点击 **"检查视图"** 或 **"Inspect views"**
4. 选择 `sidepanel`
5. 切换到 **Console** 标签页

## 🎯 图示说明

```
┌─────────────────────────────────┐
│  网页内容                        │
│                                 │
│                                 │  ← 这里的 DevTools 是网页的，
│                                 │    不会显示侧边栏的日志
└─────────────────────────────────┘

┌─────────────────┐
│ QA sidePanel    │
│                 │
│  登录按钮       │  ← 右键点击这里
│                 │
│                 │
└─────────────────┘
       ↓
   弹出新窗口
       ↓
┌─────────────────────────────────┐
│ Elements | Console | Sources   │  ← 这里才是正确的 Console
│                                 │
│ 用户点击了登录按钮              │
│ 🚀 [步骤 1/5] 开始 OAuth...     │
└─────────────────────────────────┘
```

## 🔍 快速测试：确认打开了正确的 Console

在 Console 中输入：

```javascript
console.log('测试:', location.href)
```

**正确的 Console** 应该显示：
```
测试: chrome-extension://你的扩展ID/index.html
```

**错误的 Console**（网页的）会显示：
```
测试: https://某个网站.com/...
```

## 📝 详细步骤（带截图说明）

### 第1步：确保侧边栏已打开

- 点击扩展图标，或
- 右键点击网页 → 选择打开侧边栏

### 第2步：右键点击侧边栏

**重要**：必须右键点击**侧边栏区域**，不是网页！

侧边栏通常在浏览器窗口的右侧，显示 "QA sidePanel" 的内容。

### 第3步：选择"检查"

从右键菜单中选择 **"检查"** 或 **"Inspect"**。

### 第4步：切换到 Console

在弹出的 DevTools 窗口中，点击 **Console** 标签页。

### 第5步：点击登录

现在点击 "使用 Google 账号登录" 按钮，应该能看到日志了。

## ❌ 常见错误

### 错误 1：在网页的 Console 中查看

❌ **错误做法**：
- F12 打开网页的 DevTools
- 在网页的 Console 中查看

✅ **正确做法**：
- 右键点击侧边栏
- 打开侧边栏专属的 DevTools

### 错误 2：打开了 Background Script 的 Console

如果你看到的是 `service-worker.js` 相关的内容，那是 Background Script 的 Console，不是侧边栏的。

需要重新按照上面的步骤打开侧边栏的 Console。

## 🧪 验证步骤

完成上述步骤后，在 Console 中应该能看到：

1. **侧边栏加载时的日志**（如果有）
2. **点击登录后的日志**：
   ```
   用户点击了登录按钮
   🚀 [步骤 1/5] 开始 Google OAuth 登录流程...
   ```

## 💡 小技巧

### 保持 DevTools 打开

右键 DevTools 窗口的标签栏 → 选择 "固定" 或 "Dock"，可以将 DevTools 固定在侧边栏旁边。

### 清空 Console

点击 Console 左上角的 🚫 图标可以清空历史日志，方便查看新的日志。

### 保留日志

勾选 Console 顶部的 "Preserve log" 选项，可以在页面刷新后保留日志。

## 🆘 仍然没有日志？

如果正确打开了侧边栏的 Console，但点击登录仍然没有任何日志输出，请在 Console 中运行：

```javascript
// 测试 1: 检查当前位置
console.log('当前位置:', location.href);

// 测试 2: 检查 Chrome API
console.log('Chrome API:', typeof chrome, typeof chrome?.identity);

// 测试 3: 手动触发登录（如果上面都正常）
// 找到登录按钮的处理函数并调用
```

然后告诉我输出结果！
