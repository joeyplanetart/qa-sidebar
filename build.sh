#!/bin/bash

# QA Sider 智能构建脚本
# 自动检测分支并执行相应的构建

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前目录不是 Git 仓库"
    exit 1
fi

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)

if [ -z "$CURRENT_BRANCH" ]; then
    print_error "无法获取当前分支信息"
    exit 1
fi

print_header "QA Sider 智能构建"
print_info "当前分支: ${CYAN}${CURRENT_BRANCH}${NC}"
echo ""

# 根据分支判断构建类型
case "$CURRENT_BRANCH" in
    "main")
        print_info "检测到 Chrome 插件分支"
        BUILD_TYPE="Chrome Extension"
        BUILD_DESC="Chrome 浏览器插件版本"
        OUTPUT_DIR="dist"
        ;;
    "web_version")
        print_info "检测到 Web 应用分支"
        BUILD_TYPE="Web Application"
        BUILD_DESC="独立 Web 应用版本（可部署到 Vercel）"
        OUTPUT_DIR="dist"
        ;;
    *)
        print_warning "未识别的分支: ${CURRENT_BRANCH}"
        print_info "将使用默认构建配置"
        BUILD_TYPE="Default"
        BUILD_DESC="默认构建"
        OUTPUT_DIR="dist"
        ;;
esac

echo ""
print_info "构建类型: ${GREEN}${BUILD_TYPE}${NC}"
print_info "描述: ${BUILD_DESC}"
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    print_warning "node_modules 不存在，需要安装依赖"
    NEED_INSTALL=true
else
    # 检查关键依赖是否存在
    if [ "$CURRENT_BRANCH" = "main" ]; then
        if [ ! -d "node_modules/@crxjs" ]; then
            print_warning "Chrome 插件依赖缺失，需要重新安装"
            NEED_INSTALL=true
        fi
    fi
fi

# 安装依赖（如果需要）
if [ "$NEED_INSTALL" = true ]; then
    print_header "安装依赖"
    print_info "正在执行: npm install"
    
    if npm install; then
        print_success "依赖安装完成"
        echo ""
    else
        print_error "依赖安装失败"
        exit 1
    fi
fi

# 清理旧的构建文件
if [ -d "$OUTPUT_DIR" ]; then
    print_info "清理旧的构建文件..."
    rm -rf "$OUTPUT_DIR"
    print_success "清理完成"
    echo ""
fi

# 执行构建
print_header "开始构建"
print_info "正在执行: npm run build"
echo ""

if npm run build; then
    echo ""
    print_success "构建成功！ 🎉"
    echo ""
    
    # 显示构建结果
    print_header "构建结果"
    
    if [ -d "$OUTPUT_DIR" ]; then
        # 计算构建产物大小
        BUILD_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
        print_info "输出目录: ${CYAN}${OUTPUT_DIR}/${NC}"
        print_info "构建大小: ${CYAN}${BUILD_SIZE}${NC}"
        echo ""
        
        # 列出主要文件
        print_info "主要文件:"
        if [ "$CURRENT_BRANCH" = "main" ]; then
            # Chrome 插件
            ls -lh "$OUTPUT_DIR" | grep -E "(manifest.json|index.html|service-worker)" | awk '{print "  📄 " $9 " (" $5 ")"}'
        else
            # Web 应用
            ls -lh "$OUTPUT_DIR" | grep -E "(index.html|favicon)" | awk '{print "  📄 " $9 " (" $5 ")"}'
        fi
        echo ""
        
        # 根据分支显示下一步操作
        print_header "下一步操作"
        if [ "$CURRENT_BRANCH" = "main" ]; then
            echo ""
            print_info "Chrome 插件已构建完成，你可以："
            echo ""
            echo "  1️⃣  在 Chrome 中加载扩展:"
            echo "     • 打开 chrome://extensions/"
            echo "     • 开启 '开发者模式'"
            echo "     • 点击 '加载已解压的扩展程序'"
            echo "     • 选择 ${CYAN}${OUTPUT_DIR}${NC} 目录"
            echo ""
            echo "  2️⃣  打包发布:"
            echo "     • zip -r qa_sider.zip ${OUTPUT_DIR}/"
            echo "     • 上传到 Chrome Web Store"
            echo ""
        elif [ "$CURRENT_BRANCH" = "web_version" ]; then
            echo ""
            print_info "Web 应用已构建完成，你可以："
            echo ""
            echo "  1️⃣  本地预览:"
            echo "     • npm run preview"
            echo "     • 访问 http://localhost:4173"
            echo ""
            echo "  2️⃣  部署到 Vercel:"
            echo "     • vercel --prod"
            echo "     • 或推送到 GitHub 自动部署"
            echo ""
            echo "  3️⃣  部署到其他平台:"
            echo "     • Netlify: netlify deploy --prod"
            echo "     • GitHub Pages: 直接上传 ${OUTPUT_DIR} 目录"
            echo ""
        fi
    else
        print_warning "未找到构建输出目录: ${OUTPUT_DIR}"
    fi
    
    exit 0
else
    echo ""
    print_error "构建失败 😞"
    echo ""
    print_info "常见问题排查:"
    echo "  1. 检查 TypeScript 错误"
    echo "  2. 确保依赖已正确安装: npm install"
    echo "  3. 查看上方的错误信息"
    echo ""
    exit 1
fi
