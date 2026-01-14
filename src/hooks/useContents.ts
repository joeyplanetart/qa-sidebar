import { useState, useEffect } from 'react';
import { getContents, deleteContent as deleteContentFromSupabase, togglePinContent as togglePinInSupabase } from '../services/supabase';
import { getFromLocalStorage, saveToLocalStorage } from '../services/storage';
import type { ContentItem } from '../types';

export const useContents = (userId: string | undefined) => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContents = async () => {
    try {
      if (userId) {
        // 使用 Supabase
        const data = await getContents(userId);
        setContents(data);
      } else {
        // 使用本地存储
        const data = await getFromLocalStorage();
        setContents(data);
      }
    } catch (error) {
      console.error('加载内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, [userId]);

  const deleteContent = async (id: string) => {
    try {
      if (userId) {
        // 从 Supabase 删除
        await deleteContentFromSupabase(id);
      } else {
        // 从本地存储删除
        const updatedContents = contents.filter((item) => item.id !== id);
        await saveToLocalStorage(updatedContents);
      }
      setContents((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('删除内容失败:', error);
      throw error;
    }
  };

  const togglePin = async (id: string) => {
    try {
      const item = contents.find((c) => c.id === id);
      if (!item) return;

      const newPinnedState = !item.isPinned;

      if (userId) {
        // 使用 Supabase
        await togglePinInSupabase(id, newPinnedState);
      } else {
        // 使用本地存储
        const updatedContents = contents.map((c) =>
          c.id === id ? { ...c, isPinned: newPinnedState } : c
        );
        await saveToLocalStorage(updatedContents);
      }

      // 更新本地状态
      setContents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isPinned: newPinnedState } : c))
      );
    } catch (error) {
      console.error('切换置顶状态失败:', error);
      throw error;
    }
  };

  const refresh = () => {
    loadContents();
  };

  return { contents, loading, deleteContent, togglePin, refresh };
};
