import { Plus, LogOut, LogIn, BarChart3 } from 'lucide-react';
import type { User } from '../../types';
import { signOutChromeIdentity } from '../../services/chromeAuth';
import { getUserAvatar } from '../../utils/avatar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import ThemeColorToggle from '../ThemeColorToggle/ThemeColorToggle';

interface HeaderProps {
  user: User | null;
  onNewContent: () => void;
  onShowStatistics?: () => void;
  onShowLogin?: () => void;
}

export default function Header({ user, onNewContent, onShowStatistics, onShowLogin }: HeaderProps) {
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

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary"></h1>
          {/* 主题切换按钮组 - 靠左 */}
          <ThemeToggle />
          <ThemeColorToggle />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onShowStatistics}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
            title="统计"
          >
            <BarChart3 size={20} />
            {/* <span className="text-sm">统计</span> */}
          </button>
          <button
            onClick={onNewContent}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>新建</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <img
                src={getUserAvatar(user.uid, user.displayName, user.photoURL, 32)}
                alt={user.displayName || '用户'}
                className="w-8 h-8 rounded-full shadow-sm"
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-white">
                  {user.displayName && user.displayName !== user.email 
                    ? user.displayName 
                    : (user.email || '用户')}
                </div>
                {user.displayName && user.displayName !== user.email && (
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium">游</span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">游客模式</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">数据保存在本地</div>
              </div>
            </div>
          )}
        </div>
        {user ? (
          <button
            onClick={handleSignOut}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg transition-colors"
            title="登出"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <button
            onClick={onShowLogin}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="登录账号"
          >
            <LogIn size={16} />
            <span>登录</span>
          </button>
        )}
      </div>
    </header>
  );
}
