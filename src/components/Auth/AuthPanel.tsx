import { signInWithChromeIdentity } from '../../services/chromeAuth';
import { useState } from 'react';

interface AuthPanelProps {
  onSkipLogin: () => void;
  showAlert: (message: string, title?: string) => Promise<boolean>;
}

export default function AuthPanel({ onSkipLogin, showAlert }: AuthPanelProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('用户点击了登录按钮');
      await signInWithChromeIdentity();
      console.log('signInWithChromeIdentity 执行完成');
      // 登录成功后，useAuth hook 会自动检测到认证状态变化
    } catch (error) {
      console.error('❌ 登录失败:', error);
      
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">内容管理器</h1>
        <p className="text-gray-600">保存并管理您的代码片段</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <span className="font-medium text-gray-700">
            {loading ? '登录中...' : '使用 Google 账号登录'}
          </span>
        </button>

        <button
          onClick={onSkipLogin}
          disabled={loading}
          className="w-full px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium">稍后登录（使用本地存储）</span>
        </button>

        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>登录后即可保存和同步您的内容</p>
          <p className="text-xs">未登录时数据仅保存在本地浏览器</p>
        </div>
      </div>
    </div>
  );
}
