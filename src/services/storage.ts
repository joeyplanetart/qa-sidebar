/// <reference types="chrome"/>
import type { ContentItem } from '../types';

const STORAGE_KEY = 'qa_sider_contents';

// Chrome Storage API 封装（用于匿名用户）
export const saveToLocalStorage = async (contents: ContentItem[]): Promise<void> => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ [STORAGE_KEY]: contents });
    }
  } catch (error) {
    console.error('保存到本地存储失败:', error);
    throw error;
  }
};

export const getFromLocalStorage = async (): Promise<ContentItem[]> => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return (result[STORAGE_KEY] as ContentItem[]) || [];
    }
    return [];
  } catch (error) {
    console.error('从本地存储获取失败:', error);
    return [];
  }
};

export const clearLocalStorage = async (): Promise<void> => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove(STORAGE_KEY);
    }
  } catch (error) {
    console.error('清空本地存储失败:', error);
    throw error;
  }
};
