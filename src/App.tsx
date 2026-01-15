import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import FilterTabs from './components/FilterTabs/FilterTabs';
import TagFilter from './components/TagFilter/TagFilter';
import ContentList from './components/ContentList/ContentList';
import EditorModal from './components/Editor/EditorModal';
import AuthPanel from './components/Auth/AuthPanel';
import Dialog from './components/Dialog/Dialog';
import QuickSaveDialog from './components/QuickSave/QuickSaveDialog';
import QuickInsertDialog from './components/QuickInsert/QuickInsertDialog';
import StatisticsModal from './components/Statistics/StatisticsModal';
import { useAuth } from './hooks/useAuth';
import { useContents } from './hooks/useContents';
import { useDialog } from './hooks/useDialog';
import { getFromLocalStorage } from './services/storage';
import { createContent } from './services/supabase';
import { saveToLocalStorage } from './services/storage';
import type { ContentType, ContentItem } from './types';

// 启动日志 - 帮助确认代码已加载
console.log('🎯 QA sidePanel 应用已加载');
console.log('📍 当前位置:', location.href);
console.log('🔧 Chrome API 可用:', typeof chrome !== 'undefined');
console.log('🔑 Chrome Identity 可用:', typeof chrome?.identity !== 'undefined');

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ContentType>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [quickSaveContent, setQuickSaveContent] = useState<{
    content: string;
    formattedHtml?: string;
  } | null>(null);
  const [showInsertDialog, setShowInsertDialog] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  
  const dialog = useDialog();
  
  const { user, loading: authLoading } = useAuth();
  // 使用本地模式时传入 undefined，使用 Supabase 时传入用户 ID
  const { contents, loading: contentsLoading, deleteContent, togglePin, refresh, incrementUseCount } = useContents(
    useLocalMode ? undefined : user?.uid
  );

  // 初始化：检查是否应该自动进入本地模式
  useEffect(() => {
    const initializeMode = async () => {
      // 如果用户已登录，不需要检查本地模式
      if (user) {
        setUseLocalMode(false);
        setShowAuthPanel(false);
        return;
      }

      // 检查是否之前选择了本地模式
      const savedMode = localStorage.getItem('qa_sider_use_local_mode');
      if (savedMode === 'true') {
        setUseLocalMode(true);
        setShowAuthPanel(false);
        return;
      }

      // 检查本地存储是否有数据
      try {
        const localData = await getFromLocalStorage();
        if (localData && localData.length > 0) {
          // 有本地数据，自动进入本地模式
          setUseLocalMode(true);
          setShowAuthPanel(false);
          // 保存选择
          localStorage.setItem('qa_sider_use_local_mode', 'true');
        } else {
          // 没有数据，显示登录选择页
          setShowAuthPanel(true);
        }
      } catch (error) {
        console.error('检查本地数据失败:', error);
        setShowAuthPanel(true);
      }
    };

    if (!authLoading) {
      initializeMode();
    }
  }, [user, authLoading]);

  // 监听来自 background 的消息
  useEffect(() => {
    const handleMessage = (message: {
      type?: string;
      data?: { content?: string; formattedHtml?: string; sourceUrl?: string; tabId?: number };
    }) => {
      console.log('App received message:', message);

      if (message.type === 'QUICK_SAVE' && message.data?.content) {
        // 显示快速保存对话框
        setQuickSaveContent({
          content: message.data.content,
          formattedHtml: message.data.formattedHtml,
        });
      } else if (message.type === 'SHOW_INSERT_MODE') {
        // 显示插入片段对话框
        setShowInsertDialog(true);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // 提取所有可用标签
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    contents.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [contents]);

  // 创建搜索索引（缓存小写版本以优化性能）
  const searchIndex = useMemo(() => {
    return contents.map((item) => ({
      id: item.id,
      titleLower: item.title.toLowerCase(),
      contentLower: item.content.toLowerCase(),
    }));
  }, [contents]);

  // 过滤并排序内容（使用 useMemo 缓存结果）
  const filteredContents = useMemo(() => {
    let filtered = contents;

    // 类型过滤
    if (activeFilter !== 'all') {
      filtered = filtered.filter((item) => item.type === activeFilter);
    }

    // 标签过滤（OR 逻辑）
    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) => {
        if (!item.tags || item.tags.length === 0) return false;
        // 内容只要包含任一选中的标签即可
        return selectedTags.some(tag => item.tags!.includes(tag));
      });
    }

    // 搜索过滤（使用索引优化）
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchingIds = new Set(
        searchIndex
          .filter(
            (index) =>
              index.titleLower.includes(query) ||
              index.contentLower.includes(query)
          )
          .map((index) => index.id)
      );
      filtered = filtered.filter((item) => matchingIds.has(item.id));
    }

    // 排序：置顶的在前面，然后按创建时间降序
    return filtered.sort((a, b) => {
      // 如果一个置顶一个不置顶，置顶的在前
      const aPinned = a.isPinned ?? false;
      const bPinned = b.isPinned ?? false;
      
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      
      // 都置顶或都不置顶，按创建时间降序
      return b.createdAt - a.createdAt;
    });
  }, [contents, activeFilter, selectedTags, searchQuery, searchIndex]);

  const handleNewContent = () => {
    setEditingContent(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingContent(id);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await dialog.showConfirm(
      '确定要删除这个内容吗？',
      '删除确认'
    );
    if (confirmed) {
      await deleteContent(id);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await togglePin(id);
    } catch (error) {
      console.error('置顶操作失败:', error);
      await dialog.showAlert('置顶操作失败，请重试', '错误');
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingContent(null);
  };

  const handleSaveSuccess = () => {
    // 保存成功后刷新列表
    refresh();
    handleCloseEditor();
  };

  const handleSkipLogin = () => {
    setUseLocalMode(true);
    setShowAuthPanel(false);
    // 保存用户选择，下次自动进入本地模式
    localStorage.setItem('qa_sider_use_local_mode', 'true');
  };

  // 处理快速保存
  const handleQuickSave = async (data: {
    title: string;
    content: string;
    type: ContentType;
    language?: string;
    formattedHtml?: string;
    tags?: string[];
    variables?: string[];
  }) => {
    try {
      const now = Date.now();
      const userId = useLocalMode ? 'local' : user?.uid;

      if (!userId) {
        await dialog.showAlert('请先登录或使用本地模式', '错误');
        return;
      }

      if (useLocalMode) {
        // 保存到本地
        const localData = await getFromLocalStorage();
        const newItem: ContentItem = {
          id: `local_${now}`,
          userId: 'local',
          ...data,
          createdAt: now,
          updatedAt: now,
        };
        await saveToLocalStorage([...localData, newItem]);
      } else {
        // 保存到 Supabase
        await createContent({
          userId,
          ...data,
          createdAt: now,
          updatedAt: now,
        });
      }

      setQuickSaveContent(null);
      refresh();
      await dialog.showAlert('片段已保存成功！', '成功');
    } catch (error) {
      console.error('快速保存失败:', error);
      await dialog.showAlert('保存失败，请重试', '错误');
    }
  };

  // 处理插入片段
  const handleInsertSnippet = async (content: string, contentId: string) => {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'insertToPage',
        text: content,
      });

      if (response?.success) {
        // 增加使用计数
        await incrementUseCount(contentId);
        setShowInsertDialog(false);
        await dialog.showAlert('片段已插入到页面！', '成功');
      }
    } catch (error) {
      console.error('插入失败:', error);
      await dialog.showAlert('插入失败，请确保页面有可编辑的输入框', '错误');
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="text-gray-600 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  // 显示登录选择页（仅在没有用户、没有本地模式、且应该显示的情况下）
  if (!user && !useLocalMode && showAuthPanel) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
        <AuthPanel onSkipLogin={handleSkipLogin} showAlert={dialog.showAlert} />
        <Dialog
          isOpen={dialog.isOpen}
          title={dialog.config.title}
          message={dialog.config.message}
          type={dialog.config.type}
          onConfirm={dialog.handleConfirm}
          onCancel={dialog.handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header 
        user={user} 
        onNewContent={handleNewContent} 
        onShowStatistics={() => setShowStatistics(true)}
        showAlert={dialog.showAlert} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterTabs active={activeFilter} onChange={setActiveFilter} />
          <TagFilter
            selectedTags={selectedTags}
            onTagSelect={(tag) => setSelectedTags([...selectedTags, tag])}
            onTagRemove={(tag) => setSelectedTags(selectedTags.filter(t => t !== tag))}
            onClearAll={() => setSelectedTags([])}
            availableTags={availableTags}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ContentList
            contents={filteredContents}
            loading={contentsLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
            showAlert={dialog.showAlert}
          />
        </div>
      </div>

      {isEditorOpen && (
        <EditorModal
          contentId={editingContent}
          userId={useLocalMode ? undefined : user?.uid}
          onClose={handleCloseEditor}
          onSave={handleSaveSuccess}
          showAlert={dialog.showAlert}
        />
      )}

      {quickSaveContent && (
        <QuickSaveDialog
          initialContent={quickSaveContent.content}
          initialFormattedHtml={quickSaveContent.formattedHtml}
          onSave={handleQuickSave}
          onClose={() => setQuickSaveContent(null)}
          tagSuggestions={availableTags}
        />
      )}

      {showInsertDialog && (
        <QuickInsertDialog
          contents={contents}
          onInsert={handleInsertSnippet}
          onClose={() => setShowInsertDialog(false)}
        />
      )}

      {showStatistics && (
        <StatisticsModal
          contents={contents}
          filteredContents={filteredContents}
          onClose={() => setShowStatistics(false)}
        />
      )}

      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.config.title}
        message={dialog.config.message}
        type={dialog.config.type}
        onConfirm={dialog.handleConfirm}
        onCancel={dialog.handleCancel}
      />
    </div>
  );
}

export default App;
