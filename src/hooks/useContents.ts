import { useState, useEffect } from 'react';
import { getContents, deleteContent as deleteContentFromSupabase } from '../services/supabase';
import type { ContentItem } from '../types';

export const useContents = (userId: string | undefined) => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContents = async () => {
    if (!userId) {
      setContents([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getContents(userId);
      setContents(data);
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
      await deleteContentFromSupabase(id);
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
