import type { ContentType } from '../../types';

interface FilterTabsProps {
  active: 'all' | ContentType;
  onChange: (filter: 'all' | ContentType) => void;
}

const tabs: Array<{ id: 'all' | ContentType; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'code', label: '代码' },
  { id: 'sql', label: 'SQL' },
  { id: 'text', label: '文本' },
];

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            active === tab.id
              ? 'bg-primary dark:bg-indigo-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
