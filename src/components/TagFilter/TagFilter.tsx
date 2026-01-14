import { useState } from 'react';
import { Tag, X, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 按使用频率排序的可用标签（未选中的）
  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag));
  
  if (availableTags.length === 0) {
    return null;
  }

  const displayLimit = 15;
  const hasMoreTags = unselectedTags.length > displayLimit;
  const displayTags = isExpanded ? unselectedTags : unselectedTags.slice(0, displayLimit);

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
        <div className="space-y-2">
          <div 
            className={`flex items-start gap-2 flex-wrap ${
              isExpanded ? 'max-h-48 overflow-y-auto scrollbar-thin pr-2' : ''
            }`}
          >
            <span className="text-sm text-gray-500 flex-shrink-0 pt-1">标签:</span>
            <div className="flex flex-wrap gap-2 flex-1">
              {displayTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <Tag size={12} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* 展开/收起按钮 */}
          {hasMoreTags && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  显示全部 {unselectedTags.length} 个标签（+{unselectedTags.length - displayLimit} 个）
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
