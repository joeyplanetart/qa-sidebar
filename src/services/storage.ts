import type { ContentItem } from '../types';

const STORAGE_KEY = 'qa_sider_contents';

/**
 * Web 版本存储服务 - 使用 localStorage
 */

// 保存到本地存储
export const saveToLocalStorage = async (contents: ContentItem[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
  } catch (error) {
    console.error('保存到本地存储失败:', error);
    throw error;
  }
};

// 从本地存储获取
export const getFromLocalStorage = async (): Promise<ContentItem[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('从本地存储获取失败:', error);
    return [];
  }
};

// 清空本地存储
export const clearLocalStorage = async (): Promise<void> => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清空本地存储失败:', error);
    throw error;
  }
};
