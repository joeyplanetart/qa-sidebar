import { useState } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import FilterTabs from './components/FilterTabs/FilterTabs';
import ContentList from './components/ContentList/ContentList';
import EditorModal from './components/Editor/EditorModal';
import AuthPanel from './components/Auth/AuthPanel';
import { useAuth } from './hooks/useAuth';
import { useContents } from './hooks/useContents';
import type { ContentType } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ContentType>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [useLocalMode, setUseLocalMode] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  // 使用本地模式时传入 undefined，使用 Supabase 时传入用户 ID
  const { contents, loading: contentsLoading, deleteContent, refresh } = useContents(
    useLocalMode ? undefined : user?.uid
  );

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
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!user && !useLocalMode) {
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
