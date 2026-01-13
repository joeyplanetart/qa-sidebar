/**
 * Chrome Extension OAuth 认证服务
 * 使用 chrome.identity API 和 Supabase OAuth 流程
 */

import { supabase } from './supabase';

/**
 * 使用 Chrome Identity launchWebAuthFlow 进行 Google OAuth 登录
 */
export const signInWithChromeIdentity = async (): Promise<void> => {
  try {
    console.log('开始 Google OAuth 登录流程...');

    // 1. 获取 Supabase OAuth URL
    const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: true,
        redirectTo: chrome.identity.getRedirectURL(),
      },
    });

    if (authError || !authData?.url) {
      console.error('获取 OAuth URL 失败:', authError);
      throw authError || new Error('无法获取认证 URL');
    }

    console.log('OAuth URL:', authData.url);
    console.log('Redirect URL:', chrome.identity.getRedirectURL());

    // 2. 使用 chrome.identity.launchWebAuthFlow 启动 OAuth 流程
    const redirectUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: authData.url,
          interactive: true,
        },
        (responseUrl) => {
          if (chrome.runtime.lastError) {
            console.error('launchWebAuthFlow 错误:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else if (responseUrl) {
            console.log('收到重定向 URL:', responseUrl);
            resolve(responseUrl);
          } else {
            reject(new Error('未收到重定向 URL'));
          }
        }
      );
    });

    // 3. 从重定向 URL 中提取 tokens
    const url = new URL(redirectUrl);
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');

    if (!access_token) {
      throw new Error('未能从重定向 URL 获取 access token');
    }

    console.log('成功获取 access token');

    // 4. 使用 tokens 设置 Supabase 会话
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: refresh_token || '',
    });

    if (sessionError) {
      console.error('设置会话失败:', sessionError);
      throw sessionError;
    }

    console.log('Supabase 会话设置成功:', sessionData);
  } catch (error) {
    console.error('Chrome Identity 登录失败:', error);
    throw error;
  }
};

/**
 * 登出
 */
export const signOutChromeIdentity = async (): Promise<void> => {
  try {
    console.log('开始登出...');

    // 从 Supabase 登出
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Supabase 登出失败:', error);
      throw error;
    }

    console.log('登出成功');
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};
