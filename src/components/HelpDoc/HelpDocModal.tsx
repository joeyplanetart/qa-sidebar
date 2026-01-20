import { X } from 'lucide-react';

interface HelpDocModalProps {
  onClose: () => void;
}

export default function HelpDocModal({ onClose }: HelpDocModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            帮助文档
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose dark:prose-invert max-w-none">
            {/* 核心功能介绍 */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                ✨ 核心功能
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">📝 多类型支持</span>
                  <span>保存代码片段、SQL 语句和纯文本，满足不同场景需求</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">⚡ 快速插入</span>
                  <span>右键菜单/快捷键快速保存和插入片段，提升工作效率</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">🎨 专业编辑器</span>
                  <span>Monaco Editor 集成，提供 IDE 级别的编辑体验</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">🔍 智能搜索</span>
                  <span>实时模糊搜索，快速定位所需内容</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">📌 置顶功能</span>
                  <span>常用内容置顶，一键访问高频片段</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">🏷️ 标签系统</span>
                  <span>多标签支持、智能建议、标签云筛选，轻松管理内容</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">☁️ 云端同步</span>
                  <span>基于 Supabase 后端，数据自动同步到云端</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold min-w-[120px]">💾 本地模式</span>
                  <span>支持匿名使用，数据保存在浏览器本地</span>
                </div>
              </div>
            </section>

            {/* 快捷键说明 */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                ⌨️ 快捷键
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span>保存选中文本</span>
                  <kbd className="px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                    Alt+Shift+S (Mac: Cmd+Shift+D)
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span>插入片段</span>
                  <kbd className="px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                    Ctrl+Shift+V (Mac: Cmd+Shift+V)
                  </kbd>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                💡 提示：如果快捷键冲突，可在 chrome://extensions/shortcuts 中自定义
              </p>
            </section>

            {/* 使用技巧 */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                💡 使用技巧
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-semibold mb-2">标签管理</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>每个内容最多支持 3 个标签</li>
                    <li>输入时会显示历史标签建议</li>
                    <li>可以选择多个标签进行筛选（OR 逻辑）</li>
                    <li>点击"清除全部"快速重置筛选条件</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">快速插入</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>在任何网页选中文本后右键保存</li>
                    <li>自动检测代码语言类型</li>
                    <li>支持在任何输入框中快速插入片段</li>
                    <li>插入时会自动增加使用计数</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">批量操作</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>点击"批量操作"进入批量模式</li>
                    <li>选择多个内容后可批量删除</li>
                    <li>支持全选/取消全选功能</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 版本信息 */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                版本信息
              </h3>
              <div className="text-gray-700 dark:text-gray-300 space-y-2">
                <p>当前版本: v1.0.0</p>
                <p>技术栈: React 18 + TypeScript + TailwindCSS + Supabase</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Made with ❤️ for developers
                  Email: joeyz@planetart.com
                  <a href="https://github.com/joeyplanetart/qa-sidebar" target="_blank" rel="noopener noreferrer"></a>
                  
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
