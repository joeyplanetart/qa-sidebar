import { Palette } from 'lucide-react';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function ThemeColorToggle() {
  const { themeColor, toggleThemeColor } = useThemeColor();

  return (
    <button
      onClick={toggleThemeColor}
      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      title={`切换主题色 (当前: ${themeColor === 'indigo' ? '紫色' : '绿色'})`}
    >
      <Palette size={20} className="text-gray-600 dark:text-gray-400" />
      
      {/* 颜色指示器 */}
      <span 
        className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 transition-all ${
          themeColor === 'indigo' 
            ? 'bg-indigo-600 dark:bg-indigo-400' 
            : 'bg-lime-600 dark:bg-lime-400'
        }`}
      ></span>
    </button>
  );
}
