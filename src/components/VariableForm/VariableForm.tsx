import { useState, useEffect } from 'react';
import { X, Variable } from 'lucide-react';

interface VariableFormProps {
  variables: string[];
  onSubmit: (values: Record<string, string>) => void;
  onClose: () => void;
}

/**
 * 变量填写表单组件
 * 用于在插入代码片段前收集占位符的值
 */
export default function VariableForm({
  variables,
  onSubmit,
  onClose,
}: VariableFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单值
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    variables.forEach((varName) => {
      initialValues[varName] = '';
    });
    setValues(initialValues);
  }, [variables]);

  const handleChange = (varName: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [varName]: value,
    }));
    // 清除该字段的错误
    if (errors[varName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[varName];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证所有变量都已填写
    const newErrors: Record<string, string> = {};
    variables.forEach((varName) => {
      if (!values[varName] || !values[varName].trim()) {
        newErrors[varName] = '此变量不能为空';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(values);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (index === variables.length - 1) {
        // 最后一个输入框，提交表单
        handleSubmit(e);
      } else {
        // 聚焦下一个输入框
        const nextInput = document.getElementById(`var-input-${index + 1}`);
        nextInput?.focus();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Variable size={20} className="text-primary dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              填写变量值
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            此代码片段包含 {variables.length} 个变量,请填写它们的值:
          </p>

          <div className="space-y-4">
            {variables.map((varName, index) => (
              <div key={varName}>
                <label
                  htmlFor={`var-input-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-primary dark:text-indigo-400">
                    ${'{' + varName + '}'}
                  </code>
                </label>
                <input
                  id={`var-input-${index}`}
                  type="text"
                  value={values[varName] || ''}
                  onChange={(e) => handleChange(varName, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder={`请输入 ${varName} 的值`}
                  className={`w-full px-3 py-2 border ${
                    errors[varName]
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 ${
                    errors[varName]
                      ? 'focus:ring-red-500'
                      : 'focus:ring-primary dark:focus:ring-indigo-500'
                  } transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  autoFocus={index === 0}
                />
                {errors[varName] && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors[varName]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 提示: 按 Enter 键快速切换到下一个输入框,或在最后一个输入框按 Enter 提交
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary dark:bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Variable size={16} />
            确认插入
          </button>
        </div>
      </div>
    </div>
  );
}
