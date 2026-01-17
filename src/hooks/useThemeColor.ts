import { useState, useEffect } from 'react';

export type ThemeColor = 'indigo' | 'green';

const THEME_COLOR_KEY = 'qa_sider_theme_color';

export function useThemeColor() {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem(THEME_COLOR_KEY);
    return (saved as ThemeColor) || 'indigo';
  });

  useEffect(() => {
    // 应用主题色到 HTML 根元素
    document.documentElement.setAttribute('data-theme', themeColor);
    localStorage.setItem(THEME_COLOR_KEY, themeColor);
  }, [themeColor]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
  };

  const toggleThemeColor = () => {
    setThemeColorState(prev => prev === 'indigo' ? 'green' : 'indigo');
  };

  return {
    themeColor,
    setThemeColor,
    toggleThemeColor,
    isIndigo: themeColor === 'indigo',
    isGreen: themeColor === 'green',
  };
}
