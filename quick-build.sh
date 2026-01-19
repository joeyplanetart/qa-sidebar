#!/bin/bash

# 快速构建脚本（简化版）
# 只执行构建，不安装依赖

set -e

# 颜色
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

BRANCH=$(git branch --show-current)

echo ""
echo -e "${CYAN}🚀 快速构建 - 分支: ${BRANCH}${NC}"
echo ""

npm run build

echo ""
echo -e "${GREEN}✅ 构建完成！${NC}"
echo ""
