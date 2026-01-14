#!/bin/bash

# 图标替换脚本
# 用法：将你的 128x128 图标保存为 new_icon.png，然后运行此脚本

ICONS_DIR="public/icons"
NEW_ICON="new_icon.png"

echo "🎨 QA sidePanel 图标替换脚本"
echo "================================"

# 检查 new_icon.png 是否存在
if [ ! -f "$NEW_ICON" ]; then
    echo "❌ 错误：找不到 $NEW_ICON"
    echo ""
    echo "请将你的 128x128 图标保存为 new_icon.png 到项目根目录"
    echo "然后重新运行此脚本"
    exit 1
fi

# 检查图标尺寸
echo "📏 检查图标尺寸..."
SIZE=$(sips -g pixelWidth -g pixelHeight "$NEW_ICON" 2>/dev/null | grep -E "pixelWidth|pixelHeight" | awk '{print $2}')
WIDTH=$(echo "$SIZE" | head -1)
HEIGHT=$(echo "$SIZE" | tail -1)

if [ "$WIDTH" != "128" ] || [ "$HEIGHT" != "128" ]; then
    echo "⚠️  警告：图标尺寸为 ${WIDTH}x${HEIGHT}，不是标准的 128x128"
    echo "继续处理，但可能需要调整尺寸..."
fi

echo "✅ 图标文件找到：${WIDTH}x${HEIGHT}"

# 创建图标目录（如果不存在）
mkdir -p "$ICONS_DIR"

# 复制并调整图标尺寸
echo ""
echo "🔄 生成各尺寸图标..."

# 128x128
echo "  生成 icon128.png (128x128)..."
if [ "$WIDTH" = "128" ] && [ "$HEIGHT" = "128" ]; then
    cp "$NEW_ICON" "$ICONS_DIR/icon128.png"
else
    sips -z 128 128 "$NEW_ICON" --out "$ICONS_DIR/icon128.png" > /dev/null 2>&1
fi

# 48x48
echo "  生成 icon48.png (48x48)..."
sips -z 48 48 "$NEW_ICON" --out "$ICONS_DIR/icon48.png" > /dev/null 2>&1

# 16x16
echo "  生成 icon16.png (16x16)..."
sips -z 16 16 "$NEW_ICON" --out "$ICONS_DIR/icon16.png" > /dev/null 2>&1

echo ""
echo "✅ 图标生成完成！"
echo ""
echo "📁 图标已保存到："
ls -lh "$ICONS_DIR"/*.png

echo ""
echo "🔨 现在重新构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "📋 下一步："
    echo "  1. 打开 Chrome 浏览器"
    echo "  2. 访问 chrome://extensions/"
    echo "  3. 点击扩展的刷新按钮"
    echo "  4. 查看新图标是否生效"
    echo ""
    echo "🎉 完成！"
else
    echo ""
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
