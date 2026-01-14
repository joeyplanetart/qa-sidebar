import { useState, useMemo } from 'react';
import { X, Search, Send, FileText, Code, Database, Tag } from 'lucide-react';
import type { ContentItem } from '../../types';

interface QuickInsertDialogProps {
  contents: ContentItem[];
  onInsert: (content: string) => void;
  onClose: () => void;
}

const typeIcons = {
  text: FileText,
  code: Code,
  sql: Database,
};

export default function QuickInsertDialog({
  contents,
  onInsert,
  onClose,
}: QuickInsertDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 过滤内容
  const filteredContents = useMemo(() => {
    if (!searchQuery) return contents;
    
    const query = searchQuery.toLowerCase();
    return contents.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [contents, searchQuery]);

  const selectedContent = useMemo(() => {
    return filteredContents.find((item) => item.id === selectedId);
  }, [filteredContents, selectedId]);

  const handleInsert = () => {
    if (selectedContent) {
      onInsert(selectedContent.content);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedContent) {
      e.preventDefault();
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Send size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">选择要插入的片段</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索标题、内容或标签..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧列表 */}
          <div className="w-1/2 border-r overflow-y-auto">
            {filteredContents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchQuery ? '没有找到匹配的片段' : '还没有保存任何片段'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredContents.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedId === item.id ? 'bg-blue-50 border-l-4 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className="text-primary flex-shrink-0" />
                        <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 右侧预览 */}
          <div className="w-1/2 overflow-y-auto">
            {selectedContent ? (
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{selectedContent.title}</h3>
                {selectedContent.tags && selectedContent.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {selectedContent.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono">
                    {selectedContent.content}
                  </pre>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  {selectedContent.content.length} 字符
                </p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p>选择一个片段查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            {filteredContents.length} 个片段
            {selectedContent && ' · 按 Enter 插入'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleInsert}
              disabled={!selectedContent}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={16} />
              插入到页面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
