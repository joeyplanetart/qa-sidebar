import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type { ContentType, ContentItem } from '../../types';
import { getContentById, createContent, updateContent } from '../../services/supabase';
import { getFromLocalStorage, saveToLocalStorage } from '../../services/storage';

interface EditorModalProps {
  contentId: string | null;
  userId: string | undefined;
  onClose: () => void;
}

const contentTypes: Array<{ value: ContentType; label: string }> = [
  { value: 'code', label: '代码' },
  { value: 'sql', label: 'SQL' },
  { value: 'text', label: '文本' },
];

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'plaintext', label: '纯文本' },
];

export default function EditorModal({ contentId, userId, onClose }: EditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ContentType>('code');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!contentId);
  const [editorMounted, setEditorMounted] = useState(false);
  const [editorError, setEditorError] = useState(false);

  useEffect(() => {
    if (contentId) {
      loadContent();
    }
  }, [contentId]);

  // 重置编辑器加载状态当类型改变时
  useEffect(() => {
    setEditorMounted(false);
    setEditorError(false);
  }, [type]);

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
        }
      }
    } catch (error) {
      console.error('加载内容失败:', error);
      alert('加载内容失败');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }
    if (!content.trim()) {
      alert('请输入内容');
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
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await saveToLocalStorage([...localData, newItem]);
        }
      }
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {contentId ? '编辑内容' : '新建内容'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入标题"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 类型选择 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                类型
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {contentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {type !== 'text' && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  语言
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
            )}
          </div>

          {/* 编辑器 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容
            </label>
            <div className="relative border border-gray-300 rounded-lg overflow-hidden">
              {type === 'text' || editorError ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={type === 'text' ? '请输入文本内容' : '请输入代码内容'}
                  className="w-full h-96 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
                />
              ) : (
                <div className="relative">
                  {!editorMounted && (
                    <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-50">
                      <div className="text-gray-500 mb-4">编辑器加载中...</div>
                      <button
                        onClick={() => setEditorError(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        加载时间过长？点击切换到简单编辑器
                      </button>
                    </div>
                  )}
                  <div style={{ display: editorMounted ? 'block' : 'none' }}>
                    <Editor
                      height="400px"
                      language={language}
                      value={content}
                      onChange={(value) => setContent(value || '')}
                      theme="vs-dark"
                      onMount={() => {
                        setEditorMounted(true);
                        setEditorError(false);
                      }}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            {editorError && (
              <p className="text-xs text-gray-500 mt-1">
                💡 代码编辑器加载失败，已切换到文本模式
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
