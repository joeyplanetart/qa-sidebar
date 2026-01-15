import { useState, useEffect, useMemo } from 'react';
import { X, Variable } from 'lucide-react';
import Editor from 'react-simple-code-editor';
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
import type { ContentType, ContentItem } from '../../types';
import { getContentById, createContent, updateContent, getContents } from '../../services/supabase';
import { getFromLocalStorage, saveToLocalStorage } from '../../services/storage';
import TagInput from '../TagInput/TagInput';
import { useTheme } from '../../contexts/ThemeContext';
import { extractVariables } from '../../utils/variables';

interface EditorModalProps {
  contentId: string | null;
  userId: string | undefined;
  onClose: () => void;
  onSave: () => void;
  showAlert: (message: string, title?: string) => Promise<boolean>;
}

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Shell/Bash' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: '纯文本' },
];

export default function EditorModal({ contentId, userId, onClose, onSave, showAlert }: EditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ContentType>('code');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!contentId);
  const { resolvedTheme } = useTheme();

  // 提取变量占位符
  const variables = useMemo(() => extractVariables(content), [content]);

  useEffect(() => {
    if (contentId) {
      loadContent();
    }
    loadTagSuggestions();
  }, [contentId]);

  // 加载历史标签作为建议
  const loadTagSuggestions = async () => {
    try {
      let allContents: ContentItem[] = [];
      
      if (userId) {
        // 从 Supabase 加载所有内容
        allContents = await getContents(userId);
      } else {
        // 从本地存储加载
        allContents = await getFromLocalStorage();
      }
      
      // 提取所有标签并去重
      const allTags = new Set<string>();
      allContents.forEach(item => {
        if (item.tags) {
          item.tags.forEach(tag => allTags.add(tag));
        }
      });
      
      setTagSuggestions(Array.from(allTags).sort());
    } catch (error) {
      console.error('加载标签建议失败:', error);
    }
  };

  const loadContent = async () => {
    if (!contentId) return;
    
    try {
      if (userId) {
        // 从 Supabase 加载
        const data = await getContentById(contentId);
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setType(data.type);
          setLanguage(data.language || 'javascript');
          setTags(data.tags || []);
        }
      } else {
        // 从本地存储加载
        const localData = await getFromLocalStorage();
        const item = localData.find((item) => item.id === contentId);
        if (item) {
          setTitle(item.title);
          setContent(item.content);
          setType(item.type);
          setLanguage(item.language || 'javascript');
          setTags(item.tags || []);
        }
      }
    } catch (error) {
      console.error('加载内容失败:', error);
      await showAlert('加载内容失败', '错误');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      await showAlert('请输入标题', '提示');
      return;
    }
    if (!content.trim()) {
      await showAlert('请输入内容', '提示');
      return;
    }

    setLoading(true);
    try {
      if (userId) {
        // 保存到 Supabase
        if (contentId) {
          // 更新
          await updateContent(contentId, {
            title: title.trim(),
            content: content.trim(),
            type,
            language: type === 'text' ? undefined : language,
            tags: tags.length > 0 ? tags : undefined,
            variables: variables.length > 0 ? variables : undefined,
            updatedAt: Date.now(),
          });
        } else {
          // 创建
          await createContent({
            userId,
            title: title.trim(),
            content: content.trim(),
            type,
            language: type === 'text' ? undefined : language,
            tags: tags.length > 0 ? tags : undefined,
            variables: variables.length > 0 ? variables : undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      } else {
        // 保存到本地存储
        const localData = await getFromLocalStorage();
        if (contentId) {
          // 更新
          const updatedData = localData.map((item) =>
            item.id === contentId
              ? {
                  ...item,
                  title: title.trim(),
                  content: content.trim(),
                  type,
                  language: type === 'text' ? undefined : language,
                  tags: tags.length > 0 ? tags : undefined,
                  variables: variables.length > 0 ? variables : undefined,
                  updatedAt: Date.now(),
                }
              : item
          );
          await saveToLocalStorage(updatedData);
        } else {
          // 创建
          const newItem: ContentItem = {
            id: `local_${Date.now()}`,
            userId: 'local',
            title: title.trim(),
            content: content.trim(),
            type,
            language: type === 'text' ? undefined : language,
            tags: tags.length > 0 ? tags : undefined,
            variables: variables.length > 0 ? variables : undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await saveToLocalStorage([...localData, newItem]);
        }
      }
      // 保存成功，调用 onSave 回调来刷新列表并关闭编辑器
      onSave();
    } catch (error) {
      console.error('保存失败:', error);
      await showAlert('保存失败，请重试', '错误');
    } finally {
      setLoading(false);
    }
  };

  // 根据语言类型获取 Prism 语言对象
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
      plaintext: languages.plaintext,
    };
    return languageMap[lang] || languages.plaintext;
  };

  // 代码高亮函数
  const highlightCode = (code: string) => {
    try {
      return highlight(code, getPrismLanguage(language), language);
    } catch (e) {
      return code;
    }
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="text-gray-600 dark:text-gray-300">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {contentId ? '编辑内容' : '新建内容'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入标题"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 标签输入 */}
          <TagInput
            tags={tags}
            onChange={setTags}
            suggestions={tagSuggestions}
            placeholder="添加标签（按 Enter 添加）"
          />

          {/* 语言选择（自动推断类型） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              语言
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                (类型将自动设置)
              </span>
            </label>
            <select
              value={language}
              onChange={(e) => {
                const newLanguage = e.target.value;
                setLanguage(newLanguage);
                // 根据语言自动推断类型
                if (newLanguage === 'sql') {
                  setType('sql');
                } else if (newLanguage === 'plaintext') {
                  setType('text');
                } else {
                  setType('code');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-500 transition-colors"
            >
              {languageOptions.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* 编辑器 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                内容
                {type !== 'text' && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({languageOptions.find(l => l.value === language)?.label})
                  </span>
                )}
              </label>
              {variables.length > 0 && (
                <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Variable size={14} />
                  检测到 {variables.length} 个变量
                </span>
              )}
            </div>
            {type === 'text' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入文本内容"
                className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-500 resize-none font-mono text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                style={{
                  tabSize: 2,
                  lineHeight: '1.6',
                }}
              />
            ) : (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <Editor
                  value={content}
                  onValueChange={setContent}
                  highlight={highlightCode}
                  padding={12}
                  placeholder="请输入代码内容..."
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                    fontSize: 14,
                    lineHeight: 1.6,
                    minHeight: '384px',
                    maxHeight: '384px',
                    overflowY: 'auto',
                    backgroundColor: resolvedTheme === 'dark' ? '#1e1e1e' : '#2d2d2d',
                    color: resolvedTheme === 'dark' ? '#d4d4d4' : '#ccc',
                  }}
                  textareaClassName="focus:outline-none"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 提示：按 Tab 键插入缩进，支持语法高亮
              {variables.length > 0 && (
                <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                  · 包含变量: {variables.map(v => `\${${v}}`).join(', ')}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-primary dark:bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
