import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '加载中...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="flex flex-col items-center gap-4">
        {/* 旋转的加载图标 */}
        <div className="relative">
          <Loader2 
            size={48} 
            className="text-indigo-600 dark:text-indigo-400 animate-spin" 
          />
          {/* 发光效果 */}
          <div className="absolute inset-0 blur-xl opacity-50">
            <Loader2 
              size={48} 
              className="text-indigo-600 dark:text-indigo-400 animate-spin" 
            />
          </div>
        </div>
        
        {/* 加载文字 */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            正在初始化应用...
          </p>
        </div>

        {/* 加载进度点 */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
