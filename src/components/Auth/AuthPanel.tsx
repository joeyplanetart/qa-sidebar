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
        <h1 className="text-3xl font-bold text-primary dark:text-indigo-400 mb-2">QA Sider</h1>
        <p className="text-gray-600 dark:text-gray-400">专为 QA 打造的代码片段管理工具</p>
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
