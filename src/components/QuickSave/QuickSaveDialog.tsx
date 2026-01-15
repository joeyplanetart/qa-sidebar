import { useState, useEffect, useMemo } from 'react';
import { X, Save } from 'lucide-react';
import TagInput from '../TagInput/TagInput';
import Editor from 'react-simple-code-editor';
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
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
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
  { value: 'bash', label: 'Shell/Bash', type: 'code' as ContentType },
  { value: 'html', label: 'HTML', type: 'code' as ContentType },
  { value: 'css', label: 'CSS', type: 'code' as ContentType },
  { value: 'json', label: 'JSON', type: 'code' as ContentType },
  { value: 'yaml', label: 'YAML', type: 'code' as ContentType },
  { value: 'markdown', label: 'Markdown', type: 'code' as ContentType },
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
      bash: languages.bash,
      html: languages.markup,
      css: languages.css,
      json: languages.json,
      yaml: languages.yaml,
      markdown: languages.markdown,
    };
    return languageMap[lang] || null;
  };

  // 代码高亮函数（用于 Editor 组件）
  const highlightCode = (code: string) => {
    if (language === 'plaintext' || !code) {
      return code;
    }

    const prismLang = getPrismLanguage(language);
    if (!prismLang) {
      return code;
    }

    try {
      return highlight(code, prismLang, language);
    } catch (e) {
      console.error('Syntax highlighting error:', e);
      return code;
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

  const normalizeTextContent = (text: string) =>
    text.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ');

  const detectLanguage = (text: string): string => {
    const trimmedText = text.trim();
    
    // Shell/Bash 检测
    const bashKeywords = /^(#!\/|source\s|export\s|alias\s|echo\s|cd\s|ls\s|mkdir\s|rm\s|cp\s|mv\s|chmod\s|chown\s|sudo\s|apt\s|yum\s|brew\s|npm\s|yarn\s|pip\s|curl\s|wget\s)/i;
    if (/^#!\s*\/.*\/(ba)?sh/i.test(trimmedText) || bashKeywords.test(trimmedText)) {
      return 'bash';
    }
    // SQL 检测
    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/i.test(trimmedText)) {
      return 'sql';
    }
    // JavaScript/TypeScript 检测
    if (/^(function|const|let|var|class|import|export)\s/i.test(trimmedText)) {
      return 'javascript';
    }
    // Python 检测
    if (/^(def\s|import\s|from\s.*import|class\s|if\s__name__|print\()/i.test(trimmedText)) {
      return 'python';
    }
    // HTML 检测
    if (/^(<!DOCTYPE|<html|<div|<span|<head|<body)/i.test(trimmedText)) {
      return 'html';
    }
    // YAML 检测
    if (/^[a-zA-Z_][a-zA-Z0-9_]*:\s*$/m.test(trimmedText) || /^---\s*$/m.test(trimmedText)) {
      return 'yaml';
    }
    // Markdown 检测
    if (/^#{1,6}\s|^\*\*|^-\s\[|^\d+\.\s/m.test(trimmedText)) {
      return 'markdown';
    }
    // JSON 检测
    if (/^(\{|\[)/.test(trimmedText)) {
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
            </div>

            {language === 'plaintext' ? (
              /* 纯文本模式 */
              sanitizedFormattedHtml ? (
                <div 
                  className="w-full h-48 overflow-auto border border-gray-300 rounded-lg bg-white"
                >
                  <div 
                    className="quick-save-rich-preview px-3 py-2 min-h-full" 
                    dangerouslySetInnerHTML={{ __html: sanitizedFormattedHtml }} 
                  />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm bg-gray-50"
                  spellCheck={false}
                  style={{
                    tabSize: 2,
                    lineHeight: '1.5',
                  }}
                />
              )
            ) : (
              /* 代码模式 - 带语法高亮的编辑器 */
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Editor
                  value={content}
                  onValueChange={setContent}
                  highlight={highlightCode}
                  padding={12}
                  placeholder="请输入代码内容..."
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                    fontSize: 13,
                    lineHeight: 1.5,
                    minHeight: '192px',
                    maxHeight: '192px',
                    overflowY: 'auto',
                    backgroundColor: '#2d2d2d',
                    color: '#ccc',
                  }}
                  textareaClassName="focus:outline-none"
                />
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
