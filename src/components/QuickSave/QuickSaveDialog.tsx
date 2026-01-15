import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Save, Wand2 } from 'lucide-react';
import TagInput from '../TagInput/TagInput';
import type { ContentType } from '../../types';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

interface QuickSaveDialogProps {
  initialContent: string;
  initialFormattedHtml?: string;
  onSave: (data: {
    title: string;
    content: string;
    type: ContentType;
    language?: string;
    formattedHtml?: string;
    tags?: string[];
  }) => void;
  onClose: () => void;
  tagSuggestions?: string[];
}

const languageOptions = [
  { value: 'javascript', label: 'JavaScript', type: 'code' as ContentType },
  { value: 'typescript', label: 'TypeScript', type: 'code' as ContentType },
  { value: 'python', label: 'Python', type: 'code' as ContentType },
  { value: 'java', label: 'Java', type: 'code' as ContentType },
  { value: 'sql', label: 'SQL', type: 'sql' as ContentType },
  { value: 'html', label: 'HTML', type: 'code' as ContentType },
  { value: 'css', label: 'CSS', type: 'code' as ContentType },
  { value: 'json', label: 'JSON', type: 'code' as ContentType },
  { value: 'plaintext', label: '纯文本', type: 'text' as ContentType },
];

export default function QuickSaveDialog({
  initialContent,
  initialFormattedHtml,
  onSave,
  onClose,
  tagSuggestions = [],
}: QuickSaveDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState('plaintext');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const previewRef = useRef<HTMLPreElement>(null);
  const sanitizedFormattedHtml = useMemo(
    () => sanitizeHtml(initialFormattedHtml || ''),
    [initialFormattedHtml]
  );

  // 自动检测语言类型
  useEffect(() => {
    const normalizedContent = normalizeTextContent(initialContent);
    const detectedLang = detectLanguage(normalizedContent);
    setLanguage(detectedLang);
    if (detectedLang !== 'plaintext' && normalizedContent.trim()) {
      setContent(formatCodeValue(normalizedContent));
    } else {
      setContent(normalizedContent);
    }
  }, [initialContent]);

  // 获取 Prism 语言对象
  const getPrismLanguage = (lang: string) => {
    const languageMap: Record<string, any> = {
      javascript: languages.javascript,
      typescript: languages.typescript,
      python: languages.python,
      java: languages.java,
      sql: languages.sql,
      html: languages.markup,
      css: languages.css,
      json: languages.json,
    };
    return languageMap[lang] || null;
  };

  // 生成高亮后的 HTML
  const getHighlightedCode = () => {
    if (language === 'plaintext' || !content) {
      return content;
    }

    const prismLang = getPrismLanguage(language);
    if (!prismLang) {
      return content;
    }

    try {
      return highlight(content, prismLang, language);
    } catch (e) {
      console.error('Syntax highlighting error:', e);
      return content;
    }
  };

  // 格式化代码
  const formatCodeValue = (raw: string) => {
    // 基本的代码格式化：统一缩进
    const lines = raw.split('\n');
    let indentLevel = 0;
    const indentSize = 2;

    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // 减少缩进：遇到闭合括号
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // 应用缩进
      const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmed;

      // 增加缩进：遇到开括号
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }
      // 处理同一行的闭合括号
      else if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        // 已经处理过了
      }

      return indentedLine;
    });

    return formatted.join('\n');
  };

  const formatCode = () => {
    try {
      setContent(formatCodeValue(content));
    } catch (error) {
      console.error('Format error:', error);
      alert('格式化失败，请手动调整');
    }
  };

  const normalizeTextContent = (text: string) =>
    text.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ');

  const detectLanguage = (text: string): string => {
    // 简单的语言检测逻辑
    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/i.test(text)) {
      return 'sql';
    }
    if (/^(function|const|let|var|class|import|export)\s/i.test(text)) {
      return 'javascript';
    }
    if (/^(def|import|from|class|if|for|while)\s/i.test(text)) {
      return 'python';
    }
    if (/^(<!DOCTYPE|<html|<div|<span)/i.test(text)) {
      return 'html';
    }
    if (/^(\{|\[)/.test(text.trim())) {
      return 'json';
    }
    return 'plaintext';
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    setSaving(true);
    try {
      const selectedLang = languageOptions.find(l => l.value === language);
      onSave({
        title: title.trim(),
        content: content.trim(),
        type: selectedLang?.type || 'text',
        language: selectedLang?.type === 'text' ? undefined : language,
        formattedHtml:
          language === 'plaintext' && sanitizedFormattedHtml
            ? sanitizedFormattedHtml
            : undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Save size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">快速保存片段</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给这个片段起个名字"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* 语言类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              语言类型
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {languageOptions.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* 标签 */}
          <TagInput
            tags={tags}
            onChange={setTags}
            suggestions={tagSuggestions}
            maxTags={3}
          />

          {/* 内容预览 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                内容预览
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={formatCode}
                  className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                  title="格式化代码（统一缩进）"
                >
                  <Wand2 size={12} />
                  格式化
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {isEditing ? '预览模式' : '编辑模式'}
                </button>
              </div>
            </div>

            {isEditing ? (
              /* 编辑模式 - 普通 textarea */
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm bg-white"
                spellCheck={false}
                style={{
                  tabSize: 2,
                  lineHeight: '1.5',
                }}
              />
            ) : (
              /* 预览模式 - 语法高亮 */
              <div
                className={`w-full h-48 overflow-auto border border-gray-300 rounded-lg ${
                  language === 'plaintext' ? 'bg-white' : 'bg-gray-900'
                }`}
              >
                {language === 'plaintext' ? (
                  sanitizedFormattedHtml ? (
                    <div className="quick-save-rich-preview px-3 py-2 bg-white min-h-full" dangerouslySetInnerHTML={{ __html: sanitizedFormattedHtml }} />
                  ) : (
                    <pre className="px-3 py-2 bg-gray-50 font-mono text-sm whitespace-pre m-0 min-h-full" style={{ lineHeight: '1.5' }}>
                      {content}
                    </pre>
                  )
                ) : (
                  <pre 
                    ref={previewRef}
                    className="m-0 p-3 min-h-full"
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre',
                      tabSize: 2,
                    }}
                  >
                    <code 
                      className={`language-${language}`}
                      style={{
                        whiteSpace: 'pre',
                        display: 'inline-block',
                        minWidth: '100%',
                      }}
                      dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
                    />
                  </pre>
                )}
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              {content.length} 字符 · {language === 'plaintext' ? '纯文本' : languageOptions.find(l => l.value === language)?.label}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
