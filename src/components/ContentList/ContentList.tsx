import { FileText, Code, Database, Edit, Trash2 } from 'lucide-react';
import type { ContentItem } from '../../types';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import { useEffect } from 'react';

interface ContentListProps {
  contents: ContentItem[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeIcons = {
  text: FileText,
  code: Code,
  sql: Database,
};

export default function ContentList({ contents, loading, onEdit, onDelete }: ContentListProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [contents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FileText size={48} className="mb-4 opacity-50" />
        <p>暂无内容</p>
        <p className="text-sm mt-1">点击"新建"按钮添加第一个内容</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contents.map((item) => {
        const Icon = typeIcons[item.type];
        const previewContent = item.content.slice(0, 200);
        const language = item.language || (item.type === 'sql' ? 'sql' : 'text');

        return (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon size={18} className="text-primary" />
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(item.id)}
                  className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                  title="编辑"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="删除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {item.type === 'text' ? (
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {previewContent}
                {item.content.length > 200 && '...'}
              </div>
            ) : (
              <pre className="text-sm bg-gray-900 rounded overflow-x-auto">
                <code className={`language-${language}`}>
                  {previewContent}
                  {item.content.length > 200 && '\n...'}
                </code>
              </pre>
            )}

            <div className="mt-3 text-xs text-gray-500">
              创建于 {new Date(item.createdAt).toLocaleString('zh-CN')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
