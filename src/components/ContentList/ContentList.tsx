import { FileText, Code, Database, Edit, Trash2, Copy, Check, Pin, PinOff, Tag } from 'lucide-react';
import type { ContentItem } from '../../types';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import { useState, memo, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

interface ContentListProps {
  contents: ContentItem[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  showAlert: (message: string, title?: string) => Promise<boolean>;
}

const typeIcons = {
  text: FileText,
  code: Code,
  sql: Database,
};

const typeLabels = {
  text: '文本',
  code: '代码',
  sql: 'SQL',
};

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  sql: 'SQL',
  bash: 'Shell/Bash',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  plaintext: '纯文本',
};

// 单个内容项组件（使用 memo 优化重渲染）
const ContentItemRow = memo(
  ({
    item,
    copiedId,
    onCopy,
    onEdit,
    onDelete,
    onTogglePin,
  }: {
    item: ContentItem;
    copiedId: string | null;
    onCopy: (item: ContentItem) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
  }) => {
    const Icon = typeIcons[item.type];
    const previewContent = item.content.slice(0, 200);
    const sanitizedFormattedHtml = item.formattedHtml
      ? sanitizeHtml(item.formattedHtml)
      : '';
    const language = item.language || (item.type === 'sql' ? 'sql' : 'text');

    // 获取 Prism 语言对象
    const getPrismLanguage = (lang: string) => {
      const languageMap: Record<string, any> = {
        javascript: languages.javascript,
        typescript: languages.typescript,
        python: languages.python,
        java: languages.java,
        sql: languages.sql,
        bash: languages.bash,
        html: languages.markup,
        css: languages.css,
        json: languages.json,
        yaml: languages.yaml,
        markdown: languages.markdown,
      };
      return languageMap[lang] || null;
    };

    // 使用 useMemo 缓存高亮结果，避免每次渲染都重新高亮
    const highlightedCode = useMemo(() => {
      if (item.type === 'text') return null;
      
      const prismLang = getPrismLanguage(language);
      if (!prismLang) return null;

      try {
        return highlight(previewContent, prismLang, language);
      } catch (e) {
        console.error('Syntax highlighting error:', e);
        return null;
      }
    }, [previewContent, language, item.type]);

    return (
      <div className={`bg-white rounded-lg p-4 border ${item.isPinned ? 'border-yellow-400 shadow-md' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={18} className="text-primary" />
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              {item.isPinned && (
                <Pin size={14} className="text-yellow-600 fill-yellow-600" />
              )}
            </div>
            <div className="flex items-center gap-2 ml-6">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                {typeLabels[item.type]}
              </span>
              {item.language && item.type !== 'text' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {languageLabels[item.language] || item.language}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(item.id)}
              className={`p-1.5 rounded transition-colors ${
                item.isPinned
                  ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                  : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50'
              }`}
              title={item.isPinned ? '取消置顶' : '置顶'}
            >
              {item.isPinned ? <Pin size={16} className="fill-yellow-600" /> : <PinOff size={16} />}
            </button>
            <button
              onClick={() => onCopy(item)}
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="复制内容"
            >
              {copiedId === item.id ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
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
          sanitizedFormattedHtml ? (
            <div
              className="quick-save-rich-preview text-sm bg-white border border-gray-200 p-3 rounded max-h-32 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: sanitizedFormattedHtml }}
            />
          ) : (
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {previewContent}
              {item.content.length > 200 && '...'}
            </div>
          )
        ) : (
          <pre className="text-sm bg-gray-900 rounded overflow-x-auto p-3">
            {highlightedCode ? (
              <code 
                className={`language-${language}`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            ) : (
              <code className={`language-${language}`}>
                {previewContent}
              </code>
            )}
            {item.content.length > 200 && (
              <span className="text-gray-400">{'\n...'}</span>
            )}
          </pre>
        )}

        {/* 标签显示 */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 max-h-20 overflow-y-auto flex flex-wrap gap-1 content-start scrollbar-thin">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs flex-shrink-0"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          创建于 {new Date(item.createdAt).toLocaleString('zh-CN')}
        </div>
      </div>
    );
  }
);

ContentItemRow.displayName = 'ContentItemRow';

export default function ContentList({ contents, loading, onEdit, onDelete, onTogglePin, showAlert }: ContentListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (item: ContentItem) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      await showAlert('复制失败，请重试', '错误');
    }
  };

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
    <div style={{ height: 'calc(100vh - 280px)', width: '100%' }}>
      <Virtuoso
        data={contents}
        overscan={200}
        itemContent={(_index, item) => (
          <div style={{ paddingBottom: '12px' }}>
            <ContentItemRow
              item={item}
              copiedId={copiedId}
              onCopy={handleCopy}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          </div>
        )}
      />
    </div>
  );
}
