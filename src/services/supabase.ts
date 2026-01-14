import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ContentItem, User } from '../types';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 初始化 Supabase 客户端
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Auth 服务
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: chrome.identity.getRedirectURL(),
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google 登录失败:', error);
    throw error;
  }
};

// Email 注册
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // 禁用邮箱确认，注册后自动登录
        emailRedirectTo: undefined,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Email 注册失败:', error);
    throw error;
  }
};

// Email 登录
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Email 登录失败:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const supabaseUser = session.user;
      callback({
        uid: supabaseUser.id,
        email: supabaseUser.email || null,
        displayName: supabaseUser.user_metadata?.full_name || supabaseUser.email || null,
        photoURL: supabaseUser.user_metadata?.avatar_url || null,
      });
    } else {
      callback(null);
    }
  });

  return () => {
    data.subscription.unsubscribe();
  };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  return {
    uid: user.id,
    email: user.email || null,
    displayName: user.user_metadata?.full_name || user.email || null,
    photoURL: user.user_metadata?.avatar_url || null,
  };
};

// Supabase 数据库操作
const CONTENTS_TABLE = 'contents';

export const createContent = async (data: Omit<ContentItem, 'id'>) => {
  try {
    const { data: result, error } = await supabase
      .from(CONTENTS_TABLE)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error('创建内容失败:', error);
    throw error;
  }
};

export const updateContent = async (id: string, data: Partial<ContentItem>) => {
  try {
    const { error } = await supabase
      .from(CONTENTS_TABLE)
      .update(data)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('更新内容失败:', error);
    throw error;
  }
};

// 切换置顶状态
export const togglePinContent = async (id: string, isPinned: boolean) => {
  try {
    const { error } = await supabase
      .from(CONTENTS_TABLE)
      .update({ isPinned })
      .eq('id', id);

    if (error) {
      console.error('Supabase 更新置顶状态错误:', error);
      throw new Error(`置顶操作失败: ${error.message}`);
    }
  } catch (error) {
    console.error('切换置顶状态失败:', error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  try {
    const { error } = await supabase
      .from(CONTENTS_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('删除内容失败:', error);
    throw error;
  }
};

export const getContentById = async (id: string): Promise<ContentItem | null> => {
  try {
    const { data, error } = await supabase
      .from(CONTENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ContentItem;
  } catch (error) {
    console.error('获取内容失败:', error);
    return null;
  }
};

export const getContents = async (userId: string): Promise<ContentItem[]> => {
  try {
    const { data, error } = await supabase
      .from(CONTENTS_TABLE)
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return (data as ContentItem[]) || [];
  } catch (error) {
    console.error('获取内容列表失败:', error);
    return [];
  }
};

export { supabase as db };
