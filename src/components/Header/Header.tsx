import { useState, useRef, useEffect } from 'react';
import { Plus, LogOut, LogIn, BarChart3, HelpCircle } from 'lucide-react';
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
  onShowHelp?: () => void;
}

export default function Header({ user, onNewContent, onShowStatistics, onShowLogin, onShowHelp }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={getUserAvatar(user.uid, user.displayName, user.photoURL, 32)}
                  alt={user.displayName || '用户'}
                  className="w-8 h-8 rounded-full shadow-sm cursor-pointer"
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
              </button>

              {/* 下拉菜单 */}
              {showMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onShowHelp?.();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HelpCircle size={16} />
                    <span>帮助文档</span>
                  </button>
                </div>
              )}
            </div>
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
