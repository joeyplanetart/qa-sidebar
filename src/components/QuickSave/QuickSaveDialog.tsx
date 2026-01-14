import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import TagInput from '../TagInput/TagInput';
import type { ContentType } from '../../types';

interface QuickSaveDialogProps {
  initialContent: string;
  onSave: (data: {
    title: string;
    content: string;
    type: ContentType;
    language?: string;
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
  onSave,
  onClose,
  tagSuggestions = [],
}: QuickSaveDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState('plaintext');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // 自动检测语言类型
  useEffect(() => {
    const detectedLang = detectLanguage(initialContent);
    setLanguage(detectedLang);
  }, [initialContent]);

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              内容预览
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
              readOnly={false}
            />
            <p className="mt-1 text-xs text-gray-500">
              {content.length} 字符
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
