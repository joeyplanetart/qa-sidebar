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
    console.log('🚀 [步骤 1/5] 开始 Google OAuth 登录流程...');
    console.log('📍 Chrome Extension ID:', chrome.runtime.id);

    // 检查是否在扩展环境中
    if (typeof chrome === 'undefined' || !chrome.identity) {
      throw new Error('Chrome Identity API 不可用。请确保在 Chrome 扩展环境中运行。');
    }

    const redirectUrl = chrome.identity.getRedirectURL();
    console.log('🔗 Redirect URL:', redirectUrl);

    // 1. 获取 Supabase OAuth URL
    console.log('📡 [步骤 2/5] 从 Supabase 获取 OAuth URL...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: true,
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (authError) {
      console.error('❌ Supabase OAuth 错误:', authError);
      throw new Error(`Supabase OAuth 失败: ${authError.message}`);
    }

    if (!authData?.url) {
      console.error('❌ 未获取到 OAuth URL');
      throw new Error('无法获取认证 URL。请检查 Supabase 配置。');
    }

    console.log('✅ OAuth URL 获取成功');
    console.log('🔍 [调试] 原始 OAuth URL:', authData.url);
    
    // 直接使用 Supabase 返回的 URL，不做修改
    // Supabase 会处理整个 OAuth 流程
    const finalOAuthUrl = authData.url;

    // 2. 使用 chrome.identity.launchWebAuthFlow 启动 OAuth 流程
    console.log('🌐 [步骤 3/5] 启动 OAuth 认证窗口...');
    
    const responseUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: finalOAuthUrl,
          interactive: true,
        },
        (responseUrl) => {
          console.log('🔍 [调试] 回调触发');
          console.log('🔍 [调试] responseUrl 类型:', typeof responseUrl);
          console.log('🔍 [调试] responseUrl 值:', responseUrl);
          console.log('🔍 [调试] lastError:', chrome.runtime.lastError);
          
          if (chrome.runtime.lastError) {
            console.error('❌ launchWebAuthFlow 错误:', chrome.runtime.lastError);
            console.error('❌ 错误消息:', chrome.runtime.lastError.message);
            reject(new Error(`OAuth 流程失败: ${chrome.runtime.lastError.message}`));
          } else if (responseUrl) {
            console.log('✅ 收到完整重定向 URL:', responseUrl);
            resolve(responseUrl);
          } else {
            console.error('❌ 未收到 responseUrl，也没有 lastError');
            reject(new Error('未收到重定向 URL。用户可能取消了登录。'));
          }
        }
      );
    });

    // 3. 从重定向 URL 中提取 tokens
    console.log('🔑 [步骤 4/5] 提取认证令牌...');
    
    const url = new URL(responseUrl);
    console.log('📋 URL Hash:', url.hash.substring(0, 50) + '...');
    
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');
    const error = hashParams.get('error');
    const error_description = hashParams.get('error_description');

    if (error) {
      console.error('❌ OAuth 返回错误:', error, error_description);
      throw new Error(`OAuth 认证失败: ${error_description || error}`);
    }

    if (!access_token) {
      console.error('❌ 未找到 access_token');
      console.log('URL 参数:', Array.from(hashParams.entries()));
      throw new Error('未能从重定向 URL 获取 access token。请检查 Supabase 和 Google OAuth 配置。');
    }

    console.log('✅ 成功获取 access token (长度:', access_token.length, ')');
    console.log('✅ refresh_token:', refresh_token ? '已获取' : '未获取');

    // 4. 使用 tokens 设置 Supabase 会话
    console.log('💾 [步骤 5/5] 设置 Supabase 会话...');
    
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: refresh_token || '',
    });

    if (sessionError) {
      console.error('❌ 设置会话失败:', sessionError);
      throw new Error(`设置会话失败: ${sessionError.message}`);
    }

    console.log('✅ Supabase 会话设置成功!');
    console.log('👤 用户信息:', {
      id: sessionData.user?.id,
      email: sessionData.user?.email,
    });
    
    console.log('🎉 登录完成！');
  } catch (error) {
    console.error('❌ Chrome Identity 登录失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
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
