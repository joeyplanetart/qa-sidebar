import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import FilterTabs from './components/FilterTabs/FilterTabs';
import ContentList from './components/ContentList/ContentList';
import EditorModal from './components/Editor/EditorModal';
import AuthPanel from './components/Auth/AuthPanel';
import { useAuth } from './hooks/useAuth';
import { useContents } from './hooks/useContents';
import { getFromLocalStorage } from './services/storage';
import type { ContentType } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ContentType>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  // 使用本地模式时传入 undefined，使用 Supabase 时传入用户 ID
  const { contents, loading: contentsLoading, deleteContent, refresh } = useContents(
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

  // 过滤内容
  const filteredContents = contents.filter((item) => {
    // 类型过滤
    if (activeFilter !== 'all' && item.type !== activeFilter) {
      return false;
    }
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // 调试日志：显示当前内容和过滤结果
  useEffect(() => {
    console.log('=== 内容调试信息 ===');
    console.log('所有内容数量:', contents.length);
    console.log('当前过滤器:', activeFilter);
    console.log('所有内容类型统计:', contents.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));
    console.log('过滤后内容数量:', filteredContents.length);
    console.log('所有内容详情:', contents.map(item => ({ 
      title: item.title, 
      type: item.type 
    })));
  }, [contents, activeFilter, filteredContents.length]);

  const handleNewContent = () => {
    setEditingContent(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingContent(id);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个内容吗？')) {
      await deleteContent(id);
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  // 显示登录选择页（仅在没有用户、没有本地模式、且应该显示的情况下）
  if (!user && !useLocalMode && showAuthPanel) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <AuthPanel onSkipLogin={handleSkipLogin} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onNewContent={handleNewContent} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterTabs active={activeFilter} onChange={setActiveFilter} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ContentList
            contents={filteredContents}
            loading={contentsLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {isEditorOpen && (
        <EditorModal
          contentId={editingContent}
          userId={useLocalMode ? undefined : user?.uid}
          onClose={handleCloseEditor}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
}

export default App;
