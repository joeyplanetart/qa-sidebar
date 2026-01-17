import type { ContentType } from '../../types';
import { ListChecks } from 'lucide-react';

interface FilterTabsProps {
  active: 'all' | ContentType;
  onChange: (filter: 'all' | ContentType) => void;
  batchMode?: boolean;
  onBatchModeToggle?: () => void;
}

const tabs: Array<{ id: 'all' | ContentType; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'code', label: '代码' },
  { id: 'sql', label: 'SQL' },
  { id: 'text', label: '文本' },
];

export default function FilterTabs({ active, onChange, batchMode, onBatchModeToggle }: FilterTabsProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      {/* 左侧：类型筛选 */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              active === tab.id
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 右侧：批量管理按钮 */}
      {onBatchModeToggle && !batchMode && (
        <button
          onClick={onBatchModeToggle}
          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/30"
          title="批量管理"
        >
          <ListChecks size={20} />
        </button>
      )}
    </div>
  );
}
