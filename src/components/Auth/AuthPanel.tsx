import { signInWithChromeIdentity, signInWithGitHubIdentity, signInWithTwitterIdentity } from '../../services/chromeAuth';
import { signUpWithEmail, signInWithEmail } from '../../services/supabase';
import { useState } from 'react';

interface AuthPanelProps {
  onSkipLogin: () => void;
  showAlert: (message: string, title?: string) => Promise<boolean>;
}

export default function AuthPanel({ onSkipLogin, showAlert }: AuthPanelProps) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('用户点击了 Google 登录按钮');
      await signInWithChromeIdentity();
      console.log('signInWithChromeIdentity 执行完成');
      // 登录成功后，useAuth hook 会自动检测到认证状态变化
    } catch (error) {
      console.error('❌ Google 登录失败:', error);
      
      let errorMessage = '登录失败，请重试';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 提供更友好的错误提示
        if (errorMessage.includes('Supabase')) {
          errorMessage += '\n\n💡 提示：请确保 Supabase 中已配置 Google OAuth';
        } else if (errorMessage.includes('取消')) {
          errorMessage = '您取消了登录';
        } else if (errorMessage.includes('access token')) {
          errorMessage += '\n\n💡 提示：请检查 Google OAuth 和 Supabase 的配置';
        }
      }
      
      await showAlert(errorMessage, '登录错误');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      console.log('用户点击了 GitHub 登录按钮');
      await signInWithGitHubIdentity();
      console.log('signInWithGitHubIdentity 执行完成');
      // 登录成功后，useAuth hook 会自动检测到认证状态变化
    } catch (error) {
      console.error('❌ GitHub 登录失败:', error);
      
      let errorMessage = '登录失败，请重试';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 提供更友好的错误提示
        if (errorMessage.includes('Supabase')) {
          errorMessage += '\n\n💡 提示：请确保 Supabase 中已配置 GitHub OAuth';
        } else if (errorMessage.includes('取消')) {
          errorMessage = '您取消了登录';
        } else if (errorMessage.includes('access token')) {
          errorMessage += '\n\n💡 提示：请检查 GitHub OAuth 和 Supabase 的配置';
        }
      }
      
      await showAlert(errorMessage, '登录错误');
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterSignIn = async () => {
    setLoading(true);
    try {
      console.log('用户点击了 Twitter/X 登录按钮');
      await signInWithTwitterIdentity();
      console.log('signInWithTwitterIdentity 执行完成');
      // 登录成功后，useAuth hook 会自动检测到认证状态变化
    } catch (error) {
      console.error('❌ Twitter/X 登录失败:', error);
      
      let errorMessage = '登录失败，请重试';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 提供更友好的错误提示
        if (errorMessage.includes('Supabase')) {
          errorMessage += '\n\n💡 提示：请确保 Supabase 中已配置 Twitter OAuth';
        } else if (errorMessage.includes('取消')) {
          errorMessage = '您取消了登录';
        } else if (errorMessage.includes('access token')) {
          errorMessage += '\n\n💡 提示：请检查 Twitter OAuth 和 Supabase 的配置';
        }
      }
      
      await showAlert(errorMessage, '登录错误');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!email || !password) {
      await showAlert('请填写邮箱和密码', '输入错误');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      await showAlert('两次输入的密码不一致', '输入错误');
      return;
    }

    if (password.length < 6) {
      await showAlert('密码长度至少为 6 位', '输入错误');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // 注册
        const result = await signUpWithEmail(email, password);
        
        // 检查是否需要邮箱确认
        if (result.user && result.session) {
          // 注册成功且已自动登录
          await showAlert('注册成功！', '成功');
          // useAuth hook 会自动检测到认证状态变化，无需手动操作
        } else if (result.user && !result.session) {
          // 需要邮箱确认
          await showAlert('注册成功！请检查邮箱并确认您的账号。', '注册成功');
          setIsSignUp(false);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        // 登录
        await signInWithEmail(email, password);
        // 登录成功后，useAuth hook 会自动检测到认证状态变化
      }
    } catch (error) {
      console.error('❌ 认证失败:', error);
      
      let errorMessage = isSignUp ? '注册失败' : '登录失败';
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('invalid login credentials')) {
          errorMessage = '邮箱或密码错误';
        } else if (message.includes('user already registered')) {
          errorMessage = '该邮箱已被注册';
        } else if (message.includes('invalid email')) {
          errorMessage = '邮箱格式不正确';
        } else if (message.includes('email not confirmed')) {
          errorMessage = '请先确认您的邮箱';
        } else {
          errorMessage = error.message;
        }
      }
      
      await showAlert(errorMessage, isSignUp ? '注册错误' : '登录错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4 transition-colors">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-indigo-400 mb-2">QA SidePanel</h1>
        <p className="text-gray-600 dark:text-gray-400">专为QA打造的侧边栏笔记工具！</p>
      </div>

      <div className="space-y-4">
        {/* Email 登录/注册表单 */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="请输入邮箱"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="至少 6 位密码"
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="再次输入密码"
                autoComplete="new-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 dark:bg-indigo-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (isSignUp ? '注册中...' : '登录中...') : (isSignUp ? '注册' : '登录')}
          </button>
        </form>

        {/* 切换注册/登录 */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setPassword('');
              setConfirmPassword('');
            }}
            disabled={loading}
            className="text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignUp ? '已有账号？点击登录' : '没有账号？点击注册'}
          </button>
        </div>

        {/* 分隔线 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">或使用第三方登录</span>
          </div>
        </div>

        {/* GitHub 登录按钮 */}
        <button
          onClick={handleGitHubSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {loading ? '登录中...' : '使用 GitHub 账号登录'}
          </span>
        </button>

        {/* Twitter/X 登录按钮 */}
        <button
          onClick={handleTwitterSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {loading ? '登录中...' : '使用 Twitter/X 账号登录'}
          </span>
        </button>

        {/* Google 登录按钮 - 暂时隐藏 */}
        {false && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {loading ? '登录中...' : '使用 Google 账号登录'}
            </span>
          </button>
        )}

        <button
          onClick={onSkipLogin}
          disabled={loading}
          className="w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium">稍后登录（使用本地存储）</span>
        </button>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>登录后即可保存和同步您的内容</p>
          <p className="text-xs">未登录时数据仅保存在本地浏览器</p>
        </div>
      </div>
    </div>
  );
}
