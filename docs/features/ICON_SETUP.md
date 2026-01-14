# 图标配置指南

## 当前图标配置

已在 `manifest.json` 中配置了三个尺寸的图标：
- 16x16 - 浏览器工具栏小图标
- 48x48 - 扩展管理页面图标
- 128x128 - Chrome 网上应用店和安装时的图标

## 图标文件位置

```
public/icons/
  ├── icon16.png   (16x16)
  ├── icon48.png   (48x48)
  └── icon128.png  (128x128)
```

## 如何替换图标

你已经有了一个 128x128 的紫色 "Q" 字母图标。现在需要：

### 方法一：手动替换（推荐）

1. **保存 128x128 图标**
   - 将你的图标保存为 `icon128.png`
   - 放到 `/Users/joey/qa_sider/public/icons/` 目录
   - 覆盖现有的 `icon128.png` 文件

2. **生成其他尺寸**
   
   你可以使用以下方法生成 16x16 和 48x48 的图标：

   **使用在线工具**：
   - 访问 https://www.iloveimg.com/resize-image
   - 或 https://resizeimage.net/
   - 上传你的 128x128 图标
   - 分别调整为 16x16 和 48x48
   - 保存为 `icon16.png` 和 `icon48.png`

   **使用 macOS 预览**：
   - 打开你的 128x128 图标
   - 工具 → 调整大小
   - 设置尺寸为 16x16（取消勾选"按比例缩放"）
   - 导出保存
   - 重复操作生成 48x48

   **使用命令行（如果安装了 ImageMagick）**：
   ```bash
   cd /Users/joey/qa_sider/public/icons
   
   # 从 128x128 生成其他尺寸
   convert icon128.png -resize 16x16 icon16.png
   convert icon128.png -resize 48x48 icon48.png
   ```

### 方法二：使用 macOS sips 命令（内置工具）

```bash
cd /Users/joey/qa_sider/public/icons

# 假设你已经有了 icon128.png
# 生成 16x16
sips -z 16 16 icon128.png --out icon16.png

# 生成 48x48
sips -z 48 48 icon128.png --out icon48.png
```

## 图标设计建议

### 尺寸要求：
- **16x16**：简洁清晰，避免过多细节
- **48x48**：中等细节，保持识别度
- **128x128**：完整设计，可包含更多细节

### 设计规范：
- ✅ 使用 PNG 格式（支持透明背景）
- ✅ 保持图标在所有尺寸下都清晰可辨
- ✅ 使用高对比度颜色
- ✅ 简洁的设计更容易在小尺寸下识别

### 你的图标（紫色 Q）：
- 主色：紫色 (#4A3FE0 或类似)
- 背景：浅紫色圆形
- 字母：白色 "Q"
- 风格：现代、简洁

## 快速操作步骤

1. 将你的 128x128 图标文件拖到 `/Users/joey/qa_sider/public/icons/` 文件夹
2. 重命名为 `icon128.png`（覆盖旧文件）
3. 运行以下命令生成其他尺寸：

```bash
cd /Users/joey/qa_sider/public/icons
sips -z 16 16 icon128.png --out icon16.png
sips -z 48 48 icon128.png --out icon48.png
```

4. 重新构建项目：

```bash
cd /Users/joey/qa_sider
npm run build
```

5. 在 Chrome 中重新加载扩展

## 验证图标

### 在开发中验证：
1. 打开 Chrome 扩展管理页面：`chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `/Users/joey/qa_sider/dist` 目录
5. 检查扩展图标是否显示正确

### 图标显示位置：
- **工具栏**：16x16 图标
- **扩展管理页面**：48x48 图标
- **安装对话框**：128x128 图标

## manifest.json 配置

已配置完成：

```json
{
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

## 构建后的位置

构建后，图标会复制到：
```
dist/icons/
  ├── icon16.png
  ├── icon48.png
  └── icon128.png
```

## 故障排除

### 问题：图标不显示
**解决方案**：
1. 确认文件名完全匹配（区分大小写）
2. 确认文件格式为 PNG
3. 重新构建项目：`npm run build`
4. 在 Chrome 中重新加载扩展

### 问题：图标模糊
**解决方案**：
1. 确保使用正确的尺寸（不要拉伸）
2. 使用高质量的原始图像
3. 考虑为每个尺寸单独设计优化

### 问题：构建后图标丢失
**解决方案**：
1. 检查 `public/icons/` 目录中的文件
2. 确认 vite 配置正确复制了 public 目录
3. 手动将图标复制到 `dist/icons/` 目录

## 当前状态

✅ manifest.json 已配置图标路径
⏳ 需要替换实际的图标文件
⏳ 需要重新构建项目

## 下一步

1. 将你的 128x128 紫色 Q 图标保存到 `public/icons/icon128.png`
2. 使用 sips 命令生成其他尺寸
3. 运行 `npm run build`
4. 重新加载扩展查看效果

完成后你的扩展就会显示漂亮的紫色 Q 图标了！🎨✨
