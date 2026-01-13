import { useState, useEffect } from 'react';
import { getContents, deleteContent as deleteContentFromSupabase } from '../services/supabase';
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

  const refresh = () => {
    loadContents();
  };

  return { contents, loading, deleteContent, refresh };
};
