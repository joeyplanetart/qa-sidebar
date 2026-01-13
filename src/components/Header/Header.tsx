import { Plus, LogOut, LogIn } from 'lucide-react';
import type { User } from '../../types';
import { signOutChromeIdentity, signInWithChromeIdentity } from '../../services/chromeAuth';

interface HeaderProps {
  user: User | null;
  onNewContent: () => void;
  showAlert?: (message: string, title?: string) => Promise<boolean>;
}

export default function Header({ user, onNewContent, showAlert }: HeaderProps) {
  const handleSignOut = async () => {
    try {
      await signOutChromeIdentity();
      // 清除本地模式标记，下次打开时可以重新选择
      localStorage.removeItem('qa_sider_use_local_mode');
      window.location.reload();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const handleLogin = async () => {
    console.log('🔵 Header: 用户点击登录按钮');
    try {
      console.log('🔵 Header: 开始执行登录流程');
      await signInWithChromeIdentity();
      console.log('🔵 Header: 登录流程完成');
      // 清除本地模式标记
      localStorage.removeItem('qa_sider_use_local_mode');
    } catch (error) {
      console.error('🔵 Header: 登录失败', error);
      if (showAlert) {
        let errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
        
        // 如果是 Authorization page could not be loaded 错误
        if (errorMessage.includes('Authorization page could not be loaded')) {
          errorMessage = 'OAuth 认证页面无法加载。\n\n可能原因：\n1. Google OAuth 配置需要时间生效（等待5-10分钟）\n2. 网络问题\n\n建议：稍后重试或使用本地存储模式';
        }
        
        await showAlert(errorMessage, '登录错误');
      }
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary"></h1>
          <p className="text-sm text-gray-500 mt-1">
            {user ? '保存并同步您的代码片段' : '本地模式：数据仅保存在浏览器'}
          </p>
        </div>
        <button
          onClick={onNewContent}
          className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新建</span>
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || '用户'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.displayName || '用户'}</div>
                <div className="text-gray-500 text-xs">{user.email}</div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-medium">游</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">游客模式</div>
                <div className="text-gray-500 text-xs">数据保存在本地</div>
              </div>
            </div>
          )}
        </div>
        {user ? (
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors"
            title="登出"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-indigo-50 rounded-lg transition-colors"
            title="使用 Google 账号登录"
          >
            <LogIn size={16} />
            <span>登录</span>
          </button>
        )}
      </div>
    </header>
  );
}
