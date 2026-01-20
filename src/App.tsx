import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import FilterTabs from './components/FilterTabs/FilterTabs';
import TagFilter from './components/TagFilter/TagFilter';
import ContentList from './components/ContentList/ContentList';
import EditorModal from './components/Editor/EditorModal';
import AuthPanel from './components/Auth/AuthPanel';
import Dialog from './components/Dialog/Dialog';
import StatisticsModal from './components/Statistics/StatisticsModal';
import HelpDocModal from './components/HelpDoc/HelpDocModal';
import Loading from './components/Loading/Loading';
import { useAuth } from './hooks/useAuth';
import { useContents } from './hooks/useContents';
import { useDialog } from './hooks/useDialog';
import { useThemeColor } from './hooks/useThemeColor';
import { getFromLocalStorage } from './services/storage';
import type { ContentType } from './types';

// 启动日志 - 帮助确认代码已加载
console.log('🎯 QA Sider Web 应用已加载');
console.log('📍 当前位置:', location.href);

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ContentType>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showHelpDoc, setShowHelpDoc] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  
  const dialog = useDialog();
  useThemeColor(); // 初始化主题色
  
  const { user, loading: authLoading } = useAuth();
  // 使用本地模式时传入 undefined，使用 Supabase 时传入用户 ID
  const { contents, loading: contentsLoading, deleteContent, togglePin, refresh } = useContents(
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

  const handleBatchDelete = async (ids: string[]) => {
    try {
      // 批量删除逻辑
      for (const id of ids) {
        await deleteContent(id);
      }
      await dialog.showAlert(`成功删除 ${ids.length} 个片段`, '成功');
    } catch (error) {
      console.error('批量删除失败:', error);
      await dialog.showAlert('批量删除失败，请重试', '错误');
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

  const handleShowLogin = () => {
    // 清除本地模式标记
    localStorage.removeItem('qa_sider_use_local_mode');
    // 显示登录页面
    setShowAuthPanel(true);
    setUseLocalMode(false);
  };

  if (authLoading) {
    return <Loading message="QA Sider" />;
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
        onShowLogin={handleShowLogin}
        onShowHelp={() => setShowHelpDoc(true)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterTabs 
            active={activeFilter} 
            onChange={setActiveFilter}
            batchMode={batchMode}
            onBatchModeToggle={() => setBatchMode(true)}
          />
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
            batchMode={batchMode}
            onBatchModeChange={setBatchMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBatchDelete={handleBatchDelete}
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

      {showStatistics && (
        <StatisticsModal
          contents={contents}
          filteredContents={filteredContents}
          onClose={() => setShowStatistics(false)}
        />
      )}

      {showHelpDoc && (
        <HelpDocModal
          onClose={() => setShowHelpDoc(false)}
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
