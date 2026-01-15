import { useMemo } from 'react';
import type { ContentItem } from '../../types';

interface StatisticsProps {
  contents: ContentItem[];
  filteredContents: ContentItem[];
}

export default function Statistics({ contents, filteredContents }: StatisticsProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    const total = contents.length;
    const filtered = filteredContents.length;
    
    // 计算总使用次数
    const totalUseCount = contents.reduce((sum, item) => sum + (item.useCount || 0), 0);
    
    // 按类型分组统计
    const byType = contents.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 获取最常使用的片段（Top 5）
    const topUsed = [...contents]
      .filter(item => (item.useCount || 0) > 0)
      .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
      .slice(0, 5);
    
    // 最近使用的片段（Top 5）
    const recentlyUsed = [...contents]
      .filter(item => item.lastUsedAt)
      .sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0))
      .slice(0, 5);
    
    return {
      total,
      filtered,
      totalUseCount,
      byType,
      topUsed,
      recentlyUsed,
    };
  }, [contents, filteredContents]);

  const typeLabels: Record<string, string> = {
    code: '代码',
    sql: 'SQL',
    text: '文本',
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 space-y-4">
      {/* 总体统计 */}
      <div>
        {/* <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📊 总体统计
        </h3> */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              片段总数
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalUseCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              总使用次数
            </div>
          </div>
        </div>
      </div>

      {/* 按类型统计 */}
      {Object.keys(stats.byType).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            📁 类型分布
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {typeLabels[type] || type}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最常使用 */}
      {stats.topUsed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🔥 最常使用
          </h3>
          <div className="space-y-2">
            {stats.topUsed.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded px-2 py-1.5"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-gray-400 dark:text-gray-500 font-mono text-xs">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {item.title}
                  </span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-medium ml-2">
                  {item.useCount} 次
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最近使用 */}
      {stats.recentlyUsed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🕒 最近使用
          </h3>
          <div className="space-y-2">
            {stats.recentlyUsed.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded px-2 py-1.5"
              >
                <span className="text-gray-700 dark:text-gray-300 truncate flex-1 min-w-0">
                  {item.title}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 whitespace-nowrap">
                  {formatDate(item.lastUsedAt!)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 当前筛选 */}
      {stats.filtered !== stats.total && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
          当前显示 {stats.filtered} / {stats.total} 个片段
        </div>
      )}
    </div>
  );
}
