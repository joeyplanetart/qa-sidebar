import { useState, useRef } from 'react';
import { X, Tag } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
}

export default function TagInput({ tags, onChange, suggestions = [], placeholder = '添加标签...', maxTags = 3 }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMaxReached = tags.length >= maxTags;

  // 过滤建议标签
  const filteredSuggestions = suggestions
    .filter(s => 
      !tags.includes(s) && 
      s.toLowerCase().includes(inputValue.toLowerCase())
    )
    .slice(0, 5);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    // 检查是否达到最大标签数
    if (isMaxReached) {
      return;
    }
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!isMaxReached) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0 && !isMaxReached);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <Tag size={16} className="inline mr-1" />
        标签
      </label>
      
      {/* 标签容器 */}
      <div 
        className={`min-h-[42px] border rounded-lg p-2 flex flex-wrap gap-2 items-center cursor-text ${
          isMaxReached 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
        }`}
        onClick={() => !isMaxReached && inputRef.current?.focus()}
      >
        {/* 已添加的标签 */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-blue-900 focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        
        {/* 输入框 */}
        {!isMaxReached && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          />
        )}
        
        {/* 达到最大数量提示 */}
        {isMaxReached && (
          <span className="text-xs text-gray-500 italic">
            已达到最大标签数
          </span>
        )}
      </div>

      {/* 建议标签下拉框 */}
      {showSuggestions && !isMaxReached && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addTag(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <Tag size={14} className="text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* 提示文本 */}
      <p className="mt-1 text-xs text-gray-500">
        {isMaxReached 
          ? `最多只能添加 ${maxTags} 个标签` 
          : `按 Enter 添加标签，点击标签删除（还可添加 ${maxTags - tags.length} 个）`
        }
      </p>
    </div>
  );
}
