import { useState } from 'react';
import { X, Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import type { ContentItem } from '../../types';

interface ImportExportModalProps {
  contents: ContentItem[];
  onClose: () => void;
  onImport: (contents: ContentItem[]) => Promise<void>;
  showAlert: (message: string, title?: string) => Promise<boolean>;
}

export default function ImportExportModal({ contents, onClose, onImport, showAlert }: ImportExportModalProps) {
  const [importing, setImporting] = useState(false);

  // 导出为 JSON
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(contents, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qa-sider-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showAlert('JSON 文件已导出成功！', '成功');
    } catch (error) {
      console.error('导出 JSON 失败:', error);
      showAlert('导出失败，请重试', '错误');
    }
  };

  // 导出为 CSV
  const handleExportCSV = () => {
    try {
      // CSV 头部
      const headers = ['ID', '标题', '内容', '类型', '语言', '标签', '是否置顶', '创建时间', '更新时间'];
      
      // CSV 内容
      const rows = contents.map(item => [
        item.id,
        `"${item.title.replace(/"/g, '""')}"`, // 转义双引号
        `"${item.content.replace(/"/g, '""')}"`,
        item.type,
        item.language || '',
        `"${(item.tags || []).join(', ')}"`,
        item.isPinned ? '是' : '否',
        new Date(item.createdAt).toLocaleString('zh-CN'),
        new Date(item.updatedAt).toLocaleString('zh-CN')
      ]);

      // 组合 CSV
      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

      // 添加 BOM 以支持中文
      const BOM = '\uFEFF';
      const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qa-sider-backup-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showAlert('CSV 文件已导出成功！', '成功');
    } catch (error) {
      console.error('导出 CSV 失败:', error);
      showAlert('导出失败，请重试', '错误');
    }
  };

  // 导入 JSON
  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // 验证数据格式
      if (!Array.isArray(data)) {
        throw new Error('JSON 格式不正确，应为数组');
      }

      // 基本验证
      const validItems = data.filter((item: any) => 
        item && 
        typeof item === 'object' && 
        item.title && 
        item.content && 
        item.type
      );

      if (validItems.length === 0) {
        throw new Error('没有找到有效的数据');
      }

      // 转换数据格式，确保必要字段存在，并生成新 ID 避免冲突
      const importedItems: ContentItem[] = validItems.map((item: any, index: number) => ({
        ...item,
        id: `imported_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: item.createdAt || Date.now(),
        updatedAt: Date.now(), // 更新为当前时间
        tags: item.tags || [],
        isPinned: item.isPinned || false,
      }));

      await onImport(importedItems);
      await showAlert(`成功导入 ${importedItems.length} 条数据！`, '成功');
      onClose();
    } catch (error) {
      console.error('导入 JSON 失败:', error);
      await showAlert(
        error instanceof Error ? error.message : '导入失败，请检查文件格式',
        '错误'
      );
    } finally {
      setImporting(false);
      // 清空 input
      event.target.value = '';
    }
  };

  // 导入 CSV
  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      
      // 移除 BOM
      const content = text.replace(/^\uFEFF/, '');
      const lines = content.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        throw new Error('CSV 文件内容不足');
      }

      // 跳过标题行
      const dataLines = lines.slice(1);

      const importedItems: ContentItem[] = [];

      for (const line of dataLines) {
        try {
          // 简单的 CSV 解析（处理引号内的逗号）
          const values: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                // 转义的双引号
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          // 解析数据
          if (values.length >= 4) {
            const [, title, content, type, language, tags, isPinned] = values; // 忽略原 ID
            
            importedItems.push({
              id: `imported_${Date.now()}_${importedItems.length}_${Math.random().toString(36).substr(2, 9)}`,
              userId: 'imported',
              title: title.replace(/^"|"$/g, '').replace(/""/g, '"'),
              content: content.replace(/^"|"$/g, '').replace(/""/g, '"'),
              type: type as 'text' | 'code' | 'sql',
              language: language || undefined,
              tags: tags ? tags.replace(/^"|"$/g, '').split(',').map(t => t.trim()).filter(Boolean) : [],
              isPinned: isPinned === '是',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        } catch (error) {
          console.error('解析行失败:', line, error);
        }
      }

      if (importedItems.length === 0) {
        throw new Error('没有找到有效的数据');
      }

      await onImport(importedItems);
      await showAlert(`成功导入 ${importedItems.length} 条数据！`, '成功');
      onClose();
    } catch (error) {
      console.error('导入 CSV 失败:', error);
      await showAlert(
        error instanceof Error ? error.message : '导入失败，请检查文件格式',
        '错误'
      );
    } finally {
      setImporting(false);
      // 清空 input
      event.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            导入/导出数据
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 导出部分 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Download size={20} />
              导出数据
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              当前共有 <span className="font-semibold text-primary">{contents.length}</span> 条数据
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExportJSON}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                disabled={contents.length === 0}
              >
                <FileJson size={20} />
                导出为 JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                disabled={contents.length === 0}
              >
                <FileSpreadsheet size={20} />
                导出为 CSV
              </button>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* 导入部分 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Upload size={20} />
              导入数据
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              选择 JSON 或 CSV 文件导入数据（会与现有数据合并）
            </p>
            <div className="flex gap-3">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  disabled={importing}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer">
                  <FileJson size={20} />
                  {importing ? '导入中...' : '导入 JSON'}
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  disabled={importing}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors cursor-pointer">
                  <FileSpreadsheet size={20} />
                  {importing ? '导入中...' : '导入 CSV'}
                </div>
              </label>
            </div>
          </div>

          {/* 说明 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              💡 使用说明
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <li>• JSON 格式保留完整数据结构，推荐用于备份和迁移</li>
              <li>• CSV 格式便于在 Excel 中查看和编辑</li>
              <li>• 导入数据会自动生成新 ID，可重复导入不会冲突</li>
              <li>• 导入数据会与现有数据合并，不会覆盖原有数据</li>
              <li>• 建议定期备份数据，以防数据丢失</li>
            </ul>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
