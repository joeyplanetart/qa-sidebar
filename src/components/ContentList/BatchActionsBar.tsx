import { Trash2, X, CheckSquare, Square } from 'lucide-react';

interface BatchActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchDelete: () => void;
  onCancel: () => void;
}

export default function BatchActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBatchDelete,
  onCancel,
}: BatchActionsBarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="sticky top-0 z-10 bg-primary/10 border-b border-primary/30 p-3 mb-3">
      <div className="flex items-center justify-between">
        {/* 左侧：选择信息和全选按钮 */}
        <div className="flex items-center gap-3">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors"
            title={allSelected ? '取消全选' : '全选'}
          >
            {allSelected ? (
              <CheckSquare size={20} />
            ) : (
              <Square size={20} />
            )}
          </button>
          
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            已选择 <span className="text-lg font-bold">{selectedCount}</span> 个片段
          </span>
        </div>

        {/* 右侧：批量操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBatchDelete}
            disabled={selectedCount === 0}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={`批量删除 (${selectedCount})`}
          >
            <Trash2 size={20} />
          </button>

          <button
            onClick={onCancel}
            className="p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="取消批量操作"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
