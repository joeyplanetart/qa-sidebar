import { Tag, X } from 'lucide-react';

interface TagFilterProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onClearAll: () => void;
  availableTags: string[];
}

export default function TagFilter({ 
  selectedTags, 
  onTagSelect, 
  onTagRemove, 
  onClearAll,
  availableTags 
}: TagFilterProps) {
  // 按使用频率排序的可用标签（未选中的）
  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag));
  
  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* 已选择的标签 */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">筛选:</span>
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagRemove(tag)}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Tag size={12} />
              {tag}
              <X size={14} />
            </button>
          ))}
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            清除全部
          </button>
        </div>
      )}

      {/* 可用标签云 */}
      {unselectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">标签:</span>
          {unselectedTags.slice(0, 15).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              <Tag size={12} />
              {tag}
            </button>
          ))}
          {unselectedTags.length > 15 && (
            <span className="text-xs text-gray-400">
              +{unselectedTags.length - 15} 更多
            </span>
          )}
        </div>
      )}
    </div>
  );
}
