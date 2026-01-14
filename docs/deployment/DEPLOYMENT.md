# 部署和测试指南

## 开发环境测试

### 1. 准备工作

确保已完成以下步骤：
- ✅ 已安装所有依赖 (`npm install`)
- ✅ 已配置 Firebase（参考 `FIREBASE_SETUP.md`）
- ✅ 已创建 `.env` 文件并填入 Firebase 配置

### 2. 构建扩展

\`\`\`bash
npm run build
\`\`\`

构建完成后，会在 `dist` 目录生成扩展文件。

### 3. 在 Chrome 中加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录
6. 扩展加载成功！

### 4. 打开 Side Panel

方式一：点击扩展图标
- 在浏览器工具栏找到扩展图标
- 点击图标打开 Side Panel

方式二：通过 Chrome 菜单
- 点击 Chrome 右上角的三个点
- 选择"更多工具" > "扩展程序"
- 找到"内容管理器"并点击

### 5. 测试功能

#### 测试登录
1. 打开 Side Panel
2. 点击"使用 Google 账号登录"
3. 选择 Google 账号完成登录
4. 应该看到用户信息显示在顶部

#### 测试创建内容
1. 点击右上角"新建"按钮
2. 输入标题：`测试代码片段`
3. 选择类型：`代码`
4. 选择语言：`JavaScript`
5. 输入代码：
\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`
6. 点击"保存"
7. 应该看到新内容出现在列表中，并带有语法高亮

#### 测试搜索功能
1. 在搜索框输入"测试"
2. 应该只显示包含"测试"的内容
3. 清空搜索框，所有内容应重新显示

#### 测试筛选功能
1. 点击"代码"标签
2. 应该只显示类型为"代码"的内容
3. 点击"全部"，应显示所有内容

#### 测试编辑功能
1. 点击内容卡片上的编辑图标
2. 修改标题或内容
3. 点击"保存"
4. 内容应更新

#### 测试删除功能
1. 点击内容卡片上的删除图标
2. 确认删除
3. 内容应从列表中移除

### 6. 开发模式热重载

如果需要开发模式的热重载：

\`\`\`bash
npm run dev
\`\`\`

然后：
1. 在 `chrome://extensions/` 中移除之前加载的扩展
2. 重新加载 `dist` 目录
3. 修改代码后，Vite 会自动重新构建
4. 点击扩展页面的"刷新"按钮重新加载扩展

## 生产环境部署

### 1. 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 2. 测试生产构建

在 Chrome 中加载 `dist` 目录，进行完整功能测试。

### 3. 打包扩展

创建 `.zip` 文件用于发布：

\`\`\`bash
cd dist
zip -r ../qa-sider-extension.zip .
cd ..
\`\`\`

### 4. 发布到 Chrome Web Store

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. 如果是首次发布，需要支付一次性开发者注册费（$5 USD）
3. 点击"新增项"
4. 上传 `qa-sider-extension.zip`
5. 填写扩展信息：
   - 名称：内容管理器
   - 简短描述：保存并管理您的代码片段、SQL 语句和文本内容
   - 详细描述：（参考 README.md）
   - 类别：生产力工具
   - 语言：中文（简体）
6. 上传截图和图标（至少 640x400 或 1280x800）
7. 选择定价：免费
8. 选择可见性：公开/不公开/仅限列出
9. 提交审核

### 5. 审核时间

通常需要 1-3 个工作日。审核通过后，扩展将在 Chrome Web Store 上线。

## 常见问题排查

### 扩展无法加载

**症状**: 在 chrome://extensions/ 中显示错误

**解决方案**:
1. 检查 `manifest.json` 语法是否正确
2. 确保所有引用的文件都存在
3. 查看错误详情，根据提示修复

### Side Panel 无法打开

**症状**: 点击扩展图标没有反应

**解决方案**:
1. 确保 Chrome 版本 >= 114
2. 检查浏览器控制台是否有错误
3. 重新加载扩展

### 登录失败

**症状**: 点击登录后没有反应或报错

**解决方案**:
1. 检查 `.env` 文件配置是否正确
2. 确保 Firebase 项目已启用 Google Authentication
3. 检查浏览器控制台错误信息
4. 确认授权域名包含 `chromiumapp.org`

### 无法保存/读取数据

**症状**: 保存后内容不显示，或显示权限错误

**解决方案**:
1. 检查 Firestore 安全规则是否正确配置
2. 确保用户已登录
3. 检查浏览器控制台的网络请求
4. 在 Firebase 控制台查看 Firestore 日志

### Monaco Editor 加载慢

**症状**: 打开编辑器时需要等待较长时间

**解决方案**:
这是正常现象，Monaco Editor 体积较大。可以考虑：
1. 使用 CDN 加载
2. 切换到更轻量的编辑器（如 CodeMirror）
3. 实现按需加载

### 扩展体积过大

**症状**: 构建后 bundle 大小超过 500KB

**当前状态**: 
- Monaco Editor 是主要的体积来源
- 已优化代码分割

**改进方案**:
1. 使用动态 import 按需加载 Monaco Editor
2. 考虑使用 CDN
3. 移除不需要的语言支持

## 性能优化建议

### 1. 代码分割
使用动态 import 延迟加载非关键组件：

\`\`\`typescript
const EditorModal = lazy(() => import('./components/Editor/EditorModal'));
\`\`\`

### 2. 虚拟列表
如果内容数量很多，考虑使用虚拟滚动：

\`\`\`bash
npm install react-window
\`\`\`

### 3. 缓存优化
实现本地缓存减少 Firestore 请求：

\`\`\`typescript
// 使用 React Query 或 SWR
npm install @tanstack/react-query
\`\`\`

### 4. Service Worker 缓存
利用 Chrome Extension Service Worker 缓存静态资源。

## 监控和分析

### 1. 错误追踪
集成 Sentry 进行错误监控：

\`\`\`bash
npm install @sentry/react
\`\`\`

### 2. 使用分析
在 Firebase 控制台查看：
- 认证用户数量
- Firestore 读写次数
- 性能指标

### 3. 用户反馈
在 Chrome Web Store 页面收集用户评价和反馈。

## 更新扩展

### 1. 更新版本号

在 `manifest.json` 中增加版本号：

\`\`\`json
{
  "version": "1.0.1"
}
\`\`\`

### 2. 重新构建和测试

\`\`\`bash
npm run build
\`\`\`

### 3. 上传新版本

在 Chrome Web Store Developer Dashboard 上传新的 zip 文件。

### 4. 提交审核

用户会在 1-2 天内自动收到更新。

## 备份和迁移

### 导出数据
用户数据存储在 Firestore 中，可以通过 Firebase 控制台导出。

### 迁移到新项目
1. 导出 Firestore 数据
2. 在新 Firebase 项目中导入
3. 更新 `.env` 配置
4. 重新构建和部署

## 支持和维护

### 文档
- README.md - 项目概览和快速开始
- FIREBASE_SETUP.md - Firebase 配置详解
- DEPLOYMENT.md - 本文件

### 联系方式
在 GitHub 项目页面创建 Issue 报告问题和建议。

## 许可证

MIT License - 详见 LICENSE 文件
